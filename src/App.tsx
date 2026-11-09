import {useEffect,useRef,useState} from 'react';
import {Link,NavLink,Route,Routes,useLocation} from 'react-router-dom';
import {About,Announcements,Community,Home,Learn,NotFound,Playground,Roadmap,type Ann} from './pages';
import Docs from './docs';
import Install from './install';

const nav=[['/','Beranda'],['/about','Tentang'],['/learn','Belajar'],['/docs','Docs'],['/install','Install'],['/playground','Playground'],['/announcements','Pengumuman'],['/roadmap','Roadmap'],['/community','Komunitas']] as const;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ls=(k:string,v?:string)=>{try{if(v!==undefined)localStorage.setItem(k,v);return localStorage.getItem(k)}catch{return null}};

export default function App(){
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'light');
  const [items,setItems]=useState<Ann[]>([]);const [loaded,setLoaded]=useState(false);const [err,setErr]=useState(false);
  const [seen,setSeen]=useState(Number(ls('aruna:seen'))||0);
  useEffect(()=>{document.documentElement.dataset.theme=theme;ls('aruna:theme',theme)},[theme]);
  useEffect(()=>{fetch('/api/announcements').then(r=>r.ok?r.json():Promise.reject()).then(d=>setItems(d)).catch(()=>setErr(true)).finally(()=>setLoaded(true))},[]);
  const markRead=()=>{const m=Math.max(0,...items.map(i=>i.id));ls('aruna:seen',String(m));setSeen(m)};
  const unread=items.filter(i=>i.id>seen).length;
  const [open,setOpen]=useState(false);const loc=useLocation();const navRef=useRef<HTMLElement>(null);
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{if(!open)return;
    const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
    const c=(e:PointerEvent)=>{if(!navRef.current?.contains(e.target as Node))setOpen(false)};
    addEventListener('keydown',k);addEventListener('pointerdown',c);
    return()=>{removeEventListener('keydown',k);removeEventListener('pointerdown',c)}},[open]);
  const links=nav.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>'dk'+(isActive?' on':'')}>{l}</NavLink>);
  return <>
    <a className="skip" href="#main">Lewati ke konten</a>
    <header className="topbar" ref={navRef}>
      <div className="nav-row">
        <Link className="brand" to="/" aria-label="Aruna, ke beranda">
          <img className="logo-i" src="/logo-icon.png" width="42" height="40" alt=""/>
          <img className="logo-w lw-l" src="/logo-word-light.png" width="86" height="20" alt="Aruna"/>
          <img className="logo-w lw-d" src="/logo-word-dark.png" width="86" height="20" alt="Aruna"/>
        </Link>
        <nav className="links" aria-label="Navigasi utama">{links}</nav>
        <div className="d-flex gap-2 ms-auto">
          <Link className="ic" to="/announcements" aria-label={unread?`${unread} pengumuman belum dibaca`:'Pengumuman'}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
            {unread>0&&<span className="badge-n">{unread}</span>}
          </Link>
          <button className="ic" type="button" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={theme==='dark'?'Beralih ke mode terang':'Beralih ke mode gelap'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{theme==='dark'?<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>:<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>}</svg>
          </button>
          <button className="ic burger" type="button" aria-expanded={open} aria-controls="nav-menu" aria-label={open?'Tutup menu':'Buka menu'} onClick={()=>setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{open?<path d="M6 6l12 12M18 6L6 18"/>:<path d="M4 7h16M4 12h16M4 17h16"/>}</svg>
          </button>
        </div>
      </div>
      {open&&<div className="menu" id="nav-menu">
        <nav aria-label="Menu">{links}</nav>
        <div className="menu-cta"><Link className="btn-c" to="/roadmap">Roadmap</Link><Link className="btn-c pri" to="/docs">Baca Docs</Link></div>
      </div>}
    </header>
    <Transition items={items} loaded={loaded} err={err} seen={seen} onRead={markRead}/>
  </>;
}

function Transition(p:{items:Ann[];loaded:boolean;err:boolean;seen:number;onRead:()=>void}){
  const loc=useLocation();const [shown,setShown]=useState(loc);const [phase,setPhase]=useState<'in'|'out'>('in');
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(loc.pathname===shown.pathname)return;
    const docs=loc.pathname.startsWith('/docs')&&shown.pathname.startsWith('/docs');
    const wait=reduced()||docs?0:150;
    if(wait)setPhase('out');
    const t=setTimeout(()=>{setShown(loc);setPhase('in');scrollTo(0,0);ref.current?.focus({preventScroll:true})},wait);
    return()=>clearTimeout(t);
  },[loc,shown.pathname]);
  return <main id="main" tabIndex={-1} ref={ref} className={`page ${phase}${shown.pathname.startsWith('/docs')?' docs':''}`}>
    <Routes location={shown}>
      <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/learn" element={<Learn/>}/>
      <Route path="/docs" element={<Docs/>}/><Route path="/docs/:slug" element={<Docs/>}/>
      <Route path="/install" element={<Install/>}/><Route path="/playground" element={<Playground/>}/>
      <Route path="/announcements" element={<Announcements {...p}/>}/>
      <Route path="/roadmap" element={<Roadmap/>}/><Route path="/community" element={<Community/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </main>;
}
