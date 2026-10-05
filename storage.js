// Estado guardado (favoritos, aprendidos, tus casos) en el navegador.
let ST={mine:[],fav:[],done:[],cats:[],hide:[],gone:[],alts:{}},tab='PLL',cur=null,lst=[],cdq=0,lastTab=null,vi=0,dq=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cats=()=>[...['PLL','OLL','F2L','Básicos'].filter(k=>LIB[k]&&!ST.hide.includes(k)),...new Set([...ST.cats,...ST.mine.map(m=>m.g)].filter(g=>g&&!LIB[g]&&g!='Míos'&&g!='★'))];
try{Object.assign(ST,JSON.parse(localStorage.getItem('rubik-v1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('rubik-v1',JSON.stringify(ST))}catch(e){}};
const K=x=>x.s+':'+x.n,has=(a,x)=>ST[a].includes(K(x));
