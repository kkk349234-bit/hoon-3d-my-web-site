# Kim Sang Hoon — 3D · AI Design Portfolio

순수 HTML/CSS/JS 정적 사이트입니다. 빌드 과정이 없습니다.

## 구조
```
index.html          페이지 마크업 (텍스트·섹션 수정)
css/style.css       스타일 (색상은 상단 :root 변수)
project.html        "More view" 상세 페이지 (project.html?p=driver | iron | sunglasses)
css/project.css     상세 페이지 스타일 (영상 플레이어 · 이미지 그리드 · 라이트박스)
js/projects.js      프로젝트별 데이터 — 영상 경로, 이미지 목록(순서대로 표시)
js/project.js       영상 플레이어 · 라이트박스 동작
assets/projects/    상세 페이지용 영상/이미지
assets/images/      hero / driver / iron / sunglasses / closing 이미지
assets/icons/       툴 아이콘
```

## 레이아웃
시안(본문 폭 602px) 기준 픽셀 값을 `calc(N * var(--u))`로 적어, 화면 폭이 달라도 비율이 그대로 유지됩니다.
데스크톱에서는 화면의 74.1%, 700px 이하에서는 전체 폭을 씁니다.

## 이미지 교체
`assets/images/`의 이미지는 원본 렌더입니다. 같은 파일명으로 덮어쓰면 교체됩니다.
툴 아이콘은 `assets/icons/`, 로고는 `assets/logo.png`(흰색, 투명 배경)입니다.
- 히어로: `assets/images/hero.webp` (텍스트가 오른쪽에 올라가므로 왼쪽에 피사체 배치)
- 상세 페이지: `assets/projects/<프로젝트>/`에 파일을 넣고 `js/projects.js`의
  `video`(mp4 경로)와 `images`(표시 순서대로) 배열을 수정
  · 썸네일은 자동으로 1:1(가로 중앙·세로 최상단 기준)로 잘려 보입니다
  · 원본을 WebP로 변환하고(긴 변 최대 2560px), 480px 정사각형 썸네일을 thumbs/에 만들어 넣습니다
- 연락처: `index.html`의 `.contact` 링크 (이메일·Instagram·Behance)

## 로컬 미리보기
```
npx serve .     # 또는 python3 -m http.server
```

## 배포
**Vercel**: GitHub에 푸시 → vercel.com에서 Import Project → Framework "Other" → Deploy.
**GitHub Pages**: 레포 Settings → Pages → Source "Deploy from a branch" → `main` / `(root)`.
