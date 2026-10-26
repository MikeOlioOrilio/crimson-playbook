/* Progressive enhancement: every rule and diagram is available without JS. */
(() => {
 const cards=[...document.querySelectorAll('[data-rule-group]')];
 const filters=[...document.querySelectorAll('[data-rule-filter]')];
 const count=document.querySelector('[data-rule-count]');
 if(!cards.length)return;
 function filter(group){
  cards.forEach(card=>card.hidden=group!=='all'&&card.dataset.ruleGroup!==group);
  filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ruleFilter===group)));
  count.textContent=`${cards.filter(c=>!c.hidden).length} of ${cards.length} rules shown`;
 }
 document.querySelector('.rules-filters').hidden=false;count.hidden=false;
 filters.forEach(button=>button.addEventListener('click',()=>filter(button.dataset.ruleFilter)));
 function revealHash(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const target=document.getElementById(id);
  if(target?.matches('[data-rule-group]')&&target.hidden){filter('all');target.scrollIntoView({block:'start'});}
 }
 window.addEventListener('hashchange',revealHash);
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
  const target=document.getElementById(a.hash.slice(1));
  if(target?.hidden&&target.matches('[data-rule-group]'))filter('all');
 }));
 document.querySelectorAll('[data-rule-demo]').forEach(demo=>{
  const buttons=[...demo.querySelectorAll('[data-scene]')];
  const panels=[...demo.querySelectorAll('[data-scene-panel]')];
  function show(scene){panels.forEach(p=>p.hidden=p.dataset.scenePanel!==scene);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===scene)));}
  demo.querySelector('.rule-demo-buttons').hidden=false;show('0');
  buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.scene)));
 });
 const print=document.querySelector('[data-print]');print.hidden=false;
 print.addEventListener('click',()=>window.print());
 let printOpen=[];
 window.addEventListener('beforeprint',()=>{printOpen=[...document.querySelectorAll('details:not([open])')];printOpen.forEach(d=>d.open=true);});
 window.addEventListener('afterprint',()=>{printOpen.forEach(d=>d.open=false);printOpen=[];});
 filter('all');revealHash();
})();
