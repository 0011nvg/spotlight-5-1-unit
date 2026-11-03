/* Language helpers: numbers, ordinals, answer checking, spelling diagnostics, speech */
(function (MEA) {
  'use strict';
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const ORD_SPECIAL = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };

  function numWords(n) {
    if (n < 20) return ONES[n];
    if (n === 100) return 'one hundred';
    const t = Math.floor(n / 10), o = n % 10;
    return TENS[t] + (o ? '-' + ONES[o] : '');
  }
  function ordWords(n) {
    const parts = numWords(n).split(/([- ])/);
    const last = parts.pop();
    let o;
    if (ORD_SPECIAL[last]) o = ORD_SPECIAL[last];
    else if (last.endsWith('y')) o = last.slice(0, -1) + 'ieth';
    else o = last + 'th';
    return parts.join('') + o;
  }
  function ordSuffix(n) {
    const t = n % 100;
    if (t >= 11 && t <= 13) return 'th';
    return { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th';
  }
  // Normalise: ignore case and accidental spaces (also around hyphens); unify dashes/apostrophes
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[‐-―−]/g, '-').replace(/[‘’`´]/g, "'")
      .replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim();
  }
  function normPhrase(s) { return norm(s).replace(/\s*([?.!,])\s*/g, '$1 ').replace(/[.!]+$/, '').replace(/\s+/g, ' ').trim(); }
  function parseNum(s) { s = norm(s); for (let i = 0; i <= 100; i++) if (numWords(i) === s) return i; return null; }
  function parseOrd(s) { s = norm(s); for (let i = 1; i <= 100; i++) if (ordWords(i) === s) return i; return null; }

  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  // Typical spelling traps → explanation (RU) of the rule
  const TRAPS = {
    fourty: ['forty', 'В forty нет буквы u: four → forty.'],
    fourtie: ['forty', 'В forty нет буквы u: four → forty.'],
    fiveteen: ['fifteen', 'five → fif-: fif + teen = fifteen.'],
    fivteen: ['fifteen', 'five → fif-: fif + teen = fifteen.'],
    fivety: ['fifty', 'five → fif-: fif + ty = fifty.'],
    fivty: ['fifty', 'five → fif-: fif + ty = fifty.'],
    eightteen: ['eighteen', 'В eighteen одна t: eigh + teen.'],
    eigthteen: ['eighteen', 'В eighteen одна t: eigh + teen.'],
    eightty: ['eighty', 'В eighty одна t: eigh + ty.'],
    eigty: ['eighty', 'Не потеряй h: e-i-g-h-t-y.'],
    eigteen: ['eighteen', 'Не потеряй h: e-i-g-h-t-e-e-n.'],
    ninty: ['ninety', 'ninety сохраняет e: nine + ty = ninety.'],
    ninteen: ['nineteen', 'nineteen сохраняет e: nine + teen = nineteen.'],
    twelf: ['twelve', 'twelve заканчивается на -ve.'],
    twelv: ['twelve', 'twelve заканчивается на -ve.'],
    threeteen: ['thirteen', 'three → thir-: thir + teen = thirteen.'],
    threety: ['thirty', 'three → thir-: thir + ty = thirty.'],
    thirdy: ['thirty', 'thirty пишется через t: t-h-i-r-t-y.'],
    twoty: ['twenty', 'Десятки от two: twenty.'],
    tweny: ['twenty', 'twenty: t-w-e-n-t-y.'],
    sixthy: ['sixty', 'sixty: six + ty.'],
    to: ['two', 'Число 2 — two (с буквой w).'],
    too: ['two', 'Число 2 — two (с буквой w).'],
    tree: ['three', 'Число 3 — three (с th в начале).'],
    for: ['four', 'Число 4 — four (с буквой u).'],
    fore: ['four', 'Число 4 — four.'],
    eleven: null,
    // ordinals
    fiveth: ['fifth', 'five → fifth: -ve меняется на -f, затем -th.'],
    fifeth: ['fifth', 'five → fifth: f-i-f-t-h.'],
    eightth: ['eighth', 'eight + h = eighth (одна t).'],
    eigth: ['eighth', 'eighth: e-i-g-h-t-h.'],
    nineth: ['ninth', 'nine → ninth: буква e исчезает.'],
    twelveth: ['twelfth', 'twelve → twelfth: -ve меняется на -f.'],
    twelfe: ['twelfth', 'twelfth: t-w-e-l-f-t-h.'],
    twentyth: ['twentieth', 'twenty → twentieth: y меняется на ie, затем -th.'],
    twentith: ['twentieth', 'twenty → twentieth: y → ie + th.'],
    forth: ['fourth', 'fourth сохраняет u, как four.'],
    oneth: ['first', '1st — особая форма: first.'],
    twoth: ['second', '2nd — особая форма: second.'],
    threeth: ['third', '3rd — особая форма: third.'],
    thirdth: ['third', '3rd — third (без -th на конце).'],
    ninethteen: ['nineteenth', 'nineteen + th = nineteenth.'],
    fivteenth: ['fifteenth', 'fifteen + th = fifteenth.'],
    fiveteenth: ['fifteenth', 'fifteen + th = fifteenth.'],
    eightteenth: ['eighteenth', 'eighteen + th = eighteenth (одна t в начале).']
  };

  const TEEN_TY = { 13: 30, 14: 40, 15: 50, 16: 60, 17: 70, 18: 80, 19: 90 };
  function teenTyPair(a, b) { return TEEN_TY[a] === b || TEEN_TY[b] === a; }

  /* diagnose(given, answer, mode) → {msg, ru}
     mode: 'number' | 'ordinal' | 'word' | 'phrase' */
  function diagnose(given, answer, mode) {
    const g = norm(given), a = norm(answer);
    if (!g) return { msg: 'Type your answer.', ru: 'Впиши ответ.' };
    if (mode === 'number' || mode === 'ordinal') {
      if (g.replace(/ /g, '-') === a && a.includes('-')) return { msg: 'Almost! Use a hyphen.', ru: 'Составные числа 21–99 пишутся через дефис: ' + a + '.' };
      if (g.replace(/-/g, '') === a.replace(/-/g, '') && a.includes('-')) return { msg: 'Almost! Use a hyphen.', ru: 'Между десятками и единицами ставь дефис: ' + a.split('-')[0] + '-' + a.split('-')[1] + '.' };
    }
    if (mode === 'number') {
      const gn = parseNum(g), an = parseNum(a);
      if (gn != null && an != null && gn !== an) {
        if (teenTyPair(gn, an)) return { msg: "That's " + gn + ', not ' + an + '.', ru: '-teen — это 13–19, -ty — это десятки (30, 40…). Нужно число ' + an + '.' };
        return { msg: "That's " + gn + '. Look again!', ru: 'Ты написал число ' + gn + ', а нужно ' + an + '.' };
      }
    }
    if (mode === 'ordinal') {
      const go = parseOrd(g), ao = parseOrd(a);
      const gn = parseNum(g);
      if (gn != null && gn === ao) return { msg: 'We need an ordinal number.', ru: 'Нужно порядковое числительное (какой по счёту?), а не количественное.' };
      if (go != null && ao != null && go !== ao) return { msg: "That's the " + go + ordSuffix(go) + '. Look again!', ru: 'Это ' + go + '-й, а нужен ' + ao + '-й.' };
    }
    // known traps, whole word or one part of a compound
    if (TRAPS[g] && norm(TRAPS[g][0]) === a) return { msg: 'Check your spelling.', ru: TRAPS[g][1], rule: true };
    const gp = g.split(/[- ]/), ap = a.split(/[- ]/);
    if (gp.length === ap.length) {
      for (let i = 0; i < gp.length; i++) {
        if (gp[i] !== ap[i] && TRAPS[gp[i]] && TRAPS[gp[i]][0] === ap[i]) return { msg: 'Check your spelling.', ru: TRAPS[gp[i]][1], rule: true };
      }
    }
    // spaces in compound nouns
    if (g.replace(/ /g, '') === a.replace(/ /g, '')) {
      if (a.includes(' ')) return { msg: 'Almost!', ru: '«' + a + '» пишется в два слова.' };
      return { msg: 'Almost!', ru: '«' + a + '» пишется одним словом.' };
    }
    if (mode !== 'phrase' && gp.length === ap.length && gp.length > 1) {
      const bad = gp.findIndex((p, i) => p !== ap[i]);
      if (bad >= 0) return { msg: 'Almost! Check your spelling.', ru: 'Ошибка в ' + (bad === 0 ? 'первой' : 'второй') + ' части слова.' };
    }
    const d = lev(g, a);
    if (d <= Math.max(1, Math.round(a.length / 5))) return { msg: 'Almost! Check your spelling.', ru: 'Совсем близко — проверь буквы.' };
    return { msg: 'Try again!', ru: 'Попробуй ещё раз.' };
  }

  function hintFor(answer) {
    // first letter of each part + underscores
    return String(answer).split(/([- ])/).map((p) => (p === '-' || p === ' ') ? (p === ' ' ? '   ' : ' - ') : p[0] + ' ' + '_ '.repeat(p.length - 1).trim()).join('');
  }

  // Accepts: answer string or array; compares normalised
  function matches(given, accepted, mode) {
    const list = Array.isArray(accepted) ? accepted : [accepted];
    const f = mode === 'phrase' ? normPhrase : norm;
    const g = f(given);
    return list.some((a) => f(a) === g);
  }

  /* ---------- speech synthesis ---------- */
  const Speech = {
    voices: [], voice: null, supported: 'speechSynthesis' in window, rate: 0.9,
    init() {
      if (!this.supported) return;
      const pick = () => {
        this.voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
        const wanted = MEA.Store && MEA.Store.data.settings.voice;
        let v = this.voices.find((x) => x.name === wanted);
        if (!v) {
          const prefs = [/Google UK English Female/i, /Sonia|Libby|Maisie|Ryan|Thomas.*Natural/i, /Google UK English Male/i, /Serena|Kate|Daniel|Martha|Arthur|Stephanie/i];
          for (const p of prefs) { v = this.voices.find((x) => p.test(x.name)); if (v) break; }
          if (!v) v = this.voices.find((x) => /en[-_]GB/i.test(x.lang)) || this.voices.find((x) => /en[-_]US/i.test(x.lang)) || this.voices[0];
        }
        this.voice = v || null;
        document.dispatchEvent(new CustomEvent('mea:voices'));
      };
      pick();
      try { speechSynthesis.addEventListener('voiceschanged', pick); } catch (e) { speechSynthesis.onvoiceschanged = pick; }
    },
    say(text, opts) {
      opts = opts || {};
      if (!this.supported) { MEA.toast && MEA.toast('Озвучка недоступна в этом браузере. Попробуй Chrome, Edge или Safari.'); return false; }
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang; } else u.lang = 'en-GB';
        const base = (MEA.Store && MEA.Store.data.settings.rate) || this.rate;
        u.rate = opts.slow ? Math.max(0.5, base - 0.3) : base;
        if (opts.onend) u.onend = opts.onend;
        speechSynthesis.speak(u);
        return true;
      } catch (e) { return false; }
    }
  };

  MEA.lang = { numWords, ordWords, ordSuffix, norm, normPhrase, parseNum, parseOrd, lev, diagnose, hintFor, matches, teenTyPair, TRAPS };
  MEA.Speech = Speech;
})(window.MEA = window.MEA || {});
