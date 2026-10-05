// Constantes, colores, caras, matemática de rotaciones y tabla de movimientos (R, U, M, x, ...).
const S=60,H=30,$=id=>document.getElementById(id);
const coarse=matchMedia('(pointer:coarse)').matches;
const C={W:'#f4f4f0',Y:'#ffd500',G:'#00a651',B:'#1f5fd1',R:'#d42a2a',O:'#ff7a00',N:'#8b8f98'};
const F={U:['rotateX(90deg)',1,-1],D:['rotateX(-90deg)',1,1],F:['',2,1],B:['rotateY(180deg)',2,-1],R:['rotateY(90deg)',0,1],L:['rotateY(-90deg)',0,-1]};
const SOL={U:'Y',D:'W',F:'G',B:'B',R:'O',L:'R'};
const I=()=>[[1,0,0],[0,1,0],[0,0,1]];
const mul=(a,b)=>a.map(r=>[0,1,2].map(j=>r[0]*b[0][j]+r[1]*b[1][j]+r[2]*b[2][j]));
const mvp=(a,v)=>a.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
const rnd=m=>m.map(r=>Array.isArray(r)?r.map(Math.round):Math.round(r));
function rot(ax,deg){const t=deg*Math.PI/180,c=Math.cos(t),s=Math.sin(t);
 return ax==0?[[1,0,0],[0,c,-s],[0,s,c]]:ax==1?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]]}
// movimientos: [eje, capas, sentido horario]
const MV={R:[0,[1],1],L:[0,[-1],-1],U:[1,[-1],-1],D:[1,[1],1],F:[2,[1],1],B:[2,[-1],-1],M:[0,[0],-1],E:[1,[0],1],S:[2,[0],1],
r:[0,[0,1],1],l:[0,[-1,0],-1],u:[1,[-1,0],-1],d:[1,[0,1],1],f:[2,[0,1],1],b:[2,[-1,0],-1],x:[0,[-1,0,1],1],y:[1,[-1,0,1],-1],z:[2,[-1,0,1],1]};
