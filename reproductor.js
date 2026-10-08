// Reproduce los movimientos en el cubo 3D: animar, avanzar, retroceder, reiniciar, invertir y espejo.
function parse(){const e=expand($('alg').value);
 $('err').textContent=e.bad?`No entiendo "${e.bad}"`:'';
 return e.bad?[]:e.moves.map(w=>{const q=w.slice(1);return{k:w[0],a:q.includes('2')?180:90,s:q=="'"?-1:1,t:w}})}
function mark(){if(window.onMove)onMove(null);$('chips').innerHTML=mv.map((m,i)=>`<span class="${i<idx?'d':''}${i==idx?' c':''}">${m.t}</span>`).join('')}
function anim(m,sg){return new Promise(res=>{const [ax,ls,d]=MV[m.k],tot=d*m.a*m.s*sg;
 const cs=cubies.filter(c=>ls.includes(c.pos[ax])),t0=performance.now(),dur=+$('spd').value*(m.a>90?1.5:1);
 (function f(t){const p=Math.min(1,(t-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
  cs.forEach(c=>draw(c,rot(ax,tot*e)));
  if(p<1)requestAnimationFrame(f);else{const R=rnd(rot(ax,tot));
   cs.forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos));draw(c)});res()}})(t0)})}
async function go(sg){if(busy||(sg>0&&idx>=mv.length)||(sg<0&&idx<=0))return false;
 busy=true;const gi=sg>0?idx:idx-1;if(window.onMove)onMove(mv[gi],gi);await anim(mv[gi],sg);idx+=sg;busy=false;mark();return true}
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
