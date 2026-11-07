import {firebaseConfig} from './firebase-config.js';
import {delivery} from './deployment.js';

let connection;
export function connect() {
  if (!connection) connection = (async () => {
    const [app, auth, store] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]);
    const instance = app.initializeApp(firebaseConfig);
    const session = auth.getAuth(instance);
    await auth.setPersistence(session, auth.browserSessionPersistence);
    await session.authStateReady();
    return {auth, store, session, db:store.getFirestore(instance)};
  })();
  return connection;
}

export async function readGuide(connection) {
  const {session,store,db} = connection;
  const user = session.currentUser;
  if (!user) return null;
  const grant = await store.getDocFromServer(store.doc(db,'admins',user.uid));
  if (!grant.exists() || grant.data().enabled !== true) return null;
  if (delivery === 'firestore') {
    const snapshot = await store.getDocFromServer(store.doc(db,'rkTraining','individual-phase-1'));
    if (!snapshot.exists() || typeof snapshot.data().json !== 'string') throw new Error('curriculum-unavailable');
    return JSON.parse(snapshot.data().json);
  }
  if (delivery !== 'owner-private-preview') throw new Error('unknown-delivery');
  const response = await fetch('./curriculum.json', {cache:'no-store',credentials:'same-origin'});
  if (!response.ok) throw new Error('curriculum-unavailable');
  return response.json();
}
