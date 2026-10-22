/* =========================================================
   Neptun — скрипти головної сторінки
   - таби «Оберіть свій тип бізнесу»
   - акордеони «5 кроків» та FAQ
   - live-дашборд (SVG, тільки desktop)
   - векторні іконки в картках відгуків
   ========================================================= */
(function () {
  'use strict';

  /* ---------- таби типів бізнесу ---------- */
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('on'));
    t.classList.add('on');
    const pane = document.getElementById('p-' + t.dataset.t);
    if (pane) pane.classList.add('on');
    t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }));

  /* ---------- акордеони (кроки + FAQ): відкритий завжди один ---------- */
  function accordion(triggerSel, itemSel) {
    document.querySelectorAll(triggerSel).forEach(btn => btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('on');
      document.querySelectorAll(itemSel).forEach(x => x.classList.remove('on'));
      if (!wasOpen) item.classList.add('on');
    }));
  }
  accordion('.step-h', '.step');
  accordion('.fq', '.fitem');

  /* ---- live dashboard (SVG charts, no screenshot) ---- */
  function sparkPath(vals,w,hgt,min,max){
    const span=(max-min)||1;
    return vals.map((v,i)=>{
      const x=(i/(vals.length-1))*w;
      const y=hgt-((v-min)/span)*hgt*0.86-hgt*0.05;
      return (i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);
    }).join(' ');
  }
  function dashHTML(){
    const days=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
    const ok=[12,15,13,17,15,20,23,30];
    const all=[7,9,8,11,10,13,15,21];
    const W=460,H=110;
    const lo=Math.min(...ok,...all), hi=Math.max(...ok,...all);
    const okPath=sparkPath(ok,W,H,lo,hi), allPath=sparkPath(all,W,H,lo,hi);
    const donut = (()=>{
      const seg=[['#ef8a1e',34],['#1b5a52',40],['#2a8f7e',16],['#a9c9c3',10]];
      let acc=0, r=30, c=2*Math.PI*r, out='';
      seg.forEach(([col,pct])=>{
        const len=c*pct/100;
        out+=`<circle cx="40" cy="40" r="${r}" fill="none" stroke="${col}" stroke-width="12"
          stroke-dasharray="${len} ${c-len}" stroke-dashoffset="${-acc}" transform="rotate(-90 40 40)"/>`;
        acc+=len;
      });
      return out;
    })();
    const calls = [
      ['+380 93 123 45 67','04:18','Успішний','ok'],
      ['+380 67 765 43 21','02:37','Успішний','ok'],
      ['+48 22 345 67 89','01:53','Пропущений','miss'],
      ['+44 20 8123 4567','03:12','Успішний','ok'],
    ];
    const eff = [['Олександр Ш.',92],['Марія І.',78],['Дмитро С.',65],['Ірина Л.',85]];

    return `
      <div class="ld-head">
        <div class="ld-avatar">О</div>
        <div><h5>Вітаємо, Олександре!</h5><p>Все, що відбувається у вашому акаунті сьогодні</p></div>
        <div class="ld-day">Поточний день &#9662;</div>
      </div>
      <div class="ld-kpis">
        <div class="ld-kpi"><div class="lab">Успішні дзвінки</div><div class="val">12 560</div><div class="chg">&#8593; 24%</div></div>
        <div class="ld-kpi"><div class="lab">Конверсія</div><div class="val">24,7%</div><div class="chg">&#8593; 18%</div></div>
        <div class="ld-kpi"><div class="lab">Сер. час розмови</div><div class="val">04:32</div><div class="chg">&#8593; 12%</div></div>
        <div class="ld-kpi"><div class="lab">Витрачено коштів</div><div class="val">$1248</div><div class="chg down">&#8595; 8%</div></div>
      </div>
      <div class="ld-row">
        <div class="ld-card">
          <h6>Динаміка дзвінків</h6>
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" height="90">
            <path d="${okPath}" fill="none" stroke="#1b5a52" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="${allPath}" fill="none" stroke="#ef8a1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="ld-days">${days.map(d=>'<span>'+d+'</span>').join('')}</div>
          <div class="ld-legend">
            <span><i style="background:#1b5a52"></i>Успішні дзвінки</span>
            <span><i style="background:#ef8a1e"></i>Всі дзвінки</span>
          </div>
        </div>
        <div class="ld-card">
          <h6>Джерела дзвінків</h6>
          <div class="ld-donut-wrap">
            <svg viewBox="0 0 80 80" width="80" height="80">${donut}</svg>
            <div class="ld-legend2">
              <span><i style="background:#ef8a1e"></i>Реклама</span>
              <span><i style="background:#1b5a52"></i>Сайт</span>
              <span><i style="background:#2a8f7e"></i>Партнери</span>
              <span><i style="background:#a9c9c3"></i>Інше</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ld-row">
        <div class="ld-card ld-calls">
          <h6>Останні дзвінки</h6>
          ${calls.map(c=>`<div><span class="num">${c[0]}</span><span class="time">${c[1]}</span><span class="st ${c[3]}">${c[2]}</span></div>`).join('')}
        </div>
        <div class="ld-card ld-eff">
          <h6>Ефективність менеджерів</h6>
          ${eff.map(e=>`<div><span class="nm">${e[0]}</span><span class="bar"><i style="width:${e[1]}%"></i></span><span class="pc">${e[1]}%</span></div>`).join('')}
        </div>
      </div>
    `;
  }
  document.querySelectorAll('.livedash').forEach(el=>{ el.innerHTML = dashHTML(); });


  /* ---- testimonial vector icons (drawn, not raster) ---- */
  const SEA_ICONS = {
    fish: `<svg viewBox="0 0 32 32" fill="none"><path d="M4 16c4-6 12-9 19-6 3 1.3 5 3.4 5 6s-2 4.7-5 6c-7 3-15 0-19-6z" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><path d="M23 12l5-3v14l-5-3" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="14.5" r="1.1" fill="#ef8a1e"/><path d="M8 19c2 1 5 1.4 8 1" stroke="#ef8a1e" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    fish2: `<svg viewBox="0 0 32 32" fill="none"><path d="M28 16c-4-6-12-9-19-6-3 1.3-5 3.4-5 6s2 4.7 5 6c7 3 15 0 19-6z" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l-5-3v14l5-3" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><circle cx="22" cy="14.5" r="1.1" fill="#ef8a1e"/><path d="M24 19c-2 1-5 1.4-8 1" stroke="#ef8a1e" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    jelly: `<svg viewBox="0 0 32 32" fill="none"><path d="M7 15a9 9 0 0 1 18 0c0 2.4-1 3.6-2 4.4H9c-1-.8-2-2-2-4.4z" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 20c0 3-1.4 3.6-1.4 6.5M14 20.5c0 3.4-1 4-1 7.4M18 20.5c0 3.4 1 4 1 7.4M22 20c0 3-1.4 3.6-1.4 6.5" stroke="#ef8a1e" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    shark: `<svg viewBox="0 0 32 32" fill="none"><path d="M3 20c6-1 10-3 12-9 1 3 1 6 0 9" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M15 11c6 .3 12 3.4 14 9-3 1.6-6 1.7-8.5.6" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M27 17l4-3.5-1 6.5z" stroke="#1b5a52" stroke-width="1.4" stroke-linejoin="round"/><circle cx="21" cy="16" r="1" fill="#ef8a1e"/><path d="M6 20c1.4 2 4 3.4 6.5 3.6" stroke="#ef8a1e" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    crab: `<svg viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="17" rx="8.5" ry="5.5" stroke="#1b5a52" stroke-width="1.6"/><path d="M8.5 14.5c-2-1-3.5-3-4-5.5 2 .3 4 1.6 5.3 3.4M23.5 14.5c2-1 3.5-3 4-5.5-2 .3-4 1.6-5.3 3.4" stroke="#ef8a1e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 20l-3.5 3M10.5 22.5l-2.5 3.5M21.5 22.5l2.5 3.5M23 20l3.5 3" stroke="#1b5a52" stroke-width="1.4" stroke-linecap="round"/><circle cx="13" cy="16" r="1" fill="#1b5a52"/><circle cx="19" cy="16" r="1" fill="#1b5a52"/></svg>`,
    whale: `<svg viewBox="0 0 32 32" fill="none"><path d="M3 18c1-5 6-9 13-9 7 0 12 3.6 13 8-1 4-4 6-9 6-6 0-11-2-17-5z" stroke="#1b5a52" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 24c2 1.2 5 1.6 7.5.6-1.6 2-4.4 3-7 2.4z" stroke="#1b5a52" stroke-width="1.4" stroke-linejoin="round"/><path d="M13 6c.5 1.6.2 2.6-.6 3.6M16 5c.6 1.8.3 3-.6 4.2" stroke="#ef8a1e" stroke-width="1.3" stroke-linecap="round"/><circle cx="10" cy="15.5" r="1" fill="#ef8a1e"/></svg>`
  };
  document.querySelectorAll('.tcard-ico').forEach(el=>{
    const key = [...el.classList].find(c=>c.startsWith('ic-'))?.slice(3);
    if(key && SEA_ICONS[key]) el.innerHTML = SEA_ICONS[key];
  });
})();
