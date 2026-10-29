// [video] 페이지 — 2열 목록, 마우스를 올리면 그 자리에서 미리보기 재생, 클릭하면 화면 중앙에서 재생.
const grid = document.querySelector('.vd__grid');
const canHover = matchMedia('(hover: hover)').matches;

grid.append(...window.VIDEOS.map((v, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button class="vd__card" type="button" style="--d:${i * 0.05}s">
      <div class="vd__thumb"><img src="${v.thumb}" alt="" loading="lazy" /></div>
      <span class="vd__label">${v.title}</span>
    </button>`;
  const card = li.firstElementChild;
  if (canHover) attachHover(card, v.preview);
  card.addEventListener('click', () => openVideo(v));
  return li;
}));

// 마우스를 올리면 자동재생, 치우면 처음 썸네일 화면으로 초기화
function attachHover(card, src) {
  let clip;
  card.addEventListener('mouseenter', () => {
    if (!clip) {
      clip = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'none', src });
      clip.addEventListener('playing', () => { if (card.matches(':hover')) card.classList.add('is-playing'); });
      card.querySelector('.vd__thumb').append(clip);
    }
    clip.currentTime = 0;
    clip.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    if (!clip) return;
    clip.pause();
    clip.currentTime = 0;
    card.classList.remove('is-playing');
  });
}

/* ---------------- 재생 화면 ---------------- */
const vm = document.querySelector('.vm');
const box = vm.querySelector('.vm__box');
const player = vm.querySelector('.player');
const video = player.querySelector('video');
initPlayer(player);

function openVideo(v) {
  grid.querySelectorAll('.vd__thumb video').forEach((c) => c.pause());
  player.querySelector('.player__title').textContent = v.title;
  video.poster = v.thumb;
  video.src = v.video;
  vm.hidden = false;
  document.documentElement.classList.add('vm-open');
  video.play().catch(() => {});
}
function closeVideo() {
  video.pause();
  video.removeAttribute('src');
  video.load();
  vm.hidden = true;
  document.documentElement.classList.remove('vm-open');
}
// 영상 바깥을 클릭하거나 Esc를 누르면 닫기
vm.addEventListener('click', (e) => { if (!box.contains(e.target)) closeVideo(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !vm.hidden && !document.fullscreenElement) closeVideo(); });
