const J=(d:any,s=200,h:Record<string,string>={})=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json','cache-control':'no-store',...h}});
const enc=new TextEncoder();
const b64=(u:Uint8Array)=>btoa(String.fromCharCode(...u));
const unb64=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const sha=async(s:string)=>b64(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))));
const rnd=()=>b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g,'');
const now=()=>Math.floor(Date.now()/1000);
const audit=(DB:any,action:string,detail='')=>DB.prepare('INSERT INTO audit_logs(ts,action,detail) VALUES(?,?,?)').bind(now(),action,detail).run();

async function verify(pw:string,stored:string){
  const [alg,it,s,h]=(stored||'').split(':');if(alg!=='pbkdf2'||!h)return false;
  const key=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  const bits=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:unb64(s),iterations:+it},key,256));
  const exp=unb64(h);let d=bits.length^exp.length;
  for(let i=0;i<exp.length;i++)d|=bits[i]^exp[i];
  return d===0;
}
const cookie=(req:Request,n:string)=>(req.headers.get('cookie')||'').split(/;\s*/).map(c=>c.split('=')).find(c=>c[0]===n)?.[1];
function valid(b:any){
  if(!b||typeof b.title!=='string'||typeof b.body!=='string')return null;
  const title=b.title.trim(),body=b.body.trim();
  if(!title||title.length>120||!body||body.length>5000||!['draft','published'].includes(b.status))return null;
  return {title,body,status:b.status as string};
}

export const onRequest=async({request,env}:any)=>{
  const DB=env.DB,u=new URL(request.url),p=u.pathname.replace(/\/$/,''),m=request.method;
  const sameOrigin=request.headers.get('origin')===u.origin;
  try{
    if(p==='/api/announcements'&&m==='GET'){
      const r=await DB.prepare("SELECT id,title,body,published_at FROM announcements WHERE status='published' ORDER BY id DESC LIMIT 50").all();
      return J(r.results);
    }
    if(!p.startsWith('/api/admin')||!env.ADMIN_PASSWORD_HASH)return J({error:'not_found'},404);

    if(p==='/api/admin/login'&&m==='POST'){
      if(!sameOrigin)return J({error:'forbidden'},403);
      const ip=request.headers.get('cf-connecting-ip')||'unknown',t=now();
      await DB.prepare('DELETE FROM login_attempts WHERE ts<?').bind(t-86400).run();
      const rl=await DB.prepare('SELECT COUNT(*) c FROM login_attempts WHERE ip=? AND ts>?').bind(ip,t-900).first();
      if(rl.c>=5)return J({error:'terlalu banyak percobaan, coba lagi nanti'},429);
      await DB.prepare('INSERT INTO login_attempts(ip,ts) VALUES(?,?)').bind(ip,t).run();
      const b:any=await request.json().catch(()=>null);
      const ok=b&&typeof b.password==='string'&&b.password.length<200&&await verify(b.password,env.ADMIN_PASSWORD_HASH);
      if(!ok){await audit(DB,'login_gagal');return J({error:'password salah'},401)}
      const token=rnd(),csrf=rnd();
      await DB.prepare('DELETE FROM sessions WHERE expires<?').bind(t).run();
      await DB.prepare('INSERT INTO sessions(token_hash,csrf,expires) VALUES(?,?,?)').bind(await sha(token),csrf,t+28800).run();
      await audit(DB,'login');
      return J({csrf},200,{'set-cookie':`aruna_s=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=28800`});
    }

    const tok=cookie(request,'aruna_s');
    const ses=tok?await DB.prepare('SELECT csrf FROM sessions WHERE token_hash=? AND expires>?').bind(await sha(tok),now()).first():null;
    if(!ses)return J({error:'unauthorized'},401);
    if(m!=='GET'&&(!sameOrigin||request.headers.get('x-csrf')!==ses.csrf))return J({error:'forbidden'},403);

    if(p==='/api/admin/me'&&m==='GET')return J({csrf:ses.csrf});
    if(p==='/api/admin/logout'&&m==='POST'){
      await DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(tok!)).run();await audit(DB,'logout');
      return J({ok:true},200,{'set-cookie':'aruna_s=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0'});
    }
    if(p==='/api/admin/logs'&&m==='GET')return J((await DB.prepare('SELECT ts,action,detail FROM audit_logs ORDER BY id DESC LIMIT 50').all()).results);
    if(p==='/api/admin/announcements'&&m==='GET')return J((await DB.prepare('SELECT id,title,body,status,published_at FROM announcements ORDER BY id DESC').all()).results);
    if(p==='/api/admin/announcements'&&m==='POST'){
      const v=valid(await request.json().catch(()=>null));if(!v)return J({error:'input tidak valid'},400);
      const t=now(),r=await DB.prepare('INSERT INTO announcements(title,body,status,published_at,created_at,updated_at) VALUES(?,?,?,?,?,?)').bind(v.title,v.body,v.status,v.status==='published'?t:null,t,t).run();
      await audit(DB,'buat_pengumuman','id='+r.meta.last_row_id);return J({ok:true},201);
    }
    const mm=p.match(/^\/api\/admin\/announcements\/(\d+)$/);
    if(mm&&m==='PUT'){
      const v=valid(await request.json().catch(()=>null));if(!v)return J({error:'input tidak valid'},400);
      const t=now();
      const r=await DB.prepare("UPDATE announcements SET title=?,body=?,status=?,published_at=CASE WHEN ?='published' THEN COALESCE(published_at,?) ELSE NULL END,updated_at=? WHERE id=?").bind(v.title,v.body,v.status,v.status,t,t,+mm[1]).run();
      if(!r.meta.changes)return J({error:'tidak ditemukan'},404);
      await audit(DB,'ubah_pengumuman','id='+mm[1]+' status='+v.status);return J({ok:true});
    }
    if(mm&&m==='DELETE'){
      const r=await DB.prepare('DELETE FROM announcements WHERE id=?').bind(+mm[1]).run();
      if(!r.meta.changes)return J({error:'tidak ditemukan'},404);
      await audit(DB,'hapus_pengumuman','id='+mm[1]);return J({ok:true});
    }
    return J({error:'not_found'},404);
  }catch{return J({error:'server_error'},500)}
};
