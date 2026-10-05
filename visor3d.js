// El cubo 3D: piezas, dibujo, paleta de colores y plantillas (resuelto, capa superior, F2L...).
const cubies=[],scene=$('scene');let pc='Y';
for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
 const el=document.createElement('div');el.className='cb';const c={el,h:[x,y,z],pos:[x,y,z],M:I(),st:{}};
 for(const k in F){const [t,ax,sg]=F[k],f=document.createElement('div');f.className='f';
  f.style.transform=`${t} translateZ(${H}px)`;
  if(c.h[ax]==sg){const s=document.createElement('div');s.className='s';f.appendChild(s);c.st[k]=s}
  el.appendChild(f)}
 scene.appendChild(el);cubies.push(c)}
function draw(c,R){const Rm=R||I(),A=mul(Rm,c.M),p=mvp(Rm,c.pos);
 c.el.style.transform=`matrix3d(${A[0][0]},${A[1][0]},${A[2][0]},0,${A[0][1]},${A[1][1]},${A[2][1]},0,${A[0][2]},${A[1][2]},${A[2][2]},0,${p[0]*S},${p[1]*S},${p[2]*S},1)`}
const drawAll=()=>cubies.forEach(c=>draw(c));

// paleta y plantillas
const CN={W:'Blanco',Y:'Amarillo',G:'Verde',B:'Azul',R:'Rojo',O:'Naranja',N:'Gris (sin definir)'};
Object.keys(C).forEach(k=>{const b=document.createElement('button');b.style.background=C[k];b.title=CN[k];b.setAttribute('aria-label','Pincel '+CN[k]);b.setAttribute('aria-pressed',k==pc);
 if(k==pc)b.className='on';b.onclick=()=>{pc=k;[...$('pal').children].forEach(x=>{x.className='';x.setAttribute('aria-pressed','false')});b.className='on';b.setAttribute('aria-pressed','true')};$('pal').appendChild(b)});
let lastPre='top';
function preset(p){lastPre=p;cubies.forEach(c=>{for(const f in c.st){
 const hs=JSON.stringify(c.h),ok=p=='solved'||(p=='top'&&c.h[1]==-1)||(p=='f2l'&&c.h[1]>=0)||(p=='par'&&(hs=='[1,1,1]'||hs=='[1,0,1]'));c.st[f].style.background=C[c.st[f].dataset.c=ok?SOL[f]:'N']}})}
document.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{preset(b.dataset.pre);reset();render()});
