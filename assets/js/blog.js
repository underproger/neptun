/* =========================================================
   Neptun — сторінка блогу: фільтр статей за категорією
   Кожна картка має атрибут data-cat з назвою категорії.
   ========================================================= */
(function () {
  'use strict';

  const grid = document.getElementById('blGrid');
  const filters = document.querySelectorAll('.bf');
  if (!grid || !filters.length) return;

  const cards = grid.querySelectorAll('.bpost');

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('on'));
    btn.classList.add('on');

    const cat = btn.dataset.cat || 'all';
    cards.forEach(card => {
      card.hidden = cat !== 'all' && card.dataset.cat !== cat;
    });
  }));
})();
