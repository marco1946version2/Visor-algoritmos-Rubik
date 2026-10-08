// Dibujos pequeños de cada caso (SVG) y simulación de su estado.
const TH={};
function colOf(h,f,p){const hs=JSON.stringify(h),ok=p=='solved'||(p=='top'&&h[1]==-1)||(p=='f2l'&&h[1]>=0)||(p=='par'&&(hs=='[1,1,1]'||hs=='[1,0,1]'))||(p=='oll'&&h[1]==-1&&f=='U');return ok?SOL[f]:'N'}
function snap(a,p){const k=a+'|'+p;if(TH[k])return TH[k];
 const cs=[];for(let x=-1;x<2;x++)for(let y=-1;y<2;y++)for(let z=-1;z<2;z++)cs.push({h:[x,y,z],pos:[x,y,z],M:I()});
 (gnorm(a)||'').split(' ').filter(Boolean).reverse().forEach(w=>{const q=w.slice(1),[ax,ls,d]=MV[w[0]],R=rnd(rot(ax,-d*(q.includes('2')?180:90)*(q=="'"?-1:1)));
  cs.filter(c=>ls.includes(c.pos[ax])).forEach(c=>{c.M=rnd(mul(R,c.M));c.pos=rnd(mvp(R,c.pos))})});
 const o=[];cs.forEach(c=>{for(const f in F){const ax=F[f][1],sg=F[f][2];if(c.h[ax]==sg){const n=[0,0,0];n[ax]=sg;o.push({p:c.pos,n:rnd(mvp(c.M,n)),c:colOf(c.h,f,p),h:c.h})}}});return TH[k]=o}
function thumb(a,p,bin){const S=snap(a,p),g=[];
 if(p=='top'||p=='oll'){if(p=='oll')bin=true;const col=c=>bin&&c!='Y'?C.N:C[c],op=c=>bin&&c!='Y'?' opacity=".35"':'';
  S.forEach(s=>{if(s.p[1]!=-1)return;const x=s.p[0],z=s.p[2],nx=s.n[0],ny=s.n[1],nz=s.n[2];let r;
   if(ny==-1)r=[9+(x+1)*12,9+(z+1)*12,11,11];else if(nz==1)r=[9+(x+1)*12,47,11,4];else if(nz==-1)r=[9+(x+1)*12,3,11,4];
   else if(nx==1)r=[47,9+(z+1)*12,4,11];else if(nx==-1)r=[3,9+(z+1)*12,4,11];else return;
   g.push(`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="2" fill="${col(s.c)}"${op(s.c)}/>`)});
  return `<svg viewBox="0 0 54 54">${g.join('')}</svg>`}
 const u=9,e=.46,P=(x,y,z)=>`${((x-z)*.866*u).toFixed(1)},${((x+z)*.5*u+y*u).toFixed(1)}`;
 S.forEach(s=>{const x=s.p[0],y=s.p[1],z=s.p[2],nx=s.n[0],ny=s.n[1],nz=s.n[2];let q;
  if(ny==-1)q=[[x-e,-1.5,z-e],[x+e,-1.5,z-e],[x+e,-1.5,z+e],[x-e,-1.5,z+e]];
  else if(nz==1)q=[[x-e,y-e,1.5],[x+e,y-e,1.5],[x+e,y+e,1.5],[x-e,y+e,1.5]];
  else if(nx==1)q=[[1.5,y-e,z-e],[1.5,y-e,z+e],[1.5,y+e,z+e],[1.5,y+e,z-e]];else return;
  g.push(`<polygon points="${q.map(v=>P(v[0],v[1],v[2])).join(' ')}" fill="${C[s.c]}"/>`)});
 return `<svg viewBox="-26 -28 52 56">${g.join('')}</svg>`}
