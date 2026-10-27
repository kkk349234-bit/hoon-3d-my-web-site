const key = new URLSearchParams(location.search).get('p');
const project = window.PROJECTS[key] || window.PROJECTS.driver;
document.title = `${project.title} — Kim sang hoon`;

const fmt = (s) => {
  if (!isFinite(s)) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------------- Video player ---------------- */
const player = document.querySelector('.player');
const video = player.querySelector('video');
const fill = player.querySelector('.player__fill');
const buffer = player.querySelector('.player__buffer');
const thumb = player.querySelector('.player__thumb');
const progress = player.querySelector('.player__progress');
const volume = player.querySelector('.player__volume');
const volfill = player.querySelector('.player__volfill');
const tCur = player.querySelector('.t-cur');
const tDur = player.querySelector('.t-dur');

player.querySelector('.player__title').textContent = project.title;
video.poster = project.poster;
if (project.video) video.src = project.video;

const togglePlay = () => {
  if (!video.currentSrc) return;
  video.paused ? video.play() : video.pause();
};
const skip = (sec) => { video.currentTime = clamp(video.currentTime + sec, 0, video.duration || 0); };

function renderTime() {
  const d = video.duration || 0;
  const p = d ? video.currentTime / d : 0;
  fill.style.width = thumb.style.left = `${p * 100}%`;
  tCur.textContent = fmt(video.currentTime);
  tDur.textContent = fmt(d);
  if (d && video.buffered.length) buffer.style.width = `${(video.buffered.end(video.buffered.length - 1) / d) * 100}%`;
}
function renderVolume() {
  const v = video.muted ? 0 : video.volume;
  volfill.style.width = `${v * 100}%`;
  player.classList.toggle('is-muted', v === 0);
}

video.addEventListener('play', () => player.classList.remove('is-paused'));
video.addEventListener('pause', () => { player.classList.add('is-paused'); player.classList.remove('is-idle'); });
['timeupdate', 'loadedmetadata', 'durationchange', 'progress'].forEach((e) => video.addEventListener(e, renderTime));
video.addEventListener('volumechange', renderVolume);
video.addEventListener('click', togglePlay);
player.querySelector('.player__big').addEventListener('click', togglePlay);

player.querySelector('.player__controls').addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'play') togglePlay();
  if (act === 'back') skip(-5);
  if (act === 'fwd') skip(5);
  if (act === 'mute') {
    if (video.muted || video.volume === 0) { video.muted = false; if (video.volume === 0) video.volume = 1; }
    else video.muted = true;
  }
  if (act === 'full') {
    document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen?.();
  }
});

// 드래그 가능한 슬라이더 (재생바 · 볼륨)
function dragSlider(el, onRatio) {
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const r = el.getBoundingClientRect();
      onRatio(clamp((ev.clientX - r.left) / r.width, 0, 1));
    };
    move(e);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', () => el.removeEventListener('pointermove', move), { once: true });
  });
}
dragSlider(progress, (p) => { if (video.duration) { video.currentTime = p * video.duration; renderTime(); } });
dragSlider(volume, (p) => { video.volume = p; video.muted = p === 0; });

// 재생 중 마우스가 멈추면 컨트롤 숨김
let idleTimer;
player.addEventListener('pointermove', () => {
  player.classList.remove('is-idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!video.paused) player.classList.add('is-idle'); }, 2500);
});
player.addEventListener('pointerleave', () => { if (!video.paused) player.classList.add('is-idle'); });

renderTime();
renderVolume();

/* ---------------- Image grid ---------------- */
const grid = document.querySelector('.grid');
grid.append(...project.images.map((src, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" aria-label="이미지 ${i + 1} 크게 보기"><img src="${src}" alt="" loading="lazy" /></button>`;
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
  li.innerHTML = `<button type="button" aria-label="이미지 ${i + 1}"><img src="${src}" alt="" loading="lazy" /></button>`;
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
  if (!video.paused) video.pause();
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
