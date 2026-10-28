(function(){
'use strict';
const C=window.CrimsonCourt,$=id=>document.getElementById(id);
const p=window.CRIMSON_PLAY;if(!p)return;
let chosen=0,t=0,playing=false,last=null,speed=1,raf=null,repeat=false;
const params=new URLSearchParams(location.search);if(/^\d+$/.test(params.get('read')||''))chosen=Math.min(p.options.length-1,+params.get('read'));if(Number.isFinite(Number(params.get('t'))))t=Math.max(0,Math.min(1,Number(params.get('t'))||0));
const settings={paths:true,matchups:false,help:!!p.help};
let prevIndex=-1;
function controls(){ $('play-pause').textContent=playing?'Pause':'Play';$('play-pause').setAttribute('aria-pressed',String(playing));}
function draw(){const o=p.options[chosen],steps=o.steps||o.frames;let step=0;while(step<steps.length-1&&steps[step+1].t<=t)step++;const s=C.stateAt(o,t);s.index=step;$('court').innerHTML=C.svg(p,o,t,settings);$('scrubber').value=Math.round(t*1000);$('elapsed').textContent=(t*p.duration).toFixed(1)+'s';$('phase-number').textContent=`Step ${s.index+1} of ${steps.length}`;$('phase-caption').textContent=steps[s.index].caption;$('previous-step').disabled=t<=0;$('next-step').disabled=t>=1;if(s.index!==prevIndex){document.querySelectorAll('.steps button').forEach((b,i)=>b.setAttribute('aria-current',i===s.index?'step':'false'));prevIndex=s.index;}controls();}
function stop(){playing=false;last=null;if(raf)cancelAnimationFrame(raf);raf=null;controls();}
function loop(now){if(!playing)return;if(t>=1){if(!repeat){stop();return;}t=0;prevIndex=-1;last=now;}if(last!==null)t=Math.min(1,t+Math.min((now-last)/1000,.12)*speed/p.duration);last=now;draw();if(t>=1&&!repeat){stop();return;}raf=requestAnimationFrame(loop);}
function setOption(i,keep=false){stop();chosen=i;if(!keep)t=0;prevIndex=-1;const o=p.options[i],steps=o.steps||o.frames;$('options').innerHTML=p.options.map((r,j)=>`<button aria-pressed="${i===j}" data-read="${j}">${C.escape(r.label)}</button>`).join('');$('options').querySelectorAll('button').forEach(b=>b.onclick=()=>setOption(+b.dataset.read));$('read-text').textContent=o.read;$('steps').innerHTML=steps.map((f,j)=>`<button data-step="${j}"><b>${String(j+1).padStart(2,'0')} / ${(f.t*p.duration).toFixed(1)}s</b>${C.escape(f.caption)}</button>`).join('');$('steps').querySelectorAll('button').forEach(b=>b.onclick=()=>{stop();t=steps[+b.dataset.step].t;draw();});draw();}
function jump(direction){stop();const f=p.options[chosen].steps||p.options[chosen].frames;const next=direction>0?f.find(x=>x.t>t+.0001):[...f].reverse().find(x=>x.t<t-.0001);t=next?next.t:direction>0?1:0;draw();}
function play(){if(playing){stop();return;}if(t>=1)t=0;playing=true;last=null;controls();raf=requestAnimationFrame(loop);}
$('play-pause').onclick=play;$('reset').onclick=()=>{stop();t=0;draw();};$('previous-step').onclick=()=>jump(-1);$('next-step').onclick=()=>jump(1);$('scrubber').oninput=e=>{stop();t=Number(e.target.value)/1000;draw();};$('speed').onchange=e=>{speed=Number(e.target.value);};
$('repeat').checked=false;
$('repeat').onchange=e=>{repeat=e.target.checked;};
window.addEventListener('pageshow',()=>{repeat=false;$('repeat').checked=false;});
for(const k of ['paths','matchups','help']){const el=$(k);if(el){el.checked=settings[k];el.onchange=()=>{settings[k]=el.checked;draw();};}}
$('print').onclick=()=>{stop();window.print();};$('share').onclick=async()=>{const u=new URL(location.href);u.search='';u.searchParams.set('read',chosen);u.searchParams.set('t',t.toFixed(3));try{await navigator.clipboard.writeText(u.href);$('share').textContent='Link copied';}catch{$('share-fallback').hidden=false;$('share-url').value=u.href;$('share-url').focus();$('share-url').select();}setTimeout(()=>{$('share').textContent='Copy this read';},2200);};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea,button,a,summary'))return;if(e.code==='Space'){e.preventDefault();play();}else if(e.key==='ArrowRight'){e.preventDefault();jump(1);}else if(e.key==='ArrowLeft'){e.preventDefault();jump(-1);}});
setOption(chosen,true);
})();
