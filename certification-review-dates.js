(() => {
  'use strict';
  const endpoint='https://learn.realknowledgeonline.com/api/certification-audit-dates';
  const cards=[...document.querySelectorAll('[data-certification-course]')];
  if(!cards.length)return;
  const courseIds=new Set(['general-ai-certification','managing-ai-certification','security-certification','safe-ai-agents-certification','ai-fraud-prevention-certification','personal-scam-prevention-certification','workplace-information-protection-certification','personal-safe-ai-use-certification','payment-card-security-certification','business-ethics-certification','personal-finance-certification']);
  const civilDate=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
  function show(card,value,note='',state='unavailable') {
    card.querySelector('[data-audit-date]').textContent=value;
    const status=card.querySelector('[data-audit-status]');status.textContent=note;status.hidden=!note;
    card.dataset.auditState=state;card.classList.remove('rk-is-loading');card.removeAttribute('data-rk-loading');card.removeAttribute('aria-busy');
  }
  function render(card,review) {
    if(!review||!['completed','with_gaps','not_recorded','unconfirmed'].includes(review.coverage)||!['boolean','object'].includes(typeof review.modelReviewPerformed)||typeof review.modelReviewPerformed==='object'&&review.modelReviewPerformed!==null){show(card,'Date unavailable');return;}
    if(review.coverage==='not_recorded') {show(card,'Not yet recorded','','not-recorded');return;}
    if(!Number.isFinite(review.completedAt)||review.completedAt<=0||Number.isNaN(new Date(review.completedAt).getTime())){show(card,'Date unavailable');return;}
    const finished=civilDate.format(new Date(review.completedAt))+' UTC';
    if(review.modelReviewPerformed===false){show(card,'Not recorded for this run','Model review skipped. Reference check finished '+finished+'.','skipped');return;}
    const notes=[];
    if(review.coverage==='unconfirmed'||review.modelReviewPerformed===null)notes.push('Model coverage not confirmed.');
    show(card,finished,notes.join(' '),review.coverage);
  }
  for(const card of cards){card.querySelector('[data-audit-date]').textContent='Checking…';card.dataset.auditState='loading';card.setAttribute('aria-busy','true');card.setAttribute('data-rk-loading','true');}
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  fetch(endpoint,{method:'GET',credentials:'omit',cache:'no-store',signal:controller.signal})
    .then(async response=>{if(!response.ok)throw new Error('Audit dates unavailable.');const data=await response.json();if(!data||!Array.isArray(data.reviews))throw new Error('Audit dates unavailable.');return data.reviews;})
    .then(reviews=>{const records=new Map(),duplicates=new Set();for(const review of reviews){if(!review||!courseIds.has(review.courseId))continue;if(records.has(review.courseId))duplicates.add(review.courseId);else records.set(review.courseId,review);}for(const card of cards)render(card,duplicates.has(card.dataset.certificationCourse)?null:records.get(card.dataset.certificationCourse));})
    .catch(()=>{for(const card of cards)show(card,'Date unavailable');})
    .finally(()=>clearTimeout(timer));
})();
