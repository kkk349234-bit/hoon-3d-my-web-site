// 이미지·영상 다운로드 억제 — 우클릭 메뉴(이미지/동영상 저장)와 드래그 저장을 막습니다.
// 클릭·재생·확대(라이트박스) 등 일반 동작에는 영향을 주지 않습니다.
// 브라우저 개발자 도구 등을 통한 추출까지 막을 수는 없습니다.
(() => {
  const MEDIA = 'img, video, picture, canvas, .player, .lb__stage';
  const isMedia = (el) => el instanceof Element && el.closest(MEDIA);

  document.addEventListener('contextmenu', (e) => { if (isMedia(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', (e) => { if (isMedia(e.target)) e.preventDefault(); });

  // 동적으로 추가되는 이미지·영상까지 드래그 비활성화
  const lock = (root) => {
    root.querySelectorAll?.('img, video').forEach((el) => {
      el.draggable = false;
      if (el.tagName === 'VIDEO') {
        el.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
        el.disablePictureInPicture = true;
        el.disableRemotePlayback = true;
      }
    });
  };
  lock(document);
  new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType === 1) { lock(n.parentNode || n); }
  }))).observe(document.documentElement, { childList: true, subtree: true });
})();
