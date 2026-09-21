import { db } from './firebase-config.js';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js';

export async function listTrees() {
  const snapshot = await getDocs(collection(db, 'trees'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function treeExists(id) {
  return (await getDoc(doc(db, 'trees', id))).exists();
}

export async function writeTree(id, data, createdAt) {
  await setDoc(doc(db, 'trees', id), {
    treeId: id,
    ...data,
    createdAt: createdAt || serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function removeTree(id) {
  await deleteDoc(doc(db, 'trees', id));
}
