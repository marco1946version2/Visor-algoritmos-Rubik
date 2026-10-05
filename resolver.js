// Cubo desplegado, validación de estados, mezcla al azar y mezcla escrita.
// --- resolvedor, paso 1: cubo desplegado + validación ---
let lastScr=null;
const FO={U:[0,3],L:[3,0],F:[3,3],R:[3,6],B:[3,9],D:[6,3]};
const FP={U:(r,c)=>[c-1,-1,r-1],D:(r,c)=>[c-1,1,1-r],F:(r,c)=>[c-1,r-1,1],B:(r,c)=>[1-c,r-1,-1],R:(r,c)=>[1,r-1,1-c],L:(r,c)=>[-1,r-1,c-1]};
const NS=[];for(const f in FO)for(let r=0;r<3;r++)for(let c=0;c<3;c++){const n=[0,0,0];n[F[f][1]]=F[f][2];const ct=r==1&&c==1;NS.push({f,pos:FP[f](r,c),n,gr:FO[f][0]+r+1,gc:FO[f][1]+c+1,ct,k:ct?SOL[f]:'N'})}
NS.forEach((c,i)=>{const d=document.createElement('div');d.className='ns'+(c.ct?' ct':'');d.style.gridRow=c.gr;d.style.gridColumn=c.gc;d.dataset.i=i;c.el=d;$('net').appendChild(d)});
const paintNet=()=>NS.forEach(c=>c.el.style.background=C[c.k]);
const setNet=m=>{lastScr=null;SOLV=null;$('solres').innerHTML='';$('solsum').textContent='';$('nshow').hidden=$('ncopy').hidden=true;NS.forEach(c=>{if(!c.ct)c.k=m(c)});paintNet();$('vmsg').textContent=''};
let snc='Y';
Object.keys(C).filter(k=>k!='N').forEach(k=>{const b=document.createElement('button');b.style.background=C[k];b.title=CN[k];b.setAttribute('aria-label','Pincel '+CN[k]);if(k==snc)b.className='on';b.onclick=()=>{snc=k;[...$('snpal').children].forEach(x=>x.className='');b.className='on'};$('snpal').appendChild(b)});
$('net').onclick=e=>{const d=e.target.closest('.ns');if(!d)return;const c=NS[d.dataset.i];if(c.ct)return;c.k=snc;lastScr=null;SOLV=null;$('solres').innerHTML='';$('solsum').textContent='';$('nshow').hidden=$('ncopy').hidden=true;paintNet();$('vmsg').textContent=''};
function simFwd(alg){const cs=[];for(let x=-1;x<2;x++)for(let y=-1;y<2;y++)for(let z=-1;z<2;z++)cs.push({h:[x,y,z],pos:[x,y,z],M:[[1,0,0],[0,1,0],[0,0,1]]});
 alg.forEach(w=>{const q=w.slice(1),[ax,ls,d]=MV[w[0]],R=rnd(rot(ax,d*(q.includes('2')?180:90)*(q=="'"?-1:1)));cs.filter(c=>ls.includes(c.pos[ax])).forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos))})});return cs}
$('nres').onclick=()=>setNet(c=>SOL[c.f]);$('nvac').onclick=()=>setNet(()=>'N');
function applyScr(L){const M=new Map();simFwd(L).forEach(c=>{for(const f in F)if(c.h[F[f][1]]==F[f][2]){const n=[0,0,0];n[F[f][1]]=F[f][2];M.set(c.pos+'|'+rnd(mvp(c.M,n)),SOL[f])}});
 setNet(c=>M.get(c.pos+'|'+c.n));lastScr=L;$('vmsg').textContent='Mezcla aplicada: '+L.join(' ')+'. Pulsa «Resolver», o usa «Ver en el cubo 3D» / «Reproducir la mezcla».'}
$('nmez').onclick=()=>{const L=[];let last='';while(L.length<22){const m='RLUDFB'[Math.random()*6|0];if(m==last)continue;last=m;L.push(m+["","'","2"][Math.random()*3|0])}applyScr(L)};
$('nscrb').onclick=()=>{const e=expand($('nscr').value);if(e.bad){$('vmsg').textContent=`No entiendo "${e.bad}"`;return}
 if(!e.moves.length){$('vmsg').textContent='Escribe una mezcla primero.';return}
 const x=e.moves.find(w=>!/^[RLUDFB]/.test(w));if(x){$('vmsg').textContent=`En la mezcla usa solo caras R L U D F B (no «${x}»).`;return}
 applyScr(e.moves)};
const hasUD=k=>k=='Y'||k=='W',parity=a=>{let s=0;const v=[];for(let i=0;i<a.length;i++){if(v[i])continue;let j=i,l=0;while(!v[j]){v[j]=1;j=a[j];l++}s+=l-1}return s%2};
function validar(){const out=[],nv=NS.filter(c=>c.k=='N').length;if(nv)return[`Faltan ${nv} stickers por pintar.`];
 for(const k of 'WYGBRO'){const n=NS.filter(c=>c.k==k).length;if(n!=9)out.push(`Hay ${n} stickers de color ${CN[k].toLowerCase()} y deben ser 9 (contando el centro).`)}
 if(out.length)return out;
 const by={},home={},seen={};NS.forEach(c=>{if(!c.ct)(by[c.pos]=by[c.pos]||[]).push(c)});
 Object.entries(by).forEach(([p,cs])=>home[cs.map(c=>SOL[c.f]).sort().join('')]=p);
 const P2=Object.keys(by).filter(p=>by[p].length==2).sort(),P3=Object.keys(by).filter(p=>by[p].length==3).sort(),pe=[],pc=[];let tw=0,fl=0;
 Object.entries(by).forEach(([p,cs])=>{const h=home[cs.map(c=>c.k).sort().join('')],nm=cs.map(c=>CN[c.k]).join('-');
  if(!h){out.push(`Combinación de colores imposible en una pieza: ${nm}.`);return}
  if(seen[h]){out.push(`La pieza ${nm} aparece dos veces.`);return}seen[h]=1;
  if(cs.length==3){pc[P3.indexOf(p)]=P3.indexOf(h);const u=cs.find(c=>hasUD(c.k)),s=p.split(',').reduce((a,b)=>a*b,1);tw+=u.n[1]?0:(u.n[0]?(s>0?1:2):(s>0?2:1))}
  else{pe[P2.indexOf(p)]=P2.indexOf(h);const rc=cs.find(c=>hasUD(c.k))||cs.find(c=>c.k=='G'||c.k=='B'),ref=p.split(',')[1]!=0?cs.find(c=>c.n[1]):cs.find(c=>c.n[2]);fl+=rc!==ref?1:0}});
 if(out.length)return out;
 if(tw%3)out.push('Hay una esquina girada sobre sí misma: el cubo no se puede resolver así.');
 if(fl%2)out.push('Hay una arista volteada: el cubo no se puede resolver así.');
 if(parity(pc)!=parity(pe))out.push('Hay dos piezas intercambiadas: el cubo no se puede resolver así.');
 return out}
$('nval').onclick=()=>{const o=validar();$('vmsg').innerHTML=o.length?o.map(x=>'⚠ '+esc(x)).join('<br>'):'✔ Cubo válido: se puede resolver.';if(!o.length)window.CUBE=NS.map(c=>c.k)};
$('n3d').onclick=async()=>{if(NS.some(c=>c.k=='N')){$('vmsg').textContent='Pinta todos los stickers primero (o usa «Mezcla al azar»).';return}
 $('cs').checked=false;await reset();
 cubies.forEach(c=>{for(const f in c.st){const n=[0,0,0];n[F[f][1]]=F[f][2];const x=NS.find(q=>q.pos+''==c.h+''&&q.n+''==n+'');if(x){c.st[f].style.background=C[x.k];c.st[f].dataset.c=x.k}}});
 $('vmsg').textContent='Mostrado en el cubo 3D (se desmarcó «Empezar en el caso»). Puedes escribir un algoritmo arriba y reproducirlo sobre este cubo.';scrollTo({top:0,behavior:'smooth'})};
$('nplay').onclick=async()=>{if(!lastScr){$('vmsg').textContent='Primero genera una mezcla con «Mezcla al azar» (si cambias el dibujo, la mezcla se olvida).';return}
 $('cs').checked=false;cur=null;preset('solved');$('alg').value=lastScr.join(' ');load();await reset();render();scrollTo({top:0,behavior:'smooth'});setTimeout(play,350)};
$('solvb').onclick=()=>{const v=$('solv');v.hidden=!v.hidden;if(!v.hidden)v.scrollIntoView({behavior:'smooth'})};
paintNet();
