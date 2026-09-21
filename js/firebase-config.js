import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js';

// Firebase Console > 프로젝트 설정 > 내 앱 > SDK 설정 및 구성에서 값을 복사해 교체하세요.
export const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

export const FIREBASE_CONFIGURED = !Object.values(firebaseConfig).some(
  value => typeof value === 'string' && (value.includes('YOUR_') || value.includes('PASTE_'))
);

export const app = FIREBASE_CONFIGURED ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
