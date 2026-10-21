import {readTeam, checkCoach, unlockCoach, clearCoach, isAdmin, logoutAdmin} from './firebase-store.js';
import {visiblePlays, friendlyError} from './access-model.js';
const $ = id => document.getElementById(id), C = window.CrimsonCourt, catalog = window.CRIMSON_CATALOG;
const categories = {all: 'All categories', drills: 'Drills', offense: 'Offensive Plays / Strategies', defense: 'Defensive Plays / Strategies', inbounds: 'Inbounding Plays'};
const wantsCoach = new URLSearchParams(location.search).get('view') === 'coach';
let team = {selectedSlugs: [], title: '', note: ''}, coach = false, ready = false;
function render() {
  const all = ready ? visiblePlays(catalog, team, coach) : [];
  const cat = categories[location.hash.slice(1)] ? location.hash.slice(1) : 'all';
  const query = $('search').value.trim().toLowerCase();
  const plays = all.filter(p => (cat === 'all' || p.category === cat) && [p.title, p.description, p.level, p.category].join(' ').toLowerCase().includes(query));
  document.querySelectorAll('[data-category]').forEach(link => {
    link.setAttribute('aria-current', link.dataset.category === cat ? 'page' : 'false');
    link.querySelector('.count').textContent = all.filter(p => link.dataset.category === 'all' || p.category === link.dataset.category).length;
  });
  $('section-title').textContent = categories[cat];
  $('result-count').textContent = `${plays.length} ${plays.length === 1 ? 'play' : 'plays'}`;
  $('section-subtitle').textContent = coach ? 'The full library. Team picks are marked below.' : 'The plays your coaches want you to focus on.';
  $('cards').innerHTML = plays.map(p => `<a class="play-card" href="${p.slug}/index.html${coach ? '?view=coach' : ''}"><div class="card-preview">${C.svg(p, p.preview, .35)}<span class="tag">${C.escape(categories[p.category])}</span></div><div class="card-copy"><div class="card-meta"><span class="tag level">${C.escape(p.level)}</span>${coach && team.selectedSlugs.includes(p.slug) ? '<span class="tag team-pick">Team pick</span>' : ''}</div><h3>${C.escape(p.title)}</h3><p>${C.escape(p.description)}</p><div class="card-foot">Open play <span>${p.sequence ? '30s sequence' : p.optionsCount + ' reads'} ↗</span></div></div></a>`).join('');
  if (ready && !plays.length) $('cards').innerHTML = `<div class="empty"><h3>${all.length ? 'No matching plays' : 'Your team’s plays are coming soon'}</h3><p>${all.length ? 'Try another search or category.' : 'Your coach has not selected any plays yet. Check back after your next practice.'}</p></div>`;
}
function status(message) {$('library-status').textContent = message; $('library-status').hidden = !message;}
async function load() {
  ready = false; coach = false; render();
  $('retry-library').hidden = true;
  status('Loading your team’s playbook…');
  try {
    team = await readTeam();
    if (wantsCoach) coach = await isAdmin() || await checkCoach();
    $('coach-login').hidden = !wantsCoach || coach;
    $('library-content').hidden = wantsCoach && !coach;
    $('leave-coach').hidden = !coach;
    $('view-label').textContent = coach ? 'COACH VIEW · COMPLETE LIBRARY' : 'TEAM VIEW · CURRENT FOCUS';
    $('team-title').textContent = coach ? 'Your complete playbook' : team.title;
    $('team-note').textContent = coach ? 'Review every drill and play. Switch to Team View to see exactly what your players see.' : team.note || 'Learn these plays together. Watch the movement, then walk through the teaching steps.';
    ready = !wantsCoach || coach; status(''); render();
    if (wantsCoach && !coach) $('coach-pin').focus();
    const slug = location.hash.replace(/^#\/?/, '');
    if (visiblePlays(catalog, team, coach).some(p => p.slug === slug)) location.replace(`${slug}/index.html${coach ? '?view=coach' : ''}`);
  } catch (error) {
    status(friendlyError(error)); $('retry-library').hidden = false;
    $('coach-login').hidden = true; $('library-content').hidden = true;
  }
}
$('search').addEventListener('input', render);
window.addEventListener('hashchange', render);
window.addEventListener('pageshow', event => {if (event.persisted) load();});
$('retry-library').onclick = load;
$('coach-login-form').onsubmit = async event => {
  event.preventDefault(); const button = $('unlock-coach'); button.disabled = true;
  $('coach-error').textContent = 'Checking PIN…';
  try {await unlockCoach($('coach-pin').value); $('coach-pin').value = ''; $('coach-error').textContent = ''; await load();}
  catch (error) {$('coach-error').textContent = friendlyError(error);}
  finally {button.disabled = false;}
};
$('leave-coach').onclick = async () => {clearCoach(); try {await logoutAdmin();} finally {location.href = 'index.html';}};
load();
