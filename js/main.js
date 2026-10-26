// 프로젝트 상세 데이터 — "More view"를 누르면 이 내용이 뷰어에 표시됩니다.
// media 배열에 이미지(.jpg/.png/.webp) 또는 영상(.mp4) 경로를 추가하세요.
const PROJECTS = {
  driver: {
    title: 'BLACK T 10.5 Driver',
    meta: '3D Modeling · Rendering · 2026',
    desc: '골프 드라이버 헤드의 형태와 소재감을 표현한 제품 비주얼라이제이션.',
    media: ['assets/images/driver.jpg', 'assets/images/closing.jpg'],
  },
  iron: {
    title: 'BLACK T T-1 Iron',
    meta: '3D Modeling · Rendering · 2026',
    desc: '두 가지 피니시의 T-1 아이언 제품 렌더링.',
    media: ['assets/images/iron.jpg'],
  },
  sunglasses: {
    title: 'B4 Series Sunglasses',
    meta: 'AI Image · Editing · 2026',
    desc: 'AI 기반 모델 화보와 제품 합성으로 제작한 선글라스 캠페인 비주얼.',
    media: ['assets/images/sunglasses.jpg'],
  },
};

// 스크롤 등장 애니메이션
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 프로젝트 뷰어
const viewer = document.querySelector('.viewer');
const gallery = viewer.querySelector('.viewer__gallery');

function openProject(key) {
  const p = PROJECTS[key];
  if (!p) return;
  viewer.querySelector('.viewer__title').textContent = p.title;
  viewer.querySelector('.viewer__meta').textContent = p.meta;
  viewer.querySelector('.viewer__desc').textContent = p.desc;
  gallery.replaceChildren(...p.media.map((src) => {
    const isVideo = /\.(mp4|webm)$/i.test(src);
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = src;
    if (isVideo) Object.assign(el, { controls: true, playsInline: true, loop: true, muted: true, autoplay: true });
    else { el.alt = p.title; el.loading = 'lazy'; }
    return el;
  }));
  viewer.showModal();
  viewer.scrollTop = 0;
}

document.querySelectorAll('.project').forEach((el) => {
  el.addEventListener('click', () => openProject(el.dataset.project));
});
viewer.querySelector('.viewer__close').addEventListener('click', () => viewer.close());
// 바깥(backdrop) 클릭 시 닫기
viewer.addEventListener('click', (e) => {
  const r = viewer.getBoundingClientRect();
  const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside) viewer.close();
});
viewer.addEventListener('close', () => gallery.querySelectorAll('video').forEach((v) => v.pause()));

document.getElementById('year').textContent = new Date().getFullYear();
