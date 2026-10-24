// No framework or remote service is needed for the reference lessons.
document.querySelectorAll('[data-print]').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>window.print());});
document.querySelectorAll('[data-map]').forEach(map=>{
 const controls=map.querySelector('.diagram-controls');controls.hidden=false;
 const select=side=>{map.querySelectorAll('[data-side-panel]').forEach(p=>p.hidden=p.dataset.sidePanel!==side);map.querySelectorAll('[data-side]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.side===side)));};
 controls.addEventListener('click',event=>{const b=event.target.closest('[data-side]');if(b)select(b.dataset.side);});select('left');
});
document.querySelectorAll('[data-photo-lesson]').forEach(lesson=>{
 const steps=[...lesson.querySelectorAll('[data-step]')],buttons=[...lesson.querySelectorAll('[data-step-button]')];
 const play=lesson.querySelector('[data-play]'),speed=lesson.querySelector('[data-speed]'),loop=lesson.querySelector('[data-loop]'),all=lesson.querySelector('[data-show-all]'),status=lesson.querySelector('[data-step-status]');
 let index=0,playing=false,showAll=false,timer=null;
 lesson.querySelector('.lesson-toolbar').hidden=false;lesson.querySelector('.lesson-step-nav').hidden=false;
 function stop(){playing=false;clearTimeout(timer);timer=null;play.textContent='Play steps';play.setAttribute('aria-pressed','false');}
 function render(){steps.forEach((s,i)=>s.hidden=!showAll&&i!==index);buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(!showAll&&i===index)));all.setAttribute('aria-pressed',String(showAll));all.textContent=showAll?'Show one step':'Show all steps';status.textContent=showAll?'All 3 steps · read from top to bottom':`Step ${index+1} of ${steps.length} · ${steps[index].querySelector('h2').textContent}`;}
 function schedule(){clearTimeout(timer);if(!playing)return;timer=setTimeout(()=>{if(index===steps.length-1){if(!loop.checked){stop();return;}index=0;}else index++;render();schedule();},Number(speed.value));}
 function go(i){stop();showAll=false;index=Math.max(0,Math.min(steps.length-1,i));render();}
 play.addEventListener('click',()=>{if(playing){stop();return;}showAll=false;if(index===steps.length-1)index=0;playing=true;play.textContent='Pause';play.setAttribute('aria-pressed','true');render();schedule();});
 lesson.querySelector('[data-prev]').addEventListener('click',()=>go(index-1));lesson.querySelector('[data-next]').addEventListener('click',()=>go(index+1));
 buttons.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
 all.addEventListener('click',()=>{stop();showAll=!showAll;render();});speed.addEventListener('change',schedule);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.addEventListener('beforeprint',stop);
 // Captions remain available even if an image is missing or slow to load.
 steps.forEach(step=>{const img=step.querySelector('img');img.addEventListener('error',()=>{const note=document.createElement('p');note.className='photo-error';note.textContent='The photo could not load. The coaching steps remain available beside it.';img.parentElement.replaceWith(note);},{once:true});});
 render();
});
