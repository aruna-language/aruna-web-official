const root=document.getElementById('app');let csrf='';
const el=(t,a={},...c)=>{const e=document.createElement(t);for(const k in a){if(k.startsWith('on'))e[k]=a[k];else e.setAttribute(k,a[k])}c.forEach(x=>e.append(x));return e};
const api=async(p,o={})=>{const r=await fetch('/api/admin'+p,{...o,credentials:'same-origin',headers:{'content-type':'application/json','x-csrf':csrf}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(d.error||'error'),{status:r.status});return d};
function login(){
  const pw=el('input',{type:'password',placeholder:'Password',autocomplete:'current-password',required:''}),msg=el('p',{class:'e'});
  root.replaceChildren(el('h1',{},'Admin Aruna'),el('form',{onsubmit:async e=>{e.preventDefault();try{csrf=(await api('/login',{method:'POST',body:JSON.stringify({password:pw.value})})).csrf;dash()}catch(x){msg.textContent=x.message}}},pw,el('button',{type:'submit'},'Masuk')),msg);
}
async function dash(){
  let a,l;try{[a,l]=await Promise.all([api('/announcements'),api('/logs')])}catch(x){return login()}
  let editId=null;const msg=el('p',{class:'e'});
  const fail=e=>{if(e.status===401)return login();msg.textContent=e.message;scrollTo(0,0)};
  const title=el('input',{placeholder:'Judul',maxlength:'120'}),body=el('textarea',{rows:'5',placeholder:'Isi pengumuman',maxlength:'5000'});
  const st=el('select',{},el('option',{value:'draft'},'Draft'),el('option',{value:'published'},'Publish'));
  const save=el('button',{type:'button',onclick:async()=>{try{await api(editId?'/announcements/'+editId:'/announcements',{method:editId?'PUT':'POST',body:JSON.stringify({title:title.value,body:body.value,status:st.value})});dash()}catch(x){fail(x)}}},'Simpan');
  const pub=a.filter(x=>x.status==='published').length;
  root.replaceChildren(
    el('h1',{},'Dashboard'),el('p',{class:'m'},`${a.length} pengumuman · ${pub} terbit · ${a.length-pub} draft`),
    el('div',{class:'c'},el('h2',{},'Pengumuman'),title,body,st,save,msg),
    ...a.map(x=>el('div',{class:'c'},el('strong',{},x.title),el('div',{class:'m'},x.status),
      el('button',{class:'g',onclick:()=>{editId=x.id;title.value=x.title;body.value=x.body;st.value=x.status;scrollTo(0,0)}},'Edit'),' ',
      el('button',{class:'g',onclick:async()=>{if(!confirm('Hapus pengumuman ini?'))return;try{await api('/announcements/'+x.id,{method:'DELETE'});dash()}catch(e){fail(e)}}},'Hapus'))),
    el('h2',{},'Log aktivitas'),...l.map(r=>el('div',{class:'m'},new Date(r.ts*1000).toLocaleString('id-ID')+' · '+r.action+(r.detail?' · '+r.detail:''))),
    el('p',{},el('button',{class:'g',onclick:async()=>{try{await api('/logout',{method:'POST'})}catch(e){}login()}},'Keluar')));
}
api('/me').then(r=>{csrf=r.csrf;dash()}).catch(login);
