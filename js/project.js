const key = new URLSearchParams(location.search).get('p');
const project = window.PROJECTS[key] || window.PROJECTS.driver;
document.title = `${project.title} — Kim sang hoon`;

/* ---------------- Video player (영상 상세페이지) ---------------- */
const player = document.querySelector('.player');
const video = project.cover ? null : player.querySelector('video');

/* ---------------- Cover image (이미지 상세페이지) ---------------- */
if (project.cover) {
  const cover = document.querySelector('.cover');
  const coverImg = cover.querySelector('img');
  document.querySelector('.detail').classList.add('detail--image');
  player.remove();
  coverImg.src = project.cover;
  coverImg.alt = project.title;
  cover.hidden = false;
  watchHeaderTone(coverImg);
} else {
  document.querySelector('.cover').remove();
  initPlayer(player, { title: project.title, poster: project.poster, src: project.video });
}

/* ---------------- Image grid ---------------- */
// 목록·툴바용 썸네일 (thumbs/ 폴더, 480px 정사각형)
const thumbOf = (src) => (project.thumbs ? src.replace(/([^/]+)$/, 'thumbs/$1') : src);
const grid = document.querySelector('.grid');
grid.append(...project.images.map((src, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" aria-label="이미지 ${i + 1} 크게 보기"><img src="${thumbOf(src)}" alt="" loading="lazy" /></button>`;
  li.firstChild.addEventListener('click', () => openLightbox(i));
  return li;
}));

/* ---------------- Lightbox ---------------- */
const lb = document.querySelector('.lb');
const stage = lb.querySelector('.lb__stage');
const holder = lb.querySelector('.lb__holder');
const lbImg = lb.querySelector('.lb__img');
const strip = lb.querySelector('.lb__strip');
let current = -1;

strip.append(...project.images.map((src, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" aria-label="이미지 ${i + 1}"><img src="${thumbOf(src)}" alt="" loading="lazy" /></button>`;
  li.firstChild.addEventListener('click', () => show(i));
  return li;
}));

// 본문 폭 안에서 비율 유지(contain). 세로로 아주 긴 이미지는 최소 폭을 지키고 스크롤.
const MIN_WIDTH_RATIO = 513 / 1401;
function fitImage() {
  if (!lbImg.naturalWidth) return;
  const colW = holder.clientWidth;
  const cs = getComputedStyle(holder);
  const availH = innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const ratio = lbImg.naturalWidth / lbImg.naturalHeight;
  const contain = Math.min(colW, availH * ratio);
  lbImg.style.width = `${Math.min(colW, Math.max(contain, colW * MIN_WIDTH_RATIO))}px`;
}

function show(i) {
  const n = project.images.length;
  current = (i + n) % n;
  lbImg.style.width = '0px';
  lbImg.src = project.images[current];
  if (lbImg.complete) fitImage();
  stage.scrollTop = 0;
  strip.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-current', j === current));
  strip.children[current].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}
lbImg.addEventListener('load', fitImage);
addEventListener('resize', () => { if (!lb.hidden) fitImage(); });

function openLightbox(i) {
  lb.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  if (video && !video.paused) video.pause();
  show(i);
}
function closeLightbox() {
  lb.hidden = true;
  document.documentElement.style.overflow = '';
}

lb.querySelector('.lb__arrow--prev').addEventListener('click', () => show(current - 1));
lb.querySelector('.lb__arrow--next').addEventListener('click', () => show(current + 1));
// 이미지 바깥(배경) 클릭 시 닫기
stage.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
// 툴바 위에서 휠을 굴리면 썸네일 목록을 가로로 스크롤
strip.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { strip.scrollLeft += e.deltaY; e.preventDefault(); }
}, { passive: false });

addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'ArrowLeft') { show(current - 1); e.preventDefault(); }
  if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
  if (e.key === 'Escape') closeLightbox();
});
