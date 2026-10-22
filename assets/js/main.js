/* =========================================================
   Neptun — спільні скрипти для всіх сторінок
   - мобільне меню (бургер) + вкладені розділи
   - мега-меню (desktop), тінь шапки при скролі
   - меню розділу на сторінках docs (згортається на мобільному)
   - слайдери: стрілки, drag мишею, точки-пагінація
   - форми заявок (валідація)
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
    burger.setAttribute('aria-expanded', 'false');
    mmenu.classList.remove('on');
  }

  if (burger && mmenu) {
    burger.addEventListener('click', () => {
      const open = !mmenu.classList.contains('on');
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', String(open));
      mmenu.classList.toggle('on', open);
    });
    mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  }

  /* вкладені розділи мобільного меню (акордеон) */
  document.querySelectorAll('.msec-h').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.parentElement;
      const wasOpen = sec.classList.contains('on');
      document.querySelectorAll('.msec').forEach(x => {
        x.classList.remove('on');
        x.querySelector('.msec-h')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        sec.classList.add('on');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- тінь шапки при скролі ---------- */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- меню розділу (docs): згорнуте на мобільному, відкрите з 700px ---------- */
  const docNav = document.querySelector('[data-docnav]');
  if (docNav) {
    const mq = matchMedia('(min-width:700px)');
    const sync = () => { docNav.open = mq.matches; };
    sync();
    mq.addEventListener('change', sync);
  }

  /* ---------- мега-меню (desktop) ---------- */
  const mega = document.getElementById('mega');
  const hdr = document.getElementById('hdr');
  const trigs = [...document.querySelectorAll('.ntrig')];
  const DESKTOP = 1100; // з цієї ширини показується повна навігація (див. layout.css)

  function closeMega() {
    if (!mega) return;
    mega.classList.remove('on');
    trigs.forEach(t => { t.classList.remove('on'); t.setAttribute('aria-expanded', 'false'); });
  }
  function openMega(t) {
    closeMega();
    t.classList.add('on');
    t.setAttribute('aria-expanded', 'true');
    mega.classList.add('on');
  }

  if (mega && hdr) {
    trigs.forEach(t => {
      t.addEventListener('click', e => {
        e.stopPropagation();
        if (t.classList.contains('on')) closeMega();
        else openMega(t);
      });
      t.addEventListener('mouseenter', () => {
        if (window.innerWidth >= DESKTOP) openMega(t);
      });
    });
    hdr.addEventListener('mouseleave', () => { if (window.innerWidth >= DESKTOP) closeMega(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMega(); });
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
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max;
      if (left) left.disabled = atStart;
      if (right) right.disabled = atEnd;
      wrap.classList.toggle('at-start', atStart);
      wrap.classList.toggle('at-end', atEnd);
    }
    btns.forEach(b => b.addEventListener('click', () => {
      track.scrollBy({ left: cardStep() * parseInt(b.dataset.dir, 10), behavior: 'smooth' });
    }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
    window.addEventListener('load', updateArrows);

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

  /* ---------- точки-пагінація для слайдерів з data-d="id контейнера точок" ---------- */
  document.querySelectorAll('[data-d]').forEach(tr => {
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

  /* ---------- форми заявок ----------
     Поки що лише валідація. Відправка підключається на етапі WordPress
     (Contact Form 7 / admin-ajax): дані форми приходять у події «neptun:lead». */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.dispatchEvent(new CustomEvent('neptun:lead', {
        bubbles: true,
        detail: Object.fromEntries(new FormData(form)),
      }));
    });
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
