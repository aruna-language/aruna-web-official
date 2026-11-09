// Server lokal untuk uji admin tanpa Wrangler (workerd tidak ada di Android).
// Hanya untuk pengembangan; produksi tetap Cloudflare Pages + D1.
import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const env={};
for(const l of readFileSync('.dev.vars','utf8').split('\n')){const i=l.indexOf('=');if(i>0)env[l.slice(0,i).trim()]=l.slice(i+1).trim()}
mkdirSync('.wrangler',{recursive:true});
const sql=new DatabaseSync('.wrangler/dev.sqlite');
sql.exec(readFileSync('migrations/0001_init.sql','utf8').replace(/CREATE TABLE /g,'CREATE TABLE IF NOT EXISTS ').replace(/CREATE INDEX /g,'CREATE INDEX IF NOT EXISTS '));
const wrap=s=>{const mk=a=>({
  bind:(...b)=>mk(b),
  run:async()=>{const r=s.run(...a);return{meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}},
  all:async()=>({results:s.all(...a)}),
  first:async()=>s.get(...a)??null});return mk([])};
env.DB={prepare:q=>wrap(sql.prepare(q))};
const mw=(await import(pathToFileURL(resolve('functions/_middleware.ts')).href)).onRequest;
const api=(await import(pathToFileURL(resolve('functions/api/[[route]].ts')).href)).onRequest;
const files={'/_admin/':'public/_admin/index.html','/_admin/app.js':'public/_admin/app.js'};
env.ASSETS={fetch:async u=>{const f=files[new URL(u).pathname];return f?new Response(readFileSync(f)):new Response('nf',{status:404})}};
createServer(async(req,res)=>{
  const chunks=[];for await(const c of req)chunks.push(c);
  const url=`http://${req.headers.host}${req.url}`;
  const request=new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});
  const next=async()=>new URL(url).pathname.startsWith('/api/')?api({request,env}):new Response('Not found',{status:404});
  const r=await mw({request,env,next});
  const h={};r.headers.forEach((v,k)=>{h[k]=v});
  const sc=r.headers.getSetCookie?.();if(sc?.length)h['set-cookie']=sc;
  res.writeHead(r.status,h);res.end(Buffer.from(await r.arrayBuffer()));
}).listen(8788,()=>console.log('Admin: http://localhost:8788'+env.ADMIN_PATH+'/'));
