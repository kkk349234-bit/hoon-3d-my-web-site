// [portfolio] 목록 — js/projects.js에 적힌 순서대로 게시물을 만듭니다. 클릭하면 상세페이지로 이동.
const pf = document.querySelector('.pf');
const list = pf.querySelector('.pf__grid');
const entries = Object.entries(window.PROJECTS);
const canHover = matchMedia('(hover: hover)').matches;

pf.querySelector('.pf__count').textContent = `${entries.length} PROJECTS`;

list.append(...entries.map(([key, p], i) => {
  const li = document.createElement('li');
  const type = p.video ? 'VIDEO' : 'IMAGE';
  li.innerHTML = `<a class="pf__card" href="project.html?p=${key}" style="--d:${i * 0.06}s; view-transition-name: pf-${key}">
      <div class="pf__thumb">
        <img src="${p.thumb || p.poster || p.cover}" alt="${p.title}" loading="lazy" />
        ${p.video ? '<span class="pf__badge" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M2 1v8l7-4z" /></svg></span>' : ''}
      </div>
      <div class="pf__info">
        <span class="pf__label">${p.label || p.title}</span>
        <span class="pf__meta">${type} · ${p.images.length}</span>
      </div>
    </a>`;
  if (p.video && canHover) attachPreview(li.firstElementChild, p.video);
  return li;
}));

// 영상 게시물: 마우스를 올리면 썸네일 자리에서 소리 없이 미리보기 재생
function attachPreview(card, src) {
  let video;
  card.addEventListener('mouseenter', () => {
    if (!video) {
      video = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'none', src });
      video.addEventListener('playing', () => card.classList.add('is-previewing'));
      card.querySelector('.pf__thumb').append(video);
    }
    video.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    if (!video) return;
    video.pause();
    card.classList.remove('is-previewing');
  });
}

// 2 / 3 / 4열 보기 전환 (선택은 다음 방문 때도 유지)
const buttons = pf.querySelectorAll('.pf__view button');
function setCols(n, animate) {
  const apply = () => {
    pf.dataset.cols = n;
    buttons.forEach((b) => b.setAttribute('aria-pressed', b.dataset.cols === String(n)));
  };
  if (animate && document.startViewTransition) document.startViewTransition(apply);
  else apply();
  try { localStorage.setItem('pf-cols', n); } catch {}
}
buttons.forEach((b) => b.addEventListener('click', () => setCols(b.dataset.cols, true)));
let saved = null;
try { saved = localStorage.getItem('pf-cols'); } catch {}
setCols(['2', '3', '4'].includes(saved) ? saved : '3', false);
