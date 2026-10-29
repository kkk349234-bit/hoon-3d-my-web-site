// 공용 영상 플레이어 — 재생/일시정지, 5초 앞·뒤, 소리·볼륨, 재생바, 시간, 전체화면.
// initPlayer(.player 요소)를 호출하면 그 안의 <video>에 컨트롤이 연결됩니다.
const fmt = (s) => {
  if (!isFinite(s)) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function initPlayer(player, { title = '', poster = '', src = '' } = {}) {
  const video = player.querySelector('video');
  player.querySelector('.player__title').textContent = title;
  video.poster = poster;
  if (src) video.src = src;
  const fill = player.querySelector('.player__fill');
  const buffer = player.querySelector('.player__buffer');
  const thumb = player.querySelector('.player__thumb');
  const progress = player.querySelector('.player__progress');
  const volume = player.querySelector('.player__volume');
  const volfill = player.querySelector('.player__volfill');
  const tCur = player.querySelector('.t-cur');
  const tDur = player.querySelector('.t-dur');


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
}
