// Atajos de teclado, tema claro/oscuro, exportar/importar archivo e imprimir hoja.
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
