import { auth, db, FIREBASE_CONFIGURED } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js';

const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submitButton = document.getElementById('submitButton');
const notice = document.getElementById('notice');

function show(message, type='error') {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
}

async function isActiveAdmin(user) {
  const adminSnap = await getDoc(doc(db, 'admins', user.uid));
  return adminSnap.exists() && adminSnap.data().active === true;
}

if (!FIREBASE_CONFIGURED) {
  show('Firebase 설정이 아직 입력되지 않았습니다. js/firebase-config.js에 Firebase 웹 앱 설정값을 입력해 주세요.', 'info');
  submitButton.disabled = true;
} else {
  onAuthStateChanged(auth, async user => {
    if (!user) return;
    try {
      if (await isActiveAdmin(user)) location.replace('../dashboard/');
      else await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!FIREBASE_CONFIGURED) return;
  submitButton.disabled = true;
  show('로그인 확인 중입니다.', 'info');
  try {
    const credential = await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    if (!(await isActiveAdmin(credential.user))) {
      await signOut(auth);
      throw new Error('관리자 권한이 등록되지 않은 계정입니다.');
    }
    location.replace('../dashboard/');
  } catch (error) {
    const message = error?.code === 'auth/invalid-credential'
      ? '아이디(이메일) 또는 비밀번호가 올바르지 않습니다.'
      : (error?.message || '로그인에 실패했습니다.');
    show(message, 'error');
  } finally {
    submitButton.disabled = false;
  }
});
