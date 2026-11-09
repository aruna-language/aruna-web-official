import {useEffect,useMemo,useRef,useState,type CSSProperties} from 'react';
import {Link,Navigate,useNavigate,useParams} from 'react-router-dom';

type B={t:'h2'|'p'|'code'|'note';x:string;l?:string};
type Ch={slug:string;title:string;soon?:boolean;blocks:B[]};
export const chapters:Ch[]=[
 {slug:'pengantar',title:'Pengantar',blocks:[
  {t:'p',x:'Aruna adalah bahasa pemrograman general-purpose yang sedang dirancang oleh Iky Dev, terinspirasi dari bahasa Madura sehari-hari.'},
  {t:'h2',x:'Tentang dokumentasi ini'},
  {t:'p',x:'Dokumentasi tumbuh seiring bahasa dirancang. Bagian yang belum ditulis ditandai jelas, bukan diisi contoh rekaan.'},
  {t:'note',x:'Aruna masih di tahap desain dan perencanaan.'}]},
 {slug:'status',title:'Status bahasa',blocks:[
  {t:'h2',x:'Yang sudah ada'},
  {t:'p',x:'Situs ini, sistem pengumuman, dan rencana pengembangan di halaman Roadmap.'},
  {t:'h2',x:'Yang belum ada'},
  {t:'p',x:'Spesifikasi sintaks, compiler atau interpreter, grammar untuk syntax highlighting, dan playground yang dapat menjalankan kode.'}]},
 {slug:'sintaks',title:'Sintaks',soon:true,blocks:[{t:'p',x:'Bab ini ditulis setelah sintaks Aruna ditetapkan.'}]},
 {slug:'referensi',title:'Referensi',soon:true,blocks:[{t:'p',x:'Referensi akan tersedia setelah bahasa Aruna terdefinisi.'}]},
 {slug:'contoh-kode',title:'Contoh kode',soon:true,blocks:[{t:'p',x:'Contoh kode akan ditambahkan setelah sintaks ditetapkan.'}]}
];
const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

function Code({x,l}:{x:string;l?:string}){
  const [ok,setOk]=useState(false);
  return <figure className="code"><figcaption><span>{l||'teks polos · grammar Aruna belum tersedia'}</span>
    <button type="button" aria-live="polite" onClick={async()=>{try{await navigator.clipboard.writeText(x);setOk(true);setTimeout(()=>setOk(false),1500)}catch{}}}>{ok?'Disalin ✓':'Salin'}</button></figcaption>
    <pre tabIndex={0}><code>{x}</code></pre></figure>;
}

export default function Docs(){
  const {slug}=useParams();const go=useNavigate();const bar=useRef<HTMLDivElement>(null);const [q,setQ]=useState('');
  useEffect(()=>{let f=0;const on=()=>{cancelAnimationFrame(f);f=requestAnimationFrame(()=>{const h=document.documentElement;const m=h.scrollHeight-innerHeight;if(bar.current)bar.current.style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`})};addEventListener('scroll',on,{passive:true});on();return()=>{removeEventListener('scroll',on);cancelAnimationFrame(f)}},[slug]);
  const hits=useMemo(()=>{const s=q.trim().toLowerCase();return s.length<2?[]:chapters.filter(c=>(c.title+' '+c.blocks.map(b=>b.x).join(' ')).toLowerCase().includes(s))},[q]);
  if(!slug)return <Navigate to={'/docs/'+chapters[0].slug} replace/>;
  const i=chapters.findIndex(c=>c.slug===slug);
  if(i<0)return <Navigate to="/docs" replace/>;
  const c=chapters[i],h2=c.blocks.filter(b=>b.t==='h2'),prev=chapters[i-1],next=chapters[i+1];
  const st=(n:number)=>({'--i':Math.min(n,8)} as CSSProperties);
  return <div className="container docs-wrap">
    <div className="rbar" aria-hidden="true"><div ref={bar}/></div>
    <aside>
      <div className="search"><input type="search" aria-label="Cari dokumentasi" placeholder="Cari dokumentasi…" value={q} onChange={e=>setQ(e.target.value)}/>
        {q.trim().length>=2&&<ul className="hits">{hits.length?hits.map(h=><li key={h.slug}><button type="button" onClick={()=>{go('/docs/'+h.slug);setQ('')}}>{h.title}</button></li>):<li className="mut p-2">Tidak ada hasil</li>}</ul>}</div>
      <nav className="side" aria-label="Bab dokumentasi"><span className="ind" style={{transform:`translateY(${i*44}px)`}}/>
        {chapters.map(x=><Link key={x.slug} to={'/docs/'+x.slug} className={x.slug===slug?'on':''} aria-current={x.slug===slug?'page':undefined}>{x.title}{x.soon&&<small className="soon-s">Segera</small>}</Link>)}</nav>
    </aside>
    <article key={slug}>
      <p className="eyebrow blk" style={st(0)}>Bab {i+1} dari {chapters.length}</p>
      <h1 className="blk" style={st(0)}>{c.title}</h1>
      {c.soon?<div className="soonbox blk" style={st(1)}><span className="tag">Segera hadir</span><p>{c.blocks[0].x}</p></div>
      :c.blocks.map((b,n)=>b.t==='h2'?<h2 key={n} id={slugify(b.x)} className="blk" style={st(n+1)}>{b.x}</h2>
        :b.t==='p'?<p key={n} className="blk" style={st(n+1)}>{b.x}</p>
        :b.t==='note'?<p key={n} className="note blk" style={st(n+1)}>{b.x}</p>
        :<div key={n} style={st(n+1)} className="blk"><Code x={b.x} l={b.l}/></div>)}
      <div className="pn blk" style={st(8)}>
        {prev&&<Link className="pn-card" to={'/docs/'+prev.slug}><small>← Sebelumnya</small><strong>{prev.title}</strong></Link>}
        {next&&<Link className="pn-card next" to={'/docs/'+next.slug}><small>Berikutnya →</small><strong>{next.title}</strong></Link>}
      </div>
    </article>
    <aside className="toc d-none d-lg-block"><strong>Di halaman ini</strong>
      {h2.length?<ul>{h2.map(h=><li key={h.x}><a href={'#'+slugify(h.x)} onClick={e=>{e.preventDefault();document.getElementById(slugify(h.x))?.scrollIntoView({behavior:reduced()?'auto':'smooth'})}}>{h.x}</a></li>)}</ul>:<p className="mut">Tidak ada subjudul.</p>}</aside>
  </div>;
}
