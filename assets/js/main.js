/* =========================================================
   Neptun — спільні скрипти для всіх сторінок
   - мобільне меню (бургер) + вкладені розділи
   - мега-меню (desktop)
   - слайдери: стрілки, drag мишею, точки-пагінація
   - сегментні перемикачі (.bs)
   - липка кнопка CTA (mobile, тільки головна)
   - декоративні бульбашки
   ========================================================= */
(function () {
  'use strict';

  /* ---------- мобільне меню ---------- */
  const burger = document.getElementById('bg');
  const mmenu = document.getElementById('mm');

  function closeMobileMenu() {
    if (!burger || !mmenu) return;
    burger.classList.remove('on');
    mmenu.classList.remove('on');
  }

  if (burger && mmenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('on');
      mmenu.classList.toggle('on');
    });
    mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  }

  /* вкладені розділи мобільного меню (акордеон) */
  document.querySelectorAll('.msec-h').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.parentElement;
      const wasOpen = sec.classList.contains('on');
      document.querySelectorAll('.msec').forEach(x => x.classList.remove('on'));
      if (!wasOpen) sec.classList.add('on');
    });
  });

  /* ---------- мега-меню (desktop) ---------- */
  const mega = document.getElementById('mega');
  const hdr = document.getElementById('hdr');
  const trigs = [...document.querySelectorAll('.ntrig')];

  function closeMega() {
    if (!mega) return;
    mega.classList.remove('on');
    trigs.forEach(t => t.classList.remove('on'));
  }

  if (mega && hdr) {
    trigs.forEach(t => {
      t.addEventListener('click', e => {
        e.stopPropagation();
        const open = t.classList.contains('on');
        closeMega();
        if (!open) { t.classList.add('on'); mega.classList.add('on'); }
      });
      t.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1000) { closeMega(); t.classList.add('on'); mega.classList.add('on'); }
      });
    });
    hdr.addEventListener('mouseleave', () => { if (window.innerWidth >= 1000) closeMega(); });
    document.addEventListener('click', e => { if (!mega.contains(e.target)) closeMega(); });
    addEventListener('scroll', closeMega, { passive: true });
  }

  /* ---------- слайдери: стрілки + drag мишею ---------- */
  document.querySelectorAll('.swipe-wrap').forEach(wrap => {
    const track = wrap.querySelector('.swipe, .egrid');
    if (!track) return;
    const btns = wrap.querySelectorAll('.sw-arrow');
    const left = wrap.querySelector('.sw-arrow.left');
    const right = wrap.querySelector('.sw-arrow.right');

    function cardStep() {
      const first = track.children[0];
      if (!first) return 300;
      const style = getComputedStyle(track);
      return first.getBoundingClientRect().width + parseFloat(style.gap || 14);
    }
    function updateArrows() {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (left) left.disabled = track.scrollLeft <= 2;
      if (right) right.disabled = track.scrollLeft >= max;
    }
    btns.forEach(b => b.addEventListener('click', () => {
      track.scrollBy({ left: cardStep() * parseInt(b.dataset.dir, 10), behavior: 'smooth' });
    }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 300);

    let dragging = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      dragging = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    track.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false; track.classList.remove('dragging');
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointerleave', endDrag);
    track.addEventListener('click', e => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  });

  /* ---------- точки-пагінація для .swipe[data-d] ---------- */
  document.querySelectorAll('.swipe[data-d]').forEach(tr => {
    const box = document.getElementById(tr.dataset.d);
    if (!box) return;
    const n = tr.children.length;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('span');
      d.className = 'dot' + (i ? '' : ' on');
      box.appendChild(d);
    }
    let t;
    tr.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const i = Math.min(Math.round(tr.scrollLeft / (tr.scrollWidth / n)), n - 1);
        box.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('on', j === i));
      }, 60);
    }, { passive: true });
  });

  /* ---------- сегментні перемикачі (Telegram / WhatsApp / Дзвінок) ---------- */
  document.querySelectorAll('.bl-seg').forEach(group => {
    const items = group.querySelectorAll('.bs');
    items.forEach(b => b.addEventListener('click', () => {
      items.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    }));
  });

  /* ---------- липка CTA-кнопка (mobile) ---------- */
  const sticky = document.getElementById('st');
  const form = document.getElementById('form');
  if (sticky && form) {
    addEventListener('scroll', () => {
      sticky.classList.toggle('on', scrollY > 700 && form.getBoundingClientRect().top > innerHeight);
    }, { passive: true });
  }

  /* ---------- декоративні бульбашки: <div class="bubs" data-bubbles="12"> ---------- */
  document.querySelectorAll('.bubs[data-bubbles]').forEach(c => {
    const n = parseInt(c.dataset.bubbles, 10) || 0;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('div');
      b.className = 'bub';
      const s = 5 + Math.random() * 14;
      b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;bottom:-26px;` +
        `animation-duration:${10 + Math.random() * 9}s;animation-delay:${Math.random() * 10}s`;
      c.appendChild(b);
    }
  });
})();
