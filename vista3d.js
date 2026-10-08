// Arrastrar para girar la vista del cubo y tocar para pintar stickers.
// vista: arrastrar para girar, tocar para pintar
let rx=-25,ry=-35,dn=null,tilt=false;const view=()=>scene.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
$('stage').addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY,t:e.target,m:0,ox:e.clientX,oy:e.clientY}});
addEventListener('pointermove',e=>{if(!dn)return;
 if(Math.abs(e.clientX-dn.ox)+Math.abs(e.clientY-dn.oy)>6)dn.m=1;
 if(dn.m){ry+=(e.clientX-dn.x)*.5;if(!coarse||tilt)rx=Math.max(-90,Math.min(90,rx-(e.clientY-dn.y)*.5));view()}
 dn.x=e.clientX;dn.y=e.clientY});
addEventListener('pointerup',()=>{if(dn&&!dn.m&&dn.t.classList&&dn.t.classList.contains('s')){
 if($('pzmode')&&$('pzmode').checked){const c=cubies.find(c=>Object.values(c.st).includes(dn.t));if(c){const on=Object.values(c.st).some(q=>q.dataset.c!='N');for(const f in c.st)c.st[f].style.background=C[c.st[f].dataset.c=on?'N':SOL[f]]}}
 else dn.t.style.background=C[dn.t.dataset.c=pc]}dn=null});
addEventListener('pointercancel',()=>{dn=null});
$('tl').addEventListener('pointerdown',e=>e.stopPropagation());
$('tl').onclick=()=>{tilt=!tilt;$('stage').classList.toggle('tilt',tilt);$('tl').classList.toggle('on',tilt);$('tl').setAttribute('aria-pressed',tilt);$('tl').textContent=tilt?'✋ Listo':'↕ Inclinar'};
