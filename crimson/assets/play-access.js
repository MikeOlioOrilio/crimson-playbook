import {readTeam, checkCoach, isAdmin, clearCoach, logoutAdmin} from './firebase-store.js';
import {visiblePlays, friendlyError} from './access-model.js?v=practice-order';
const main = document.getElementById('main'), gate = document.getElementById('play-access-status');
const coachRequested = new URLSearchParams(location.search).get('view') === 'coach';
const lessonVideo = main.querySelector('[data-lesson-video]');
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
    if (lessonVideo && !lessonVideo.firstElementChild) {
      lessonVideo.append(document.getElementById('lesson-video').content.cloneNode(true));
      lessonVideo.hidden = false;
    }
    document.getElementById('leave-coach').hidden = !coach;
    if (coach) main.querySelectorAll('.breadcrumbs a').forEach(link => {const u = new URL(link.href); u.searchParams.set('view', 'coach'); link.href = u.href;});
    const plays = visiblePlays(window.CRIMSON_CATALOG, team, coach), index = plays.findIndex(p => p.slug === window.CRIMSON_PLAY.slug);
    const nav = main.querySelector('.next-prev'); nav.replaceChildren();
    if (!coach && index >= 0) {
      const heading = main.querySelector('.play-heading .eyebrow');
      const position = heading.querySelector('.practice-position') || document.createElement('span');
      position.className = 'practice-position';
      position.textContent = ` · Practice ${index + 1} of ${plays.length}`;
      heading.append(position);
    }
    if (plays.length > 1 && index >= 0) for (const [delta, label] of [[-1, 'Previous: '], [1, 'Next: ']]) {
      const target = index + delta;
      const p = plays[coach ? (target + plays.length) % plays.length : target];
      if (!p) continue;
      const link = document.createElement('a');
      link.href = `../${p.slug}/index.html${coach ? '?view=coach' : ''}`; link.textContent = label + p.title; nav.append(link);
    }
  } catch (error) {
    message.textContent = friendlyError(error);
    const retry = document.createElement('button'); retry.textContent = 'Try again'; retry.onclick = load; gate.append(retry);
  } finally {
    if (lessonVideo && main.hidden) {
      lessonVideo.replaceChildren();
      lessonVideo.hidden = true;
    }
  }
}
document.getElementById('leave-coach').onclick = async () => {clearCoach(); try {await logoutAdmin();} finally {location.href = '../index.html';}};
main.querySelector('[data-print-video-lesson]')?.addEventListener('click', () => window.print());
window.addEventListener('pageshow', event => {if (event.persisted) load();});
load();
