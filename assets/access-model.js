// Pure helpers shared by the team library and administration.
export function teamSelection(value) {
  if (!value) return {title: 'This week’s playbook', note: '', selectedSlugs: [], revision: 0};
  if (!Array.isArray(value.selectedSlugs) || value.selectedSlugs.some(s => typeof s !== 'string')) throw new Error('The team selection is not valid. Ask the administrator to save it again.');
  return {title: String(value.title || 'This week’s playbook'), note: String(value.note || ''), selectedSlugs: [...new Set(value.selectedSlugs)], revision: Number.isInteger(value.revision) ? value.revision : 0};
}
export function visiblePlays(catalog, selection, coach) {
  const selected = new Set(selection.selectedSlugs);
  return coach ? catalog : catalog.filter(p => selected.has(p.slug));
}
export function checkedSelection(catalog, slugs) {
  const selected = new Set(slugs);
  return catalog.filter(p => selected.has(p.slug)).map(p => p.slug);
}
export function validatePin(pin) {
  if (!/^\d{4,8}$/.test(pin)) throw new Error('Use a PIN with 4–8 digits. Six or more is recommended.');
  return pin;
}
export async function credentialKey(pin, projectId, cryptoProvider = globalThis.crypto) {
  validatePin(pin);
  const bytes = new TextEncoder();
  const key = await cryptoProvider.subtle.importKey('raw', bytes.encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await cryptoProvider.subtle.deriveBits({name: 'PBKDF2', salt: bytes.encode(projectId + ':coach-pin:v1'), iterations: 150000, hash: 'SHA-256'}, key, 256);
  return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
}
export function friendlyError(error) {
  const code = String(error?.code || '');
  if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(code)) return 'The email or password was not recognized.';
  if (/too-many-requests|resource-exhausted/.test(code)) return 'Too many attempts or the Firebase quota was reached. Please try again later.';
  if (/permission-denied/.test(code)) return 'Firebase blocked this request. Check the published Firestore rules and your administrator record in the setup guide.';
  if (/operation-not-allowed|configuration-not-found/.test(code)) return 'Enable Email/Password in Firebase Authentication, following the setup guide.';
  if (/unauthorized-domain/.test(code)) return 'Add this website’s hostname under Firebase Authentication → Settings → Authorized domains.';
  if (/unavailable|network-request-failed|deadline-exceeded/.test(code) || error instanceof TypeError) return 'Unable to reach Firebase. Check your connection and Firebase setup, then try again.';
  return error?.message || 'Something went wrong. Please try again.';
}
