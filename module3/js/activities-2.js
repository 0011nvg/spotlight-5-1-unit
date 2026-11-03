/* More activity types: multi-select items, room scenes, Spell & Move board game, There is/are builder */
(function (MEA) {
  'use strict';
  const L = MEA.lang, E = MEA.Engine, { esc, shuffle, pick, $, $$ } = MEA.util;

  /* scene: a room with its furniture (no labels — recognise the pictures) */
  E.Scenes.roomkit = function (sc) {
    return '<div class="roomkit"><div class="rk-head">' + esc(sc.title) + '</div><div class="rk-grid">' +
      sc.items.map((a) => '<div class="rk-it">' + MEA.art(a.art) + (a.n > 1 ? '<span class="rk-n">×' + a.n + '</span>' : '') + '</div>').join('') + '</div></div>';
  };

  /* item: choose ALL the right options (e.g. "It has got a … and a …") */
  E.Items.multi = {
    max: () => 2, check: true,
    render(it, el, api) {
      const opts = shuffle(it.options); const need = it.answers.length; const pics = opts.some((o) => o.art);
      el.innerHTML = (it.scene ? '<div class="visual">' + E.Scenes[it.scene.type](it.scene) + '</div>' : '') + (it.audio ? '<div class="audio-row">' + MEA.playBtn(it.audio, 'Listen', true) + '</div>' : '') +
        '<p class="prompt">' + it.prompt + '</p><p class="prompt-ru">Выбери ' + need + ' ответ' + (need < 5 ? 'а' : 'ов') + '.</p>' +
        '<div class="opts ' + (pics ? 'opts-pics' : '') + '">' + opts.map((o) => { const v = typeof o === 'string' ? o : o.value; return '<button type="button" class="opt" aria-pressed="false" data-v="' + esc(v) + '">' + (o.art ? MEA.art(o.art) : '') + '<span>' + esc(typeof o === 'string' ? o : (o.label || o.value)) + '</span></button>'; }).join('') + '</div>';
      const sel = new Set();
      $$('.opt', el).forEach((b) => b.addEventListener('click', () => {
        if (b.disabled) return; const v = b.dataset.v;
        if (sel.has(v)) { sel.delete(v); b.classList.remove('is-sel'); b.setAttribute('aria-pressed', 'false'); }
        else { sel.add(v); b.classList.add('is-sel'); b.setAttribute('aria-pressed', 'true'); }
        $$('.opt.is-wrong', el).forEach((x) => x.classList.remove('is-wrong'));
      }));
      return {
        check() {
          if (sel.size !== need) return { empty: true, msg: 'Choose ' + need + ' answers.' };
          const wrong = [...sel].filter((v) => !it.answers.includes(v));
          wrong.forEach((v) => { const b = $$('.opt', el).find((x) => x.dataset.v === v); b.classList.add('is-wrong'); b.classList.remove('is-sel'); sel.delete(v); });
          return { ok: !wrong.length, given: [...sel].concat(wrong).join(', '), diag: wrong.length ? { msg: 'Not quite.', ru: 'Неверно: ' + wrong.join(', ') + '. Верные ответы остались выбранными.' } : null };
        },
        reveal() { $$('.opt', el).forEach((b) => { if (it.answers.includes(b.dataset.v)) b.classList.add('is-right'); }); },
        lock(ok) { $$('.opt', el).forEach((b) => { b.disabled = true; if (ok && it.answers.includes(b.dataset.v)) b.classList.add('is-right'); }); }
      };
    }
  };

  /* whole: board game "Spell & Move" — toss a coin (heads 1, tails 2), spell the word you land on, mistake = move back one */
  E.Whole.boardgame = function (ctx, api) {
    const sq = typeof ctx.ex.squares === 'function' ? ctx.ex.squares() : ctx.ex.squares;
    let pos = 0, landed = 0, right = 0, tries = 0, waiting = false; const mistakes = [], seen = new Set();
    api.body.innerHTML = '<div class="bgame"><ol class="bpath">' + '<li class="bsq start" data-i="0"><b>START</b></li>' +
      sq.map((s, i) => '<li class="bsq" data-i="' + (i + 1) + '"><span class="bnum">' + (i + 1) + '</span>' + MEA.art(s.art) + '</li>').join('') + '<li class="bsq finish" data-i="' + (sq.length + 1) + '"><b>FINISH</b></li></ol>' +
      '<div class="bpanel"><div class="coin" aria-live="polite"><span class="coin-face">?</span></div><p class="muted small">Heads = 1 square · Tails = 2 squares</p>' +
      '<button type="button" class="btn-primary" id="toss">Toss the coin</button><div class="bq" hidden></div></div></div>';
    const token = document.createElement('span'); token.className = 'btoken'; token.innerHTML = MEA.icon('plane');
    function place() { const li = $('.bsq[data-i="' + Math.min(pos, sq.length + 1) + '"]', api.body); li.appendChild(token); li.scrollIntoView && li.scrollIntoView({ block: 'nearest', inline: 'center', behavior: MEA.reduced ? 'auto' : 'smooth' }); }
    place();
    $('#toss', api.body).addEventListener('click', () => {
      if (waiting) return;
      const heads = Math.random() < 0.5; const coin = $('.coin', api.body);
      coin.classList.remove('spin'); void coin.offsetWidth; coin.classList.add('spin');
      $('.coin-face', api.body).textContent = heads ? 'HEADS · 1' : 'TAILS · 2';
      pos += heads ? 1 : 2; place();
      if (pos > sq.length) return finish();
      ask();
    });
    function ask() {
      const s = sq[pos - 1]; waiting = true; $('#toss', api.body).disabled = true; tries = 0;
      const q = $('.bq', api.body); q.hidden = false;
      q.innerHTML = '<p><b>Square ' + pos + '.</b> Say the word and spell it!</p>' + MEA.art(s.art, 'bq-art') +
        '<div class="type-line"><input class="type-in" id="bq-in" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Spell the word" placeholder="spell the word"><button type="button" class="btn-primary sm" id="bq-ok">Check</button></div>';
      const inp = $('#bq-in', q); inp.focus({ preventScroll: true });
      const go = () => {
        if (!L.norm(inp.value)) { api.feedback('info', 'Spell the word first.'); return; }
        landed++; const ok = L.matches(inp.value, s.word);
        const spelled = s.word.toUpperCase().split('').map((c) => (c === ' ' ? ' ' : c)).join('-').replace(/- -/g, ' ');
        if (ok) {
          right++; api.feedback('good', MEA.util.pick(['Great job!', 'Excellent!', 'Perfect!']), esc(s.word) + ': ' + esc(spelled));
          MEA.Speech.say(s.word + '. ' + s.word.replace(/ /g, '').split('').join(', '));
          if (s.pkey && MEA.Store.noteCorrect(s.pkey, true, false)) MEA.toast('Removed from Words to Practise: ' + s.word);
        } else {
          const d = L.diagnose(inp.value, s.word, 'word');
          api.feedback('bad', 'Oops! Move back one circle.', esc(d.ru) + ' Правильно: <b>' + esc(spelled) + '</b>');
          if (!seen.has(s.word)) { seen.add(s.word); mistakes.push({ q: 'square ' + pos, given: inp.value, answer: s.word, result: 'retry' }); }
          MEA.Store.noteError({ pkey: s.pkey, plabel: s.ru, answerText: s.word, mode: 'word', ru: s.ru, art: s.art, audioText: s.word });
          pos = Math.max(0, pos - 1); place();
        }
        q.hidden = true; waiting = false; $('#toss', api.body).disabled = false; $('#toss', api.body).focus({ preventScroll: true });
      };
      $('#bq-ok', q).addEventListener('click', go);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    }
    function finish() {
      $('#toss', api.body).disabled = true; $('.bq', api.body).hidden = true;
      api.feedback('good', 'FINISH! You did it, Malik!', right + ' of ' + landed + ' words spelled right.');
      api.actions([{ label: 'Finish', icon: 'right', primary: true, id: 'next', on: () => api.finish({ score: landed ? right / landed : 1, total: landed, firstTry: right, mistakes }) }]);
    }
    api.actions([{ label: 'Skip', icon: 'skip', on: () => api.finish({ score: landed ? right / landed : null, total: landed, firstTry: right, mistakes }) }]);
  };

  /* widget: build sentences with there is / there are */
  const NOUNS = [['sofa', 'sofas'], ['armchair', 'armchairs'], ['lamp', 'lamps'], ['chair', 'chairs'], ['painting', 'paintings'], ['window', 'windows'], ['wardrobe', 'wardrobes'], ['mirror', 'mirrors']];
  const NUM = ['', 'a', 'two', 'three'];
  MEA.widgets.thereis = function (el) {
    el.innerHTML = '<div class="ti"><div class="ti-ctrl"><label>Thing <select id="ti-n">' + NOUNS.map((n, i) => '<option value="' + i + '">' + n[0] + '</option>').join('') + '</select></label>' +
      '<label>How many? <select id="ti-c"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="0">0 (none)</option></select></label>' +
      '<label>Type <select id="ti-m"><option value="s">sentence</option><option value="q">question</option></select></label></div>' +
      '<p class="ti-out"></p><button type="button" class="say ti-say">' + MEA.icon('speaker') + '<span>Listen</span></button><p class="ti-why"></p></div>';
    const n = $('#ti-n', el), c = $('#ti-c', el), m = $('#ti-m', el);
    function art(w) { return /^[aeiou]/.test(w) ? 'an' : 'a'; }
    function build() {
      const [sg, pl] = NOUNS[+n.value], k = +c.value, q = m.value === 'q';
      let s, why;
      if (q) { s = k === 1 ? 'Is there <mark>' + art(sg) + '</mark> ' + sg + ' in the room?' : 'Are there <mark>any</mark> ' + pl + ' in the room?'; why = k === 1 ? 'Вопрос: Is there + a/an + предмет.' : 'Вопрос во множественном числе: Are there any + предметы.'; }
      else if (k === 0) { s = 'There <mark>aren\'t any</mark> ' + pl + ' in the room.'; why = 'Отрицание во множественном числе: there aren\'t any + предметы.'; }
      else if (k === 1) { s = 'There <mark>is</mark> ' + art(sg) + ' ' + sg + ' in the room.'; why = 'Один предмет: there is (there\'s) + a/an.'; }
      else { s = 'There <mark>are</mark> ' + NUM[k] + ' ' + pl + ' in the room.'; why = 'Несколько предметов: there are + число + предметы (-s).'; }
      $('.ti-out', el).innerHTML = s; $('.ti-why', el).textContent = why;
    }
    [n, c, m].forEach((x) => x.addEventListener('change', build)); build();
    $('.ti-say', el).addEventListener('click', () => MEA.Speech.say($('.ti-out', el).textContent));
  };
})(window.MEA = window.MEA || {});
