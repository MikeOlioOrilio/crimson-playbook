import {connect, readGuide} from './firebase.js';

const $ = (id) => document.getElementById(id);
const tag = (name, text, className) => {
  const element = document.createElement(name);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
};
function sourceLink(label, address) {
  const url = new URL(address);
  const link = tag('a', label);
  if (url.protocol === 'https:') link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}
const list = (items, name='ul') => {
  const element = tag(name);
  for (const item of items) element.append(tag('li', item));
  return element;
};
const cleared = ['process','provider-tabs','provider-panels','recovery','prompts'];
const tableBody = $('comparison').querySelector('tbody');
const legend = $('checklist').querySelector('legend');
const form = $('login-form');
const fields = $('credentials');
let connection, revision = 0;

function clearGuide() {
  $('workspace').hidden = true;
  $('sign-out').hidden = true;
  $('login').hidden = false;
  for (const id of cleared) $(id).replaceChildren();
  tableBody.replaceChildren();
  $('checklist').replaceChildren(legend);
  for (const id of ['verified-date','biggest-risk','check-progress']) $(id).textContent = '';
}

function render(guide) {
  if (guide.version !== 1 || guide.providers.map(p=>p.id).join(',') !== 'openai,google,claude') throw new Error('invalid-curriculum');
  $('verified-date').textContent = 'Sources checked ' + guide.verified;
  $('biggest-risk').textContent = guide.risk;
  for (const [title,description] of guide.process) {
    const step = tag('li');
    step.append(tag('h3',title),tag('p',description));
    $('process').append(step);
  }
  const tabs = [], panels = [];
  const select = (index, focus=false) => {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i===index));
      tab.tabIndex = i===index ? 0 : -1;
      panels[i].hidden = i!==index;
    });
    if (focus) tabs[index].focus();
  };
  guide.providers.forEach((provider,index) => {
    const row = tag('tr');
    const name = tag('th',provider.label);
    name.scope = 'row';
    row.append(name,tag('td',provider.best),tag('td',provider.phone));
    tableBody.append(row);
    const tab = tag('button',provider.label);
    tab.type = 'button';
    tab.id = 'tab-'+provider.id;
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls','panel-'+provider.id);
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      const count = guide.providers.length;
      const next = {ArrowRight:(index+1)%count,ArrowLeft:(index+count-1)%count,Home:0,End:count-1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next,true);
    });
    const panel = tag('section',null,'provider-panel');
    panel.id = 'panel-'+provider.id;
    panel.tabIndex = 0;
    panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',tab.id);
    panel.append(tag('p',provider.label,'mini-label'),tag('h3',provider.title),tag('p',provider.summary,'summary'));
    const grid = tag('div',null,'provider-grid');
    for (const [heading, bullets] of provider.sections) {
      const item = tag('article');
      item.append(tag('h4',heading),list(bullets));
      grid.append(item);
    }
    const exercise = tag('div',null,'exercise');
    exercise.append(tag('h4','Instructor exercise'),list(provider.exercise,'ol'));
    const sources = tag('ul',null,'source-list');
    for (const [label,url] of provider.sources) {
      const item = tag('li');item.append(sourceLink(label,url));sources.append(item);
    }
    panel.append(grid,exercise,tag('h4','Official sources'),sources);
    tabs.push(tab);panels.push(panel);
    $('provider-tabs').append(tab);$('provider-panels').append(panel);
  });
  select(0);
  for (const [title,description,source] of guide.recovery) {
    const item = tag('article');
    item.append(tag('h3',title),tag('p',description));
    if (source) item.append(sourceLink('Official restore instructions ↗',source));
    $('recovery').append(item);
  }
  for (const [title,prompt] of guide.prompts) {
    const item = tag('article'), copy = tag('button','Copy prompt','admin-button secondary'), status = tag('span',null,'copy-status');
    status.setAttribute('role','status');
    copy.type = 'button';
    copy.addEventListener('click',async()=>{
      try { await navigator.clipboard.writeText(prompt); status.textContent = 'Copied.'; }
      catch { status.textContent = 'Select the prompt text to copy it.'; }
    });
    item.append(tag('h3',title),tag('pre',prompt),copy,status);
    $('prompts').append(item);
  }
  const updateProgress = () => {
    const count = $('checklist').querySelectorAll('input:checked').length;
    $('check-progress').textContent = count+' of '+guide.checklist.length+' demonstrated';
  };
  for (const text of guide.checklist) {
    const label = tag('label'), input = tag('input');
    input.type = 'checkbox';
    input.addEventListener('change',updateProgress);
    label.append(input,document.createTextNode(text));$('checklist').append(label);
  }
  updateProgress();
}

async function enter(focus) {
  const request = ++revision;
  const guide = await readGuide(connection);
  if (request !== revision) return;
  if (!guide) {
    await connection.auth.signOut(connection.session);
    $('status').textContent = 'This account is not enabled for administrator access.';
    return;
  }
  render(guide);
  $('login').hidden = true;
  $('workspace').hidden = false;
  $('sign-out').hidden = false;
  if (focus) $('guide-title').focus();
}

form.addEventListener('submit', async (event)=>{
  event.preventDefault();
  if (!connection || fields.disabled) return;
  const email = $('email').value.trim(), password = $('password').value;
  $('password').value = '';
  fields.disabled = true;
  $('status').textContent = 'Checking administrator access…';
  try {
    await connection.auth.signInWithEmailAndPassword(connection.session,email,password);
    await enter(true);
  } catch(error) {
    clearGuide();
    if (error.code?.startsWith('auth/')) $('status').textContent = 'Could not sign in. Check your credentials and try again.';
    else $('status').textContent = 'The training guide could not be opened. Check the connection or contact the site owner.';
  } finally { fields.disabled = false; }
});

$('sign-out').addEventListener('click', async ()=>{
  ++revision;
  clearGuide();
  fields.disabled = true;
  try { await connection.auth.signOut(connection.session); form.reset(); $('status').textContent = 'Signed out.'; }
  catch { $('status').textContent = 'The page is locked. Close this tab to clear its session, or try signing in again.'; }
  finally { fields.disabled = false; $('email').focus(); }
});

try {
  $('status').textContent = 'Connecting to Firebase…';
  connection = await connect();
  connection.auth.onAuthStateChanged(connection.session,user=>{
    if (!user) { ++revision;clearGuide(); }
  });
  fields.disabled = false;
  $('status').textContent = '';
  if (connection.session.currentUser) await enter(false);
} catch {
  clearGuide();
  $('status').textContent = 'Unable to open the training guide. Reload to retry or contact the site owner.';
}
