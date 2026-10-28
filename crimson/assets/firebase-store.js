import {firebaseConfig} from './firebase-config.js';
import {credentialKey, teamSelection} from './access-model.js';

let connection;
function deadline(promise) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {timer = setTimeout(() => reject(new Error('Firebase is taking too long to respond. Check your connection and setup, then try again.')), 15000);})]).finally(() => clearTimeout(timer));
}
export async function connect() {
  if (!connection) connection = deadline((async () => {
    const [appSDK, authSDK, dbSDK] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]);
    const app = appSDK.initializeApp(firebaseConfig);
    const auth = authSDK.getAuth(app), db = dbSDK.getFirestore(app);
    await authSDK.setPersistence(auth, authSDK.browserSessionPersistence);
    await auth.authStateReady();
    return {auth, db, a: authSDK, d: dbSDK};
  })()).catch(error => {connection = null; throw error;});
  return connection;
}
export async function readTeam() {
  const {db, d} = await connect();
  const snap = await deadline(d.getDocFromServer(d.doc(db, 'settings', 'team')));
  return teamSelection(snap.exists() ? snap.data() : null);
}
export async function saveTeam(value, expectedRevision) {
  const {db, d} = await connect();
  return d.runTransaction(db, async tx => {
    const ref = d.doc(db, 'settings', 'team'), snap = await tx.get(ref);
    const revision = teamSelection(snap.exists() ? snap.data() : null).revision;
    if (revision !== expectedRevision) throw new Error('Another administrator changed the selection. Reload this page before saving again.');
    tx.set(ref, {...value, revision: revision + 1, updatedAt: d.serverTimestamp()});
    return revision + 1;
  });
}
const sessionKey = 'crimson.coach.access.v1';
export function clearCoach() {try {sessionStorage.removeItem(sessionKey);} catch {}}
export async function checkCoach(key) {
  let session;
  if (!key) {
    try {session = JSON.parse(sessionStorage.getItem(sessionKey));} catch {}
    if (!session || !Number.isFinite(session.expires) || session.expires < Date.now()) {clearCoach(); return false;}
    key = session.key;
  }
  if (!/^[a-f0-9]{64}$/.test(key)) return false;
  const {db, d} = await connect();
  const snap = await deadline(d.getDocFromServer(d.doc(db, 'coachAccess', key)));
  const allowed = snap.exists() && snap.data().enabled === true;
  if (!allowed) clearCoach();
  return allowed;
}
export async function unlockCoach(pin) {
  const key = await credentialKey(pin, firebaseConfig.projectId);
  if (!await checkCoach(key)) throw new Error('That PIN was not recognized or has been disabled.');
  try {sessionStorage.setItem(sessionKey, JSON.stringify({key, expires: Date.now() + 12 * 60 * 60 * 1000}));}
  catch {throw new Error('Allow browser session storage to use Coach View.');}
}
export async function isAdmin() {
  const {auth, db, d} = await connect();
  if (!auth.currentUser) return false;
  const snap = await deadline(d.getDocFromServer(d.doc(db, 'admins', auth.currentUser.uid)));
  return snap.exists() && snap.data().enabled === true;
}
export async function loginAdmin(email, password) {
  const {auth, a} = await connect();
  await a.signInWithEmailAndPassword(auth, email, password);
  if (!await isAdmin()) {await a.signOut(auth); throw new Error('This account has not been enabled as an administrator. Follow step 4 in the setup guide.');}
}
export async function logoutAdmin() {const {auth, a} = await connect(); await a.signOut(auth);}
export async function listCoaches() {
  const {db, d} = await connect();
  const snap = await deadline(d.getDocsFromServer(d.collection(db, 'coaches')));
  return snap.docs.map(doc => ({...doc.data(), id: doc.id})).sort((a, b) => (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName));
}
export async function saveCoach({id, firstName, lastName, enabled, pin}) {
  const {db, d} = await connect();
  const ref = id ? d.doc(db, 'coaches', id) : d.doc(d.collection(db, 'coaches'));
  const newKey = pin ? await credentialKey(pin, firebaseConfig.projectId) : null;
  return d.runTransaction(db, async tx => {
    const oldSnap = await tx.get(ref), old = oldSnap.exists() ? oldSnap.data() : null;
    const key = newKey || old?.credentialId;
    if (!key) throw new Error('Enter a PIN for the new coach.');
    const accessRef = d.doc(db, 'coachAccess', key), access = await tx.get(accessRef);
    if (access.exists() && access.data().coachId !== ref.id) throw new Error('That PIN is already assigned to another coach. Choose a different PIN.');
    if (old?.credentialId && old.credentialId !== key) tx.delete(d.doc(db, 'coachAccess', old.credentialId));
    tx.set(ref, {firstName: firstName.trim(), lastName: lastName.trim(), enabled, credentialId: key, updatedAt: d.serverTimestamp()});
    tx.set(accessRef, {coachId: ref.id, enabled});
    return ref.id;
  });
}
