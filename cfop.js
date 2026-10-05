// Motor del método CFOP: cruz calculada; F2L, OLL y PLL usando el catálogo. No toca la pantalla.
// --- resolvedor CFOP (cruz calculada; F2L, OLL y PLL con el catálogo) ---
/*SV_CORE_START*/
const SV={};
(function(){
const FACES=['U','D','F','B','R','L'];
SV.nrm=f=>{const n=[0,0,0];n[F[f][1]]=F[f][2];return n};
SV.slots=[];SV.sidx={};SV.fof=[];SV.slotsAt={};
for(let x=-1;x<2;x++)for(let y=-1;y<2;y++)for(let z=-1;z<2;z++)for(const f of FACES){const n=SV.nrm(f);if([x,y,z][F[f][1]]==F[f][2]){const i=SV.slots.length;SV.slots.push({p:[x,y,z],n,f});SV.sidx[[x,y,z]+'|'+n]=i;SV.fof.push(f);(SV.slotsAt[[x,y,z]]=SV.slotsAt[[x,y,z]]||[]).push(i)}}
SV.solved=()=>SV.slots.map(s=>SOL[s.f]);
const permC={};
SV.perm=tok=>{if(permC[tok])return permC[tok];const q=tok.slice(1),[ax,ls,d]=MV[tok[0]],R=rnd(rot(ax,d*(q.includes('2')?180:90)*(q=="'"?-1:1)));
 const pm=SV.slots.map((s,i)=>{if(!ls.includes(s.p[ax]))return i;return SV.sidx[rnd(mvp(R,s.p))+'|'+rnd(mvp(R,s.n))]});return permC[tok]=pm};
SV.apply=(st,toks)=>{let a=st;for(const t of toks){const pm=SV.perm(t),b=new Array(54);for(let i=0;i<54;i++)b[pm[i]]=a[i];a=b}return a};
SV.toks=s=>Array.isArray(s)?s:(expand(s).moves);
SV.inv=toks=>[...toks].reverse().map(w=>w.endsWith("2'")?w.slice(0,-1):w.endsWith('2')?w:w.endsWith("'")?w.slice(0,-1):w+"'");
SV.cubieOK=(st,pos)=>SV.slotsAt[pos].every(i=>st[i]==SOL[SV.fof[i]]);
})();
/*SV_CORE_END*/

/*SV_SOLVER_START*/
(function(){
const lib=cat=>LIB[cat].map(t=>{const [n,a]=t.split('|');return{n,a,t:SV.toks(a)}});
// letras: giro y del hueco j (0=FR,1=FL,2=BL,3=BR): R→F→L→B→R
const RHO={R:'F',F:'L',L:'B',B:'R',U:'U',D:'D'};
SV.mapSlot=(toks,j)=>toks.map(w=>{let c=w[0];for(let i=0;i<j;i++)c=RHO[c]||c;return c+w.slice(1)});
SV.simp=toks=>{const o=[];for(const w of toks){const f=w[0],q=w.slice(1),a=q.includes('2')?2:q=="'"?3:1;
 if(o.length&&o[o.length-1][0]==f){const t=(o[o.length-1][1]+a)%4;if(t==0)o.pop();else o[o.length-1][1]=t}else o.push([f,a])}
 return o.map(([f,a])=>f+(a==1?'':a==2?'2':"'"))};
const pw=(m,k)=>Array(k).fill(m);
const UP=['','U','U2',"U'"]; // k vueltas de U
const SLOTS=[{c:[1,1,1],e:[1,0,1],cols:['G','O'],nm:'frente-derecha'},{c:[-1,1,1],e:[-1,0,1],cols:['G','R'],nm:'frente-izquierda'},{c:[-1,1,-1],e:[-1,0,-1],cols:['B','R'],nm:'atrás-izquierda'},{c:[1,1,-1],e:[1,0,-1],cols:['B','O'],nm:'atrás-derecha'}];
const DEDG=[[0,1,1],[0,1,-1],[-1,1,0],[1,1,0]];
const colsAt=(st,pos)=>SV.slotsAt[pos].map(i=>st[i]);
SV.find=(st,cols)=>{const k=[...cols].sort().join('');for(const pos in SV.slotsAt){const s=SV.slotsAt[pos];if(s.length==cols.length&&s.map(i=>st[i]).sort().join('')==k)return pos}return null};
const isSolved=st=>st.every((c,i)=>c==SOL[SV.fof[i]]);
SV.isSolved=isSolved;
const pairOK=(st,j)=>SV.cubieOK(st,SLOTS[j].c)&&SV.cubieOK(st,SLOTS[j].e);
const crossOK=st=>DEDG.every(p=>SV.cubieOK(st,p));
// ---------- CRUZ: tabla de distancias (BFS desde la cruz resuelta, movimientos de cara) ----------
const FM=[];for(const f of 'UDFBRL')for(const s of ['',"'",'2'])FM.push(f+s);
let DB=null,E24=null,EM=null;
function buildDB(){
 E24={};let n=0;const ed=[];SV.slots.forEach((s,i)=>{if(s.p.filter(v=>v!=0).length==2){E24[i]=n++;ed.push(i)}});
 EM=FM.map(m=>{const pm=SV.perm(m);return ed.map(i=>E24[pm[i]])});
 const key=a=>((a[0]*24+a[1])*24+a[2])*24+a[3];
 const home=['G','O','B','R'].map(c=>E24[SV.sidx[SOL_POS[c]]]);
 DB=new Int8Array(24*24*24*24).fill(-1);
 let cur=[home];DB[key(home)]=0;let d=0;
 while(cur.length){const nx=[];for(const s of cur)for(let m=0;m<18;m++){const t=[EM[m][s[0]],EM[m][s[1]],EM[m][s[2]],EM[m][s[3]]],k=key(t);if(DB[k]<0){DB[k]=d+1;nx.push(t)}}cur=nx;d++}
 DB.key=key;DB.home=home}
const SOL_POS={G:[0,1,1]+'|'+[0,1,0],O:[1,1,0]+'|'+[0,1,0],B:[0,1,-1]+'|'+[0,1,0],R:[-1,1,0]+'|'+[0,1,0]};
SV.cross=st=>{if(!DB)buildDB();
 const cur=['G','O','B','R'].map(c=>{const pos=SV.find(st,['W',c]);const i=SV.slotsAt[pos].find(i=>st[i]=='W');return E24[i]});
 const mv=[];let s=cur,k=DB.key(s);
 while(DB[k]>0){let done=false;for(let m=0;m<18;m++){const t=[EM[m][s[0]],EM[m][s[1]],EM[m][s[2]],EM[m][s[3]]],kk=DB.key(t);if(DB[kk]==DB[k]-1){mv.push(FM[m]);s=t;k=kk;done=true;break}}if(!done)break}
 return mv};
// ---------- F2L ----------
const F2L=lib('F2L'),OLL=lib('OLL'),PLL=lib('PLL');
const posIn=(pos,list)=>list.some(p=>p+''==pos);
const isU=pos=>pos.split(',')[1]=='-1', isD=pos=>pos.split(',')[1]=='1';
const nm=c=>({G:'verde',O:'naranja',B:'azul',R:'rojo'}[c]);
// describe la situación del par j y devuelve {corner:'solved|twist|dother|U', edge:'solved|flip|mother|U', cj, ej}
function situ(st,j){const S=SLOTS[j],cp=SV.find(st,['W',...S.cols]),ep=SV.find(st,S.cols);
 let corner,cj=-1,edge,ej=-1;
 if(cp==S.c+''){corner=SV.cubieOK(st,S.c)?'solved':'twist'}else if(isU(cp))corner='U';else{corner='dother';cj=SLOTS.findIndex(s=>s.c+''==cp)}
 if(ep==S.e+''){edge=SV.cubieOK(st,S.e)?'solved':'flip'}else if(isU(ep))edge='U';else{edge='mother';ej=SLOTS.findIndex(s=>s.e+''==ep)}
 return{corner,edge,cj,ej}}
const TXC={solved:'esquina en su sitio',twist:'esquina en su hueco pero girada',dother:'esquina metida en el hueco de otro par',U:'esquina arriba'};
const TXE={solved:'arista en su sitio',flip:'arista en su hueco pero volteada',mother:'arista metida en el hueco de otro par',U:'arista arriba'};
// plan para un par: devuelve {segs:[{k,txt,m:[...]}], st:estadoFinal} o null
SV.planPair=(st0,j)=>{let st=st0;const segs=[];
 for(let it=0;it<4;it++){
  if(pairOK(st,j))return{segs,st};
  const s=situ(st,j);
  const lift=jj=>{const m=SV.mapSlot(['R','U',"R'"],jj);return m};
  if(s.corner=='dother'||s.edge=='mother'){const jj=s.corner=='dother'?s.cj:s.ej;
   const m=lift(jj);segs.push({k:'extra',sit:`${TXC[s.corner]}, ${TXE[s.edge]}`,txt:`Sacar lo que estaba mal metido en el hueco ${SLOTS[jj].nm} con un sexy move incompleto`,m});st=SV.apply(st,m);continue}
  // caso F2L: probar AUF previo (0..3) + algoritmo del catálogo
  let best=null;
  for(const c of F2L){const am=SV.mapSlot(c.t,j);for(let k=0;k<4;k++){const mv=SV.simp([...pw('U',0),...SV.mapSlot(UP[k]?[UP[k]]:[],j),...am]);
   const r=SV.apply(st,mv);if(!pairOK(r,j))continue;if(!crossOK(r))continue;
   let ok=true;for(let q=0;q<4;q++)if(q!=j&&pairOK(st,q)&&!pairOK(r,q)){ok=false;break}if(!ok)continue;
   if(!best||mv.length<best.mv.length)best={c,k,mv,am}}}
  if(!best){// último recurso: sacar con sexy incompleto del propio hueco
   const m=lift(j);segs.push({k:'extra',sit:`${TXC[s.corner]}, ${TXE[s.edge]}`,txt:'No encajó en ningún caso: saco el par con un sexy move incompleto y vuelvo a mirar',m});st=SV.apply(st,m);continue}
  segs.push({k:'f2l',sit:`${TXC[s.corner]}, ${TXE[s.edge]}`,case:best.c.n,alg:best.c.a,auf:UP[best.k],m:best.mv});st=SV.apply(st,best.mv);}
 return null};
// ---------- OLL / PLL ----------
const topY=st=>SV.slots.every((s,i)=>s.n[1]!=-1||st[i]=='Y');
const f2lAll=st=>crossOK(st)&&[0,1,2,3].every(j=>pairOK(st,j));
SV.oll=st=>{if(topY(st))return{skip:true,m:[],st};let best=null;
 for(const c of OLL)for(let k=0;k<4;k++){const mv=SV.simp([...(UP[k]?[UP[k]]:[]),...c.t]),r=SV.apply(st,mv);if(!topY(r)||!f2lAll(r))continue;if(!best||mv.length<best.m.length)best={c:c.n,alg:c.a,auf:UP[k],m:mv,st:r}}
 return best};
SV.pll=st=>{const posts=[[],['U'],['U2'],["U'"]];
 for(const po of posts){const f=SV.apply(st,po);if(isSolved(f))return{skip:true,m:[],st:f,post:po[0]||''}}
 let best=null;
 const ps=[st,...[1,2,3].map(k=>SV.apply(st,pw('U',k)))];
 for(const c of PLL)for(let k=0;k<4;k++){const pre=[null,'U','U2',"U'"][k];const mv=SV.simp([...(pre?[pre]:[]),...c.t]),r=SV.apply(st,mv);
  for(const po of posts){const f=SV.apply(r,po);if(isSolved(f)){const tot=mv.length+po.length;if(!best||tot<best.tot)best={c:c.n,alg:c.a,auf:pre||'',m:mv,post:po[0]||'',st:f,tot}}}}
 return best};
// ---------- resolver todo ----------
SV.solve=colors=>{ // colors: array de 54 letras en el orden SV.slots
 let st=colors.slice();const steps=[];
 const push=(t,segs)=>steps.push({t,segs});
 if(isSolved(st))return{steps,all:[]};
 // cruz
 if(!crossOK(st)){const m=SV.cross(st);if(m.length){push('Cruz blanca',[{k:'cross',txt:'Cruz blanca en la cara de abajo (búsqueda óptima)',m}]);st=SV.apply(st,m)}}
 if(!crossOK(st))return{error:'No logré armar la cruz.'};
 // F2L
 const done=new Set();[0,1,2,3].forEach(j=>{if(pairOK(st,j))done.add(j)});
 const nms=j=>`${nm(SLOTS[j].cols[0])}-${nm(SLOTS[j].cols[1])}`;
 let fi=0;while(done.size<4){let best=null;
  for(let j=0;j<4;j++){if(done.has(j))continue;const p=SV.planPair(st,j);if(!p)continue;const len=p.segs.reduce((a,s)=>a+s.m.length,0);
   const pen=p.segs.some(s=>s.k=='extra')?3:0;if(!best||len+pen<best.len+best.pen)best={j,p,len,pen}}
  if(!best)return{error:'No pude resolver un par F2L.'};
  push(`F2L · par ${++fi} · ${nms(best.j)}`,best.p.segs.map(s=>({...s,pair:nms(best.j),slot:SLOTS[best.j].nm})));
  st=best.p.st;done.add(best.j);[0,1,2,3].forEach(q=>{if(pairOK(st,q))done.add(q)})}
 if(!crossOK(st)||![0,1,2,3].every(j=>pairOK(st,j)))return{error:'Falló el F2L.'};
 // OLL
 const o=SV.oll(st);if(!o)return{error:'No encontré OLL.'};
 if(o.skip)push('OLL',[{k:'skip',txt:'La cara de arriba ya está toda amarilla: se salta el OLL.',m:[]}]);else{push('OLL',[{k:'oll',case:o.c,alg:o.alg,auf:o.auf,m:o.m}]);st=o.st}
 // PLL
 const p=SV.pll(st);if(!p)return{error:'No encontré PLL.'};
 if(p.skip){const sg=[{k:'skip',txt:p.post?'Solo falta girar la capa de arriba (no hace falta PLL).':'Ya está resuelto: no hace falta PLL.',m:[]}];if(p.post)sg.push({k:'auf',txt:'Ajuste final de la capa de arriba',m:[p.post]});push('PLL',sg);st=p.st}else{
  const segs=[{k:'pll',case:p.c,alg:p.alg,auf:p.auf,m:p.m}];if(p.post)segs.push({k:'auf',txt:'Ajuste final de la capa de arriba',m:[p.post]});push('PLL',segs);st=p.st}
 if(!isSolved(st))return{error:'El cubo no quedó resuelto.'};
 return{steps,all:steps.flatMap(s=>s.segs.flatMap(g=>g.m))}};
})();
/*SV_SOLVER_END*/


