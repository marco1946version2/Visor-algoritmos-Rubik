// Pestañas principales (Mis casos, Catálogo, Identificar, Resolver) y botón flotante de la guía.
// Los paneles no se borran, solo se ocultan: todo lo demás sigue funcionando igual.
(()=>{const nav=$('mainnav'),P=[...document.querySelectorAll('[data-panel]')];
const show=(n,save=true)=>{if(!P.some(p=>p.dataset.panel==n))n='casos';P.forEach(p=>p.hidden=p.dataset.panel!=n);$('vistacard').hidden=n=='resolver';nav.querySelectorAll('button').forEach(b=>{const on=b.dataset.p==n;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});if(save)try{localStorage.setItem('rubikPanel',n)}catch(e){}};
nav.onclick=e=>{const b=e.target.closest('button[data-p]');if(!b)return;show(b.dataset.p);if(matchMedia('(max-width:900px)').matches)document.querySelector('.workspace-right').scrollIntoView({behavior:'smooth',block:'start'})};
let s='casos';try{s=localStorage.getItem('rubikPanel')||s}catch(e){}
show(s,false);
const g=$('guide'),gb=$('gbtn');gb.onclick=()=>{const o=g.classList.toggle('open');g.open=o;gb.textContent=o?'✕ Cerrar guía':'📖 Guía'};
})();
