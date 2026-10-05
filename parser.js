// Lee un algoritmo escrito como texto y lo convierte en lista de movimientos (paréntesis, repeticiones).
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
