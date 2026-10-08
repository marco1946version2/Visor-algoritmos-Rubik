// Pantalla del resolvedor: botón Resolver, lista de pasos, reproducir y copiar.
// --- resolvedor: botón, pasos y reproducción ---
let SOLV=null;
const netColors=()=>SV.slots.map(s=>NS.find(c=>c.pos+''==s.p+''&&c.n+''==s.n+'').k);
function segHtml(g){const mv=g.m.length?`<div class="mvs">${g.m.map((x,i)=>`<span class="mv" data-i="${g.s+i}">${esc(x)}</span>`).join(' ')}</div>`:'';let t='',s='';
 if(g.k=='cross'){t='Cruz blanca (abajo)';s=`Calculada: busca la cruz más corta (${g.m.length} movimientos).`}
 else if(g.k=='extra'){t='⚠ Extra · sexy move incompleto';s=`Vi: ${esc(g.sit)}.<br>${esc(g.txt)}. Es el <code>R U R'</code> de siempre (sexy move sin su último U'), con las letras giradas a ese hueco.`}
 else if(g.k=='f2l'){t='Caso '+g.case;s=`Vi: ${esc(g.sit)}.<br>Algoritmo del catálogo: <code>${esc(g.alg)}</code>`+(g.auf?`<br>Ajuste previo de U: <code>${g.auf}</code>`:'')+(g.slot&&g.slot!='frente-derecha'?`<br>Hueco ${esc(g.slot)}: las letras van giradas respecto al catálogo (que está escrito para frente-derecha).`:'')}
 else if(g.k=='oll'||g.k=='pll'){t=(g.k=='oll'?'Caso ':'PLL ')+g.case;s=`Algoritmo del catálogo: <code>${esc(g.alg)}</code>`+(g.auf?`<br>Ajuste previo de U: <code>${g.auf}</code>`:'')}
 else if(g.k=='auf'){t='Ajuste final';s=esc(g.txt)}
 else{t='Sin trabajo';s=esc(g.txt)}
 return `<div class="sg ${g.k}"><div class="tag">${t}</div>${mv}<div class="sit">${s}</div></div>`}
function renderSol(r){let n=0;
 $('solres').innerHTML=r.steps.map((s,i)=>{s.start=n;s.segs.forEach(g=>{g.s=n;n+=g.m.length;g.e=n});s.end=n;const c=s.end-s.start;
  return `<div class="stp"><div class="sth"><b>${i+1} · ${esc(s.t)}</b><span class="row" style="gap:6px"><span class="move-count">${c} mov</span>${c?`<button class="b" data-sp="${i}" aria-label="Ver este paso en el cubo 3D" title="Ver este paso en el cubo 3D">▶</button>`:''}</span></div>${s.segs.map(segHtml).join('')}</div>`}).join('');
 const by=k=>r.steps.filter(s=>s.t.startsWith(k)).reduce((a,s)=>a+s.end-s.start,0);
 $('solsum').textContent=`${n} movimientos · cruz ${by('Cruz')} · F2L ${by('F2L')} · OLL ${by('OLL')} · PLL ${by('PLL')}`}
$('nsolve').onclick=()=>{const o=validar();$('solres').innerHTML='';$('solsum').textContent='';$('nshow').hidden=$('ncopy').hidden=true;SOLV=null;
 if(o.length){$('vmsg').innerHTML=o.map(x=>'⚠ '+esc(x)).join('<br>');return}
 const r=SV.solve(netColors());
 if(r.error){$('vmsg').textContent='⚠ '+r.error;return}
 if(!r.all.length){$('vmsg').textContent='✔ Ese cubo ya está resuelto.';return}
 SOLV=r;$('vmsg').textContent='✔ Cubo válido. Solución abajo; toca ▶ en un paso para verlo en el cubo 3D.';renderSol(r);$('nshow').hidden=$('ncopy').hidden=false;$('solsum').scrollIntoView({behavior:'smooth',block:'center'})};
async function showSol(){if(!SOLV)return false;await $('n3d').onclick();$('alg').value=SOLV.all.join(' ');cur=null;load();render();return true}
// --- cámara automática y resaltado de lo que se arma (cruz y F2L) ---
const RYJ=[-35,35,145,215],sleep=ms=>new Promise(r=>setTimeout(r,ms));
// Las piezas se reconocen por sus colores (no por su posición): así el resaltado sigue a la pieza mientras se mueve.
const cols=c=>Object.values(c.st).map(s=>s.dataset.c),key=c=>cols(c).sort().join(''),isCrossC=c=>{const k=cols(c);return k.length==2&&k.includes('W')};
const pairKeys=j=>{const q=SV.SLOTS[j].cols;return[['W',...q].sort().join(''),[...q].sort().join('')]};
function setHL(on,step){cubies.forEach(c=>c.el.classList.remove('dim','ctx','hl'));
 if(!on||!step||(step.t[0]!='C'&&step.t[0]!='F'))return;
 const cross=step.t[0]=='C',mine=cross?[]:pairKeys(step.j),done=cross?[]:SOLV.steps.filter(s=>s.j!=null&&s.start<step.start).flatMap(s=>pairKeys(s.j));
 cubies.forEach(c=>c.el.classList.add((cross?isCrossC(c):mine.includes(key(c)))?'hl':(isCrossC(c)||done.includes(key(c)))?'ctx':'dim'))}
async function focus(step,seg){const ph=step.t[0];
 setHL($('autohl').checked,step);
 $('cap').textContent=step.t+(seg.k=='extra'?' · extra: sexy move incompleto':seg.case?' · '+seg.case:'');
 if(!$('autocam').checked)return;
 let tx=-25,ty=-35;if(ph=='C')tx=40;else if(ph=='F'){ty=RYJ[seg.j!=null?seg.j:step.j];tx=-20}else tx=-50;
 const d=((ty-ry+540)%360)-180;scene.style.transition='transform .7s ease';ry+=d;rx=tx;view();await sleep(760);scene.style.transition=''}
let runId=0;
async function playRange(a,b){const my=++runId;if(!await showSol())return;if(my!=runId)return;const FMAP=[];SOLV.steps.forEach(s=>s.segs.forEach(g=>{for(let i=g.s;i<g.e;i++)FMAP[i]={step:s,seg:g}}));
 await seek(a);if(my!=runId)return;playing=true;$('pb').textContent='⏸';let last=null;
 while(playing&&my==runId&&idx<b){const f=FMAP[idx];if(f&&f.seg!==last){last=f.seg;await focus(f.step,f.seg);if(!playing||my!=runId)break}if(!await go(1))break}
 if(my!=runId)return;playing=false;$('pb').textContent='▶';setHL(false);$('cap').textContent=''}
$('nshow').onclick=()=>playRange(0,SOLV?SOLV.all.length:0);
$('solres').onclick=e=>{const b=e.target.closest('[data-sp]');if(!b||!SOLV)return;const s=SOLV.steps[+b.dataset.sp];playRange(s.start,s.end)};
$('ncopy').onclick=async()=>{if(!SOLV)return;const t=SOLV.steps.map((s,i)=>`${i+1}. ${s.t}\n`+s.segs.filter(g=>g.m.length).map(g=>'   '+(g.case?g.case+': ':g.k=='extra'?'Extra: ':'')+g.m.join(' ')).join('\n')).join('\n')+`\n\nTotal: ${SOLV.all.length} movimientos\n${SOLV.all.join(' ')}`;
 try{await navigator.clipboard.writeText(t);$('vmsg').textContent='Solución copiada ✓'}catch(e){$('io').value=t;$('vmsg').textContent='No pude copiar directo: la dejé en «Exportar / importar mis datos».'}};
