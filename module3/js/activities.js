/* Whole-screen activity types, panels (reading text / listening script) and rule widgets */
(function (MEA) {
  'use strict';
  const L = MEA.lang, W = MEA.Engine.Whole, { esc, shuffle, $, $$ } = MEA.util;

  /* ===== Discover: flashcards ===== */
  W.cards = function (ctx, api) {
    const items = ctx.ex.items; let i = 0; const seen = new Set();
    function draw() {
      const c = items[i]; seen.add(i);
      api.body.innerHTML = '<div class="flash">' + MEA.art(c.art, 'flash-art') +
        '<div class="flash-txt"><div class="flash-word">' + esc(c.word) + '</div>' + MEA.playBtn(c.word, 'Listen', true) +
        '<button type="button" class="ru-toggle" aria-expanded="false">Показать перевод</button><p class="flash-ru" hidden>' + esc(c.ru) + '</p>' +
        (c.example ? '<p class="flash-ex">' + MEA.playBtn(c.example) + ' <span>' + esc(c.example) + '</span></p>' : '') + '</div></div>' +
        '<div class="dots">' + items.map((_, k) => '<button type="button" class="dot ' + (k === i ? 'on' : '') + (seen.has(k) ? ' seen' : '') + '" data-k="' + k + '" aria-label="Card ' + (k + 1) + '"></button>').join('') + '</div>';
      $('.ru-toggle', api.body).addEventListener('click', (e) => { const p = $('.flash-ru', api.body); p.hidden = !p.hidden; e.currentTarget.textContent = p.hidden ? 'Показать перевод' : 'Скрыть перевод'; });
      $$('.dot', api.body).forEach((d) => d.addEventListener('click', () => { i = +d.dataset.k; draw(); }));
      setTimeout(() => MEA.Speech.say(c.word), 200);
      api.actions([
        { label: 'Back', icon: 'left', disabled: i === 0, on: () => { i--; draw(); } },
        i < items.length - 1 ? { label: 'Next card', icon: 'right', primary: true, id: 'next', on: () => { i++; draw(); } } :
          { label: "I've got it!", icon: 'check', primary: true, id: 'next', disabled: seen.size < items.length, on: () => api.finish({ score: null, mistakes: [] }) }
      ]);
    }
    draw();
  };

  /* ===== Learn: rule card with optional interactive widget ===== */
  W.rule = function (ctx, api) {
    api.body.innerHTML = '<div class="rule">' + ctx.ex.html + '</div>';
    $$('[data-widget]', api.body).forEach((w) => MEA.widgets[w.dataset.widget](w));
    api.actions([{ label: 'Got it!', icon: 'check', primary: true, id: 'next', on: () => api.finish({ score: null, mistakes: [] }) }]);
  };

  /* ===== Match (two columns, tap-tap), supports rounds ===== */
  function cardHtml(c) {
    if (typeof c === 'string') c = { t: c };
    if (c.s) return '<span class="m-audio">' + MEA.icon('speaker') + '<span>Play</span></span>';
    if (c.a) return MEA.art(c.a, 'm-art') + (c.t ? '<span>' + esc(c.t) + '</span>' : '');
    return '<span class="' + (c.mono ? 'mono' : '') + '">' + c.t + '</span>';
  }
  W.match = function (ctx, api) {
    const ex = ctx.ex;
    const rounds = typeof ex.rounds === 'function' ? ex.rounds() : (ex.rounds || [{ pairs: typeof ex.pairs === 'function' ? ex.pairs() : ex.pairs }]);
    let r = 0, first = 0, total = 0; const mistakes = [];
    function round() {
      const R = rounds[r]; const pairs = R.pairs.map((p, i) => Object.assign({ id: i }, p));
      const left = shuffle(pairs), right = shuffle(pairs); const wrongOn = new Set();
      api.body.innerHTML = (R.title ? '<p class="round-title">Round ' + (r + 1) + ' of ' + rounds.length + ': ' + esc(R.title) + '</p>' : '') +
        '<div class="match"><div class="m-col">' + left.map((p) => '<button type="button" class="m-card" data-side="l" data-id="' + p.id + '">' + cardHtml(p.l) + '</button>').join('') +
        '</div><div class="m-col">' + right.map((p) => '<button type="button" class="m-card" data-side="r" data-id="' + p.id + '">' + cardHtml(p.r) + '</button>').join('') + '</div></div>';
      let sel = null, matched = 0;
      $$('.m-card', api.body).forEach((b) => b.addEventListener('click', () => {
        if (b.classList.contains('is-done')) return;
        const p = pairs[+b.dataset.id]; const c = b.dataset.side === 'l' ? p.l : p.r;
        if (c && c.s) MEA.Speech.say(c.s); else if (c && c.say) MEA.Speech.say(c.say);
        if (!sel || sel.dataset.side === b.dataset.side) { $$('.m-card.is-sel', api.body).forEach((x) => x.classList.remove('is-sel')); sel = b; b.classList.add('is-sel'); return; }
        const a = sel; sel = null; a.classList.remove('is-sel');
        if (a.dataset.id === b.dataset.id) {
          [a, b].forEach((x) => { x.classList.add('is-done'); x.disabled = true; });
          matched++; if (!wrongOn.has(a.dataset.id)) first++;
          api.feedback('good', MEA.util.pick(['Great job!', 'Well done!', 'Excellent!', 'Perfect!']));
          if (matched === pairs.length) {
            total += pairs.length;
            if (r < rounds.length - 1) api.actions([{ label: 'Next round', icon: 'right', primary: true, id: 'next', on: () => { r++; api.clear(); round(); } }]);
            else api.actions([{ label: 'Finish', icon: 'right', primary: true, id: 'next', on: () => api.finish({ score: first / total, total, firstTry: first, mistakes }) }]);
          }
        } else {
          [a, b].forEach((x) => { x.classList.add('is-wrong'); setTimeout(() => x.classList.remove('is-wrong'), 450); });
          const lid = a.dataset.side === 'l' ? a.dataset.id : b.dataset.id;
          if (!wrongOn.has(lid)) { wrongOn.add(lid); const p = pairs[+lid]; mistakes.push({ q: plain(p.l), given: '—', answer: plain(p.r), result: 'retry' }); }
          api.feedback('bad', 'Try again!', ex.missRu || 'Эти карточки не пара.');
        }
      }));
      api.actions([{ label: 'Skip', icon: 'skip', on: () => { total += pairs.length; if (r < rounds.length - 1) { r++; api.clear(); round(); } else api.finish({ score: first / total, total, firstTry: first, mistakes }); } }]);
    }
    round();
  };
  const plain = (c) => (typeof c === 'string' ? c : c.t || c.s || c.a || '').replace(/<[^>]+>/g, '');

  /* ===== Memory game ===== */
  W.memory = function (ctx, api) {
    const pairs = typeof ctx.ex.pairs === 'function' ? ctx.ex.pairs() : ctx.ex.pairs;
    const cards = shuffle(pairs.flatMap((p, i) => [{ id: i, face: MEA.art(p.art, 'mem-art'), say: p.word }, { id: i, face: '<span class="mem-word">' + esc(p.word) + '</span>', say: p.word }]));
    api.body.innerHTML = '<p class="mem-stat">Moves: <b>0</b> · Pairs: <b>0</b>/' + pairs.length + '</p><div class="memory">' +
      cards.map((c, k) => '<button type="button" class="mem" data-k="' + k + '" aria-label="Card"><span class="mem-back">' + MEA.icon('plane') + '</span><span class="mem-face">' + c.face + '</span></button>').join('') + '</div>';
    let open = [], moves = 0, found = 0, busy = false;
    $$('.mem', api.body).forEach((b) => b.addEventListener('click', () => {
      if (busy || b.classList.contains('up')) return;
      b.classList.add('up'); open.push(b);
      if (open.length === 2) {
        moves++; busy = true;
        const [x, y] = open; const cx = cards[+x.dataset.k], cy = cards[+y.dataset.k];
        if (cx.id === cy.id) { found++; MEA.Speech.say(cx.say); x.classList.add('done'); y.classList.add('done'); open = []; busy = false; if (found === pairs.length) end(); }
        else setTimeout(() => { x.classList.remove('up'); y.classList.remove('up'); open = []; busy = false; }, 900);
        $('.mem-stat', api.body).innerHTML = 'Moves: <b>' + moves + '</b> · Pairs: <b>' + found + '</b>/' + pairs.length;
      }
    }));
    function end() {
      const extra = Math.max(0, moves - pairs.length);
      const score = Math.max(0.5, 1 - extra * 0.04);
      api.feedback('good', 'All pairs found in ' + moves + ' moves!');
      api.actions([{ label: 'Finish', icon: 'right', primary: true, id: 'next', on: () => api.finish({ score, total: pairs.length, firstTry: pairs.length, mistakes: [] }) }]);
    }
    api.actions([{ label: 'Skip', icon: 'skip', on: () => api.finish({ score: found / pairs.length, total: pairs.length, firstTry: found, mistakes: [] }) }]);
  };

  /* ===== Sort into groups ===== */
  W.sort = function (ctx, api) {
    const ex = ctx.ex; const items = shuffle(ex.items.map((x, i) => Object.assign({ i }, x)));
    api.body.innerHTML = '<div class="chips">' + items.map((x) => '<button type="button" class="chip" data-i="' + x.i + '">' + esc(x.t) + '</button>').join('') + '</div>' +
      '<div class="bins">' + ex.bins.map((b) => '<button type="button" class="bin" data-b="' + b.id + '"><b>' + esc(b.label) + '</b><small>' + esc(b.sub || '') + '</small><span class="bin-in"></span></button>').join('') + '</div>';
    let sel = null, placed = 0, first = 0; const wrong = new Set(), mistakes = [];
    $$('.chip', api.body).forEach((c) => c.addEventListener('click', () => {
      if (c.disabled) return; $$('.chip.is-sel', api.body).forEach((x) => x.classList.remove('is-sel'));
      c.classList.add('is-sel'); sel = c; MEA.Speech.say(ex.items[+c.dataset.i].say || ex.items[+c.dataset.i].t);
    }));
    $$('.bin', api.body).forEach((b) => b.addEventListener('click', () => {
      if (!sel) { api.feedback('info', 'First tap a word, then tap a group.'); return; }
      const it = ex.items[+sel.dataset.i];
      if (it.bin === b.dataset.b) {
        $('.bin-in', b).insertAdjacentHTML('beforeend', '<i>' + esc(it.t) + '</i>'); sel.disabled = true; sel.classList.remove('is-sel'); sel.classList.add('gone');
        placed++; if (!wrong.has(it.t)) first++; sel = null; api.feedback('good', MEA.util.pick(['Great job!', 'Excellent!', 'Well done!']));
        if (placed === ex.items.length) api.actions([{ label: 'Finish', icon: 'right', primary: true, id: 'next', on: () => api.finish({ score: first / ex.items.length, total: ex.items.length, firstTry: first, mistakes }) }]);
      } else {
        if (!wrong.has(it.t)) { wrong.add(it.t); mistakes.push({ q: it.t, given: b.querySelector('b').textContent, answer: ex.bins.find((x) => x.id === it.bin).label, result: 'retry' }); }
        b.classList.add('is-wrong'); setTimeout(() => b.classList.remove('is-wrong'), 450);
        api.feedback('bad', 'Listen again!', esc(it.why || ex.missRu || 'Послушай слово ещё раз.'));
      }
    }));
    api.actions([{ label: 'Skip', icon: 'skip', on: () => api.finish({ score: first / ex.items.length, total: ex.items.length, firstTry: first, mistakes }) }]);
  };

  /* ===== Gap fill (listening / reading) ===== */
  W.gapfill = function (ctx, api) {
    const ex = ctx.ex; const gaps = [];
    const html = ex.template.replace(/\[\[(?:(\w):)?([^\]]+)\]\]/g, (m, mode, ans) => {
      const k = gaps.length; gaps.push({ mode: { n: 'number', o: 'ordinal' }[mode] || 'word', answers: ans.split('/') });
      return '<span class="gap"><sup>' + (k + 1) + '</sup><input class="gap-in" data-k="' + k + '" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Gap ' + (k + 1) + '"></span>';
    });
    api.body.innerHTML = '<div class="gapdoc">' + html + '</div><ul class="gap-notes"></ul>';
    const inputs = $$('.gap-in', api.body); let checks = 0; const state = gaps.map(() => null);
    inputs.forEach((inp) => inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }));
    function check() {
      checks++; const notes = [];
      inputs.forEach((inp, k) => {
        if (state[k]) return;
        const g = gaps[k];
        if (L.matches(inp.value, g.answers, 'word')) { state[k] = checks === 1 ? 1 : 0.5; inp.classList.add('is-right'); inp.readOnly = true; inp.classList.remove('is-wrong'); }
        else {
          inp.classList.add('is-wrong');
          if (L.norm(inp.value)) { const d = L.diagnose(inp.value, g.answers[0], g.mode); notes.push('<li><b>' + (k + 1) + '.</b> ' + esc(d.msg) + ' ' + esc(d.ru) + '</li>'); }
          else notes.push('<li><b>' + (k + 1) + '.</b> Пропуск пустой.</li>');
        }
      });
      $('.gap-notes', api.body).innerHTML = notes.join('');
      const all = state.every(Boolean);
      if (all) { api.feedback('good', 'Great job!', 'Все пропуски заполнены верно.'); return end(); }
      if (checks >= 3) return reveal();
      api.feedback('bad', 'Some gaps are not right yet.', checks === 2 ? 'Подсказка: послушай ещё раз в медленном режиме (Slow).' : 'Исправь красные пропуски и нажми Check ещё раз.');
      bar();
    }
    function reveal() {
      inputs.forEach((inp, k) => { if (!state[k]) { state[k] = 0; inp.value = gaps[k].answers[0]; inp.classList.remove('is-wrong'); inp.classList.add('is-revealed'); inp.readOnly = true; } });
      api.feedback('bad', 'Here are the answers.', 'Сравни со своими вариантами.'); end();
    }
    function end() {
      const pts = state.reduce((s, x) => s + (x || 0), 0);
      const mistakes = gaps.map((g, k) => state[k] === 1 ? null : { q: 'Gap ' + (k + 1), given: '', answer: g.answers[0], result: 'retry' }).filter(Boolean);
      api.actions([{ label: 'Finish', icon: 'right', primary: true, id: 'next', on: () => api.finish({ score: pts / gaps.length, total: gaps.length, firstTry: state.filter((x) => x === 1).length, mistakes }) }]);
      if (ex.revealScript) {
        const t = $('.script-text', ctx.host);
        if (t) t.hidden = false;
        else if (ex.panel && ex.panel.script) {
          const slot = $('.panel-slot', ctx.host);
          if (slot && !$('.student-transcript', slot)) slot.insertAdjacentHTML('beforeend', '<details class="student-transcript"><summary>Transcript · after practice</summary><p>' + esc(ex.panel.script) + '</p></details>');
        }
      }
    }
    function bar() {
      api.actions([
        (checks > 0 || MEA.Store.data.settings.teacher) && { label: 'Show answers', icon: 'eye', on: reveal },
        { label: 'Check', icon: 'check', primary: true, id: 'check', on: check }
      ]);
    }
    bar();
  };

  /* ===== Speaking: listen, record (if allowed), self-check ===== */
  W.speak = function (ctx, api) {
    const ex = ctx.ex; const lines = ex.lines || [];
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    api.body.innerHTML = '<p class="note">' + MEA.icon('mic') + ' Скажи вслух. Если браузер разрешит, можно записать себя и послушать. Это <b>самопроверка</b>: сайт не оценивает произношение автоматически.</p>' +
      (ex.notes ? '<div class="talk-notes">' + ex.notes + '</div>' : '') +
      '<div class="speak-list">' + lines.map((l, k) => '<div class="speak-line" data-k="' + k + '"><div class="sl-text"><b>' + esc(l.text) + '</b>' + (l.ru ? '<small>' + esc(l.ru) + '</small>' : '') + '</div>' +
        '<div class="sl-tools">' + (l.model === false ? '' : MEA.playBtn(l.text, 'Model')) +
        '<button type="button" class="say rec" data-k="' + k + '">' + MEA.icon('mic') + '<span>Record</span></button>' +
        '<button type="button" class="say mine" data-k="' + k + '" hidden>' + MEA.icon('play') + '<span>My voice</span></button>' +
        (Rec && l.model !== false ? '<button type="button" class="say asr" data-k="' + k + '">' + MEA.icon('eye') + '<span>What did the computer hear?</span></button>' : '') + '</div>' +
        '<p class="asr-out" hidden></p>' +
        '<div class="self"><span>How was it?</span><button type="button" class="self-b" data-v="good">I said it clearly</button><button type="button" class="self-b" data-v="again">I need more practice</button></div></div>').join('') + '</div>';
    const clips = {}; let recorder = null, stream = null, recK = null;
    $$('.rec', api.body).forEach((b) => b.addEventListener('click', async () => {
      const k = +b.dataset.k;
      if (recorder && recK === k) { recorder.stop(); return; }
      if (recorder) recorder.stop();
      try {
        if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error('nomedia');
        stream = stream || await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = []; recorder = new MediaRecorder(stream); recK = k;
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => { clips[k] = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })); recorder = null; recK = null; b.classList.remove('live'); b.querySelector('span').textContent = 'Record again'; const m = $('.mine[data-k="' + k + '"]', api.body); m.hidden = false; };
        recorder.start(); b.classList.add('live'); b.querySelector('span').textContent = 'Stop';
      } catch (e) {
        b.disabled = true; b.querySelector('span').textContent = 'Mic not available';
        api.feedback('info', 'Recording is not available here.', 'Браузер не дал доступ к микрофону (на этой странице или в этом режиме). Просто скажи фразу вслух и оцени себя.');
      }
    }));
    $$('.mine', api.body).forEach((b) => b.addEventListener('click', () => { const u = clips[+b.dataset.k]; if (u) new Audio(u).play().catch(() => {}); }));
    $$('.asr', api.body).forEach((b) => b.addEventListener('click', () => {
      const k = +b.dataset.k, out = $('.speak-line[data-k="' + k + '"] .asr-out', api.body);
      try {
        const r = new Rec(); r.lang = 'en-GB'; r.interimResults = false; r.maxAlternatives = 1;
        out.hidden = false; out.textContent = 'Listening… say the sentence.';
        r.onresult = (e) => {
          const heard = e.results[0][0].transcript; const want = L.normPhrase(lines[k].text).replace(/[?.!,]/g, '').split(' ');
          const got = L.normPhrase(heard).replace(/[?.!,]/g, '').split(' ');
          const hit = want.filter((w) => got.includes(w)).length;
          out.innerHTML = 'Computer heard: <b>«' + esc(heard) + '»</b> (' + hit + '/' + want.length + ' words). <small>Это распознавание речи, а не оценка произношения.</small>';
        };
        r.onerror = () => { out.textContent = 'Распознавание недоступно (нужен доступ к микрофону). Оцени себя сам.'; };
        r.start();
      } catch (e) { out.hidden = false; out.textContent = 'Распознавание недоступно в этом браузере.'; }
    }));
    const self = {};
    $$('.self-b', api.body).forEach((b) => b.addEventListener('click', () => {
      const line = b.closest('.speak-line'); $$('.self-b', line).forEach((x) => x.classList.remove('on')); b.classList.add('on');
      self[line.dataset.k] = b.dataset.v; bar();
    }));
    function bar() {
      const n = Object.keys(self).length;
      api.actions([{ label: n < lines.length ? 'Rate each line (' + n + '/' + lines.length + ')' : 'Finish', icon: 'right', primary: true, id: 'next', disabled: n < lines.length && !MEA.Store.data.settings.teacher,
        on: () => { if (stream) stream.getTracks().forEach((t) => t.stop()); api.finish({ score: null, mistakes: [], self }); } }]);
    }
    bar();
  };

  /* ===== Writing (portfolio) ===== */
  W.writing = function (ctx, api) {
    const ex = ctx.ex, S = MEA.Store; const saved = S.data.writing[ctx.key] || '';
    api.body.innerHTML = (ex.widget ? '<div class="w-widget" data-widget="' + ex.widget + '"></div>' : '') + '<div class="writing"><div class="w-main">' +
      '<div class="frames"><span>Useful phrases:</span>' + ex.frames.map((f) => '<button type="button" class="frame-b">' + esc(f) + '</button>').join('') + '</div>' +
      '<label for="w-text" class="sr">Your paragraph</label><textarea id="w-text" rows="9" spellcheck="false" placeholder="My home is…">' + esc(saved) + '</textarea>' +
      '<p class="muted"><span class="wc">0</span> words · сохраняется автоматически</p></div>' +
      '<aside class="w-side"><h4>Checklist</h4><ul class="checklist">' + ex.checks.map((c, k) => '<li data-k="' + k + '">' + MEA.icon('check') + '<span>' + esc(c.label) + '</span></li>').join('') + '</ul>' +
      '<details class="model"><summary>See an example</summary><p>' + ex.model + '</p></details></aside></div>';
    $$('[data-widget]', api.body).forEach((w) => MEA.widgets[w.dataset.widget](w, ctx));
    const ta = $('#w-text', api.body);
    $$('.frame-b', api.body).forEach((b) => b.addEventListener('click', () => { const t = b.textContent.replace(/…$/, ''); ta.value += (ta.value && !/\s$/.test(ta.value) ? ' ' : '') + t; ta.focus(); upd(); }));
    function upd() {
      const t = ta.value; S.data.writing[ctx.key] = t; S.save();
      $('.wc', api.body).textContent = (t.trim().match(/\S+/g) || []).length;
      let ok = 0; ex.checks.forEach((c, k) => { const p = c.test(t); if (p) ok++; $('.checklist [data-k="' + k + '"]', api.body).classList.toggle('on', p); });
      api.actions([{ label: ok >= ex.need ? 'Finish' : 'Complete the checklist (' + ok + '/' + ex.checks.length + ')', icon: 'right', primary: true, id: 'next', disabled: ok < ex.need && !S.data.settings.teacher, on: () => api.finish({ score: null, mistakes: [] }) }]);
    }
    ta.addEventListener('input', upd); upd();
  };

  /* ===== Panels shown above a set of items ===== */
  MEA.panels.text = function (slot, p) {
    slot.innerHTML = '<section class="reading"><div class="reading-art">' + MEA.art(p.art) + '</div><div class="reading-body"><h3>' + esc(p.title) + '</h3>' +
      (p.audio ? '<div class="audio-row">' + MEA.playBtn(p.audio, 'Listen', true) + '</div>' : '') + '<div class="reading-text">' + p.html + '</div>' +
      (p.glossary ? '<p class="gloss-tip">Tap a <b>bold</b> word to see the translation.</p>' : '') + '</div></section>';
    $$('.reading-text b', slot).forEach((b) => {
      const g = p.glossary && p.glossary[b.textContent.toLowerCase()];
      if (!g) return; b.tabIndex = 0; b.classList.add('gl');
      const show = () => MEA.toast(b.textContent + ' — ' + g);
      b.addEventListener('click', show); b.addEventListener('keydown', (e) => { if (e.key === 'Enter') show(); });
    });
  };
  MEA.panels.audio = function (slot, p) {
    slot.innerHTML = '<section class="listening"><div class="listen-art">' + MEA.art(p.art || 'flats') + '</div><div><h3>' + esc(p.title) + '</h3><p class="muted">' + esc(p.sub || 'Listen two times. Use Slow if you need it.') + '</p>' +
      '<div class="audio-row">' + MEA.playBtn(p.script, 'Listen', true) + '</div>' +
      (MEA.Store.data.settings.teacher ? '<details data-teacher-only class="script-text"><summary>Transcript (teacher)</summary><p>' + esc(p.script) + '</p></details>' : '') + '</div></section>';
  };

  /* ===== Interactive rule widgets ===== */
  MEA.widgets = {
    ordinals(el) {
      el.innerHTML = '<div class="ow"><label for="ow-r">Choose a number: <b class="ow-n">1</b></label><input id="ow-r" type="range" min="1" max="20" value="1">' +
        '<div class="ow-out"><div><small>How many?</small><b class="ow-c"></b></div>' + MEA.icon('right') + '<div><small>Which one?</small><b class="ow-o"></b></div>' +
        '<button type="button" class="say ow-say">' + MEA.icon('speaker') + '<span>Listen</span></button></div><p class="ow-note"></p></div>';
      const r = $('#ow-r', el);
      const notes = { 1: 'Особая форма!', 2: 'Особая форма!', 3: 'Особая форма!', 5: 've → f + th', 8: 'eight + h (одна t)', 9: 'nine без e + th', 12: 've → f + th', 20: 'y → ie + th' };
      function show() {
        const n = +r.value; $('.ow-n', el).textContent = n;
        $('.ow-c', el).textContent = n + ' · ' + L.numWords(n);
        $('.ow-o', el).innerHTML = n + '<sup>' + L.ordSuffix(n) + '</sup> · ' + markChange(n);
        $('.ow-note', el).textContent = notes[n] || 'Обычное правило: число + th';
        $('.ow-note', el).classList.toggle('special', !!notes[n]);
      }
      $('.ow-say', el).addEventListener('click', () => MEA.Speech.say(L.numWords(+r.value) + '. ' + L.ordWords(+r.value)));
      r.addEventListener('input', show); show();
    },
    floors(el) {
      el.innerHTML = '<div class="floors-cmp"><div><h5>In Britain</h5>' + ['second floor', 'first floor', 'ground floor'].map((f) => '<div class="fl">' + f + '</div>').join('') +
        '</div><div><h5>В России</h5>' + ['3-й этаж', '2-й этаж', '1-й этаж'].map((f) => '<div class="fl ru">' + f + '</div>').join('') + '</div></div>';
    },
    numbers(el) {
      el.innerHTML = '<div class="numgrid">' + Array.from({ length: 20 }, (_, i) => i + 1).map((n) => '<button type="button" class="nb ' + ([12, 13, 15, 18].includes(n) ? 'trap' : '') + '" data-n="' + n + '"><b>' + n + '</b><span>' + L.numWords(n) + '</span></button>').join('') + '</div>';
      $$('.nb', el).forEach((b) => b.addEventListener('click', () => MEA.Speech.say(L.numWords(+b.dataset.n))));
    },
    tens(el) {
      el.innerHTML = '<div class="numgrid tens">' + [20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => '<button type="button" class="nb ' + ([40, 50, 80, 90].includes(n) ? 'trap' : '') + '" data-n="' + n + '"><b>' + n + '</b><span>' + L.numWords(n) + '</span></button>').join('') + '</div>';
      $$('.nb', el).forEach((b) => b.addEventListener('click', () => MEA.Speech.say(L.numWords(+b.dataset.n))));
    },
    builder(el) {
      el.innerHTML = '<div class="nbuild"><label>Tens <select id="nb-t">' + [2, 3, 4, 5, 6, 7, 8, 9].map((t) => '<option value="' + t + '">' + t * 10 + '</option>').join('') + '</select></label>' +
        '<label>Units <select id="nb-u">' + Array.from({ length: 10 }, (_, u) => '<option value="' + u + '">' + u + '</option>').join('') + '</select></label>' +
        '<div class="nb-out"><b class="mono"></b><button type="button" class="say">' + MEA.icon('speaker') + '<span>Listen</span></button></div></div>';
      const t = $('#nb-t', el), u = $('#nb-u', el); u.value = 6; t.value = 7;
      const show = () => { const n = +t.value * 10 + +u.value; const w = L.numWords(n); $('.nb-out b', el).innerHTML = n + ' = ' + w.replace('-', '<mark>-</mark>'); };
      t.addEventListener('change', show); u.addEventListener('change', show); show();
      $('.nb-out .say', el).addEventListener('click', () => MEA.Speech.say(L.numWords(+t.value * 10 + +u.value)));
    },
    teenty(el) {
      el.innerHTML = '<div class="tt">' + [13, 14, 15, 16, 17, 18, 19].map((n) => '<div class="tt-row"><button type="button" class="say" data-n="' + n + '">' + MEA.icon('speaker') + '<span>' + n + ' thir<b>TEEN</b></span></button><button type="button" class="say" data-n="' + n * 10 % 100 + '">' + MEA.icon('speaker') + '<span>' + '</span></button></div>').join('') + '</div>';
      $$('.tt-row', el).forEach((row, k) => {
        const a = 13 + k, b = (a - 10) * 10;
        const st = (w, part) => w.replace(part, '<b>' + part.toUpperCase() + '</b>');
        row.children[0].querySelector('span').innerHTML = a + ' · ' + st(L.numWords(a), 'teen');
        row.children[1].dataset.n = b; row.children[1].querySelector('span').innerHTML = b + ' · <b>' + L.numWords(b).slice(0, -2).toUpperCase() + '</b>ty';
      });
      $$('.say', el).forEach((b) => b.addEventListener('click', () => MEA.Speech.say(L.numWords(+b.dataset.n))));
    }
  };
  function markChange(n) {
    const o = L.ordWords(n), c = L.numWords(n);
    if ([1, 2, 3].includes(n)) return '<mark>' + o + '</mark>';
    let i = 0; while (i < o.length && o[i] === c[i]) i++;
    return o.slice(0, i) + '<mark>' + o.slice(i) + '</mark>';
  }
})(window.MEA = window.MEA || {});
