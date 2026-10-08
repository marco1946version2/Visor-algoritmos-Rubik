// Marca en azul el movimiento que se está haciendo: la tecla del teclado en pantalla (con su ' o 2) y el movimiento en la lista de la solución.
window.onMove=function(m,i){
 document.querySelectorAll('#kp button.kon').forEach(b=>b.classList.remove('kon'));
 document.querySelectorAll('.mvs .mv.now').forEach(b=>b.classList.remove('now'));
 const sol=typeof SOLV!=='undefined'&&SOLV&&$('alg').value===SOLV.all.join(' ');
 if(m){const ks=[m.k];if(m.s<0)ks.push("'");if(m.a>90)ks.push('2');
  document.querySelectorAll('#kp button').forEach(b=>{if(ks.includes(b.dataset.k)||(m.s<0&&b.dataset.a==='p')||(m.a>90&&b.dataset.a==='d'))b.classList.add('kon')});
  if(sol){const e=document.querySelector(`.mvs .mv[data-i="${i}"]`);if(e)e.classList.add('now')}}
 if(sol)document.querySelectorAll('.mvs .mv').forEach(e=>e.classList.toggle('dn',+e.dataset.i<idx))};
