import {useRef,useState,type KeyboardEvent} from 'react';
import {Link} from 'react-router-dom';

type T={id:string;label:string;grp:string;d:string;file?:boolean};
const tabs:T[]=[
  {id:'pip',label:'pip',grp:'Package manager',d:'Pemasangan lewat pip (Python Package Index).'},
  {id:'npm',label:'npm',grp:'Package manager',d:'Pemasangan lewat npm (Node Package Manager).'},
  {id:'yarn',label:'Yarn',grp:'Package manager',d:'Pemasangan lewat Yarn.'},
  {id:'pnpm',label:'pnpm',grp:'Package manager',d:'Pemasangan lewat pnpm.'},
  {id:'acode',label:'Acode',grp:'Editor',d:'Plugin Acode yang dipasang langsung dari dalam editor.'},
  {id:'vscode',label:'VS Code',grp:'Editor',d:'Ekstensi Visual Studio Code yang dipasang terpisah.'},
  {id:'installer',label:'Installer',grp:'Berkas',d:'Berkas instalasi yang diunduh dan dijalankan langsung.',file:true},
  {id:'full',label:'Paket Full',grp:'Berkas',d:'Paket lengkap dalam satu unduhan.',file:true}];
const groups=['Package manager','Editor','Berkas'];

export default function Install(){
  const [i,setI]=useState(0);const refs=useRef<(HTMLButtonElement|null)[]>([]);
  const key=(e:KeyboardEvent)=>{
    let n=i;
    if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;
    else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
    e.preventDefault();setI(n);refs.current[n]?.focus();
  };
  const t=tabs[i];
  return <div className="container narrow"><p className="eyebrow">Install</p><h1>Pasang Aruna</h1>
    <p className="lead">Pilih cara pemasangan. Semua jalur ini sedang disiapkan dan tersedia setelah rilis pertama.</p>
    <div role="tablist" aria-label="Cara pemasangan" onKeyDown={key}>
      {groups.map(g=><div className="tabgrp" key={g}><small>{g}</small><div className="chips">
        {tabs.map((x,n)=>x.grp===g&&<button key={x.id} ref={el=>{refs.current[n]=el}} type="button" role="tab" id={'tab-'+x.id}
          aria-selected={n===i} aria-controls="tp" tabIndex={n===i?0:-1} className="chip" onClick={()=>setI(n)}>{x.label}</button>)}
      </div></div>)}
    </div>
    <div role="tabpanel" id="tp" aria-labelledby={'tab-'+t.id} className="ipanel">
      <div className="d-flex flex-wrap align-items-center gap-2"><h2>{t.label}</h2><span className="tag">Segera hadir</span></div>
      <p className="mut">{t.d}</p>
      <div className="win"><div className="win-bar"><i/><i/><i/><span className="t">{t.file?'unduhan':'terminal'}</span></div>
        <div className="win-body"><p>{t.file?'Tautan unduhan akan tersedia setelah rilis pertama.':'Perintah instalasi akan tampil di sini setelah rilis pertama.'}</p></div>
        <div className="win-foot"><span className="mut">Belum dirilis</span><span className="btn-c sm off" aria-disabled="true">{t.file?'Unduh':'Salin'}</span></div></div>
    </div>
    <div className="note mt-4">Ingin tahu saat rilis? Pantau <Link to="/announcements">Pengumuman</Link> atau <a href="https://github.com/aruna-language" target="_blank" rel="noopener noreferrer">GitHub resmi Aruna<span className="visually-hidden"> (tab baru)</span></a>.</div>
  </div>;
}
