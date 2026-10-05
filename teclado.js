// Teclado en pantalla para escribir algoritmos (sobre todo en el celular).
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
