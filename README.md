# 트리샘 - 입목죽(수목) 관리 및 스토리텔링 시스템

GitHub Pages + Firebase Authentication + Cloud Firestore + Cloud Storage 조합의 정적 웹앱입니다.

## 폴더 구조

```text
Forest/
├─ index.html                 # 공개 메인 화면
├─ login/index.html           # 관리자 로그인
├─ dashboard/index.html       # 관리자 CRUD/QR 대시보드
├─ tree/index.html            # 일반 사용자 QR 상세 페이지
├─ css/app.css                # 공통 반응형 스타일
├─ js/firebase-config.js      # Firebase 웹 앱 설정
├─ js/login.js                # 관리자 인증 및 권한 확인
├─ js/dashboard.js            # 수목 CRUD, Storage 업로드, QR 생성
├─ js/tree.js                 # 공개 수목 상세 조회 및 MP3 플레이어
├─ firestore.rules            # Firestore 보안 규칙
├─ storage.rules              # Storage 보안 규칙
└─ .github/workflows/pages.yml# GitHub Pages 자동 배포
```

## 1. Firebase 프로젝트 만들기

1. Firebase Console에서 프로젝트를 생성합니다.
2. 프로젝트 개요 > 앱 추가 > Web(`</>`)을 선택합니다.
3. 웹 앱 이름을 입력하고 등록한 뒤 표시되는 `firebaseConfig` 값을 복사합니다.
4. `js/firebase-config.js`의 placeholder 값을 실제 설정값으로 교체합니다.

> Firebase Web API Key는 클라이언트 앱 식별용 값이며 서버 비밀키처럼 숨기는 값이 아닙니다. 실제 보안은 Authentication + Security Rules로 강제합니다.

## 2. Authentication 설정

1. Firebase Console > Build > Authentication > Sign-in method로 이동합니다.
2. `Email/Password` 제공업체를 활성화합니다.
3. Authentication > Users에서 사용할 관리자 계정을 직접 추가합니다. 공개 회원가입 화면은 제공하지 않습니다.
4. Settings > Authorized domains에 `kwonoyoung.github.io`를 추가합니다.

## 3. Firestore 설정

1. Build > Firestore Database > Create database를 선택합니다.
2. 위치를 선택하고 Production mode로 생성합니다.
3. Rules 탭에 저장소 루트의 `firestore.rules` 내용을 붙여넣고 게시합니다.
4. `admins` 컬렉션을 만들고, 문서 ID를 관리자 사용자의 Firebase `UID`로 지정합니다.
5. 관리자 문서에 Boolean 필드 `active: true`를 추가합니다.

예시:

```text
admins/
  q1w2e3r4...  (Authentication 사용자의 UID)
    active: true
    name: "관리자"
```

`admins/{uid}`에 등록되지 않은 계정은 이메일/비밀번호를 알아도 관리자 CRUD를 사용할 수 없습니다.

## 4. Storage 설정

1. Build > Storage에서 버킷을 생성합니다.
2. Rules 탭에 `storage.rules` 내용을 붙여넣고 게시합니다.
3. Storage 규칙에서 Firestore 문서 조회를 처음 사용할 때 Firebase가 서비스 연결 권한 설정을 안내하면 승인합니다.

정책은 다음과 같습니다.
- 이미지/MP3 읽기: 공개(일반 사용자 QR 재생용)
- 업로드/교체/삭제: `admins/{uid}.active == true`인 관리자만 가능
- 이미지: 10MB 이하 `image/*`
- MP3: 30MB 이하 `audio/mpeg`

## 5. 데이터 구조

```text
trees/{treeId}
  treeId
  treeName
  assetNo
  species
  age
  location
  propertyType
  status
  storyText
  imageUrl
  imagePath
  audioUrl
  audioPath
  createdAt
  updatedAt
```

일반 공개 상세주소 예시:

```text
https://kwonoyoung.github.io/Forest/tree/?id=TREE-001
```

## 6. 사용 순서

1. `/Forest/login/`에서 관리자 로그인
2. `새 수목` 버튼으로 수목 등록
3. 이미지와 MP3 업로드
4. 저장 후 카드의 `QR/URL` 클릭
5. QR 코드를 출력하여 해당 나무에 부착
6. 학생·교직원·주민은 로그인 없이 QR 상세 페이지 열람

## 보안 주의

관리자 이메일이나 비밀번호를 JavaScript 소스에 하드코딩하지 않습니다. 계정 검증은 Firebase Authentication이 처리하고, 실제 쓰기 권한은 Firestore/Storage Security Rules에서 다시 검증합니다.
