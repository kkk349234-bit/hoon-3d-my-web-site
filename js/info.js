// 자기소개: 접힌 높이는 사진 하단에 맞추고, ▼로 전체 펼치기. 마우스를 올리면 한국어로 전환.
const bio = document.querySelector('.bio');
const clip = bio.querySelector('.bio__clip');
const en = bio.querySelector('.bio__en');
const ko = bio.querySelector('.bio__ko');
const more = bio.querySelector('.bio__more');
const photo = document.querySelector('.about__photo');

function layout() {
  const c = clip.getBoundingClientRect();
  const p = photo.getBoundingClientRect();
  const sideBySide = p.right <= c.left;
  // 사진 옆이면 사진 하단까지, 사진 아래로 내려간 모바일 배치면 화면 높이의 45%
  const collapsed = Math.max(120, sideBySide ? Math.round(p.bottom - c.top) : Math.round(innerHeight * 0.45));
  const full = Math.max(en.scrollHeight, ko.scrollHeight);
  bio.style.setProperty('--bio-h', `${collapsed}px`);
  bio.style.setProperty('--bio-full', `${full}px`);
  bio.classList.toggle('no-more', full <= collapsed + 2);
}

more.addEventListener('click', () => {
  const open = bio.classList.toggle('is-open');
  more.setAttribute('aria-expanded', open);
  more.setAttribute('aria-label', open ? '본문 접기' : '본문 전체 보기');
});

// 마우스가 있는 기기: 올리면 한국어 / 터치 기기: 본문을 탭하면 전환
if (matchMedia('(hover: hover)').matches) {
  bio.addEventListener('mouseenter', () => bio.classList.add('is-ko'));
  bio.addEventListener('mouseleave', () => bio.classList.remove('is-ko'));
} else {
  clip.addEventListener('click', () => bio.classList.toggle('is-ko'));
}
// 키보드(Tab)로 포커스했을 때만 한국어로 (터치 탭과 겹치지 않게)
bio.addEventListener('focus', () => { if (bio.matches(':focus-visible')) bio.classList.add('is-ko'); });
bio.addEventListener('blur', () => bio.classList.remove('is-ko'));

addEventListener('resize', layout);
if (photo.complete) layout(); else photo.addEventListener('load', layout);
document.fonts?.ready.then(layout);
