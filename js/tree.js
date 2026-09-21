import { db, FIREBASE_CONFIGURED } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js';

const root = document.getElementById('treeContent');
const params = new URLSearchParams(location.search);
const treeId = params.get('id')?.trim();

function esc(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function fallback(value) { return value ? esc(value) : '-'; }
function error(message) { root.innerHTML = `<div class="error-box">${esc(message)}</div>`; }

async function loadTree() {
  if (!FIREBASE_CONFIGURED) return error('Firebase 연결 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.');
  if (!treeId) return error('수목 ID가 없는 주소입니다. QR 코드를 다시 확인해 주세요.');
  try {
    const snap = await getDoc(doc(db, 'trees', treeId));
    if (!snap.exists()) return error('등록되지 않았거나 삭제된 수목입니다.');
    const t = snap.data();
    document.title = `${t.treeName || '수목'} | 트리샘`;
    const image = t.imageUrl
      ? `<img class="tree-hero-img" src="${esc(t.imageUrl)}" alt="${esc(t.treeName || '수목')} 이미지">`
      : `<div class="tree-hero-img" style="display:grid;place-items:center;font-size:70px;color:#789086">🌳</div>`;
    const audio = t.audioUrl
      ? `<div class="audio-box"><strong>🎧 나무 이야기 듣기</strong><audio controls preload="metadata" src="${esc(t.audioUrl)}">이 브라우저는 오디오 재생을 지원하지 않습니다.</audio></div>`
      : '';
    root.innerHTML = `
      ${image}
      <h1 class="tree-title">${fallback(t.treeName)}</h1>
      <p class="tree-sub">수목 고유 ID · ${esc(treeId)}</p>
      <section class="info-grid" aria-label="수목 재산 정보">
        <div class="info-item"><span>대장번호</span><b>${fallback(t.assetNo)}</b></div>
        <div class="info-item"><span>수종</span><b>${fallback(t.species)}</b></div>
        <div class="info-item"><span>수령</span><b>${fallback(t.age)}</b></div>
        <div class="info-item"><span>위치</span><b>${fallback(t.location)}</b></div>
        <div class="info-item"><span>재산구분</span><b>${fallback(t.propertyType)}</b></div>
        <div class="info-item"><span>관리상태</span><b>${fallback(t.status)}</b></div>
      </section>
      <section class="story-box"><h2>이 나무의 이야기</h2><p>${fallback(t.storyText)}</p></section>
      ${audio}
    `;
  } catch (e) {
    console.error(e);
    error('수목 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}
loadTree();
