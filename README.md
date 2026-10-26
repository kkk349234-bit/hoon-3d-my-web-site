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

## 이미지 교체
현재 이미지는 시안 스크린샷에서 잘라낸 **임시 저해상도 이미지**입니다.
같은 파일명으로 원본 렌더(가로 2400px 이상, JPG/WebP 권장)를 덮어쓰면 됩니다.
- 히어로: `assets/images/hero.jpg` (텍스트가 오른쪽에 올라가므로 왼쪽에 피사체 배치)
- 상세 갤러리: `js/main.js`의 `PROJECTS.*.media` 배열에 이미지·mp4 경로 추가
- 연락처: `index.html`의 `.contact` 링크 (이메일·Instagram·Behance)

## 로컬 미리보기
```
npx serve .     # 또는 python3 -m http.server
```

## 배포
**Vercel**: GitHub에 푸시 → vercel.com에서 Import Project → Framework "Other" → Deploy.
**GitHub Pages**: 레포 Settings → Pages → Source "Deploy from a branch" → `main` / `(root)`.
