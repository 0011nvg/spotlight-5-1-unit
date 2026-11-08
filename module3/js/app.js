/* App shell: lessons registry, screens, gamification, teacher tools */
(function (MEA) {
  'use strict';
  const { esc, $, $$, shuffle } = MEA.util, S = MEA.Store, L = MEA.lang;
  MEA.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- lessons registry ---------- */
  MEA.lessons = [];
  MEA.registerLesson = (def) => { MEA.lessons.push(def); };
  // Planned lessons of Module 3 (shown on the map as "coming soon"; add a lesson file to open them)
  const ROUTE = [
    { id: 'have', code: 'HAVE', title: 'Who has what? · Grammar bridge' },
    { id: '3a', code: '3A', title: 'At home' },
    { id: '3b', code: '3B', title: 'Move in!' },
    { id: '3c', code: '3C', title: 'My bedroom' },
    { id: '3d', code: '3D', title: 'Culture Corner: A typical English house' },
    { id: 'eu3', code: 'EiU', title: 'English in Use: Viewing a house' },
    { id: 'er3', code: 'ER', title: 'Extensive Reading: The Taj Mahal' },
    { id: 'pc3', code: 'PC3', title: 'Progress Check 3' }
  ];
  const lessonById = (id) => MEA.lessons.find((l) => l.id === id);
  function curLesson() {
    const last = S.data.last && lessonById(S.data.last.lesson);
    if (last) {
      const i = MEA.lessons.indexOf(last), nx = MEA.lessons[i + 1];
      if (nx && S.data.stamps[last.id] && flat(last).every((x) => doneK(x.key) || x.ex.type === 'report') && !Object.keys(S.data.results).some((k) => k.startsWith(nx.id + '/'))) return nx;
      return last;
    }
    return MEA.lessons.find((l) => !S.data.stamps[l.id]) || MEA.lessons[0];
  }
  const learned = (lesson) => lesson.vocab.filter((v) => !S.data.practise[v.key] && (lesson.learnedAfter || ['d6', 'f1']).some((x) => doneK(lesson.id + '/' + x)));
  const flat = (lesson) => lesson.stages.flatMap((st) => st.exercises.map((ex) => ({ st, ex, key: lesson.id + '/' + ex.id })));
  const scored = (ex) => !['rule', 'cards', 'report', 'speak', 'writing', 'haveProject'].includes(ex.type);

  /* ---------- gamification ---------- */
  const STAMPS = {
    numbers: { title: 'Numbers Airport', code: 'NUM', color: '#2F7BF6', line: 'Numbers 1–100' },
    '3a': { title: 'Home Sweet Home', code: '3A', color: '#E5484D', line: 'Lesson 3A · At home' },
    '3b': { title: 'New Home', code: '3B', color: '#128A5C', line: 'Lesson 3B · Move in!' },
    '3c': { title: 'Dream Room', code: '3C', color: '#6D4BC4', line: 'Lesson 3C · My bedroom' },
    '3d': { title: 'Culture Corner', code: 'UK', color: '#B5523B', line: 'Lesson 3D · A typical English house' },
    eu3: { title: 'House Viewing', code: 'KEY', color: '#2F6FE4', line: 'English in Use 3' },
    er3: { title: 'Taj Mahal', code: 'IND', color: '#E09B00', line: 'Extensive Reading 3 · Agra, India' },
    pc3: { title: 'Module 3 Complete', code: 'M3', color: '#0F2344', line: 'Progress Check 3' }
  };
  const best = (k) => (S.result(k) || {}).best || 0;
  const doneK = (k) => (S.result(k) || {}).status === 'done';
  const BADGES = [
    { id: 'first', title: 'First Flight', desc: 'Complete your first exercise', icon: 'plane', test: () => Object.values(S.data.results).some((r) => r.status === 'done') },
    { id: 'pilot', title: 'Number Pilot', desc: '80% or more in the Final Number Challenge', icon: 'star', test: () => best('3a/n7') >= 80 },
    { id: 'speller', title: 'Spelling Ace', desc: '25 words written right on the first try', icon: 'check', test: () => S.data.stats.typedFirstTry >= 25 },
    { id: 'perfect', title: 'Perfect Flight', desc: '100% in an exercise with 5+ questions', icon: 'star', test: () => !!S.data.badges.perfect },
    { id: 'explorer', title: 'Home Explorer', desc: 'Finish all Discover exercises in lesson 3A', icon: 'home', test: () => ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].every((x) => doneK('3a/' + x)) },
    { id: 'lift', title: 'Lift Operator', desc: '90% or more in the lift game', icon: 'right', test: () => best('3a/g3') >= 90 },
    { id: 'reader', title: 'Bookworm', desc: 'Finish all reading tasks', icon: 'book', test: () => ['c1', 'c2', 'c3'].every((x) => doneK('3a/' + x)) },
    { id: 'writer', title: 'Writer', desc: 'Finish your portfolio paragraph', icon: 'clipboard', test: () => doneK('3a/c8') },
    { id: 'speller3b', title: 'Spell & Move Champion', desc: '80% or more in the Spell & Move board game', icon: 'star', test: () => best('3b/g3') >= 80 },
    { id: 'designer', title: 'Interior Designer', desc: 'Finish all Discover exercises in lesson 3B', icon: 'home', test: () => ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].every((x) => doneK('3b/' + x)) },
    { id: 'tidy', title: 'Tidy-up Hero', desc: '90% or more in Tidy up!', icon: 'home', test: () => best('3c/g1') >= 90 },
    { id: 'author', title: 'Room Author', desc: 'Write your bedroom paragraph', icon: 'clipboard', test: () => doneK('3c/c6') },
    { id: 'planner', title: 'House Planner', desc: 'Complete the plan of the English house without mistakes', icon: 'map', test: () => best('3d/r5') === 100 },
    { id: 'fixer', title: 'Word Fixer', desc: 'Remove 5 words from Words to Practise', icon: 'retry', test: () => S.data.cleared >= 5 }
  ];
  const level = () => { const xp = S.data.xp; const ranks = ['Cadet', 'Co-pilot', 'Pilot', 'Captain', 'Senior Captain', 'Sky Legend']; const lv = Math.floor(xp / 500); return { n: lv + 1, rank: ranks[Math.min(lv, ranks.length - 1)], into: xp % 500, need: 500 }; };

  MEA.afterExercise = function (ctx, res) {
    if (ctx.review) return;
    const queue = [];
    const pct = res.score == null ? null : Math.round(res.score * 100);
    if (pct === 100 && res.total >= 5 && !S.data.badges.perfect) S.data.badges.perfect = Date.now();
    if (ctx.ex.stamp && pct != null && pct >= (ctx.ex.pass || 70) && !S.data.stamps[ctx.ex.stamp]) {
      S.data.stamps[ctx.ex.stamp] = Date.now(); queue.push({ stamp: ctx.ex.stamp });
    }
    const lsn = ctx.lesson;
    if (STAMPS[lsn.id] && !S.data.stamps[lsn.id] && !flat(lsn).some((x) => x.ex.stamp === lsn.id) && flat(lsn).every((x) => x.ex.type === 'report' || doneK(x.key))) {
      S.data.stamps[lsn.id] = Date.now(); queue.push({ stamp: lsn.id });
    }
    BADGES.forEach((b) => { if (b.id === 'perfect') { if (S.data.badges.perfect && !S.data.badges.perfectShown) { S.data.badges.perfectShown = 1; queue.push({ badge: b }); } return; }
      if (!S.data.badges[b.id] && b.test()) { S.data.badges[b.id] = Date.now(); queue.push({ badge: b }); } });
    S.save(); renderHeader();
    let i = 0; const nextC = () => { if (i < queue.length) celebrate(queue[i++], nextC); };
    setTimeout(nextC, 500);
  };
  function stampSvg(id, date) {
    const s = STAMPS[id];
    return '<svg class="stamp-svg" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="' + s.color + '" stroke-width="3"><circle cx="60" cy="60" r="54"/><circle cx="60" cy="60" r="44" stroke-dasharray="4 3"/></g>' +
      '<text x="60" y="52" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="22" font-weight="700" fill="' + s.color + '">' + s.code + '</text>' +
      '<text x="60" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="' + s.color + '">' + esc(s.title.toUpperCase()) + '</text>' +
      '<text x="60" y="84" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="' + s.color + '">' + (date ? new Date(date).toLocaleDateString('en-GB') : '') + '</text>' +
      '<path d="M40 92 l20 8 l20 -8" stroke="' + s.color + '" stroke-width="2" fill="none"/></svg>';
  }
  const badgeHtml = (b, on) => '<div class="badge ' + (on ? 'on' : '') + '"><span class="badge-ic">' + MEA.icon(on ? b.icon : 'lock') + '</span><b>' + esc(b.title) + '</b><small>' + esc(b.desc) + '</small></div>';

  function celebrate(item, done) {
    const ov = document.createElement('div'); ov.className = 'celebrate'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    let inner;
    if (item.stamp) {
      const s = STAMPS[item.stamp];
      inner = '<div class="cel-stamp">' + stampSvg(item.stamp, Date.now()) + '</div><h3>' + (item.stamp === '3a' ? "You've unlocked a new destination!" : 'New stamp in your passport!') + '</h3><p>' + esc(s.title) + ' · ' + esc(s.line) + '</p>';
    } else inner = '<div class="cel-badge">' + badgeHtml(item.badge, true) + '</div><h3>New badge!</h3><p>' + esc(item.badge.desc) + '</p>';
    ov.innerHTML = '<div class="cel-card">' + inner + '<div class="cel-chars">' + MEA.keks('cel-keks') + '<p class="keks-says"><b>Keks:</b> ' + (item.stamp ? 'Pack your bag, we fly on!' : 'Purr-fect!') + '</p></div><button type="button" class="btn-primary">Awesome!</button></div>';
    document.body.appendChild(ov);
    const btn = $('button', ov); btn.focus();
    btn.addEventListener('click', () => { ov.remove(); done && done(); });
  }

  /* ---------- toast & global helpers ---------- */
  MEA.toast = function (msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]'); if (!b) return;
    MEA.Speech.say(b.dataset.say, { slow: !!b.dataset.slow });
    b.classList.add('playing'); setTimeout(() => b.classList.remove('playing'), 900);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.matches('input,textarea,button,select,a,summary')) return;
    const b = $('.ex-actions [data-act=next]') || $('.ex-actions [data-act=check]'); if (b && !b.disabled) { e.preventDefault(); b.click(); }
  });

  /* ---------- header ---------- */
  const NAV = () => [['home', 'home', 'Home'], ['map', 'map', 'Map'], ['lesson-' + curLesson().id, 'plane', 'Lesson'], ['passport', 'passport', 'Passport'], ['words', 'book', 'My Words'], ['profile', 'user', 'My Cabin']];
  function renderHeader() {
    const lv = level(), cur = (location.hash || '#home').slice(1), teacher = S.data.settings.teacher = !!window.SpotlightMode?.isTeacher();
    $('#top').innerHTML = '<a class="brand" href="#home" aria-label="Home"><span class="brand-ic">' + MEA.icon('plane') + '</span><span class="brand-t">Spotlight 5 <b>English Adventures</b></span></a>' +
      '<nav class="nav" aria-label="Main">' + NAV().concat(teacher ? [['teacher', 'clipboard', 'Teacher']] : []).map(([h, i, t]) =>
        '<a href="#' + h + '" class="' + (cur === h || (cur.startsWith('lesson') && h.startsWith('lesson')) ? 'on' : '') + '">' + MEA.icon(i) + '<span>' + t + '</span></a>').join('') + '</nav>' +
      '<div class="top-r"><span class="xp" title="Experience points">' + MEA.icon('star') + '<b>' + S.data.xp + '</b> XP</span>' +
      '</div>';
    document.body.classList.toggle('teacher', teacher);
  }

  /* ---------- helpers for progress ---------- */
  function lessonStats(lesson) {
    const all = flat(lesson).filter((x) => !x.st.optional); const done = all.filter((x) => doneK(x.key));
    const sc = all.filter((x) => scored(x.ex) && doneK(x.key));
    const avg = sc.length ? Math.round(sc.reduce((s, x) => s + (best(x.key) || 0), 0) / sc.length) : null;
    return { total: all.length, done: done.length, pct: Math.round(100 * done.length / all.length), avg };
  }
  function nextExercise(lesson) {
    const all = flat(lesson).filter((x) => !x.st.optional);
    const last = S.data.last && S.data.last.lesson === lesson.id ? all.findIndex((x) => x.ex.id === S.data.last.ex) : -1;
    const inProg = all.find((x) => S.data.sessions[x.key]);
    if (inProg) return inProg;
    if (last >= 0 && !doneK(all[last].key) && (S.result(all[last].key) || {}).status !== 'skipped') return all[last];
    for (let k = 1; k <= all.length; k++) { const c = all[(last + k) % all.length]; if (!doneK(c.key) && c.ex.type !== 'report') return c; }
    return all[all.length - 1];
  }

  /* ---------- screens ---------- */
  const Screens = {};
  const main = () => $('#app');

  Screens.home = function () {
    const lesson = curLesson(), nx = nextExercise(lesson), st = lessonStats(lesson), lv = level();
    const words = S.practiseList().length, stamps = Object.keys(S.data.stamps).length;
    const assigned = S.data.assigned.map((k) => MEA.lessons.flatMap((l) => flat(l).map((x) => Object.assign({ l }, x))).find((x) => x.key === k)).filter(Boolean);
    const started = Object.keys(S.data.results).length > 0;
    main().innerHTML =
      '<section class="hero"><div class="hero-txt"><p class="eyebrow">Learn English. Explore the World.</p><h1>Welcome aboard!</h1><p class="lead">' +
      (started ? (st.done ? 'Your next flight is ready. Let\'s continue where you stopped.' : 'You\'ve unlocked a new destination: lesson ' + lesson.code + '!') : 'Ready for your first adventure? Today we fly to lesson ' + lesson.code + ': ' + esc(lesson.title) + '.') + '</p></div>' +
      '<div class="hero-chars">' + MEA.keks('hero-keks') + '<div class="bubble">' + (started ? "Let's fly on!" : "Hi! I'm Keks. Let's travel!") + '</div></div></section>' +
      '<section class="pass" aria-label="Next lesson"><div class="pass-main"><div class="pass-row"><div><small>FLIGHT</small><b>' + lesson.code + '</b></div><div><small>DESTINATION</small><b>' + esc(lesson.destination.name) + '</b></div><div><small>STATUS</small><b class="status">' + (st.done ? (st.done === st.total ? 'LANDED' : 'IN FLIGHT') : 'BOARDING') + '</b></div></div>' +
      '<h2>Lesson ' + lesson.code + ': ' + esc(lesson.title) + '</h2><p class="muted">' + esc(lesson.subtitle) + ' · Spotlight 5, ' + esc(lesson.pages) + '</p>' +
      '<div class="pbar"><i style="width:' + st.pct + '%"></i></div><p class="muted small">' + st.done + ' of ' + st.total + ' exercises done</p></div>' +
      '<div class="pass-stub"><small>NEXT</small><b>' + esc(nx.ex.title) + '</b><small>' + esc(nx.st.title) + '</small><button type="button" class="btn-primary" id="continue">' + MEA.icon('right') + '<span>' + (started ? 'Continue Learning' : 'Start the adventure') + '</span></button></div></section>' +
      '<section class="card"><div class="row-card"><h3>' + MEA.icon('map') + ' Module 3 · My home, my castle</h3><a class="btn-ghost sm" href="#map">' + MEA.icon('map') + '<span>Travel map</span></a></div><div class="lgrid">' +
      MEA.lessons.map((l) => { const s2 = lessonStats(l); const stp = S.data.stamps[l.id]; return '<button type="button" class="lcard' + (l === lesson ? ' cur' : '') + '" data-lesson="' + l.id + '"><span class="lcode">' + l.code + '</span><b>' + esc(l.title) + '</b><span class="pbar"><i style="width:' + s2.pct + '%"></i></span><small>' + (stp ? 'Landed · stamp ✓' : s2.done + ' / ' + s2.total + ' done') + '</small></button>'; }).join('') + '</div></section>' +
      '<section class="tiles4"><a class="tile-s" href="#profile"><small>Level ' + lv.n + '</small><b>' + lv.rank + '</b><span class="pbar"><i style="width:' + (100 * lv.into / lv.need) + '%"></i></span></a>' +
      '<a class="tile-s" href="#passport"><small>Passport stamps</small><b>' + stamps + ' / ' + Object.keys(STAMPS).length + '</b></a>' +
      '<a class="tile-s" href="#words"><small>Words to Practise</small><b>' + words + '</b></a>' +
      '<a class="tile-s" href="#passport"><small>Badges</small><b>' + BADGES.filter((b) => S.data.badges[b.id]).length + ' / ' + BADGES.length + '</b></a></section>' +
      (assigned.length ? '<section class="card"><h3>' + MEA.icon('clipboard') + ' From your teacher</h3><div class="assigned">' + assigned.map((a) => '<button type="button" class="chip-l" data-go="' + a.ex.id + '" data-l="' + a.l.id + '">' + esc(a.ex.title) + '<small>' + a.l.code + ' · ' + esc(a.st.title) + '</small></button>').join('') + '</div></section>' : '') +
      (words ? '<section class="card row-card"><div><h3>Words to Practise</h3><p class="muted">' + words + ' word' + (words > 1 ? 's' : '') + ' need a little more practice.</p></div><a class="btn-ghost" href="#words">' + MEA.icon('retry') + '<span>Practise now</span></a></section>' : '') +
      (!S.data.settings.noticeSeen || !S.available ? '<section class="notice"><p>' + MEA.icon('bulb') + ' <b>Прогресс сохраняется в этом браузере на этом устройстве.</b> Если открыть сайт на другом устройстве или очистить данные браузера, результаты не перенесутся. Сделать копию можно в разделе <a href="#profile">My Cabin</a>.' +
        (!S.available ? ' <b>Сейчас браузер не разрешает сохранение — прогресс пропадёт после закрытия страницы.</b>' : '') + '</p><button type="button" class="btn-ghost sm" id="notice-ok">OK</button></section>' : '');
    $('#continue').addEventListener('click', () => openLesson(lesson.id, nx.ex.id));
    $$('[data-lesson]').forEach((b) => b.addEventListener('click', () => openLesson(b.dataset.lesson)));
    $$('[data-go]').forEach((b) => b.addEventListener('click', () => openLesson(b.dataset.l || lesson.id, b.dataset.go)));
    const n = $('#notice-ok'); n && n.addEventListener('click', () => { S.data.settings.noticeSeen = true; S.save(); n.closest('.notice').remove(); });
  };

  Screens.map = function () {
    main().innerHTML = '<section class="page-head"><h1>Travel map</h1><p class="lead">Module 3 · My home, my castle. Every lesson opens a new destination.</p></section>' +
      '<section class="route-map">' + ROUTE.map((r, i) => {
        const lesson = lessonById(r.id); const st = lesson ? lessonStats(lesson) : null;
        const state = !lesson ? 'soon' : S.data.stamps[r.id] ? 'landed' : lesson === curLesson() ? 'now' : 'open';
        return '<div class="rnode rnode-' + state + '" style="--i:' + i + '">' + (i ? '<span class="rline" aria-hidden="true"></span>' : '') +
          '<div class="rcard"><div class="rcode">' + r.code + '</div><div class="rbody"><b>' + esc(r.title) + '</b>' +
          (lesson ? '<div class="pbar"><i style="width:' + st.pct + '%"></i></div><small>' + (state === 'landed' ? 'Landed · stamp received' : (state === 'now' ? 'Now boarding · ' : 'Open · ') + st.done + '/' + st.total) + '</small>' +
            '<div class="rsub">' + lesson.stages.map((s) => { const xs = s.exercises.map((e) => lesson.id + '/' + e.id); const d = xs.filter(doneK).length; return '<span class="' + (d === xs.length ? 'on' : d ? 'half' : '') + '" title="' + esc(s.title) + '">' + esc(s.title) + '</span>'; }).join('') + '</div>' +
            '<button type="button" class="btn-primary sm" data-open="' + r.id + '">' + MEA.icon('plane') + '<span>Fly here</span></button>'
            : '<small>' + MEA.icon('lock') + ' Coming soon</small>') + '</div>' +
          (state === 'landed' ? '<div class="rstamp">' + stampSvg(r.id, S.data.stamps[r.id]) + '</div>' : '') +
          (state === 'now' ? '<div class="rplane">' + MEA.icon('plane') + '</div>' : '') + '</div></div>';
      }).join('') + '</section>';
    $$('[data-open]').forEach((b) => b.addEventListener('click', () => openLesson(b.dataset.open)));
  };

  Screens.passport = function () {
    const lv = level();
    main().innerHTML = '<section class="page-head"><h1>My Travel Passport</h1></section><section class="passport">' +
      '<div class="pp-page pp-id"><div class="pp-photo"><span class="pp-avatar">S</span></div><dl><dt>Name</dt><dd>STUDENT</dd><dt>Rank</dt><dd>' + lv.rank + ' · Level ' + lv.n + '</dd><dt>Experience</dt><dd>' + S.data.xp + ' XP</dd><dt>Issued</dt><dd>' + new Date(S.data.created).toLocaleDateString('en-GB') + '</dd></dl>' +
      '<p class="mrz mono">P&lt;ENG&lt;STUDENT&lt;&lt;ENGLISH&lt;ADVENTURES&lt;&lt;&lt;&lt;</p></div>' +
      '<div class="pp-page"><div class="pp-keks">' + MEA.keks() + '<small>Travel buddy: KEKS</small></div><h3>Stamps</h3><div class="stamps">' + Object.keys(STAMPS).map((id) => S.data.stamps[id] ? '<div class="stamp on">' + stampSvg(id, S.data.stamps[id]) + '</div>' : '<div class="stamp"><span>' + STAMPS[id].code + '</span><small>' + esc(STAMPS[id].title) + '</small></div>').join('') + '</div>' +
      '<p class="muted small">Штамп NUM — 80% в Final Number Challenge. Штампы 3A–3D — 70% и больше в Final Mission урока. KEY и IND — за все задания урока. M3 — 70 баллов и больше в Progress Check 3.</p></div></section>' +
      '<section class="card"><h3>Badges</h3><div class="badges">' + BADGES.map((b) => badgeHtml(b, !!S.data.badges[b.id])).join('') + '</div></section>';
  };

  Screens.words = function () {
    const list = S.practiseList();
    const lw = MEA.lessons.flatMap((l) => learned(l));
    main().innerHTML = '<section class="page-head"><h1>My Words</h1><p class="lead">Words you find difficult come here automatically. Write them right a few times, and they leave the list.</p></section>' +
      '<section class="card"><div class="row-card"><h3>Words to Practise <span class="count">' + list.length + '</span></h3>' + (list.length ? '<button type="button" class="btn-primary" id="review">' + MEA.icon('retry') + '<span>Practise now</span></button>' : '') + '</div>' +
      (list.length ? '<ul class="wlist">' + list.map((p) => '<li><b>' + esc(p.answer) + '</b><span class="muted">' + esc(p.label) + '</span>' + (p.audio ? MEA.playBtn(p.audio) : '') + '<small>' + p.errors + ' mistake' + (p.errors > 1 ? 's' : '') + ' · ' + p.streak + '/2</small></li>').join('') + '</ul>'
        : '<p class="muted">No words to practise. Great job!</p>') + '</section>' +
      '<section class="card"><h3>Learned words <span class="count">' + lw.length + '</span></h3>' + (lw.length ? '<div class="wcloud">' + lw.map((v) => '<span>' + MEA.playBtn(v.word, v.word) + '</span>').join('') + '</div>' : '<p class="muted">Finish “Write the words” or the Final Mission of a lesson to see your learned words here.</p>') + '</section>' +
      '<div id="review-host"></div>';
    const r = $('#review'); r && r.addEventListener('click', startReview);
  };

  function reviewItems() {
    return shuffle(S.practiseList()).slice(0, 12).map((p) => {
      const base = { kind: 'typing', answer: p.answer, answerText: p.answer, mode: p.mode, pkey: p.key, plabel: p.label, ru: p.ru, practiseAudio: p.audio, log: p.label };
      if (p.mode === 'number' || p.mode === 'ordinal') return Object.assign(base, { prompt: 'Write in words: <b class="digits">' + esc(p.label) + '</b>' });
      return Object.assign(base, { art: p.art, prompt: 'Write the word: <b>' + esc(p.label || p.ru) + '</b>', audio: null });
    });
  }
  function startReview() {
    const host = main(); const lesson = curLesson();
    host.innerHTML = '<section class="page-head"><a href="#words" class="back">' + MEA.icon('left') + ' My Words</a></section><div class="review-wrap"></div>';
    MEA.Engine.run({ lesson, stage: { title: 'Words to Practise' }, ex: { id: 'review', type: 'seq', title: 'Practise my words', task: 'Write each word without help. Two right answers in a row — and the word leaves the list.', items: reviewItems }, key: 'review/words', host: $('.review-wrap', host), review: true, restart: true, onNext: () => { location.hash = '#words'; route(); } });
  }

  Screens.profile = function () {
    const lesson = curLesson(), st = lessonStats(lesson), lv = level();
    const vocabDone = MEA.lessons.reduce((n, l) => n + learned(l).length, 0);
    main().innerHTML = '<section class="page-head"><h1>My Cabin</h1><p class="lead">Your progress · ' + lv.rank + ' · Level ' + lv.n + '</p></section>' +
      '<section class="tiles4"><div class="tile-s"><small>Current lesson</small><b>' + lesson.code + ' ' + esc(lesson.title) + '</b></div><div class="tile-s"><small>Lesson progress</small><b>' + st.pct + '%</b><span class="pbar"><i style="width:' + st.pct + '%"></i></span></div>' +
      '<div class="tile-s"><small>Average score</small><b>' + (st.avg == null ? '—' : st.avg + '%') + '</b></div><div class="tile-s"><small>Learned words / to practise</small><b>' + vocabDone + ' / ' + S.practiseList().length + '</b></div></section>' +
      '<div class="row-btns"><button type="button" class="btn-primary" id="cont">' + MEA.icon('right') + '<span>Continue Learning</span></button><a class="btn-ghost" href="#passport">' + MEA.icon('passport') + '<span>My passport</span></a><a class="btn-ghost" href="#words">' + MEA.icon('book') + '<span>My words</span></a></div>' +
      MEA.lessons.map((l) => '<section class="card"><h3>Results · ' + l.code + ' ' + esc(l.title) + '</h3>' + resultsTable(l, false) + '</section>').join('') +
      '<section class="card"><h3>Sound settings</h3><div class="settings"><label for="voice">Voice</label><select id="voice"></select><label for="rate">Speed <b id="rate-v"></b></label><input type="range" id="rate" min="0.6" max="1.1" step="0.05"><button type="button" class="btn-ghost sm" id="test-v">' + MEA.icon('speaker') + '<span>Test</span></button></div>' +
      '<p class="muted small">Озвучка встроена в браузер. Лучшие британские голоса обычно в Chrome («Google UK English») и Edge («Microsoft Sonia / Libby Online»). Если голос звучит плохо — выбери другой здесь.</p></section>' +
      '<section class="card"><h3>Saving progress</h3><p>Прогресс хранится <b>только в этом браузере</b>. Чтобы перенести его на другое устройство, скопируй код и вставь его там.</p>' +
      '<div class="row-btns"><button type="button" class="btn-ghost" id="exp">Copy my progress code</button><button type="button" class="btn-ghost" id="imp-b">Paste a progress code</button><button type="button" class="btn-ghost danger" id="reset">Reset all progress</button></div>' +
      '<div id="data-box"></div></section>';
    $('#cont').addEventListener('click', () => { const nx = nextExercise(lesson); openLesson(lesson.id, nx.ex.id); });
    const vs = $('#voice'), rate = $('#rate');
    const fillV = () => { vs.innerHTML = MEA.Speech.voices.length ? MEA.Speech.voices.map((v) => '<option ' + (MEA.Speech.voice && v.name === MEA.Speech.voice.name ? 'selected' : '') + '>' + esc(v.name) + ' (' + v.lang + ')</option>').join('') : '<option>Default English voice</option>'; };
    fillV(); document.addEventListener('mea:voices', fillV, { once: true });
    vs.addEventListener('change', () => { const v = MEA.Speech.voices[vs.selectedIndex]; if (v) { MEA.Speech.voice = v; S.data.settings.voice = v.name; S.save(); } });
    rate.value = S.data.settings.rate; $('#rate-v').textContent = S.data.settings.rate + 'x';
    rate.addEventListener('input', () => { S.data.settings.rate = +rate.value; $('#rate-v').textContent = rate.value + 'x'; S.save(); });
    $('#test-v').addEventListener('click', () => MEA.Speech.say('Welcome aboard! The kitchen is on the twelfth floor.'));
    $('#exp').addEventListener('click', () => {
      const code = S.exportJSON(); $('#data-box').innerHTML = '<textarea readonly rows="4" class="code">' + esc(code) + '</textarea><p class="muted small">Код выделен — скопируй его (Ctrl+C) и сохрани.</p>';
      const ta = $('#data-box textarea'); ta.select();
      try { navigator.clipboard.writeText(code).then(() => MEA.toast('Progress code copied.'), () => {}); } catch (e) { /* manual copy */ }
    });
    $('#imp-b').addEventListener('click', () => {
      $('#data-box').innerHTML = '<label for="imp" class="small">Вставь код прогресса:</label><textarea id="imp" rows="4" class="code"></textarea><button type="button" class="btn-primary sm" id="imp-go">Load progress</button>';
      $('#imp-go').addEventListener('click', () => { try { S.importJSON($('#imp').value.trim()); MEA.toast('Progress loaded.'); route(); renderHeader(); } catch (e) { MEA.toast('Этот код не подходит. Скопируй его ещё раз целиком.'); } });
    });
    $('#reset').addEventListener('click', () => {
      $('#data-box').innerHTML = '<div class="confirm"><p><b>Удалить весь прогресс в этом модуле?</b> Это нельзя отменить.</p><button type="button" class="btn-ghost danger" id="reset-y">Yes, delete</button><button type="button" class="btn-ghost" id="reset-n">Cancel</button></div>';
      $('#reset-y').addEventListener('click', () => { S.reset(); renderHeader(); route(); MEA.toast('Progress deleted.'); });
      $('#reset-n').addEventListener('click', () => { $('#data-box').innerHTML = ''; });
    });
  };

  function resultsTable(lesson, teacher) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Exercise</th><th>Status</th><th>Best</th><th>Last</th><th>Tries</th>' + (teacher ? '<th>Mistakes</th><th></th>' : '') + '</tr></thead><tbody>' +
      lesson.stages.map((st) => '<tr class="tbl-stage"><th colspan="' + (teacher ? 7 : 5) + '">' + esc(st.title) + ' · ' + esc(st.sub || '') + '</th></tr>' + st.exercises.map((ex) => {
        const k = lesson.id + '/' + ex.id, r = S.result(k) || {};
        const status = S.data.sessions[k] ? '<span class="pill pill-amber">in progress</span>' : r.status === 'done' ? (r.best == null || r.best >= 70 ? '<span class="pill pill-green">done</span>' : '<span class="pill pill-amber">repeat</span>') : r.status === 'skipped' ? '<span class="pill">skipped</span>' : '<span class="pill pill-grey">—</span>';
        return '<tr><td>' + esc(ex.title) + '</td><td>' + status + '</td><td>' + (r.best == null ? (r.status === 'done' ? '✓' : '') : r.best + '%') + '</td><td>' + (r.last == null ? '' : r.last + '%') + '</td><td>' + (r.attempts || '') + '</td>' +
          (teacher ? '<td>' + ((r.mistakes || []).length ? '<details><summary>' + r.mistakes.length + '</summary><ul class="mlist">' + r.mistakes.map((m) => '<li>' + esc(m.q) + ': <s>' + esc(m.given || '') + '</s> → <b>' + esc(m.answer || '') + '</b></li>').join('') + '</ul></details>' : '') + '</td>' +
            '<td class="nowrap"><button type="button" class="btn-ghost sm" data-open-ex="' + ex.id + '">Open</button> <button type="button" class="btn-ghost sm ' + (S.data.assigned.includes(k) ? 'on' : '') + '" data-assign="' + k + '">' + (S.data.assigned.includes(k) ? 'Assigned' : 'Assign') + '</button></td>' : '') + '</tr>';
      }).join('')).join('') + '</tbody></table></div>';
  }

  Screens.teacher = function () {
    const lesson = lessonById(Screens.teacher.sel) || curLesson(), st = lessonStats(lesson);
    const writing = Object.entries(S.data.writing).filter(([, t]) => t && t.trim());
    main().innerHTML = '<section class="page-head"><h1>Teacher panel</h1><div class="row-btns">' + MEA.lessons.map((l) => '<button type="button" class="btn-ghost sm ' + (l === lesson ? 'on' : '') + '" data-tl="' + l.id + '">' + l.code + ' ' + esc(l.title) + '</button>').join('') + '</div><p class="lead">Lesson ' + lesson.code + ' · ' + st.done + '/' + st.total + ' exercises · average ' + (st.avg == null ? '—' : st.avg + '%') + '</p></section>' +
      '<section class="card"><p class="muted small">В режиме учителя: в каждом задании видна методическая цель, кнопка <b>Show answer</b> доступна сразу, все упражнения открыты. «Assign» добавляет задание в блок «From your teacher» на главной странице ученика.</p>' + resultsTable(lesson, true) + '</section>' +
      '<section class="card"><h3>' + MEA.icon('clipboard') + ' Printable worksheets</h3><p class="muted small">Для каждого урока: Classwork (на урок) и Homework (на дом). Откроется страница А4 с кнопкой Print; ключи печатаются по галочке.</p><div class="ws-grid">' +
      MEA.lessons.map((l) => '<div class="ws-row"><b>' + l.code + ' ' + esc(l.title) + '</b><span class="row-btns">' + wsLinks(l.id) + '</span></div>').join('') + '</div></section>' +
      '<section class="card"><h3>Words to Practise (' + S.practiseList().length + ')</h3>' + (S.practiseList().length ? '<p>' + S.practiseList().map((p) => '<span class="pill">' + esc(p.answer) + ' · ' + p.errors + '</span>').join(' ') + '</p><button type="button" class="btn-ghost sm" id="clear-w">Clear the list</button>' : '<p class="muted">Empty.</p>') + '</section>' +
      '<section class="card"><h3>Writing</h3>' + (writing.length ? writing.map(([k, t]) => '<div class="wtext"><small>' + esc(k) + '</small><p>' + esc(t).replace(/\n/g, '<br>') + '</p></div>').join('') : '<p class="muted">No writing drafts yet.</p>') + '</section>';
    $$('[data-open-ex]').forEach((b) => b.addEventListener('click', () => openLesson(lesson.id, b.dataset.openEx)));
    $$('[data-tl]').forEach((b) => b.addEventListener('click', () => { Screens.teacher.sel = b.dataset.tl; Screens.teacher(); }));
    $$('[data-assign]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.assign, a = S.data.assigned; const i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.push(k); S.save(); Screens.teacher(); }));
    const cw = $('#clear-w'); cw && cw.addEventListener('click', () => { S.data.practise = {}; S.save(); Screens.teacher(); });
  };

  /* ---------- printable worksheets ---------- */
  const PAGES = 'https://0011nvg.github.io/spotlight-5-1-unit/module3/';
  const wsUrl = (l, t) => (/github\.io$|^localhost$|^127\./.test(location.hostname) ? '' : PAGES) + 'worksheet.html?l=' + l + '&t=' + t;
  const wsLinks = (l) => '<a class="btn-ghost sm" target="_blank" rel="noopener" href="' + wsUrl(l, 'class') + '">' + MEA.icon('clipboard') + '<span>Classwork</span></a>' +
    '<a class="btn-ghost sm" target="_blank" rel="noopener" href="' + wsUrl(l, 'home') + '">' + MEA.icon('book') + '<span>Homework</span></a>';
  MEA.wsLinks = wsLinks;

  /* ---------- lesson view ---------- */
  let current = { lesson: null, ex: null };
  function openLesson(id, exId) {
    current = { lesson: id, ex: exId || null };
    if (location.hash !== '#lesson-' + id) location.hash = '#lesson-' + id; else route();
  }
  function lessonScreen(lesson) {
    const all = flat(lesson);
    let exId = current.lesson === lesson.id && current.ex ? current.ex : nextExercise(lesson).ex.id;
    current = { lesson: lesson.id, ex: exId };
    main().innerHTML = '<div class="lesson"><aside class="route" aria-label="Lesson route"><details class="route-d" open><summary><span><small>Spotlight 5 · Module ' + lesson.module + '</small><b>' + lesson.code + ' ' + esc(lesson.title) + '</b></span><span class="route-pct"></span></summary><div class="route-list"></div></details></aside>' +
      '<section class="stage-main"><div class="ex-top"><span class="crumb"></span><div class="row-btns">' + (lesson.id === 'have' ? '<a data-teacher-only class="btn-ghost sm" href="have-guide.html" target="_blank" rel="noopener">План учителю</a>' : '<details class="ws-menu"><summary class="btn-ghost sm">' + MEA.icon('clipboard') + '<span>Worksheets</span></summary><div class="ws-pop"><p class="small"><b>Рабочие листы для печати (А4)</b><br>Лист для урока и лист для домашней работы, ключи — на отдельной странице.</p>' + wsLinks(lesson.id) + '</div></details>') + '<button type="button" class="btn-ghost sm" id="skip-ex">' + MEA.icon('skip') + '<span>Skip exercise</span></button></div></div><div id="ex-host"></div></section></div>';
    if (window.innerWidth < 860) $('.route-d').open = false;
    drawRoute(lesson); openEx(lesson, exId);
    $('#skip-ex').addEventListener('click', () => {
      const i = all.findIndex((x) => x.ex.id === current.ex); const k = all[i].key;
      if (!doneK(k)) S.setResult(k, { status: 'skipped' });
      delete S.data.sessions[k]; S.save();
      if (all[i + 1]) openEx(lesson, all[i + 1].ex.id);
    });
  }
  function drawRoute(lesson) {
    const st = lessonStats(lesson);
    $('.route-pct').textContent = st.pct + '%';
    $('.route-list').innerHTML = lesson.stages.map((s, si) => '<div class="rs"><div class="rs-h"><span class="rs-n">' + (si + 1) + '</span><b>' + esc(s.title) + '</b>' + (s.badge ? '<em>' + esc(s.badge) + '</em>' : '') + '</div><ul>' +
      s.exercises.map((ex) => {
        const k = lesson.id + '/' + ex.id, r = S.result(k) || {};
        const cls = S.data.sessions[k] ? 'prog' : r.status === 'done' ? (r.best == null || r.best >= 70 ? 'done' : 'low') : r.status === 'skipped' ? 'skip' : '';
        return '<li><button type="button" class="rx ' + cls + (current.ex === ex.id ? ' cur' : '') + '" data-ex="' + ex.id + '"><i></i><span>' + esc(ex.title) + '</span>' + (r.best != null ? '<small>' + r.best + '%</small>' : '') + '</button></li>';
      }).join('') + '</ul></div>').join('');
    $$('.rx').forEach((b) => b.addEventListener('click', () => { openEx(lesson, b.dataset.ex); if (window.innerWidth < 860) $('.route-d').open = false; }));
  }
  function openEx(lesson, exId) {
    const all = flat(lesson); let i = all.findIndex((x) => x.ex.id === exId); if (i < 0) i = 0;
    const { st, ex, key } = all[i];
    current.ex = ex.id; S.data.last = { lesson: lesson.id, ex: ex.id }; S.save();
    $('.crumb').innerHTML = esc(lesson.code) + ' · ' + esc(st.title) + ' · ' + (st.exercises.indexOf(ex) + 1) + '/' + st.exercises.length;
    drawRoute(lesson);
    const host = $('#ex-host');
    const onNext = () => { drawRoute(lesson); renderHeader(); if (lesson.id === 'have' && ex.id === 'project') { location.hash = '#map'; } else if (all[i + 1]) openEx(lesson, all[i + 1].ex.id); else { location.hash = '#map'; } };
    if (ex.type === 'report') return reportEx(lesson, st, ex, key, host, onNext);
    MEA.Engine.run({ lesson, stage: st, ex, key, host, onNext });
    const sm = $('.stage-main'); if (sm && sm.getBoundingClientRect().top < 0) sm.scrollIntoView({ behavior: MEA.reduced ? 'auto' : 'smooth' });
  }
  MEA.openEx = (exId, lessonId) => openLesson(lessonId || current.lesson || curLesson().id, exId);

  function reportEx(lesson, st, ex, key, host, onNext) {
    const stats = lessonStats(lesson);
    const sc = flat(lesson).filter((x) => scored(x.ex) && doneK(x.key)).sort((a, b) => best(a.key) - best(b.key));
    const weak = sc.filter((x) => best(x.key) < 80).slice(0, 4);
    const todo = flat(lesson).filter((x) => !doneK(x.key) && x.ex.type !== 'report');
    const words = S.practiseList();
    const recs = [];
    if (todo.length) recs.push('Закончи задания: ' + todo.slice(0, 3).map((x) => '«' + x.ex.title + '»').join(', ') + (todo.length > 3 ? ' и ещё ' + (todo.length - 3) : '') + '.');
    if (weak.length) recs.push('Повтори задания с результатом ниже 80% (кнопки ниже).');
    if (words.length) recs.push('Потренируй ' + words.length + ' слов(а) в разделе My Words — каждый день по 5 минут.');
    if (lesson.id === '3a' && !S.data.stamps.numbers) recs.push('Набери 80% в Final Number Challenge, чтобы получить штамп Numbers Airport.');
    if (!recs.length) recs.push('Отлично! Урок ' + lesson.code + ' пройден. Повтори Words to Practise перед следующим уроком.');
    host.innerHTML = '<article class="ex">' + '<header class="ex-head"><div class="ex-kicker">My Progress</div><h2 class="ex-title">Lesson ' + lesson.code + ' report</h2></header>' +
      '<div class="report"><div class="tiles4"><div class="tile-s"><small>Exercises done</small><b>' + stats.done + ' / ' + stats.total + '</b></div><div class="tile-s"><small>Average score</small><b>' + (stats.avg == null ? '—' : stats.avg + '%') + '</b></div>' +
      '<div class="tile-s"><small>Words to Practise</small><b>' + words.length + '</b></div><div class="tile-s"><small>Stamps</small><b>' + Object.keys(S.data.stamps).length + ' / ' + Object.keys(STAMPS).length + '</b></div></div>' +
      '<h4>Stages</h4><div class="stage-bars">' + lesson.stages.filter((s) => s.id !== 'progress').map((s) => {
        const xs = s.exercises.map((e) => lesson.id + '/' + e.id); const d = xs.filter(doneK).length; const scs = s.exercises.filter((e) => scored(e) && doneK(lesson.id + '/' + e.id)).map((e) => best(lesson.id + '/' + e.id));
        const avg = scs.length ? Math.round(scs.reduce((a, b) => a + b, 0) / scs.length) : null;
        return '<div class="sbar"><span>' + esc(s.title) + '</span><span class="pbar"><i style="width:' + Math.round(100 * d / xs.length) + '%"></i></span><small>' + d + '/' + xs.length + (avg != null ? ' · ' + avg + '%' : '') + '</small></div>';
      }).join('') + '</div>' +
      '<h4>What to do next</h4><ul class="recs">' + recs.map((r) => '<li>' + MEA.icon('bulb') + '<span>' + esc(r) + '</span></li>').join('') + '</ul>' +
      (weak.length ? '<div class="assigned">' + weak.map((x) => '<button type="button" class="chip-l" data-go="' + x.ex.id + '">' + esc(x.ex.title) + '<small>' + best(x.key) + '%</small></button>').join('') + '</div>' : '') +
      (words.length ? '<h4>Words to Practise</h4><p>' + words.slice(0, 20).map((w) => '<span class="pill">' + esc(w.answer) + '</span>').join(' ') + '</p>' : '') + '</div>' +
      '<footer class="ex-actions"><a class="btn-ghost" href="#words">' + MEA.icon('book') + '<span>My Words</span></a><button type="button" class="btn-primary" data-act="next" id="rep-done">' + MEA.icon('map') + '<span>Back to the map</span></button></footer></article>';
    $$('[data-go]', host).forEach((b) => b.addEventListener('click', () => openEx(lesson, b.dataset.go)));
    $('#rep-done').addEventListener('click', () => { S.setResult(key, { status: 'done', best: null, last: null, attempts: ((S.result(key) || {}).attempts || 0) + 1 }); onNext(); });
  }

  /* ---------- router ---------- */
  function route() {
    const h = (location.hash || '#home').slice(1);
    renderHeader();
    window.speechSynthesis && speechSynthesis.cancel();
    if (h.startsWith('lesson-')) { const l = lessonById(h.slice(7)); if (l) return lessonScreen(l); }
    const name = h === 'teacher' && !S.data.settings.teacher ? 'home' : h;
    (Screens[name] || Screens.home)();
    window.scrollTo(0, 0);
  }
  MEA.route = route;
  window.addEventListener('hashchange', route);
  window.addEventListener('spotlight:modechange', () => { S.data.settings.teacher = window.SpotlightMode.isTeacher(); S.save(); route(); });
  document.addEventListener('DOMContentLoaded', () => { S.load(); MEA.Speech.init(); route(); });
})(window.MEA = window.MEA || {});
