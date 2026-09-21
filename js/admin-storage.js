import { storage } from './firebase-config.js';
import { getDownloadURL, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js';

export async function uploadMedia(treeId, file, kind) {
  const safeName = file.name.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-90) || 'file';
  const path = `trees/${treeId}/${kind}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, path);
  const contentType = kind === 'audio' ? 'audio/mpeg' : file.type;
  await uploadBytes(fileRef, file, { contentType });
  return { path, url: await getDownloadURL(fileRef) };
}
