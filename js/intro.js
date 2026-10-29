// 첫 접속 인트로 — 전체화면 이미지를 2초간 보여준 뒤 서서히 사라지며 메인 페이지가 나타납니다.
// 같은 브라우저 세션에서는 한 번만 표시 (다른 페이지에서 Home으로 돌아올 때는 생략). 클릭하면 바로 넘어갑니다.
(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.intro');
  if (!intro) return;
  if (!root.classList.contains('intro-on')) { intro.remove(); return; }

  const img = intro.querySelector('img');
  const HOLD = 2000; // 이미지가 보이는 시간
  const FADE = 900;  // 사라지는 시간 (CSS와 동일)
  let started = false;

  function hide() {
    if (intro.classList.contains('is-out')) return;
    intro.classList.add('is-out');
    try { sessionStorage.setItem('intro-seen', '1'); } catch {}
    setTimeout(() => { intro.remove(); root.classList.remove('intro-on'); }, FADE + 50);
  }
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(() => intro.classList.add('is-shown'));
    setTimeout(hide, HOLD);
  }

  if (img.complete && img.naturalWidth) start();
  else { img.addEventListener('load', start); img.addEventListener('error', hide); }
  setTimeout(hide, 5000); // 이미지가 늦게 오더라도 5초 안에는 메인으로
  intro.addEventListener('click', hide);
})();
