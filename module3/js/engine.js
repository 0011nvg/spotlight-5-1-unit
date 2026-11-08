/* Exercise engine: one runner for every exercise type.
   Sequential types ("seq") show items one by one; "whole" types render a single activity. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  MEA.util = { esc, shuffle, pick, $, $$ };

  const GOOD = ['Great job!', 'Excellent!', 'Well done!', 'Perfect!', 'Brilliant!', 'Nice one!'];
  const praise = () => (Math.random() < 0.15 ? 'Great job!' : pick(GOOD));
  const playBtn = (text, label, big) =>
    '<button type="button" class="say ' + (big ? 'say-big' : '') + '" data-say="' + esc(text) + '" aria-label="Listen">' + MEA.icon('speaker') + (label ? '<span>' + esc(label) + '</span>' : '') + '</button>' +
    (big ? '<button type="button" class="say say-slow" data-say="' + esc(text) + '" data-slow="1" aria-label="Listen slowly">' + MEA.icon('slow') + '<span>Slow</span></button>' : '');
  MEA.playBtn = playBtn;

  /* ---------- scenes (visual context above an item) ---------- */
  const Scenes = {
    building(sc) {
      const rows = sc.floors.slice().sort((a, b) => b.n - a.n).map((f) => {
        const label = f.n === 0 ? 'G' : f.n + '<sup>' + L.ordSuffix(f.n) + '</sup>';
        return '<div class="bld-row ' + (sc.mark === f.who ? 'is-mark' : '') + '"><span class="bld-n">' + label + '</span><span class="bld-who">' +
          (f.pet ? '<i class="pet">' + MEA.art(f.pet, 'mini') + '</i>' : '') + esc(f.who) + '</span></div>';
      }).join('');
      return '<div class="building" aria-label="Building"><div class="bld-roof">' + esc(sc.title || 'Sky Tower') + '</div>' + rows + '<div class="bld-ground">GROUND FLOOR = G</div></div>';
    },
    board(sc) {
      return '<div class="board"><div class="board-head"><span>DEPARTURES</span><span>' + esc(sc.time || '09:40') + '</span></div>' +
        '<div class="board-row board-cols"><span>FLIGHT</span><span>TO</span><span>GATE</span></div>' +
        '<div class="board-row is-live"><span class="flip">' + esc(sc.flight) + '</span><span>' + esc(sc.city) + '</span><span>' + esc(sc.gate || 'A7') + '</span></div></div>';
    },
    ticket(sc) {
      return '<div class="ticket"><div class="ticket-l"><small>BOARDING PASS</small><b class="wrong-word">' + esc(sc.wrong) + '</b><small>Gate sign has a spelling mistake</small></div>' +
        '<div class="ticket-r"><small>NUMBER</small><b>' + esc(sc.digits) + '</b></div></div>';
    },
    roomcat(sc) {
      return '<div class="roomcat">' + MEA.art(sc.room) + '<div class="roomcat-cat" style="left:' + (sc.x || 60) + '%;top:' + (sc.y || 40) + '%">' + MEA.art('cat', 'char') + '</div><p class="roomcat-cap">' + esc(sc.caption) + '</p></div>';
    },
    lift(sc) {
      return '<div class="liftbox"><div class="lift-display" aria-live="polite"><span class="lift-floor">' + (!sc.from ? 'G' : sc.from) + '</span></div>' +
        '<div class="lift-doors"><i></i><i></i></div></div>';
    }
  };
  function visual(item) {
    let h = '';
    if (item.scene) h += Scenes[item.scene.type](item.scene);
    if (item.art) h += MEA.art(item.art, 'item-art');
    if (item.audio) h += '<div class="audio-row">' + playBtn(item.audio, 'Listen', true) + '</div>';
    if (item.passage) h += '<div class="passage">' + item.passage + '</div>';
    return h ? '<div class="visual">' + h + '</div>' : '';
  }
  const promptHtml = (item) => (item.prompt ? '<p class="prompt">' + item.prompt + '</p>' : '') + (item.promptRu ? '<p class="prompt-ru">' + esc(item.promptRu) + '</p>' : '');
  const optLabel = (o) => (typeof o === 'string' ? o : (o.label != null ? o.label : o.value));
  const optVal = (o) => (typeof o === 'string' ? o : o.value);

  /* ---------- item kinds ---------- */
  const Items = {};

  Items.choice = {
    max: (it) => (it.options.length <= 2 ? 1 : 2),
    render(it, el, api) {
      const opts = it.keepOrder ? it.options : shuffle(it.options);
      const pics = opts.some((o) => o.art);
      el.innerHTML = visual(it) + promptHtml(it) + '<div class="opts ' + (pics ? 'opts-pics' : '') + (it.mono ? ' opts-mono' : '') + '">' +
        opts.map((o) => '<button type="button" class="opt" data-v="' + esc(optVal(o)) + '">' + (o.art ? MEA.art(o.art) : '') + (o.art && !o.label ? '' : '<span>' + esc(optLabel(o)) + '</span>') + '</button>').join('') + '</div>';
      let sel = null;
      $$('.opt', el).forEach((b) => b.addEventListener('click', () => {
        if (b.disabled) return;
        $$('.opt', el).forEach((x) => x.classList.remove('is-sel')); b.classList.add('is-sel'); sel = b.dataset.v;
        if (it.sayOnTap) MEA.Speech.say(sel);
        api.submit();
      }));
      return {
        check() {
          if (sel == null) return { empty: true };
          const ok = sel === String(it.answer);
          const btn = $$('.opt', el).find((b) => b.dataset.v === sel);
          if (!ok) { btn.classList.add('is-wrong'); btn.disabled = true; }
          return { ok, given: optLabel(it.options.find((o) => String(optVal(o)) === sel) || sel), diag: !ok && it.why && it.why[sel] ? { msg: 'Not quite.', ru: it.why[sel] } : null };
        },
        reveal() { $$('.opt', el).forEach((b) => { if (b.dataset.v === String(it.answer)) b.classList.add('is-right'); }); },
        lock(ok) { $$('.opt', el).forEach((b) => { b.disabled = true; if (ok && b.dataset.v === sel) b.classList.add('is-right'); }); }
      };
    }
  };

  Items.tf = {
    max: () => 1,
    render(it, el, api) {
      const t = Object.assign({}, it, { options: [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }], keepOrder: true,
        answer: (it.answer === true || it.answer === 'true') ? 'true' : 'false' });
      return Items.choice.render(t, el, api);
    }
  };

  Items.poll = {
    render(it, el, api) {
      el.innerHTML = visual(it) + promptHtml(it) + '<div class="opts">' + it.options.map((o) => '<button type="button" class="opt" data-v="' + esc(o) + '"><span>' + esc(o) + '</span></button>').join('') + '</div>';
      let sel = null;
      $$('.opt', el).forEach((b) => b.addEventListener('click', () => { $$('.opt', el).forEach((x) => x.classList.remove('is-sel')); b.classList.add('is-sel'); sel = b.dataset.v; api.submit(); }));
      return {
        check() { return sel == null ? { empty: true } : { ok: true, poll: true, given: sel, reply: it.reply && it.reply[sel] }; },
        reveal() {}, lock() { $$('.opt', el).forEach((b) => (b.disabled = true)); }
      };
    }
  };

  Items.typing = {
    max: (it) => it.max || 3,
    render(it, el, api) {
      const id = 'in' + Math.random().toString(36).slice(2, 8);
      const input = '<input id="' + id + '" class="type-in" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="Your answer" placeholder="' + esc(it.placeholder || 'type here') + '">';
      el.innerHTML = visual(it) + promptHtml(it) +
        '<div class="type-line">' + (it.before ? '<span class="frame">' + esc(it.before) + '</span>' : '') + input + (it.after ? '<span class="frame">' + esc(it.after) + '</span>' : '') + '</div>' +
        '<p class="hint" hidden></p>';
      const inp = $('#' + id, el);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); api.submit(); } });
      inp.addEventListener('input', () => inp.classList.remove('is-wrong'));
      const accepted = Array.isArray(it.answer) ? it.answer : [it.answer];
      return {
        focus() { setTimeout(() => inp.focus({ preventScroll: true }), 30); },
        check() {
          const v = inp.value;
          if (!L.norm(v)) return { empty: true };
          const mode = it.mode || 'word';
          const ok = L.matches(v, accepted, mode === 'phrase' ? 'phrase' : 'word');
          if (ok) return { ok, given: v };
          inp.classList.add('is-wrong');
          // diagnose against the closest accepted answer
          const best = accepted.slice().sort((a, b) => L.lev(L.norm(v), L.norm(a)) - L.lev(L.norm(v), L.norm(b)))[0];
          const d = L.diagnose(v, best, mode);
          if (it.sameAsWrong && L.norm(v) === L.norm(it.sameAsWrong)) { d.msg = "That's the same mistake!"; if (!d.rule) d.ru = 'Сравни буквы с правилом: найди, какую букву нужно изменить.'; }
          return { ok: false, given: v, diag: d };
        },
        hint() { const h = $('.hint', el); h.hidden = false; h.innerHTML = MEA.icon('bulb') + ' Hint: <b class="mono">' + esc(L.hintFor(accepted[0])) + '</b>'; },
        reveal() { inp.value = accepted[0]; inp.classList.remove('is-wrong'); inp.classList.add('is-revealed'); },
        lock(ok) { inp.readOnly = true; if (ok) inp.classList.add('is-right'); }
      };
    }
  };

  function tokenJoin(arr) { return arr.join(' ').replace(/\s+([?.!,])/g, '$1').replace(/\s*-\s*/g, '-'); }

  Items.order = {
    max: () => 3,
    render(it, el, api) {
      const tokens = it.tokens || it.answer.replace(/([?.!,])/g, ' $1').split(/\s+/).filter(Boolean);
      const bank = shuffle(tokens.map((t, i) => ({ t, i })));
      el.innerHTML = visual(it) + promptHtml(it) + '<div class="build-line" aria-label="Your sentence"></div><div class="bank"></div>';
      const line = $('.build-line', el), bk = $('.bank', el);
      const built = [];
      function draw() {
        line.innerHTML = built.length ? built.map((b, k) => '<button type="button" class="tok in-line" data-k="' + k + '">' + esc(b.t) + '</button>').join('') : '<span class="ph">Tap the words in the right order</span>';
        bk.innerHTML = bank.map((b) => '<button type="button" class="tok" data-i="' + b.i + '" ' + (built.includes(b) ? 'disabled' : '') + '>' + esc(b.t) + '</button>').join('');
        $$('.tok.in-line', line).forEach((x) => x.addEventListener('click', () => { if (locked) return; built.splice(+x.dataset.k, 1); line.classList.remove('is-wrong'); draw(); }));
        $$('.tok:not(.in-line)', bk).forEach((x) => x.addEventListener('click', () => { if (locked) return; built.push(bank.find((b) => b.i === +x.dataset.i)); line.classList.remove('is-wrong'); draw(); }));
      }
      let locked = false; draw();
      return {
        check() {
          if (built.length < tokens.length) return { empty: true, msg: 'Use all the words.' };
          const s = tokenJoin(built.map((b) => b.t));
          const ok = L.normPhrase(s) === L.normPhrase(it.answer) && s[0] === it.answer[0];
          if (!ok) line.classList.add('is-wrong');
          return { ok, given: s, diag: ok ? null : { msg: 'Try again!', ru: it.tipRu || 'Проверь порядок слов.' } };
        },
        hint() { const first = it.answer.split(' ')[0]; MEA.toast('Hint: start with «' + first + '»'); },
        reveal() { line.innerHTML = '<span class="revealed-line">' + esc(it.answer) + '</span>'; bk.innerHTML = ''; locked = true; },
        lock(ok) { locked = true; if (ok) line.classList.add('is-right'); $$('button', el).forEach((b) => (b.disabled = true)); }
      };
    }
  };

  Items.builder = {
    max: () => 3,
    render(it, el, api) {
      const parts = it.tiles || it.answer.split('');
      const tiles = shuffle(parts.concat(it.extra || []).map((t, i) => ({ t, i })));
      el.innerHTML = visual(it) + promptHtml(it) + '<div class="build-word" aria-live="polite"></div><div class="bank tiles ' + (it.tiles ? 'tiles-parts' : '') + '"></div>' +
        '<div class="row-tools"><button type="button" class="btn-ghost sm" data-act="back">' + MEA.icon('backspace') + ' Delete</button><button type="button" class="btn-ghost sm" data-act="clear">Clear</button></div>';
      const word = $('.build-word', el), bk = $('.bank', el); let used = [], locked = false;
      function draw() {
        word.innerHTML = used.length ? used.map((u) => '<span class="tile on">' + esc(u.t) + '</span>').join('') : '<span class="ph">Tap the tiles</span>';
        bk.innerHTML = tiles.map((t) => '<button type="button" class="tile" data-i="' + t.i + '" ' + (used.includes(t) ? 'disabled' : '') + '>' + esc(t.t) + '</button>').join('');
        $$('.tile', bk).forEach((b) => b.addEventListener('click', () => { if (locked) return; used.push(tiles.find((t) => t.i === +b.dataset.i)); word.classList.remove('is-wrong'); draw(); }));
      }
      $('[data-act=back]', el).addEventListener('click', () => { if (!locked) { used.pop(); draw(); } });
      $('[data-act=clear]', el).addEventListener('click', () => { if (!locked) { used = []; draw(); } });
      draw();
      return {
        check() {
          if (!used.length) return { empty: true };
          const v = used.map((u) => u.t).join('');
          const ok = L.norm(v) === L.norm(it.answer);
          if (!ok) word.classList.add('is-wrong');
          return { ok, given: v, diag: ok ? null : L.diagnose(v, it.answer, it.mode || 'word') };
        },
        hint() { const h = L.hintFor(it.answer); MEA.toast('Hint: ' + h); },
        reveal() { word.innerHTML = '<span class="revealed-line">' + esc(it.answer) + '</span>'; locked = true; },
        lock(ok) { locked = true; if (ok) word.classList.add('is-right'); $$('button', el).forEach((b) => (b.disabled = true)); }
      };
    }
  };

  Items.lift = {
    max: () => 2,
    render(it, el, api) {
      const top = it.top || 20;
      const btns = [0].concat(Array.from({ length: top }, (_, i) => i + 1));
      el.innerHTML = '<div class="lift-wrap">' + Scenes.lift({ from: it.from }) + '<div><div class="audio-row">' + playBtn(it.audio, 'Listen', true) + '</div>' + promptHtml(it) +
        '<div class="lift-panel">' + btns.map((n) => '<button type="button" class="lbtn" data-v="' + n + '">' + (n === 0 ? 'G' : n) + '</button>').join('') + '</div></div></div>';
      let sel = null;
      $$('.lbtn', el).forEach((b) => b.addEventListener('click', () => { $$('.lbtn', el).forEach((x) => x.classList.remove('is-sel')); b.classList.add('is-sel'); sel = +b.dataset.v; api.submit(); }));
      const disp = $('.lift-floor', el);
      function ride(to, cb) {
        let cur = it.from || 0; const step = to > cur ? 1 : -1; $('.liftbox', el).classList.add('moving');
        const t = setInterval(() => { if (cur === to) { clearInterval(t); $('.liftbox', el).classList.remove('moving'); $('.liftbox', el).classList.add('open'); cb && cb(); return; } cur += step; disp.textContent = cur === 0 ? 'G' : cur; }, MEA.reduced ? 0 : 90);
      }
      return {
        check() {
          if (sel == null) return { empty: true };
          const ok = sel === it.answer;
          if (!ok) { const b = $$('.lbtn', el).find((x) => +x.dataset.v === sel); b.classList.add('is-wrong'); b.disabled = true; }
          return { ok, given: sel === 0 ? 'G' : String(sel), diag: ok ? null : { msg: 'Wrong floor!', ru: it.why || 'Послушай ещё раз и найди номер этажа.' } };
        },
        reveal() { $$('.lbtn', el).forEach((b) => { if (+b.dataset.v === it.answer) b.classList.add('is-right'); }); },
        lock(ok) { $$('.lbtn', el).forEach((b) => (b.disabled = true)); if (ok) { $$('.lbtn', el).find((b) => +b.dataset.v === it.answer).classList.add('is-right'); ride(it.answer); } }
      };
    }
  };

  /* ---------- runner ---------- */
  const SEQ = new Set(['seq']);
  const Engine = { Items, Scenes, Whole: {} };

  Engine.materialize = function (ex) {
    let items = typeof ex.items === 'function' ? ex.items() : JSON.parse(JSON.stringify(ex.items || []));
    if (ex.shuffle) items = shuffle(items);
    if (ex.take) items = items.slice(0, ex.take);
    return items;
  };

  function head(ctx) {
    const { ex, stage } = ctx;
    const teacher = MEA.Store.data.settings.teacher;
    return '<header class="ex-head"><div class="ex-kicker">' + esc(stage ? stage.title : '') + (stage && stage.sub ? ' · ' + esc(stage.sub) : '') + '</div>' +
      '<h2 class="ex-title">' + esc(ex.title) + '</h2>' +
      (ex.task ? '<p class="ex-task">' + ex.task + '</p>' : '') + (ex.taskRu ? '<p class="ex-task-ru">' + esc(ex.taskRu) + '</p>' : '') +
      (teacher ? window.SpotlightMode.notes((ex.goal ? '<p><b>Цель:</b> '+esc(ex.goal)+'</p>' : '') + (ex.teacherNotes || '')) : '') + '</header>';
  }

  Engine.run = function (ctx) {
    // ctx: {lesson, stage, ex, key, host, onNext, restart, review}
    const { ex, host } = ctx;
    MEA.Speech.say && window.speechSynthesis && speechSynthesis.cancel();
    host.innerHTML = '<article class="ex ex-' + ex.type + '">' + head(ctx) + '<div class="ex-progress" hidden><i></i><span></span></div>' +
      (ex.panel ? '<div class="panel-slot"></div>' : '') +
      '<div class="ex-body"></div><div class="feedback" role="status" aria-live="polite"></div><footer class="ex-actions"></footer></article>';
    if (ex.panel) MEA.panels[ex.panel.type]($('.panel-slot', host), ex.panel, ctx);
    if (ex.type === 'seq') return runSeq(ctx);
    const W = Engine.Whole[ex.type];
    if (!W) { $('.ex-body', host).textContent = 'Unknown exercise type: ' + ex.type; return; }
    W(ctx, makeApi(ctx));
  };

  function makeApi(ctx) {
    const host = ctx.host;
    const fb = $('.feedback', host), actions = $('.ex-actions', host);
    return {
      body: $('.ex-body', host),
      feedback(kind, msg, ru) {
        fb.className = 'feedback show fb-' + kind;
        fb.innerHTML = (kind === 'good' ? MEA.icon('check') : kind === 'bad' ? MEA.icon('cross') : MEA.icon('bulb')) + '<div><b>' + esc(msg) + '</b>' + (ru ? '<span>' + ru + '</span>' : '') + '</div>';
      },
      clear() { fb.className = 'feedback'; fb.innerHTML = ''; },
      actions(list) {
        actions.innerHTML = '';
        list.filter(Boolean).forEach((a) => {
          const b = document.createElement('button'); b.type = 'button';
          b.className = a.primary ? 'btn-primary' : 'btn-ghost'; if (a.id) b.dataset.act = a.id;
          b.innerHTML = (a.icon ? MEA.icon(a.icon) : '') + '<span>' + esc(a.label) + '</span>';
          if (a.disabled) b.disabled = true;
          b.addEventListener('click', a.on); actions.appendChild(b);
        });
      },
      finish(res) { finishExercise(ctx, res); }
    };
  }

  function runSeq(ctx) {
    const { ex, key, host } = ctx;
    const S = MEA.Store, api = makeApi(ctx);
    let snap = !ctx.restart && !ctx.review && S.data.sessions[key];
    if (!snap || !snap.items) snap = { items: Engine.materialize(ex), idx: 0, log: [], points: 0, xp: 0 };
    const prog = $('.ex-progress', host); prog.hidden = false;
    const scored = () => snap.items.filter((i) => i.kind !== 'poll').reduce((n, i) => n + (i.w || 1), 0);

    function save() { if (!ctx.review) { S.data.sessions[key] = snap; S.save(); } }
    function step() {
      if (snap.idx >= snap.items.length) return done();
      const it = snap.items[snap.idx];
      prog.querySelector('i').style.width = (100 * snap.idx / snap.items.length) + '%';
      prog.querySelector('span').textContent = (snap.idx + 1) + ' / ' + snap.items.length;
      api.clear();
      const kind = Items[it.kind];
      const body = api.body; body.innerHTML = '';
      const box = document.createElement('div'); box.className = 'item item-' + it.kind; body.appendChild(box);
      let attempts = 0, settled = false, h;
      const max = ex.test ? 1 : (kind.max ? kind.max(it) : 2);
      const submit = () => {
        if (settled) return next();
        const r = h.check(); if (!r) return;
        if (r.empty) { api.feedback('info', r.msg || 'Choose or type your answer first.'); return; }
        if (r.poll) { settled = true; h.lock(true); api.feedback('good', r.reply || 'Thanks!'); snap.log.push({ q: it.log || stripTags(it.prompt), given: r.given, result: 'poll' }); bar(); return; }
        if (r.ok) {
          settled = true; h.lock(true);
          const first = attempts === 0;
          snap.points += (it.w || 1) * (first ? 1 : 0.5); const xp = first ? 10 : 5; snap.xp += xp; S.data.xp += xp;
          S.data.stats.itemsCorrect++; if (first && (it.kind === 'typing' || it.kind === 'builder')) S.data.stats.typedFirstTry++;
          if (it.pkey && S.noteCorrect(it.pkey, first, ctx.review)) MEA.toast('Removed from Words to Practise: ' + (it.plabel || it.answerText));
          api.feedback('good', praise(), (first ? '+10 XP' : '+5 XP') + (it.explain ? ' · ' + it.explain : ''));
          snap.log.push({ q: it.log || stripTags(it.prompt), given: r.given, answer: it.answerText, result: first ? 'first' : 'retry' });
          MEA.Speech && it.sayAfter && MEA.Speech.say(it.sayAfter);
          bar(); save(); return;
        }
        attempts++;
        if (attempts === 1) S.noteError(meta(it));
        if (attempts >= max) return reveal(r.given);
        const d = r.diag || { msg: 'Try again!', ru: '' };
        api.feedback('bad', d.msg, esc(d.ru || ''));
        if (attempts >= max - 1 && h.hint && max > 2) h.hint();
        bar();
      };
      function reveal(given) {
        settled = true; h.reveal(); h.lock(false);
        S.noteError(Object.assign(meta(it), { revealed: true }));
        api.feedback('bad', 'The answer is: ' + (it.answerText || ''), (it.explain ? esc(it.explain) + ' ' : '') + (it.pkey ? 'Слово добавлено в Words to Practise.' : ''));
        snap.log.push({ q: it.log || stripTags(it.prompt), given: given || '—', answer: it.answerText, result: 'revealed' });
        bar(); save();
      }
      function next() { snap.idx++; save(); step(); }
      function bar() {
        const teacher = S.data.settings.teacher;
        api.actions([
          !settled && { label: 'Skip', icon: 'skip', on: () => { snap.log.push({ q: it.log || stripTags(it.prompt), given: '—', answer: it.answerText, result: 'skipped' }); next(); } },
          !settled && !ex.test && (teacher || attempts > 0) && { label: 'Show answer', icon: 'eye', on: () => reveal('') },
          settled ? { label: snap.idx + 1 < snap.items.length ? 'Next' : 'Finish', icon: 'right', primary: true, id: 'next', on: next } :
            (it.kind === 'typing' || it.kind === 'order' || it.kind === 'builder' || kind.check) && { label: 'Check', icon: 'check', primary: true, id: 'check', on: submit }
        ]);
        if (settled) setTimeout(() => { const b = $('[data-act=next]', host); b && b.focus({ preventScroll: true }); }, 30);
      }
      h = kind.render(it, box, { submit });
      Engine.current = { it, submit }; // used by automated tests
      bar();
      if (it.audio && it.autoplay !== false) setTimeout(() => MEA.Speech.say(it.audio), 250);
      h.focus && h.focus();
    }
    function done() {
      prog.querySelector('i').style.width = '100%';
      const total = scored();
      const res = { score: total ? snap.points / total : null, total, firstTry: snap.log.filter((l) => l.result === 'first').length, mistakes: snap.log.filter((l) => l.result !== 'first' && l.result !== 'poll'), xp: snap.xp };
      if (!ctx.review) { delete S.data.sessions[key]; S.save(); }
      finishExercise(ctx, res);
    }
    save(); step();
  }
  const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').trim();
  function meta(it) {
    return { pkey: it.pkey, plabel: it.plabel, answerText: it.answerText, mode: it.mode, ru: it.ru, art: it.part || it.art, audioText: it.practiseAudio };
  }

  function finishExercise(ctx, res) {
    const S = MEA.Store, key = ctx.key;
    if (!ctx.review) {
      const prev = S.result(key) || {};
      const pct = res.score == null ? null : Math.round(res.score * 100);
      let bonus = 0;
      if (pct == null || pct >= 70) { bonus = prev.status === 'done' ? 5 : 20; S.data.xp += bonus; }
      res.xp = (res.xp || 0) + bonus;
      S.setResult(key, { status: 'done', last: pct, best: pct == null ? null : Math.max(prev.best || 0, pct), attempts: (prev.attempts || 0) + 1, mistakes: (res.mistakes || []).slice(0, 30) });
      S.data.last = { lesson: ctx.lesson.id, ex: ctx.ex.id }; S.save();
    }
    MEA.afterExercise && MEA.afterExercise(ctx, res);
    summary(ctx, res);
  }

  function summary(ctx, res) {
    const host = ctx.host, api = makeApi(ctx);
    $('.ex-progress', host) && ($('.ex-progress', host).hidden = true);
    const ps = $('.panel-slot', host); if (ps) ps.remove();
    api.clear();
    const pct = res.score == null ? null : Math.round(res.score * 100);
    const stars = pct == null ? 3 : pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    const msg = pct == null ? 'Mission complete!' : pct >= 90 ? 'Perfect landing!' : pct >= 70 ? 'Good flight!' : "Let's practise a bit more.";
    const mist = (res.mistakes || []).filter((m) => m.answer);
    api.body.innerHTML = '<div class="summary">' +
      '<div class="stars">' + [1, 2, 3].map((i) => '<span class="' + (i <= stars ? 'on' : '') + '">' + MEA.icon('star') + '</span>').join('') + '</div>' +
      '<h3>' + esc(msg) + '</h3>' + (pct == null || pct >= 70 ? '<div class="sum-keks">' + MEA.keks() + '<p><b>Keks:</b> ' + esc(MEA.util.pick(pct === 100 ? ['Purr-fect!', 'Wow, no mistakes!', 'You are a star pilot!'] : ['Good flight!', 'Meow! Well done!', 'Next stop — new words!'])) + '</p></div>' : '') +
      (pct != null ? (ctx.ex.test ? '<p class="big-score">' + Math.round(res.score * res.total) + '<small> / ' + res.total + '</small></p><p class="muted">My score</p>' : '<p class="big-score">' + pct + '<small>%</small></p><p class="muted">' + res.firstTry + ' of ' + res.total + ' correct on the first try</p>') : '') +
      (res.xp ? '<p class="xp-chip">+' + res.xp + ' XP</p>' : '') +
      (mist.length ? '<div class="mistakes"><h4>Check these answers</h4><ul>' + mist.map((m) => '<li><span class="q">' + esc(m.q) + '</span>' +
        (m.given && m.given !== '—' ? '<s>' + esc(m.given) + '</s>' : '<em>skipped</em>') + MEA.icon('right') + '<b>' + esc(m.answer) + '</b></li>').join('') + '</ul></div>' : '') +
      (pct != null && pct < 70 ? '<p class="advice">' + MEA.icon('bulb') + ' Совет: повтори это задание ещё раз — новые вопросы появятся автоматически.</p>' : '') +
      '</div>';
    api.actions([
      { label: 'Try again', icon: 'retry', on: () => Engine.run(Object.assign({}, ctx, { restart: true })) },
      ctx.onNext && { label: ctx.review ? 'Done' : 'Next exercise', icon: 'right', primary: true, id: 'next', on: ctx.onNext }
    ]);
    setTimeout(() => { const b = $('[data-act=next]', host); b && b.focus({ preventScroll: true }); }, 50);
  }

  Engine.esc = esc;
  MEA.Engine = Engine;
  MEA.panels = MEA.panels || {};
})(window.MEA = window.MEA || {});
