// [portfolio] 목록 — js/projects.js에 적힌 순서대로 게시물을 만듭니다. 클릭하면 상세페이지로 이동.
const list = document.querySelector('.pf__grid');
list.append(...Object.entries(window.PROJECTS).map(([key, p]) => {
  const li = document.createElement('li');
  li.innerHTML = `<a class="pf__card" href="project.html?p=${key}">
      <div class="pf__thumb"><img src="${p.thumb || p.poster || p.cover}" alt="${p.title}" loading="lazy" /></div>
      <span class="pf__label">${p.label || p.title}</span>
    </a>`;
  return li;
}));
