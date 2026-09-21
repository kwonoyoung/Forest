import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js';

export function requireAdmin(onReady, onError) {
  return onAuthStateChanged(auth, async user => {
    if (!user) {
      location.replace('../login/');
      return;
    }
    try {
      const admin = await getDoc(doc(db, 'admins', user.uid));
      if (!admin.exists() || admin.data().active !== true) {
        await signOut(auth);
        location.replace('../login/');
        return;
      }
      onReady(user);
    } catch (error) {
      onError(error);
    }
  });
}

export async function logoutAdmin() {
  await signOut(auth);
  location.replace('../login/');
}
