import {readTeam, checkCoach, isAdmin, clearCoach, logoutAdmin} from './firebase-store.js';
import {visiblePlays, friendlyError} from './access-model.js';
const main = document.getElementById('main'), gate = document.getElementById('play-access-status');
const coachRequested = new URLSearchParams(location.search).get('view') === 'coach';
async function load() {
  main.hidden = true; gate.hidden = false; gate.replaceChildren();
  const message = document.createElement('p'); message.textContent = 'Loading this play…'; gate.append(message);
  try {
    const team = await readTeam();
    const coach = coachRequested && (await isAdmin() || await checkCoach());
    if (coachRequested && !coach) {
      message.textContent = 'Enter your coach PIN to browse the complete playbook.';
      const link = document.createElement('a'); link.className = 'button'; link.href = '../index.html?view=coach'; link.textContent = 'Open Coach View'; gate.append(link); return;
    }
    if (!coach && !team.selectedSlugs.includes(window.CRIMSON_PLAY.slug)) {
      message.textContent = 'This play is not in your team’s current selection.';
      const link = document.createElement('a'); link.className = 'button'; link.href = '../index.html'; link.textContent = 'See this week’s plays'; gate.append(link); return;
    }
    gate.hidden = true; main.hidden = false;
    document.getElementById('leave-coach').hidden = !coach;
    if (coach) main.querySelectorAll('.breadcrumbs a').forEach(link => {const u = new URL(link.href); u.searchParams.set('view', 'coach'); link.href = u.href;});
    const plays = visiblePlays(window.CRIMSON_CATALOG, team, coach), index = plays.findIndex(p => p.slug === window.CRIMSON_PLAY.slug);
    const nav = main.querySelector('.next-prev'); nav.replaceChildren();
    if (plays.length > 1) for (const [delta, label] of [[-1, '← '], [1, 'Next: ']]) {
      const p = plays[(index + delta + plays.length) % plays.length], link = document.createElement('a');
      link.href = `../${p.slug}/index.html${coach ? '?view=coach' : ''}`; link.textContent = label + p.title; nav.append(link);
    }
  } catch (error) {
    message.textContent = friendlyError(error);
    const retry = document.createElement('button'); retry.textContent = 'Try again'; retry.onclick = load; gate.append(retry);
  }
}
document.getElementById('leave-coach').onclick = async () => {clearCoach(); try {await logoutAdmin();} finally {location.href = '../index.html';}};
window.addEventListener('pageshow', event => {if (event.persisted) load();});
load();
