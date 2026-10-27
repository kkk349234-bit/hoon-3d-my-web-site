# Kim Sang Hoon — 3D · AI Design Portfolio

순수 HTML/CSS/JS 정적 사이트입니다. 빌드 과정이 없습니다.

## 구조
```
index.html          페이지 마크업 (텍스트·섹션 수정)
css/style.css       스타일 (색상은 상단 :root 변수)
js/main.js          "More view" 상세 데이터(PROJECTS) + 애니메이션
assets/images/      hero / driver / iron / sunglasses / closing 이미지
assets/icons/       툴 아이콘
```

## 레이아웃
시안(본문 폭 602px) 기준 픽셀 값을 `calc(N * var(--u))`로 적어, 화면 폭이 달라도 비율이 그대로 유지됩니다.
데스크톱에서는 화면의 74.1%(최대 1000px), 700px 이하에서는 전체 폭을 씁니다.

## 이미지 교체
`assets/images/`의 이미지는 원본 렌더입니다. 같은 파일명으로 덮어쓰면 교체됩니다.
툴 아이콘은 `assets/icons/`, 로고는 `assets/logo.png`(흰색, 투명 배경)입니다.
- 히어로: `assets/images/hero.webp` (텍스트가 오른쪽에 올라가므로 왼쪽에 피사체 배치)
- 상세 갤러리: `js/main.js`의 `PROJECTS.*.media` 배열에 이미지·mp4 경로 추가
- 연락처: `index.html`의 `.contact` 링크 (이메일·Instagram·Behance)

## 로컬 미리보기
```
npx serve .     # 또는 python3 -m http.server
```

## 배포
**Vercel**: GitHub에 푸시 → vercel.com에서 Import Project → Framework "Other" → Deploy.
**GitHub Pages**: 레포 Settings → Pages → Source "Deploy from a branch" → `main` / `(root)`.
