(function () {
  const $ = (id) => document.getElementById(id);
  const svg = (path) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${path}"/></svg>`;

  const ICONS = {
    map: svg('M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z M9 4v13 M15 7v13'),
    bug: svg('M8 8c0-2 2-4 4-4s4 2 4 4 M5 10h14 M12 6v12 M7 14h10 M8 18l-2 3 M16 18l2 3 M6 8L4 6 M18 8l2-2'),
    person: svg('M12 12a4 4 0 100-8 4 4 0 000 8z M5 20c1.5-3 4-5 7-5s5.5 2 7 5'),
    book: svg('M5 5h10a3 3 0 013 3v11H8a3 3 0 00-3 3V5z M8 19V8'),
    zen: svg('M12 4v4 M8 8h8 M7 12h10 M12 12c-4 4-6 7-6 8h12c0-1-2-4-6-8z'),
    menu: svg('M5 7h14 M5 12h14 M5 17h14')
  };

  const ui = {
    profileId: 'q1_early',
    mode: 'journey',
    selectedLoc: null,
    lineIndex: 0,
    revealed: false,
    chosen: null,
    selectedGu: null,
    range: null
  };

  function present() {
    return window.UI_V2_PRESENT.getPresentationState(window.UI_V2_MOCKS[ui.profileId]);
  }

  function setPressed(selector, id, attr) {
    document.querySelectorAll(selector).forEach((b) => {
      b.setAttribute(attr, b.dataset.id === id ? 'true' : 'false');
    });
  }

  function renderHud(p) {
    $('hudWhere').textContent = `Q${p.book} · ${p.chapterName}`;
    $('hudWhen').textContent = `${p.sub} · còn ${p.hero.ap} việc`;
    $('hpVal').textContent = `${p.hero.hp} / ${p.hero.maxHp}`;
    $('hpBar').style.width = `${Math.round((p.hero.hp / p.hero.maxHp) * 100)}%`;
    $('essVal').textContent = `${p.hero.ess} / ${p.hero.maxEss}`;
    $('essBar').style.width = `${Math.round((p.hero.ess / p.hero.maxEss) * 100)}%`;
    $('stoneVal').textContent = String(p.hero.stones);
    $('cicadaVal').textContent = p.hero.cicada;
    $('weekBtn').textContent = p.book === 1 ? 'Qua tuần' : 'Qua ngày';
  }

  function renderJourney(p) {
    const art = $('journeyArt');
    art.style.backgroundImage = `url("${p.mapArt}")`;
    art.style.setProperty('--focus', p.mapFocus);
    $('journeyTitle').textContent = p.title;
    $('journeySub').textContent = p.sub;
    const selected = ui.selectedLoc || p.locations.find((l) => l.state === 'selected') || p.locations[0];
    ui.selectedLoc = selected.id;

    const pinHtml = p.locations
      .map((l) => {
        const pressed = l.id === ui.selectedLoc;
        return `<button type="button" class="pin" data-id="${l.id}" data-state="${l.state}" style="left:${l.x}%;top:${l.y}%" aria-pressed="${pressed}" ${l.state === 'locked' ? 'disabled' : ''}>
          <span class="diamond"></span>
          <span><b>${l.n}</b><small>${l.tag}</small></span>
        </button>`;
      })
      .join('');
    $('mapField').innerHTML = pinHtml;
    $('journeyList').innerHTML = p.locations
      .map(
        (l) =>
          `<button type="button" class="choice" data-id="${l.id}" ${l.state === 'locked' ? 'disabled' : ''}>
            <span>${l.n}</span>
            <span class="meta">${l.tag} · ${l.cost}</span>
          </button>`
      )
      .join('');

    $('pendingTitle').textContent = p.pending.title;
    $('pendingDesc').textContent = p.pending.desc;
    $('pendingBtn').textContent = p.pending.action;

    const loc = p.locations.find((l) => l.id === ui.selectedLoc);
    const sheet = $('destSheet');
    if (loc) {
      sheet.hidden = false;
      $('destName').textContent = loc.n;
      $('destDesc').textContent = loc.desc;
      $('destCost').textContent = loc.state === 'locked' ? loc.tag : `Chi phí: ${loc.cost}`;
      $('destGo').disabled = loc.state === 'locked';
    }

    $('mapField').onclick = (e) => {
      const btn = e.target.closest('.pin');
      if (!btn || btn.disabled) return;
      ui.selectedLoc = btn.dataset.id;
      render();
    };
    $('journeyList').onclick = (e) => {
      const btn = e.target.closest('[data-id]');
      if (!btn || btn.disabled) return;
      ui.selectedLoc = btn.dataset.id;
      render();
    };
  }

  function renderNarrative(p) {
    const n = p.narrative;
    $('narrArt').style.backgroundImage = `url("${n.art}")`;
    const port = $('narrPortrait');
    port.style.backgroundImage = `url("${n.portrait}")`;
    port.hidden = n.layout === 'action';
    $('modeNarrative').dataset.layout = n.layout;
    $('speaker').textContent = n.speaker;
    const shown = n.lines.slice(0, ui.lineIndex + 1).join(' ');
    $('line').textContent = ui.revealed ? n.lines.join(' ') : shown;
    const lastLine = ui.revealed || ui.lineIndex >= n.lines.length - 1;
    $('choices').hidden = !lastLine || ui.chosen;
    $('choices').innerHTML = n.choices
      .map((c) => {
        const metaClass = c.tone || '';
        return `<button type="button" class="choice" data-id="${c.id}" ${c.locked ? 'disabled' : ''}>
          <span>${c.text}</span>
          <span class="meta ${metaClass}">${c.meta}</span>
        </button>`;
      })
      .join('');
    const rec = $('receipt');
    rec.hidden = !ui.chosen;
    if (ui.chosen) {
      $('receiptTitle').textContent = p.receipt.title;
      $('receiptBody').textContent = p.receipt.body;
    }
  }

  function renderCombat(p) {
    const c = p.combat;
    $('combatArt').style.backgroundImage = `url("${c.art}")`;
    $('combatGoal').textContent = c.goal;
    $('combatIntent').innerHTML = `Ý đồ địch: <strong>${c.intent}</strong>`;
    const range = ui.range || c.range;
    document.querySelectorAll('.range').forEach((el) => {
      el.classList.toggle('is-here', el.dataset.range === range);
    });
    $('selfFighter').style.backgroundImage = `url("${c.selfArt}"), url("assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg")`;
    $('foeFighter').style.backgroundImage = `url("${c.foeArt}")`;
    $('foeName').textContent = c.foeName;
    $('skillbar').innerHTML =
      c.skills
        .map((s) => {
          const extra = s.locked ? s.why : `${s.cost ? s.cost + ' chân nguyên' : 'nội tại'} · ${s.cd}`;
          return `<button type="button" class="skill" data-id="${s.id}" ${s.locked ? 'disabled' : ''}>
            ${s.name}<small>${extra}</small>
          </button>`;
        })
        .join('') +
      `<div class="move-cluster">
        <button type="button" class="ghost-btn" data-range="xa">Lùi xa</button>
        <button type="button" class="ghost-btn" data-range="gan">Tiến gần</button>
      </div>`;
  }

  function renderInventory(p) {
    const selected = ui.selectedGu || p.inventory[0].k;
    ui.selectedGu = selected;
    $('guGrid').innerHTML = p.inventory
      .map((g) => {
        return `<button type="button" class="gu-card" data-id="${g.k}" aria-pressed="${g.k === selected}">
          <img src="${g.img}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'han-mark',textContent:'蛊',style:'font-size:48px;text-align:center'}))">
          <div class="name">${g.n}</div>
          <div class="st">${g.status} · Chuyển ${g.r}</div>
        </button>`;
      })
      .join('');
    const g = p.inventory.find((x) => x.k === selected);
    $('guDetail').innerHTML = g
      ? `<h3>${g.n}</h3>
         <p>Công dụng: ${g.use}</p>
         <p>Nuôi: ${g.food} · Đang: ${g.status}</p>
         <p>Tốn: ${g.cost}</p>`
      : '';
  }

  function renderPeople(p) {
    $('peopleList').innerHTML = p.people
      .map(
        (x) => `<article class="person">
          <img src="${x.img}" alt="">
          <div><strong>${x.n}</strong><div class="meta">${x.mood}</div><p>${x.last}</p></div>
        </article>`
      )
      .join('');
    $('karmaList').innerHTML = p.karma
      .map((k) => `<article class="karma-item"><h3>${k.t}</h3><p>${k.d}</p></article>`)
      .join('');
  }

  function setMode(mode) {
    ui.mode = mode;
    ['journey', 'narrative', 'combat'].forEach((m) => {
      $('mode' + m[0].toUpperCase() + m.slice(1)).classList.toggle('is-on', mode === m);
    });
    document.querySelectorAll('.dock-btn[data-mode]').forEach((b) => {
      b.setAttribute('aria-current', b.dataset.mode === mode && !window.UI_V2_OVERLAY.reasons().length ? 'true' : 'false');
    });
  }

  function render() {
    const p = present();
    renderHud(p);
    renderJourney(p);
    renderNarrative(p);
    renderCombat(p);
    renderInventory(p);
    renderPeople(p);
    setMode(ui.mode);
  }

  function setProfile(id) {
    ui.profileId = id;
    ui.selectedLoc = null;
    ui.lineIndex = 0;
    ui.revealed = false;
    ui.chosen = null;
    ui.selectedGu = null;
    ui.range = null;
    document.querySelectorAll('[data-profile]').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.profile === id ? 'true' : 'false');
    });
    render();
  }

  function openOverlay(id, reason) {
    window.UI_V2_OVERLAY.open(id, reason);
    document.querySelectorAll('.dock-btn').forEach((b) => {
      b.setAttribute('aria-current', b.dataset.overlay === id ? 'true' : 'false');
    });
  }

  function bind() {
    $('dockJourney').innerHTML = ICONS.map + '<span>Hành trình</span>';
    $('dockGu').innerHTML = ICONS.bug + '<span>Cổ trùng</span>';
    $('dockHero').innerHTML = ICONS.person + '<span>Nhân vật</span>';
    $('dockKarma').innerHTML = ICONS.book + '<span>Nhân quả</span>';
    $('btnZen').innerHTML = ICONS.zen;
    $('btnMenu').innerHTML = ICONS.menu;
    $('btnZen').setAttribute('aria-label', 'Thiền');
    $('btnMenu').setAttribute('aria-label', 'Menu');

    document.querySelectorAll('[data-profile]').forEach((b) => {
      b.addEventListener('click', () => setProfile(b.dataset.profile));
    });
    document.querySelectorAll('[data-frame]').forEach((b) => {
      b.addEventListener('click', () => {
        $('deviceFrame').dataset.size = b.dataset.frame;
        document.querySelector('.v2-app').classList.toggle('is-list', b.dataset.frame === 'phone');
        $('listToggle').setAttribute('aria-pressed', b.dataset.frame === 'phone' ? 'true' : 'false');
        document.querySelectorAll('[data-frame]').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      });
    });
    $('listToggle').addEventListener('click', () => {
      document.querySelector('.v2-app').classList.toggle('is-list');
      $('listToggle').setAttribute(
        'aria-pressed',
        document.querySelector('.v2-app').classList.contains('is-list') ? 'true' : 'false'
      );
    });

    $('dockJourney').addEventListener('click', () => {
      window.UI_V2_OVERLAY.close();
      ui.mode = 'journey';
      render();
    });
    $('dockGu').addEventListener('click', () => openOverlay('inventory', 'kho cổ'));
    $('dockHero').addEventListener('click', () => openOverlay('people', 'nhân vật'));
    $('dockKarma').addEventListener('click', () => openOverlay('karma', 'nhân quả'));
    $('btnMenu').addEventListener('click', () => openOverlay('settings', 'cài đặt'));
    $('btnZen').addEventListener('click', () => openOverlay('settings', 'thiền'));

    document.querySelectorAll('[data-overlay-close]').forEach((b) => {
      b.addEventListener('click', () => {
        window.UI_V2_OVERLAY.close(b.closest('[data-overlay]').dataset.overlay);
        ui.mode = 'journey';
        setMode('journey');
      });
    });

    $('pendingBtn').addEventListener('click', () => {
      ui.mode = 'narrative';
      ui.lineIndex = 0;
      ui.revealed = false;
      ui.chosen = null;
      render();
    });
    $('destGo').addEventListener('click', () => {
      const p = present();
      if (ui.selectedLoc === p.pending.loc) {
        ui.mode = 'narrative';
      } else {
        ui.mode = 'narrative';
      }
      ui.lineIndex = 0;
      ui.revealed = false;
      ui.chosen = null;
      render();
    });

    $('readPane').addEventListener('click', (e) => {
      if (e.target.closest('.choice') || e.target.closest('.seal-btn')) return;
      const n = present().narrative;
      if (!ui.revealed && ui.lineIndex < n.lines.length - 1) {
        ui.lineIndex += 1;
      } else {
        ui.revealed = true;
      }
      renderNarrative(present());
    });

    $('choices').addEventListener('click', (e) => {
      const btn = e.target.closest('.choice');
      if (!btn || btn.disabled) return;
      ui.chosen = btn.dataset.id;
      renderNarrative(present());
    });

    $('toCombat').addEventListener('click', () => {
      ui.mode = 'combat';
      window.UI_V2_OVERLAY.close();
      render();
    });

    $('skillbar').addEventListener('click', (e) => {
      const move = e.target.closest('[data-range]');
      if (move) {
        ui.range = move.dataset.range;
        renderCombat(present());
        return;
      }
      const sk = e.target.closest('.skill');
      if (!sk || sk.disabled) return;
      $('combatLog').textContent = `Đã chọn ${sk.textContent.trim().split('\n')[0]} — prototype không trừ chân nguyên.`;
    });

    $('guGrid').addEventListener('click', (e) => {
      const card = e.target.closest('[data-id]');
      if (!card) return;
      ui.selectedGu = card.dataset.id;
      renderInventory(present());
    });

    $('weekBtn').addEventListener('click', () => {
      $('combatLog').textContent = 'Qua lượt không chạy engine trong prototype.';
    });

    window.UI_V2_OVERLAY.bind();
    render();
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
