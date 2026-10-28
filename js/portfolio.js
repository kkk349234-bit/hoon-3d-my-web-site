// [portfolio] 목록 — js/projects.js에 적힌 순서대로 게시물을 만듭니다. 클릭하면 상세페이지로 이동.
const pf = document.querySelector('.pf');
const list = pf.querySelector('.pf__grid');

list.append(...Object.entries(window.PROJECTS).map(([key, p], i) => {
  const li = document.createElement('li');
  li.innerHTML = `<a class="pf__card" href="project.html?p=${key}" style="--d:${i * 0.06}s; view-transition-name: pf-${key}">
      <div class="pf__thumb"><img src="${p.thumb || p.poster || p.cover}" alt="${p.title}" loading="lazy" /></div>
      <span class="pf__label">${p.label || p.title}</span>
    </a>`;
  return li;
}));

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
