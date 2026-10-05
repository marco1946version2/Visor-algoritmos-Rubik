const S=60,H=30,$=id=>document.getElementById(id);
const coarse=matchMedia('(pointer:coarse)').matches;
const C={W:'#f4f4f0',Y:'#ffd500',G:'#00a651',B:'#1f5fd1',R:'#d42a2a',O:'#ff7a00',N:'#8b8f98'};
const F={U:['rotateX(90deg)',1,-1],D:['rotateX(-90deg)',1,1],F:['',2,1],B:['rotateY(180deg)',2,-1],R:['rotateY(90deg)',0,1],L:['rotateY(-90deg)',0,-1]};
const SOL={U:'Y',D:'W',F:'G',B:'B',R:'O',L:'R'};
const I=()=>[[1,0,0],[0,1,0],[0,0,1]];
const mul=(a,b)=>a.map(r=>[0,1,2].map(j=>r[0]*b[0][j]+r[1]*b[1][j]+r[2]*b[2][j]));
const mvp=(a,v)=>a.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
const rnd=m=>m.map(r=>Array.isArray(r)?r.map(Math.round):Math.round(r));
function rot(ax,deg){const t=deg*Math.PI/180,c=Math.cos(t),s=Math.sin(t);
 return ax==0?[[1,0,0],[0,c,-s],[0,s,c]]:ax==1?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]]}
// movimientos: [eje, capas, sentido horario]
const MV={R:[0,[1],1],L:[0,[-1],-1],U:[1,[-1],-1],D:[1,[1],1],F:[2,[1],1],B:[2,[-1],-1],M:[0,[0],-1],E:[1,[0],1],S:[2,[0],1],
r:[0,[0,1],1],l:[0,[-1,0],-1],u:[1,[-1,0],-1],d:[1,[0,1],1],f:[2,[0,1],1],b:[2,[-1,0],-1],x:[0,[-1,0,1],1],y:[1,[-1,0,1],-1],z:[2,[-1,0,1],1]};

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

// algoritmo
let mv=[],idx=0,busy=false,playing=false;
const MOVE=/^[RLUDFBMESxyzrludfb](2'|'2|2|')?$/;
// Expande paréntesis/corchetes con repetición: (R U R' U')3 -> 12 movimientos. Admite anidados.
function expand(text){
 const toks=text.replace(/[’‘′`´]/g,"'").replace(/²/g,'2').replace(/³/g,'3').replace(/([RLUDFB])w/g,m=>m[0].toLowerCase()).replace(/[()\[\]]/g,' $& ').split(/\s+/).filter(Boolean);
 let bad=null;const st=[[]];
 for(let i=0;i<toks.length;i++){const w=toks[i],top=()=>st[st.length-1];
  if(w=='('||w=='['){st.push([]);continue}
  if(w==')'||w==']'){
   if(st.length<2){bad=bad||w;st[0].push(w);continue}
   const g=st.pop();let n=1;
   {const nx=(toks[i+1]||'').replace(/^[×*]/,'');if(/^\d+$/.test(nx)){n=Math.min(+nx,20);i++}}
   if(top().length+g.length*n>600){bad=bad||'demasiados movimientos';continue}
   for(let r=0;r<n;r++)top().push(...g);continue}
  if(!MOVE.test(w)&&/^(?:[RLUDFBMESxyzrludfb](?:2'|'2|2|')?)+$/.test(w)){top().push(...w.match(/[RLUDFBMESxyzrludfb](?:2'|'2|2|')?/g));continue}
  if(!MOVE.test(w))bad=bad||w;
  top().push(w)}
 while(st.length>1){bad=bad||'(';const g=st.pop();st[st.length-1].push('(',...g)}
 return{moves:st[0],bad}}
function parse(){const e=expand($('alg').value);
 $('err').textContent=e.bad?`No entiendo "${e.bad}"`:'';
 return e.bad?[]:e.moves.map(w=>{const q=w.slice(1);return{k:w[0],a:q.includes('2')?180:90,s:q=="'"?-1:1,t:w}})}
function mark(){$('chips').innerHTML=mv.map((m,i)=>`<span class="${i<idx?'d':''}${i==idx?' c':''}">${m.t}</span>`).join('')}
function anim(m,sg){return new Promise(res=>{const [ax,ls,d]=MV[m.k],tot=d*m.a*m.s*sg;
 const cs=cubies.filter(c=>ls.includes(c.pos[ax])),t0=performance.now(),dur=+$('spd').value*(m.a>90?1.5:1);
 (function f(t){const p=Math.min(1,(t-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
  cs.forEach(c=>draw(c,rot(ax,tot*e)));
  if(p<1)requestAnimationFrame(f);else{const R=rnd(rot(ax,tot));
   cs.forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos));draw(c)});res()}})(t0)})}
async function go(sg){if(busy||(sg>0&&idx>=mv.length)||(sg<0&&idx<=0))return false;
 busy=true;await anim(mv[sg>0?idx:idx-1],sg);idx+=sg;busy=false;mark();return true}
async function reset(){playing=false;$('pb').textContent='▶';while(busy)await new Promise(r=>setTimeout(r,20));
 cubies.forEach(c=>{c.pos=[...c.h];c.M=I()});if($('cs').checked)for(let i=mv.length-1;i>=0;i--)inst(mv[i],-1);drawAll();idx=0;mark()}
function inst(m,sg){const [ax,ls,d]=MV[m.k],R=rnd(rot(ax,d*m.a*m.s*sg));
 cubies.filter(c=>ls.includes(c.pos[ax])).forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos))})}
async function play(){if(playing){playing=false;return}
 if(idx>=mv.length)await reset();playing=true;$('pb').textContent='⏸';
 while(playing&&await go(1));playing=false;$('pb').textContent='▶'}
function load(){mv=parse();reset()}
if(coarse){$('alg').readOnly=true;$('alg').inputMode='none'}
$('alg').oninput=()=>{load();render()};$('pb').onclick=play;$('rs').onclick=reset;
$('fw').onclick=()=>{playing=false;go(1)};$('bk').onclick=()=>{playing=false;go(-1)};
document.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{$('alg').value=b.dataset.ex;load();render()});
const tk=()=>expand($('alg').value).moves;
const flip=w=>w.endsWith("2'")?w.slice(0,-1):w.endsWith('2')?w:w.endsWith("'")?w.slice(0,-1):w+"'";
$('mi').onclick=()=>{$('alg').value=tk().map(w=>{const k=w[0],sw={R:'L',L:'R',r:'l',l:'r'}[k];
 if(sw)w=sw+w.slice(1);return 'Mx'.includes(k)?w:flip(w)}).join(' ');load();render()};
$('inv').onclick=()=>{$('alg').value=tk().reverse().map(flip).join(' ');load();render()};

// vista: arrastrar para girar, tocar para pintar
let rx=-25,ry=-35,dn=null,tilt=false;const view=()=>scene.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
$('stage').addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY,t:e.target,m:0,ox:e.clientX,oy:e.clientY}});
addEventListener('pointermove',e=>{if(!dn)return;
 if(Math.abs(e.clientX-dn.ox)+Math.abs(e.clientY-dn.oy)>6)dn.m=1;
 if(dn.m){ry+=(e.clientX-dn.x)*.5;if(!coarse||tilt)rx=Math.max(-90,Math.min(90,rx-(e.clientY-dn.y)*.5));view()}
 dn.x=e.clientX;dn.y=e.clientY});
addEventListener('pointerup',()=>{if(dn&&!dn.m&&dn.t.classList&&dn.t.classList.contains('s'))dn.t.style.background=C[dn.t.dataset.c=pc];dn=null});
addEventListener('pointercancel',()=>{dn=null});
$('tl').addEventListener('pointerdown',e=>e.stopPropagation());
$('tl').onclick=()=>{tilt=!tilt;$('stage').classList.toggle('tilt',tilt);$('tl').classList.toggle('on',tilt);$('tl').setAttribute('aria-pressed',tilt);$('tl').textContent=tilt?'✋ Listo':'↕ Inclinar'};

let ST={mine:[],fav:[],done:[],cats:[],hide:[],gone:[],alts:{}},tab='PLL',cur=null,lst=[],cdq=0,lastTab=null,vi=0,dq=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cats=()=>[...['PLL','OLL','F2L','Básicos'].filter(k=>LIB[k]&&!ST.hide.includes(k)),...new Set([...ST.cats,...ST.mine.map(m=>m.g)].filter(g=>g&&!LIB[g]&&g!='Míos'&&g!='★'))];
try{Object.assign(ST,JSON.parse(localStorage.getItem('rubik-v1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('rubik-v1',JSON.stringify(ST))}catch(e){}};
const K=x=>x.s+':'+x.n,has=(a,x)=>ST[a].includes(K(x));
function all(){const o=[];for(const s in LIB)LIB[s].forEach(t=>{const [n,a]=t.split('|');o.push({s,n,a})});
 ST.mine.forEach(m=>o.push({s:m.g||'Míos',n:m.n,a:m.a,own:1,p:m.p}));return o.filter(x=>!ST.gone.includes(K(x)))}
function render(){const q=$('q').value.toLowerCase(),A=all(),inTab=x=>tab=='Míos'?!!x.own:x.s==tab;
 lst=(tab=='★'?A.filter(x=>has('fav',x)):A.filter(inTab)).filter(x=>(x.n+' '+x.a).toLowerCase().includes(q));
 const len=x=>x.a.split(/\s+/).length;
 if($('fr').checked)lst=lst.filter(x=>/^[RU2' ()]+$/.test(x.a));
 if($('fx').checked)lst=lst.filter(x=>!/[xyzMES]/.test(x.a));
 if($('so').value)lst=[...lst].sort((a,b)=>($('so').value=='n'?1:-1)*(len(a)-len(b)));
 $('caseName').textContent=cur?`${cur.s} · ${cur.n}${vars(cur).includes($('alg').value.trim())?'':' · editado'}`:'Algoritmo personalizado';
 $('mc').textContent=`${mv.length} ${mv.length==1?'movimiento':'movimientos'}`;
 $('lst').innerHTML=lst.map((x,i)=>`<button class="b${cur&&K(cur)==K(x)?' on':''}" data-i="${i}"><span class="th">${thumb(x.a,viewOf(x),/oll/i.test(x.s))}</span><span class="nm">${esc(x.n)}${has('fav',x)?' ★':''}${has('done',x)?' ✓':''}${vars(x).length>1?` <i>×${vars(x).length}</i>`:''}</span></button>`).join('')||'<span style="color:var(--mu)">Vacío. Escribe un algoritmo y guárdalo con 💾.</span>';
 const d=A.filter(x=>inTab(x)||tab=='★').filter(x=>has('done',x)).length;$('cnt').textContent=tab=='★'?'':`${d}/${A.filter(inTab).length} aprendidos`;
 $('tabs').innerHTML=[...cats(),'Míos','★'].map(t=>`<button class="b${t==tab?' on':''}" data-t="${esc(t)}">${esc(t)}</button>`).join('');
 $('fv').classList.toggle('on',!!cur&&has('fav',cur));$('dn').classList.toggle('on',!!cur&&has('done',cur));$('del').style.display=cur?'':'none';$('del').textContent=dq?'¿Seguro? Toca otra vez':'🗑 Borrar caso';$('mv').style.display=cur&&cur.own?'':'none';
 const C=cats(),sel=$('cg'),pv=sel.value,opts=[...C,'Míos'];
 $('cd').style.display=C.includes(tab)?'':'none';$('cd').textContent=cdq?'¿Seguro? Toca otra vez':'🗑 Borrar categoría';{const n=ST.hide.length+ST.gone.length;$('cr').style.display=n?'':'none';$('cr').textContent=`↺ Restaurar (${n})`}
 sel.innerHTML=opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
 sel.value=tab!=lastTab&&opts.includes(tab)?tab:opts.includes(pv)?pv:'Míos';lastTab=tab;
 const V=cur?vars(cur):[];if(vi>=V.length)vi=0;
 $('vrow').innerHTML=cur?'<span class="hint">Variantes</span>'+V.map((_,i)=>`<button class="b${i==vi?' on':''}" data-v="${i}">${i+1}</button>`).join('')+'<button class="b" data-a="add" title="Guarda el algoritmo actual como otra variante de este caso">＋ variante</button>'+(vi>0?'<button class="b" data-a="rm">🗑 variante</button>':''):'';
 $('bigth').innerHTML=thumb($('alg').value,lastPre,!!cur&&/oll/i.test(cur.s))}
function pick(x){cur=x;vi=0;dq=0;$('alg').value=x.a;$('nm').value=x.n;preset(viewOf(x));load();render()}
$('lst').onclick=e=>{const b=e.target.closest('[data-i]');if(b)pick(lst[b.dataset.i])};
$('tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(b){tab=b.dataset.t;cdq=0;render()}};
$('q').oninput=render;
$('rnd').onclick=()=>{const c=lst.filter(x=>!has('done',x));const l=c.length?c:lst;if(l.length)pick(l[Math.floor(Math.random()*l.length)])};
const tog=a=>{if(!cur)return;const k=K(cur),i=ST[a].indexOf(k);i<0?ST[a].push(k):ST[a].splice(i,1);save();render()};
$('fv').onclick=()=>tog('fav');$('dn').onclick=()=>tog('done');
$('sv').onclick=()=>{const n=$('nm').value.trim(),a=$('alg').value.trim();if(!n||!a||!mv.length)return $('err').textContent='Necesito nombre y un algoritmo válido';
 const g0=$('cg').value,g=g0=='Míos'?undefined:g0;ST.mine=ST.mine.filter(m=>!(m.n==n&&m.g==g));ST.mine.push({n,a,p:lastPre,g});save();tab=g||'Míos';cur={s:g||'Míos',n,a,own:1,p:lastPre};render()};
$('del').onclick=()=>{if(!cur)return;if(!dq){dq=1;return render()}
 if(cur.own){ST.mine=ST.mine.filter(m=>!(m.n==cur.n&&(m.g||'Míos')==cur.s));delete ST.alts[K(cur)]}else if(!ST.gone.includes(K(cur)))ST.gone.push(K(cur));
 dq=0;vi=0;cur=null;save();render()};
$('cs').onchange=reset;
const viewOf=x=>x.p||(x.s=='PLL'||x.s=='OLL'?'top':x.s=='F2L'?'f2l':'solved');
function vars(x){return [x.a,...(ST.alts[K(x)]||[])]}
const TH={};
function colOf(h,f,p){const hs=JSON.stringify(h),ok=p=='solved'||(p=='top'&&h[1]==-1)||(p=='f2l'&&h[1]>=0)||(p=='par'&&(hs=='[1,1,1]'||hs=='[1,0,1]'));return ok?SOL[f]:'N'}
function snap(a,p){const k=a+'|'+p;if(TH[k])return TH[k];
 const cs=[];for(let x=-1;x<2;x++)for(let y=-1;y<2;y++)for(let z=-1;z<2;z++)cs.push({h:[x,y,z],pos:[x,y,z],M:I()});
 (gnorm(a)||'').split(' ').filter(Boolean).reverse().forEach(w=>{const q=w.slice(1),[ax,ls,d]=MV[w[0]],R=rnd(rot(ax,-d*(q.includes('2')?180:90)*(q=="'"?-1:1)));
  cs.filter(c=>ls.includes(c.pos[ax])).forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos))})});
 const o=[];cs.forEach(c=>{for(const f in F){const ax=F[f][1],sg=F[f][2];if(c.h[ax]==sg){const n=[0,0,0];n[ax]=sg;o.push({p:c.pos,n:rnd(mvp(c.M,n)),c:colOf(c.h,f,p),h:c.h})}}});return TH[k]=o}
function thumb(a,p,bin){const S=snap(a,p),g=[];
 if(p=='top'){const col=c=>bin&&c!='Y'?C.N:C[c],op=c=>bin&&c!='Y'?' opacity=".35"':'';
  S.forEach(s=>{if(s.p[1]!=-1)return;const x=s.p[0],z=s.p[2],nx=s.n[0],ny=s.n[1],nz=s.n[2];let r;
   if(ny==-1)r=[9+(x+1)*12,9+(z+1)*12,11,11];else if(nz==1)r=[9+(x+1)*12,47,11,4];else if(nz==-1)r=[9+(x+1)*12,3,11,4];
   else if(nx==1)r=[47,9+(z+1)*12,4,11];else if(nx==-1)r=[3,9+(z+1)*12,4,11];else return;
   g.push(`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="2" fill="${col(s.c)}"${op(s.c)}/>`)});
  return `<svg viewBox="0 0 54 54">${g.join('')}</svg>`}
 const u=9,e=.46,P=(x,y,z)=>`${((x-z)*.866*u).toFixed(1)},${((x+z)*.5*u+y*u).toFixed(1)}`;
 S.forEach(s=>{const x=s.p[0],y=s.p[1],z=s.p[2],nx=s.n[0],ny=s.n[1],nz=s.n[2];let q;
  if(ny==-1)q=[[x-e,-1.5,z-e],[x+e,-1.5,z-e],[x+e,-1.5,z+e],[x-e,-1.5,z+e]];
  else if(nz==1)q=[[x-e,y-e,1.5],[x+e,y-e,1.5],[x+e,y+e,1.5],[x-e,y+e,1.5]];
  else if(nx==1)q=[[1.5,y-e,z-e],[1.5,y-e,z+e],[1.5,y+e,z+e],[1.5,y+e,z-e]];else return;
  g.push(`<polygon points="${q.map(v=>P(v[0],v[1],v[2])).join(' ')}" fill="${C[s.c]}"/>`)});
 return `<svg viewBox="-26 -28 52 56">${g.join('')}</svg>`}
$('vrow').onclick=e=>{const b=e.target.closest('button');if(!b||!cur)return;const k=K(cur),V=vars(cur);
 if(b.dataset.v!=null){vi=+b.dataset.v;$('alg').value=V[vi];load();render();return}
 if(b.dataset.a=='add'){const a=$('alg').value.trim();if(!a||!mv.length)return $('err').textContent='Arma un algoritmo válido primero';
  if(V.includes(a))return $('err').textContent='Esa variante ya existe';(ST.alts[k]=ST.alts[k]||[]).push(a);vi=V.length;save();render()}
 else if(b.dataset.a=='rm'&&vi>0){ST.alts[k].splice(vi-1,1);vi=0;$('alg').value=vars(cur)[0];load();save();render()}};
$('ca').onclick=()=>{const n=$('cat').value.trim();if(!n||n=='Míos'||n=='★')return;
 if(LIB[n])ST.hide=ST.hide.filter(x=>x!=n);else if(!cats().includes(n))ST.cats.push(n);
 $('cat').value='';tab=n;save();render()};
$('cd').onclick=()=>{if(!cats().includes(tab))return;if(!cdq){cdq=1;return render()}
 cdq=0;ST.mine=ST.mine.filter(m=>m.g!=tab);ST.cats=ST.cats.filter(c=>c!=tab);if(LIB[tab]&&!ST.hide.includes(tab))ST.hide.push(tab);
 cur=null;tab=cats()[0]||'Míos';save();render()};
$('cr').onclick=()=>{ST.hide=[];ST.gone=[];save();render()};
$('mv').onclick=()=>{if(!cur||!cur.own)return;const g0=$('cg').value,g=g0=='Míos'?undefined:g0,m=ST.mine.find(x=>x.n==cur.n&&(x.g||'Míos')==cur.s);if(!m)return;
 ST.mine=ST.mine.filter(x=>x===m||!(x.n==m.n&&x.g==g));if(g)m.g=g;else delete m.g;const o=K(cur),nk=(g||'Míos')+':'+cur.n;if(ST.alts[o]){ST.alts[nk]=ST.alts[o];delete ST.alts[o]}['fav','done'].forEach(a=>{const i=ST[a].indexOf(o);if(i>=0)ST[a][i]=nk});save();tab=g||'Míos';cur={...cur,s:g||'Míos'};render()};
const gnorm=a=>{const e=expand(a);return e.bad||!e.moves.length?null:e.moves.join(' ')};
$('bi').onclick=()=>{const g=$('grp').value.trim()||(cats().includes(tab)?tab:'Importados'),p=/f2l/i.test(g)?'f2l':/oll|pll/i.test(g)?'top':'solved';let ok=0,vr=0,bad=[];
 $('bulk').value.split('\n').forEach(ln=>{ln=ln.trim().replace(/^(\d+)[.)]\s+/,'$1: ');if(!ln)return;
  const m=ln.match(/^(.*?)\s*[:|\t;]\s*(.+)$/),a=gnorm(m?m[2]:ln);
  if(!a){bad.push(ln.slice(0,22));return}
  let n=m?m[1]:'';n=!n?`${g} ${ok+1}`:/^\d+$/.test(n)?`${g} ${n}`:n;
  const ex=all().find(y=>y.s==g&&y.n==n);if(ex){if(!vars(ex).includes(a))(ST.alts[K(ex)]=ST.alts[K(ex)]||[]).push(a);vr++}else{ST.mine.push({n,a,p,g});ok++}});
 save();if(ok)tab=g;render();$('err').textContent=`Importados: ${ok}${vr?` · ${vr} como variante`:''}`+(bad.length?` · no entendí ${bad.length} (${bad.slice(0,3).join(' / ')})`:'')};
$('ex').onclick=()=>$('io').value=JSON.stringify(ST);
$('im').onclick=()=>{try{const d=JSON.parse($('io').value);['mine','fav','done','cats','hide','gone'].forEach(k=>{if(Array.isArray(d[k]))ST[k]=k=='mine'?[...ST.mine.filter(m=>!d.mine.some(n=>n.n==m.n)),...d.mine]:[...new Set([...ST[k],...d[k]])]});if(d.alts)for(const k in d.alts)ST.alts[k]=[...new Set([...(ST.alts[k]||[]),...d.alts[k]])];save();render();$('err').textContent='Importado ✓'}catch(e){$('err').textContent='Datos no válidos'}};

const KB='RLUDFBrludfbMESxyz';
$('kp').innerHTML=[...KB].map(k=>`<button class="b${/[A-Z]/.test(k)&&!'MES'.includes(k)?'':' m'}" data-k="${k}" title="${'xyz'.includes(k)?'Rotar todo el cubo':'MES'.includes(k)?'Capa central':/[a-z]/.test(k)?'Dos capas':'Cara'}">${k}</button>`).join('')
 +`<button class="b x" data-a="p">' (prima)</button><button class="b" data-a="d" title="Doble (o repetir el grupo 2 veces, justo después de un paréntesis)">2</button><button class="b" data-a="o" title="Abrir grupo">(</button><button class="b" data-a="c" title="Cerrar grupo">)</button><button class="b" data-a="3" title="Repetir el grupo 3 veces">×3</button><button class="b" data-a="4" title="Repetir el grupo 4 veces">×4</button><button class="b" data-a="del" aria-label="Borrar último movimiento" title="Borrar último movimiento">⌫</button><button class="b" data-a="clr" aria-label="Limpiar algoritmo" title="Limpiar algoritmo">🧹</button>`;
const rawTok=()=>$('alg').value.replace(/[’‘′`´]/g,"'").replace(/([RLUDFB])w/g,m=>m[0].toLowerCase()).replace(/[()\[\]]/g,' $& ').split(/\s+/).filter(Boolean).map(w=>w=='['?'(':w==']'?')':w);
$('kp').onclick=e=>{const b=e.target.closest('button');if(!b)return;let t=rawTok();const l=t.length-1,last=t[l]||'';
 if(b.dataset.k)t.push(b.dataset.k);
 else{const a=b.dataset.a;
  if(a=='clr')t=[];else if(a=='del')t.pop();
  else if(a=='o')t.push('(');else if(a=='c')t.push(')');
  else if(/^\d$/.test(a)){if(last==')')t.push(a);else if(/^\d+$/.test(last))t[l]=a}
  else if(a=='d'&&last==')')t.push('2');
  else if(MOVE.test(last)){const k=last[0],q=last.slice(1);t[l]=a=='p'?k+(q=="'"?'':q?q:"'"):k+(q=='2'?'':'2')}}
 $('alg').value=t.join(' ').replace(/\( /g,'(').replace(/ \)/g,')').replace(/\) (\d)/g,')$1');load();render()};
// --- extras ---
$('chips').onclick=e=>{const sp=e.target.closest('span');if(sp)seek([...$('chips').children].indexOf(sp))};
async function seek(i){playing=false;$('pb').textContent='▶';await reset();for(let j=0;j<i;j++)inst(mv[j],1);drawAll();idx=i;mark()}
addEventListener('keydown',e=>{if(/^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
 const k=e.key;if(document.activeElement&&document.activeElement.tagName=='BUTTON')document.activeElement.blur();
 if(k==' ')play();else if(k=='ArrowRight'){playing=false;go(1)}else if(k=='ArrowLeft'){playing=false;go(-1)}else if(k=='r'||k=='R'||k=='Home')reset();else return;e.preventDefault()});
try{const t=localStorage.getItem('rubik-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
$('th').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme=='dark':matchMedia('(prefers-color-scheme:dark)').matches;d.dataset.theme=dark?'light':'dark';try{localStorage.setItem('rubik-theme',d.dataset.theme)}catch(e){}};
$('exf').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(ST)],{type:'application/json'}));a.download='rubik-datos.json';a.click()};
$('imf').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{$('io').value=t;$('im').click()})};
['so','fr','fx'].forEach(i=>$(i).onchange=render);
$('pr').onclick=()=>{$('sheet').innerHTML=lst.map(x=>`<div class="sh"><span class="th">${thumb(x.a,viewOf(x),/oll/i.test(x.s))}</span><div><b>${esc(x.n)}</b><br><span>${esc(x.a)}</span></div></div>`).join('');print()};
// ¿Qué caso F2L es? Compara los stickers pintados con el par esquina+arista de cada caso (admite giro previo de U)
const UR=rnd(rot(1,-90)),UK=['',"U'",'U2','U'];
const FN={},CF={};for(const f in F){const n=[0,0,0];n[F[f][1]]=F[f][2];FN[n.join()]=f}for(const f in SOL)CF[SOL[f]]=f;
const YN=['','y',"y2","y'"];
// gira los stickers pintados j veces 'y' (y reetiqueta los colores) para llevar cualquier hueco al delantero-derecho
function turn(P,j){const Y=rnd(rot(1,-90*j));return P.map(s=>{const n=[0,0,0],f=CF[s.c];n[F[f][1]]=F[f][2];return{p:rnd(mvp(Y,s.p)),n:rnd(mvp(Y,s.n)),c:SOL[FN[rnd(mvp(Y,n)).join()]]}})}
function who(){if(cubies.some(c=>c.pos.join()!=c.h.join()))return['El cubo no está resuelto en pantalla (hay un algoritmo cargado). Pulsa 🧹 para vaciar el algoritmo, pinta el par y vuelve a identificar.',0];
 const P=[];cubies.forEach(c=>{for(const f in c.st){const d=c.st[f].dataset.c;if(d&&d!='N'){const n=[0,0,0];n[F[f][1]]=F[f][2];if(SOL[FN[n.join()]]!=d)P.push({p:c.pos,n:rnd(mvp(c.M,n)),c:d})}}});
 if(P.length<2)return['Casi no hay stickers pintados fuera de su sitio. Pinta la esquina (3 stickers) y la arista (2) del par con los colores que tienen en tu cubo; los que ya estén en su sitio (como en «Dos capas») no cuentan.',0];
 if(P.length>5)return[`Hay ${P.length} stickers pintados fuera de su sitio, pero un par solo tiene 5 (esquina 3 + arista 2). Borra o corrige los demás.`,0];
 const key=s=>s.p+'|'+s.n+'|'+s.c,hit=[],sc=[...new Set(P.map(s=>s.c).filter(c=>c!='W'&&c!='Y'))].map(c=>CN[c]).join('-');
 all().filter(x=>x.s=='F2L').forEach(x=>{const S0=snap(x.a,'solved').filter(s=>{const h=s.h.join();return h=='1,1,1'||h=='1,0,1'});let best=null;
  for(let j=0;j<4;j++){const Pj=turn(P,j);let S=S0;
   for(let k=0;k<4;k++){const ks=S.map(key),nsn=S.filter(s=>SOL[FN[s.n.join()]]!=s.c).length;
    if(Pj.every(s=>ks.includes(key(s)))){const eq=nsn==Pj.length;if(!best||(eq&&!best[3]))best=[x,k,j,eq]}
    S=S.map(s=>s.p[1]==-1?{p:rnd(mvp(UR,s.p)),n:rnd(mvp(UR,s.n)),c:s.c,h:s.h}:s)}}
  if(best)hit.push(best)});
 const ex=hit.filter(h=>h[3]);if(ex.length)hit.splice(0,hit.length,...ex);
 if(!hit.length)return['No encontré ningún caso F2L con esos stickers. Revisa los colores y la posición.',0];
 const pre=h=>[YN[h[2]],UK[h[1]]].filter(Boolean).join(' '),fx=h=>h[0].n+(pre(h)?` (${pre(h)} + algoritmo)`:'');
 if(hit.length==1){const h=hit[0],q=pre(h);pick(h[0]);if(q){$('alg').value=q+' '+h[0].a;load();render()}
  return[`Es ${h[0].n} · hueco ${sc}`+(q?` · cargado con «${q}» al inicio para dejarlo como tu cubo`:''),1]}
 return['Podría ser: '+hit.slice(0,6).map(fx).join(' · ')+(hit.length>6?'…':'')+'. Pinta los 5 stickers para afinar.',1]}
$('wh').onclick=()=>{$('err').textContent=who()[0]};
// ¿Qué OLL/PLL es? (capa superior; admite giro previo de U)
const mkk=(s,b)=>s.p+'|'+s.n+'|'+(b?(s.c=='Y'?'Y':'x'):s.c);
function ll(){const P=[];cubies.forEach(c=>{if(c.pos[1]!=-1)return;for(const f in c.st){const d=c.st[f].dataset.c;if(d&&d!='N'){const n=[0,0,0];n[F[f][1]]=F[f][2];P.push({p:c.pos,n:rnd(mvp(c.M,n)),c:d})}}});
 if(P.length<8)return['Pinta más stickers de la capa superior (la cara de arriba y los laterales de esa capa).',0];
 const top=P.filter(s=>s.n[1]==-1),pll=top.length==9&&top.every(s=>s.c=='Y'),cat=pll?'PLL':'OLL',hit=[];
 all().filter(x=>x.s==cat).forEach(x=>{let S=snap(x.a,'solved').filter(s=>s.p[1]==-1);
  for(let k=0;k<4;k++){const ks=new Set(S.map(s=>mkk(s,!pll)));if(P.every(s=>ks.has(mkk(s,!pll)))){hit.push([x,k]);break}
   S=S.map(s=>({p:rnd(mvp(UR,s.p)),n:rnd(mvp(UR,s.n)),c:s.c}))}});
 if(!hit.length)return['No encontré ningún '+cat+' con esos stickers. Revisa los colores.',0];
 if(hit.length==1){const [x,k]=hit[0];pick(x);if(k){$('alg').value=UK[k]+' '+x.a;load();render()}return['Es '+x.n+(k?` · cargado con «${UK[k]}» al inicio`:''),1]}
 return['Podría ser: '+hit.slice(0,6).map(([x,k])=>x.n+(k?` (${UK[k]} primero)`:'')).join(' · ')+'. Pinta más stickers para afinar.',1]}
$('wl').onclick=()=>{$('err').textContent=ll()[0]};
// --- resolvedor, paso 1: cubo desplegado + validación ---
let lastScr=null;
const FO={U:[0,3],L:[3,0],F:[3,3],R:[3,6],B:[3,9],D:[6,3]};
const FP={U:(r,c)=>[c-1,-1,r-1],D:(r,c)=>[c-1,1,1-r],F:(r,c)=>[c-1,r-1,1],B:(r,c)=>[1-c,r-1,-1],R:(r,c)=>[1,r-1,1-c],L:(r,c)=>[-1,r-1,c-1]};
const NS=[];for(const f in FO)for(let r=0;r<3;r++)for(let c=0;c<3;c++){const n=[0,0,0];n[F[f][1]]=F[f][2];const ct=r==1&&c==1;NS.push({f,pos:FP[f](r,c),n,gr:FO[f][0]+r+1,gc:FO[f][1]+c+1,ct,k:ct?SOL[f]:'N'})}
NS.forEach((c,i)=>{const d=document.createElement('div');d.className='ns'+(c.ct?' ct':'');d.style.gridRow=c.gr;d.style.gridColumn=c.gc;d.dataset.i=i;c.el=d;$('net').appendChild(d)});
const paintNet=()=>NS.forEach(c=>c.el.style.background=C[c.k]);
const setNet=m=>{lastScr=null;NS.forEach(c=>{if(!c.ct)c.k=m(c)});paintNet();$('vmsg').textContent=''};
let snc='Y';
Object.keys(C).filter(k=>k!='N').forEach(k=>{const b=document.createElement('button');b.style.background=C[k];b.title=CN[k];b.setAttribute('aria-label','Pincel '+CN[k]);if(k==snc)b.className='on';b.onclick=()=>{snc=k;[...$('snpal').children].forEach(x=>x.className='');b.className='on'};$('snpal').appendChild(b)});
$('net').onclick=e=>{const d=e.target.closest('.ns');if(!d)return;const c=NS[d.dataset.i];if(c.ct)return;c.k=snc;lastScr=null;paintNet();$('vmsg').textContent=''};
function simFwd(alg){const cs=[];for(let x=-1;x<2;x++)for(let y=-1;y<2;y++)for(let z=-1;z<2;z++)cs.push({h:[x,y,z],pos:[x,y,z],M:[[1,0,0],[0,1,0],[0,0,1]]});
 alg.forEach(w=>{const q=w.slice(1),[ax,ls,d]=MV[w[0]],R=rnd(rot(ax,d*(q.includes('2')?180:90)*(q=="'"?-1:1)));cs.filter(c=>ls.includes(c.pos[ax])).forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos))})});return cs}
$('nres').onclick=()=>setNet(c=>SOL[c.f]);$('nvac').onclick=()=>setNet(()=>'N');
$('nmez').onclick=()=>{const L=[];let last='';while(L.length<22){const m='RLUDFB'[Math.random()*6|0];if(m==last)continue;last=m;L.push(m+["","'","2"][Math.random()*3|0])}
 const M=new Map();simFwd(L).forEach(c=>{for(const f in F)if(c.h[F[f][1]]==F[f][2]){const n=[0,0,0];n[F[f][1]]=F[f][2];M.set(c.pos+'|'+rnd(mvp(c.M,n)),SOL[f])}});
 setNet(c=>M.get(c.pos+'|'+c.n));lastScr=L;$('vmsg').textContent='Mezcla aplicada: '+L.join(' ')+'. Usa «Ver en el cubo 3D» o «Reproducir la mezcla».'};
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
// --- guía de movimientos ---
const G=[
['Las 6 caras','Cada letra es una cara. Sin símbolo gira 90° en el sentido de las agujas del reloj mirando esa cara de frente. Sostén el cubo con amarillo arriba y verde al frente, como en la app.',[['R','Derecha (Right)'],['L','Izquierda (Left)'],['U','Arriba (Up)'],['D','Abajo (Down)'],['F','Frente (Front)'],['B','Atrás (Back)']]],
['Modificadores','Van justo después de la letra.',[["R'",'Prima: 90° en sentido contrario (antihorario)'],['R2','Media vuelta (180°); el sentido da igual'],["R2'",'Igual que R2; algunos algoritmos lo escriben así']]],
['Dos capas a la vez (movimientos anchos)','Letra minúscula, o la mayúscula con w: la cara y la capa del medio pegada a ella giran juntas, en el sentido de esa cara. La app entiende ambas formas.',[['r','Derecha + capa del medio (también Rw)'],['l','Izquierda + capa del medio (Lw)'],['u','Arriba + capa del medio (Uw)'],['d','Abajo + capa del medio (Dw)'],['f','Frente + capa del medio (Fw)'],['b','Atrás + capa del medio (Bw)'],["r'","Ancho en sentido contrario (Rw')"]]],
['Capas del medio','Gira solo la capa central, la que no tiene cara propia. Cada una sigue el sentido de una cara.',[['M','Entre L y R. Gira como L: la columna central del frente baja'],['E','Entre U y D. Gira como D: la fila central del frente va a la derecha'],['S','Entre F y B. Gira como F: horario mirando de frente'],["M'",'M al revés: la columna central del frente sube'],['M2','Media vuelta de M; aparece en los PLL H, Ua, Ub y Z']]],
['Rotaciones de todo el cubo','No cambian el estado, solo cómo sostienes el cubo. x gira como R, y como U y z como F.',[['x','Como R: el frente pasa a arriba'],['y','Como U: el frente pasa a la izquierda'],['z','Como F: arriba pasa a la derecha'],["y'",'y al revés: el frente pasa a la derecha'],['y2','Media vuelta del cubo sobre el eje vertical']]],
['Escritura','Los movimientos se separan con espacios.',[["(R U R' U')3",'Los paréntesis agrupan y el número de después repite el grupo (la app lo expande)']]]];
$('gbody').innerHTML=G.map(([t,d,r])=>`<h3>${t}</h3><div class="hint">${d}</div><div class="gd">${r.map(([m,x])=>`<button class="b" data-g="${esc(m)}">${esc(m)}</button><span>${esc(x)}</span>`).join('')}</div>`).join('');
$('guide').onclick=async e=>{const b=e.target.closest('[data-g]');if(!b)return;const prev=$('cs').checked;$('cs').checked=false;cur=null;preset('solved');$('alg').value=b.dataset.g;load();await reset();$('cs').checked=prev;render();scrollTo({top:0,behavior:'smooth'});setTimeout(play,350)};
view();preset('top');load();render();
