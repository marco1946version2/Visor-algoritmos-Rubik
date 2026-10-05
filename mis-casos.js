// Guardar/borrar casos propios, variantes, categorías, mover, importar y exportar.
$('sv').onclick=()=>{const n=$('nm').value.trim(),a=$('alg').value.trim();if(!n||!a||!mv.length)return $('err').textContent='Necesito nombre y un algoritmo válido';
 const g0=$('cg').value,g=g0=='Míos'?undefined:g0;ST.mine=ST.mine.filter(m=>!(m.n==n&&m.g==g));ST.mine.push({n,a,p:lastPre,g});save();tab=g||'Míos';cur={s:g||'Míos',n,a,own:1,p:lastPre};render()};
$('del').onclick=()=>{if(!cur)return;if(!dq){dq=1;return render()}
 if(cur.own){ST.mine=ST.mine.filter(m=>!(m.n==cur.n&&(m.g||'Míos')==cur.s));delete ST.alts[K(cur)]}else if(!ST.gone.includes(K(cur)))ST.gone.push(K(cur));
 dq=0;vi=0;cur=null;save();render()};
$('cs').onchange=reset;
const viewOf=x=>x.p||(x.s=='PLL'||x.s=='OLL'?'top':x.s=='F2L'?'f2l':'solved');
function vars(x){return [x.a,...(ST.alts[K(x)]||[])]}
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
