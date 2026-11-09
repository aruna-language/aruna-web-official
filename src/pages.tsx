import {useEffect,useState,type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {chapters} from './docs';

export type Ann={id:number;title:string;body:string;published_at:number};
const Note=({children}:{children:ReactNode})=><p className="note">{children}</p>;
const Card=({to,t,d}:{to:string;t:string;d:string})=><div className="col-md-4"><Link to={to} className="card-c"><h3>{t}</h3><p>{d}</p></Link></div>;

type Row={to:string;t:string;d:string;s:string;live?:boolean};
const rows:Row[]=[
  {to:'/docs',t:'Dokumentasi',d:'Pengantar proyek dan status terkini bahasa Aruna.',s:'Tersedia',live:true},
  {to:'/install',t:'Install',d:'Pasang Aruna lewat pip, npm, plugin editor, atau berkas instalasi.',s:'Segera hadir'},
  {to:'/learn',t:'Belajar',d:'Jalur belajar bertahap, ditulis setelah sintaks ditetapkan.',s:'Segera hadir'},
  {to:'/playground',t:'Playground',d:'Tempat mencoba kode Aruna langsung di browser.',s:'Segera hadir'},
  {to:'/roadmap',t:'Roadmap',d:'Urutan pengembangan Aruna dari desain sampai compiler.',s:'Draf',live:true},
  {to:'/community',t:'Komunitas',d:'GitHub resmi Aruna. Discord dan Telegram menyusul.',s:'Tersedia',live:true}];
export const Home=()=><div className="container">
  <section className="hero2">
    <div>
      <p className="eyebrow">Bahasa pemrograman · terinspirasi bahasa Madura</p><h1>Aruna</h1>
      <p className="lead">Bahasa pemrograman general-purpose yang dirancang oleh Iky Dev dari bahasa sehari-hari.</p>
      <div className="d-flex gap-3 flex-wrap"><Link className="btn-c pri" to="/docs">Baca dokumentasi</Link><Link className="btn-c" to="/roadmap">Lihat roadmap</Link></div>
    </div>
    <div className="win"><div className="win-bar"><i/><i/><i/><span className="t">contoh-kode</span></div>
      <div className="win-body"><span className="tag">Segera hadir</span><p>Contoh kode Aruna akan tampil di sini setelah sintaks ditetapkan.</p></div></div>
  </section>
  <h2 className="h-sec">Jelajahi</h2>
  <ul className="rows">{rows.map(r=><li key={r.to}><Link to={r.to}><span><strong>{r.t}</strong><small>{r.d}</small></span><span className={'tag'+(r.live?' live':'')}>{r.s}</span><span aria-hidden="true">→</span></Link></li>)}</ul>
</div>;

const Fact=({k,v}:{k:string;v:string})=><div className="col-6"><div className="fact"><span>{k}</span><strong>{v}</strong></div></div>;
export const About=()=><div className="container narrow">
  <p className="eyebrow">Tentang</p><h1>Aruna</h1>
  <p className="lead">Proyek bahasa pemrograman general-purpose yang terinspirasi dari bahasa Madura sehari-hari.</p>
  <div className="row g-3 my-3"><Fact k="Pembuat" v="Iky Dev"/><Fact k="Jenis" v="General-purpose"/><Fact k="Inspirasi" v="Bahasa Madura"/><Fact k="Status" v="Desain & perencanaan"/></div>
  <section className="sec"><h2>Gagasan</h2><p>Aruna dirancang oleh Iky Dev sebagai bahasa pemrograman general-purpose. Rincian rancangan bahasa akan dipublikasikan di dokumentasi setelah ditetapkan.</p></section>
  <section className="sec"><h2>Sudah dan belum ada</h2><div className="row g-3">
    <div className="col-md-6"><div className="card-c"><h3>Sudah ada</h3><ul className="ticks"><li>Situs resmi ini</li><li>Dokumentasi status bahasa</li><li>Sistem pengumuman</li></ul></div></div>
    <div className="col-md-6"><div className="card-c"><h3>Belum ada</h3><ul><li>Spesifikasi sintaks</li><li>Compiler atau interpreter</li><li>Grammar syntax highlighting</li><li>Playground yang menjalankan kode</li></ul></div></div></div></section>
  <section className="sec"><h2>Prinsip situs ini</h2><p>Situs ini tidak menampilkan contoh kode, fitur, atau data yang belum ada. Bagian yang belum siap ditandai dengan jelas.</p></section>
  <div className="d-flex gap-3 flex-wrap"><Link className="btn-c pri" to="/docs">Baca dokumentasi</Link><Link className="btn-c" to="/roadmap">Lihat roadmap</Link></div></div>;

const steps:[string,string,string,string][]=[
  ['Pengenalan Aruna','Latar belakang dan status proyek.','/docs/pengantar','Tersedia'],
  ['Dasar sintaks','Bentuk dasar bahasa dan cara menulis program.','','Segera hadir'],
  ['Program pertama','Menulis dan menjalankan program sederhana.','','Segera hadir'],
  ['Latihan','Latihan terarah di playground.','','Segera hadir']];
export const Learn=()=><div className="container narrow"><p className="eyebrow">Belajar</p><h1>Jalur belajar Aruna</h1>
  <p className="lead">Tutorial ditulis setelah sintaks Aruna ditetapkan. Berikut urutan yang direncanakan.</p>
  <ol className="tl">{steps.map(([t,d,to,st],i)=><li key={t} className={to?'on':''}><span className="tl-n">{i+1}</span>
    <div><h2>{to?<Link to={to}>{t}</Link>:t}<span className={'tag'+(to?' live':'')}>{st}</span></h2><p>{d}</p></div></li>)}</ol></div>;

export function Playground(){
  const [code,setCode]=useState('');const [ok,setOk]=useState(false);
  const copy=async()=>{try{await navigator.clipboard.writeText(code);setOk(true);setTimeout(()=>setOk(false),1500)}catch{}};
  return <div className="container narrow"><p className="eyebrow">Playground</p><h1>Playground Aruna</h1>
    <p className="lead">Tempat mencoba kode Aruna di browser akan tersedia setelah compiler selesai.</p>
    <div className="win"><div className="win-bar"><i/><i/><i/><span className="t">editor</span><span className="tag ms-auto">Segera hadir</span></div>
      <label className="visually-hidden" htmlFor="ed">Editor catatan</label>
      <textarea id="ed" className="editor2" rows={10} value={code} onChange={e=>setCode(e.target.value)} placeholder="Tulis catatan di sini…" spellCheck={false}/>
      <div className="win-foot"><span className="mut">{code?code.split('\n').length:0} baris · {code.length} karakter</span>
        <div className="d-flex gap-2 flex-wrap"><button type="button" className="btn-c sm" disabled={!code} onClick={()=>setCode('')}>Bersihkan</button>
          <button type="button" className="btn-c sm" disabled={!code} onClick={copy}>{ok?'Disalin ✓':'Salin'}</button>
          <span className="btn-c sm off" aria-disabled="true">Jalankan</span></div></div></div>
    <div className="win mt-3"><div className="win-bar"><i/><i/><i/><span className="t">output</span></div>
      <div className="win-body"><p>Belum ada compiler Aruna, jadi kode tidak dijalankan. Editor ini hanya untuk catatan.</p></div></div></div>;
}

export function Announcements({items,loaded,err,seen,onRead}:{items:Ann[];loaded:boolean;err:boolean;seen:number;onRead:()=>void}){
  const [prev]=useState(seen);
  useEffect(()=>{if(loaded&&!err&&items.length)onRead()},[loaded]);// eslint-disable-line
  return <div className="container narrow"><h1>Pengumuman</h1>
    {!loaded?<p className="mut">Memuat…</p>:err?<Note>Pengumuman tidak dapat dimuat saat ini. Coba lagi nanti.</Note>
    :!items.length?<p>Belum ada pengumuman.</p>
    :items.map(a=><article key={a.id} className="card-c ann"><h2>{a.title}{a.id>prev&&<span className="tag">Baru</span>}</h2>
      <time className="mut" dateTime={new Date(a.published_at*1000).toISOString()}>{new Date(a.published_at*1000).toLocaleDateString('id-ID',{dateStyle:'long'})}</time>
      <p style={{whiteSpace:'pre-wrap'}}>{a.body}</p></article>)}</div>;
}

const road:[string,string,string][]=[
  ['Situs resmi dan dokumentasi dasar','Situs, pengumuman, dan dokumentasi status bahasa.','Berjalan'],
  ['Spesifikasi sintaks','Menetapkan bentuk dasar bahasa sebelum ada contoh kode.','Berikutnya'],
  ['Interpreter atau compiler pertama','Implementasi awal untuk menjalankan kode Aruna.','Direncanakan'],
  ['Grammar syntax highlighting','Pewarnaan kode di dokumentasi setelah sintaks tetap.','Direncanakan'],
  ['Playground yang menjalankan kode','Editor yang benar-benar mengeksekusi kode, bergantung pada compiler.','Direncanakan']];
export const Roadmap=()=><div className="container narrow"><p className="eyebrow">Roadmap</p><h1>Arah pengembangan</h1>
  <p className="lead">Draf urutan pengembangan Aruna. Urutan dan isinya dapat berubah.</p>
  <ol className="tl">{road.map(([t,d,st],i)=><li key={t} className={st==='Berjalan'?'on':''}><span className="tl-n">{i+1}</span>
    <div><h2>{t}<span className={'tag'+(st==='Berjalan'?' live':'')}>{st}</span></h2><p>{d}</p></div></li>)}</ol></div>;

const GH='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z';
const DC='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z';
const TG='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z';
const TT='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
const FB='M12 0a12 12 0 1 0 0 24A12 12 0 0 0 12 0zM13.5 23.6v-10.1h2.5l.4-3.1h-2.9V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8v3.1h2.5v10.1z';
const P:Record<string,string>={gh:GH,dc:DC,tg:TG,tt:TT,fb:FB};
const Ico=({k,s=28}:{k:string;s?:number})=>k==='ig'
  ?<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>
  :<svg width={s} height={s} viewBox={k==='gh'?'0 0 16 16':'0 0 24 24'} fill="currentColor" fillRule={k==='fb'?'evenodd':undefined} aria-hidden="true"><path d={P[k]}/></svg>;
type Soc={k:string;name:string;desc:string;href?:string;url?:string};
const community:Soc[]=[
  {k:'gh',name:'GitHub',desc:'Organisasi GitHub resmi Aruna. Pantau repositori dan perkembangan proyek.',href:'https://github.com/aruna-language',url:'github.com/aruna-language'},
  {k:'dc',name:'Discord',desc:'Server komunitas resmi Aruna.'},
  {k:'tg',name:'Telegram',desc:'Telegram resmi Aruna.'}];
const socials=[{k:'tt',name:'TikTok'},{k:'ig',name:'Instagram'},{k:'fb',name:'Facebook'}];
const owner:{k:string;name:string;href?:string;url?:string}[]=[
  {k:'gh',name:'GitHub',href:'https://github.com/iky-art',url:'github.com/iky-art'},{k:'ig',name:'Instagram'},{k:'tg',name:'Telegram'},{k:'tt',name:'TikTok'}];
export const Community=()=><div className="container">
  <p className="eyebrow">Komunitas</p><h1>Bergabung dengan Aruna</h1>
  <p className="lead">Kanal resmi untuk mengikuti perkembangan Aruna.</p>
  <div className="row g-3 mt-2">{community.map(c=><div className="col-12 col-md-4" key={c.k}><section className="soc">
    <div className="d-flex justify-content-between align-items-start">
      <span className="soc-ic"><Ico k={c.k}/></span>
      {!c.href&&<span className="tag">Segera hadir</span>}
    </div>
    <h2>{c.name}</h2><p>{c.desc}</p>
    {c.href?<a className="btn-c pri" href={c.href} target="_blank" rel="noopener noreferrer">Buka GitHub<span className="visually-hidden"> (tab baru)</span></a>
      :<span className="btn-c off" aria-disabled="true">Segera hadir</span>}
    {c.url&&<span className="mut small">{c.url}</span>}
  </section></div>)}</div>
  <h2 className="h-sec">Media sosial resmi Aruna</h2>
  <div className="row g-3">{socials.map(c=><div className="col-12 col-md-4" key={c.k}><div className="soc-s">
    <span className="soc-ic"><Ico k={c.k} s={24}/></span><strong>{c.name}</strong><span className="tag">Segera hadir</span></div></div>)}</div>
  <h2 className="h-sec">Akun resmi Iky Dev</h2>
  <nav className="acct" aria-label="Akun resmi Iky Dev">{owner.map(o=>o.href
    ?<a key={o.k} className="acct-i" href={o.href} target="_blank" rel="noopener noreferrer"><Ico k={o.k} s={22}/><span className="acct-t"><strong>{o.name}</strong><small>{o.url}</small></span><span className="visually-hidden"> (tab baru)</span></a>
    :<span key={o.k} className="acct-i off" aria-disabled="true"><Ico k={o.k} s={22}/><span className="acct-t"><strong>{o.name}</strong><small>Segera hadir</small></span></span>)}</nav>
</div>;

export const NotFound=()=><div className="container narrow"><h1>Halaman tidak ditemukan</h1><Link className="btn-c pri" to="/">Ke beranda</Link></div>;
