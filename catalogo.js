// Lista de casos, pestañas, búsqueda, filtros, elegir caso, favoritos y aprendidos.
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
 const CC=cats(),sel=$('cg'),pv=sel.value,opts=[...CC,'Míos'];
 $('cd').style.display=CC.includes(tab)?'':'none';$('cd').textContent=cdq?'¿Seguro? Toca otra vez':'🗑 Borrar categoría';{const n=ST.hide.length+ST.gone.length;$('cr').style.display=n?'':'none';$('cr').textContent=`↺ Restaurar (${n})`}
 sel.innerHTML=opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
 sel.value=tab!=lastTab&&opts.includes(tab)?tab:opts.includes(pv)?pv:'Míos';lastTab=tab;
 const V=cur?vars(cur):[];if(vi>=V.length)vi=0;
 $('vrow').innerHTML=cur?'<span class="hint">Variantes</span>'+V.map((_,i)=>`<button class="b${i==vi?' on':''}" data-v="${i}">${i+1}</button>`).join('')+'<button class="b" data-a="add" title="Guarda el algoritmo actual como otra variante de este caso">＋ variante</button>'+(vi>0?'<button class="b" data-a="rm">🗑 variante</button>':''):'';
 $('bigth').innerHTML=thumb($('alg').value,lastPre,!!cur&&/oll/i.test(cur.s))}
function pick(x){cur=x;vi=0;dq=0;$('alg').value=x.a;$('nm').value=x.n;preset(vistaFija||viewOf(x));load();render()}
$('lst').onclick=e=>{const b=e.target.closest('[data-i]');if(b)pick(lst[b.dataset.i])};
$('tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(b){tab=b.dataset.t;cdq=0;render()}};
$('q').oninput=render;
$('rnd').onclick=()=>{const c=lst.filter(x=>!has('done',x));const l=c.length?c:lst;if(l.length)pick(l[Math.floor(Math.random()*l.length)])};
const tog=a=>{if(!cur)return;const k=K(cur),i=ST[a].indexOf(k);i<0?ST[a].push(k):ST[a].splice(i,1);save();render()};
$('fv').onclick=()=>tog('fav');$('dn').onclick=()=>tog('done');
