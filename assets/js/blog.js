/* =========================================================
   Neptun — сторінка блогу
   - фільтр статей за категорією (data-cat на картці та кнопці)
   - «Показати більше»: спершу показуємо PAGE карток
   ========================================================= */
(function () {
  'use strict';

  const grid = document.getElementById('blGrid');
  if (!grid) return;

  const PAGE = 6;
  const cards = [...grid.querySelectorAll('.bpost')];
  const filters = document.querySelectorAll('.bf');
  const more = document.getElementById('blMore');

  let cat = 'all';
  let limit = PAGE;

  function render() {
    const matched = cards.filter(c => cat === 'all' || c.dataset.cat === cat);
    cards.forEach(c => { c.hidden = true; });
    matched.slice(0, limit).forEach(c => { c.hidden = false; });
    if (more) more.parentElement.hidden = matched.length <= limit;
  }

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(x => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('on');
    btn.setAttribute('aria-pressed', 'true');
    cat = btn.dataset.cat || 'all';
    limit = PAGE;
    render();
  }));

  if (more) more.addEventListener('click', () => {
    limit += PAGE;
    render();
  });

  render();
})();
