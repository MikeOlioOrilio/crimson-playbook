import {isAdmin, loginAdmin, logoutAdmin, readTeam, saveTeam, listCoaches, saveCoach} from './firebase-store.js';
import {checkedSelection, friendlyError} from './access-model.js';
const $ = id => document.getElementById(id), C = window.CrimsonCourt, catalog = window.CRIMSON_CATALOG;
const categories = {drills: 'Drills', offense: 'Offensive Plays / Strategies', defense: 'Defensive Plays / Strategies', inbounds: 'Inbounding Plays'};
let revision = 0, dirty = false, coaches = [], active = false;
function markDirty() {dirty = true; $('selection-status').textContent = 'Unsaved changes'; count();}
function count() {$('selection-count').textContent = `${document.querySelectorAll('[data-play]:checked').length} of ${catalog.length} selected`;}
function resetCoach() {
  $('coach-editor').reset(); $('coach-id').value = ''; $('new-coach-pin').required = true;
  $('save-coach').textContent = 'Add coach'; $('cancel-coach').hidden = true;
  $('pin-help').textContent = 'Share the PIN with this coach after saving. PINs cannot be displayed later.';
}
function drawCoaches() {
  $('coach-list').innerHTML = coaches.length ? coaches.map(coach => `<div class="coach-row"><div><strong>${C.escape(coach.firstName + ' ' + coach.lastName)}</strong><p>${coach.enabled ? 'Access enabled' : 'Access disabled'}</p></div><button type="button" data-edit-coach="${C.escape(coach.id)}">Edit / change PIN</button></div>`).join('') : '<p>No coaches yet. Add your first coach above.</p>';
  document.querySelectorAll('[data-edit-coach]').forEach(button => {button.onclick = () => {
    const coach = coaches.find(c => c.id === button.dataset.editCoach);
    $('coach-id').value = coach.id; $('coach-first').value = coach.firstName; $('coach-last').value = coach.lastName;
    $('coach-enabled').checked = coach.enabled; $('new-coach-pin').value = ''; $('new-coach-pin').required = false;
    $('pin-help').textContent = 'Leave PIN blank to keep the current PIN, or enter a new unique PIN. The old PIN will stop working.';
    $('save-coach').textContent = 'Save coach'; $('cancel-coach').hidden = false; $('coach-save-status').textContent = ''; $('coach-first').focus();
  };});
}
async function openWorkspace() {
  $('admin-workspace').hidden = true;
  const [team, records] = await Promise.all([readTeam(), listCoaches()]);
  revision = team.revision; coaches = records;
  $('selection-title').value = team.title; $('selection-note').value = team.note;
  $('play-checklist').innerHTML = Object.entries(categories).map(([key, label]) => `<fieldset><legend>${label}</legend>${catalog.filter(p => p.category === key).map(p => `<label class="play-check"><input type="checkbox" data-play="${p.slug}" ${team.selectedSlugs.includes(p.slug) ? 'checked' : ''}><span><strong>${C.escape(p.title)}</strong><small>${C.escape(p.description)}</small></span></label>`).join('')}</fieldset>`).join('');
  dirty = false; count(); drawCoaches(); active = true;
  $('admin-login').hidden = true; $('admin-workspace').hidden = false; $('admin-signout').hidden = false;
  $('admin-status').textContent = 'Signed in as administrator.';
}
async function start() {
  $('retry-admin').hidden = true; $('admin-status').textContent = 'Connecting to Firebase…';
  try {if (await isAdmin()) await openWorkspace(); else {$('admin-login').hidden = false; $('admin-status').textContent = '';}}
  catch (error) {$('admin-status').textContent = friendlyError(error); $('admin-login').hidden = false; $('retry-admin').hidden = false;}
}
$('admin-login-form').onsubmit = async event => {
  event.preventDefault(); $('admin-signin').disabled = true; $('admin-status').textContent = 'Signing in…';
  try {await loginAdmin($('admin-email').value.trim(), $('admin-password').value); $('admin-password').value = ''; await openWorkspace();}
  catch (error) {$('admin-status').textContent = friendlyError(error);}
  finally {$('admin-signin').disabled = false;}
};
$('retry-admin').onclick = start;
$('admin-signout').onclick = async () => {await logoutAdmin(); active = false; location.reload();};
$('selection-form').addEventListener('input', markDirty);
for (const [id, checked] of [['select-all', true], ['select-none', false]]) $(id).onclick = () => {document.querySelectorAll('[data-play]').forEach(input => {input.checked = checked;}); markDirty();};
$('selection-form').onsubmit = async event => {
  event.preventDefault(); if (!active) return;
  $('save-selection').disabled = true; $('selection-status').textContent = 'Saving…';
  const values = {title: $('selection-title').value.trim(), note: $('selection-note').value.trim(), selectedSlugs: checkedSelection(catalog, Array.from(document.querySelectorAll('[data-play]:checked'), input => input.dataset.play))};
  // Disable the form while saving so newer edits cannot be mistaken for saved values.
  const controls = Array.from($('selection-form').elements); controls.forEach(input => {input.disabled = true;});
  try {revision = await saveTeam(values, revision); dirty = false; $('selection-status').textContent = `Saved. The team will see ${values.selectedSlugs.length} plays when they open or refresh the page.`;}
  catch (error) {$('selection-status').textContent = friendlyError(error);}
  finally {controls.forEach(input => {input.disabled = false;});}
};
$('cancel-coach').onclick = () => {resetCoach(); $('coach-save-status').textContent = '';};
$('coach-editor').onsubmit = async event => {
  event.preventDefault(); if (!active) return;
  const values = {id: $('coach-id').value || null, firstName: $('coach-first').value, lastName: $('coach-last').value, enabled: $('coach-enabled').checked, pin: $('new-coach-pin').value};
  if (!values.firstName.trim() || !values.lastName.trim()) {$('coach-save-status').textContent = 'Enter both first and last name.'; return;}
  const controls = Array.from($('coach-editor').elements); controls.forEach(input => {input.disabled = true;});
  $('coach-save-status').textContent = 'Saving coach…';
  try {
    await saveCoach(values); resetCoach(); $('coach-save-status').textContent = 'Coach saved.';
    try {coaches = await listCoaches(); drawCoaches();} catch {$('coach-save-status').textContent = 'Coach saved. Reload the page to refresh the coach list.';}
  } catch (error) {$('coach-save-status').textContent = friendlyError(error);}
  finally {controls.forEach(input => {input.disabled = false;});}
};
window.addEventListener('beforeunload', event => {if (dirty) {event.preventDefault(); event.returnValue = '';}});
start();
