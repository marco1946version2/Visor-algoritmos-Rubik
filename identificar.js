// «¿Qué caso es?»: reconoce F2L, OLL y PLL a partir de stickers pintados.
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
