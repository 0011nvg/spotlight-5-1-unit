/* Numbers Airport: cardinal numbers 1–100 (generators, adaptive to Words to Practise).
   Reusable by any lesson: MEA.Numbers.stage() returns a ready stage definition. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick } = MEA.util;
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const CITIES = ['LONDON', 'DUBAI', 'TOKYO', 'PARIS', 'ISTANBUL', 'NEW YORK', 'ROME', 'CAIRO', 'SYDNEY', 'MADRID', 'TORONTO', 'BERLIN', 'SEOUL', 'OSLO', 'LISBON', 'MEXICO CITY', 'DELHI', 'BEIJING'];
  const GATES = ['A2', 'A7', 'B3', 'B12', 'C5', 'C9', 'D1', 'D14', 'E6'];

  const B = {
    small: range(1, 12), teen: range(13, 19), tens: [20, 30, 40, 50, 60, 70, 80, 90],
    tricky: range(41, 49).concat(range(51, 59), range(81, 89), range(91, 99)),
    other: range(21, 39).concat(range(61, 79)).filter((n) => n % 10)
  };
  function weak() { return MEA.Store.weakKeys('num:').map((k) => +k.slice(4)).filter((n) => n >= 0 && n <= 100); }

  // varied, adaptive selection across the whole 1–100 range
  function pickNumbers(k) {
    const out = new Set(shuffle(weak()).slice(0, Math.floor(k / 3)));
    const order = ['teen', 'tens', 'tricky', 'small', 'other', 'tricky', 'teen', 'other', 'tens', 'tricky', 'other', 'small'];
    let i = 0;
    while (out.size < k) {
      const b = order[i % order.length];
      out.add(Math.random() < 0.05 ? 100 : pick(B[b])); i++;
    }
    return shuffle(Array.from(out)).slice(0, k);
  }
  function words(n) { return L.numWords(n); }
  function base(n) { return { answer: words(n), answerText: words(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: words(n), log: String(n) }; }

  function boardItem(n) {
    return Object.assign(base(n), {
      kind: 'typing', scene: { type: 'board', flight: 'FLIGHT ' + n, city: pick(CITIES), gate: pick(GATES) },
      prompt: 'Write the flight number in words.', before: 'Flight', placeholder: 'number in words'
    });
  }
  function typeItem(n) {
    return Object.assign(base(n), { kind: 'typing', prompt: 'Write in words: <b class="digits">' + n + '</b>', placeholder: 'e.g. seventy-six' });
  }
  function dictationItem(n) {
    return Object.assign(base(n), { kind: 'typing', audio: words(n), prompt: 'Listen and write the number in words.', placeholder: 'what number do you hear?' });
  }
  const MISTAKES = [
    ['fourty', 40], ['fiveteen', 15], ['eightteen', 18], ['ninty', 90], ['twelf', 12], ['ninteen', 19], ['threeteen', 13],
    ['fourty-five', 45], ['twenty five', 25], ['eigty-two', 82], ['fivety-three', 53], ['seventy-for', 74], ['sixty-too', 62],
    ['ninty-nine', 99], ['fiveteen', 15], ['eightty', 80], ['thirty seven', 37], ['fourty-one', 41]
  ];
  function fixItem(m) {
    const [wrong, n] = m;
    return Object.assign(base(n), {
      kind: 'typing', scene: { type: 'ticket', wrong: wrong.toUpperCase(), digits: n }, sameAsWrong: wrong,
      prompt: 'Find the mistake and write the number correctly.', promptRu: 'Найди ошибку и напиши число правильно.', log: wrong + ' (' + n + ')'
    });
  }
  function confusable(n) {
    const set = new Set([n]);
    if (n >= 13 && n <= 19) set.add((n - 10) * 10);
    if (n % 10 === 0 && n >= 30 && n <= 90) set.add(n / 10 + 10);
    if (n > 20 && n % 10) { set.add(Math.floor(n / 10) + 10 <= 19 ? Math.floor(n / 10) + 10 : n + 1); set.add((n % 10) * 10 + Math.floor(n / 10)); }
    while (set.size < 4) { const d = n + pick([-2, -1, 1, 2, 10, -10]); if (d > 0 && d <= 100) set.add(d); }
    return Array.from(set).slice(0, 4);
  }
  function listenItem(n, asWords) {
    const opts = confusable(n).map((x) => ({ value: String(x), label: asWords ? words(x) : String(x) }));
    return Object.assign(base(n), { kind: 'choice', audio: words(n), options: opts, answer: String(n), mono: !asWords, prompt: 'Listen and choose the number you hear.', log: 'listen: ' + n });
  }
  function builderItem(n) {
    if (n === 100 || n === 0) n = 40;
    const w = words(n);
    if (w.includes('-')) {
      const [t, u] = w.split('-');
      const tenStem = { twenty: ['twen', 'ty'], thirty: ['thir', 'ty'], forty: ['for', 'ty'], fifty: ['fif', 'ty'], sixty: ['six', 'ty'], seventy: ['seven', 'ty'], eighty: ['eigh', 'ty'], ninety: ['nine', 'ty'] }[t];
      const decoy = { forty: 'four', fifty: 'five', eighty: 'eight', ninety: 'nin', twenty: 'two', thirty: 'three', sixty: 'teen', seventy: 'teen' }[t];
      return Object.assign(base(n), { kind: 'builder', tiles: [tenStem[0], tenStem[1], '-', u], extra: [decoy, 'teen'], prompt: 'Build the number: <b class="digits">' + n + '</b>' });
    }
    const extra = { forty: ['u', 'e'], fifteen: ['v', 'e'], eighteen: ['t', 'h'], ninety: ['n', 'i'], twelve: ['f', 'h'], nineteen: ['t', 'a'], fifty: ['v', 'e'], eighty: ['t', 'e'], thirteen: ['e', 'r'] }[w] || ['e', 'a'];
    return Object.assign(base(n), { kind: 'builder', extra, prompt: 'Build the number from letters: <b class="digits">' + n + '</b>' });
  }

  const RULE_1 = '<h3>Numbers 1–20</h3><p>Нажми на число, чтобы услышать его. Числа с оранжевой рамкой пишутся с ловушкой.</p><div data-widget="numbers"></div>' +
    '<div class="rule-grid"><div class="rule-box"><h4>13–19: + teen</h4><p>thir<b>teen</b>, four<b>teen</b>, fif<b>teen</b>, eigh<b>teen</b></p><ul><li><b>13</b> three → <b>thir</b>teen</li><li><b>15</b> five → <b>fif</b>teen</li><li><b>18</b> eight + een → eigh<b>t</b>een (одна t!)</li></ul></div>' +
    '<div class="rule-box"><h4>Запомни</h4><ul><li><b>12</b> twel<b>ve</b> (а не twelf)</li><li><b>19</b> n<b>ine</b>teen — e остаётся</li><li><b>14</b> four<b>teen</b> — u остаётся</li></ul></div></div>';
  const RULE_2 = '<h3>Tens and numbers 21–99</h3><div data-widget="tens"></div>' +
    '<div class="rule-grid"><div class="rule-box"><h4>Десятки: + ty</h4><ul><li><b>40</b> f<b>o</b>rty — <b>без u!</b> (four → forty)</li><li><b>50</b> <b>fif</b>ty</li><li><b>80</b> eigh<b>ty</b> (одна t)</li><li><b>90</b> nin<b>e</b>ty — e остаётся</li></ul></div>' +
    '<div class="rule-box"><h4>21–99: через дефис</h4><p class="mono big">76 = seventy<mark>-</mark>six</p><p>Десятки + дефис + единицы. Без пробела, без «and».</p><div data-widget="builder"></div></div></div>' +
    '<h4>-teen или -ty? Слушай ударение</h4><p>thir<b>TEEN</b> (13) — ударение в конце. <b>THIR</b>ty (30) — ударение в начале.</p><div data-widget="teenty"></div>';

  MEA.Numbers = {
    pickNumbers, words,
    stage() {
      return {
        id: 'numbers', title: 'Numbers Airport', sub: 'Numbers 1–100', icon: 'plane', badge: 'Bonus mission',
        exercises: [
          { id: 'n-r1', type: 'rule', title: 'Check-in: numbers 1–20', task: 'Listen and remember the tricky spellings.', goal: 'Повторить написание чисел 1–20 и ловушки 12, 13, 15, 18, 19.', html: RULE_1 },
          { id: 'n-r2', type: 'rule', title: 'Check-in: tens and 21–99', task: 'Learn how to write tens and two-part numbers.', goal: 'Десятки 20–100, дефис в 21–99, различие -teen / -ty.', html: RULE_2 },
          { id: 'n1', type: 'seq', title: 'Number Airport', task: 'Read the departures board. Write each flight number in words.', taskRu: 'Напиши номер рейса словами.', goal: 'Самостоятельное написание чисел 1–100 без подсказок.', items: () => pickNumbers(8).map(boardItem) },
          { id: 'n2', type: 'seq', title: 'Find the Mistake', task: 'The airport signs have spelling mistakes. Write the numbers correctly.', taskRu: 'Исправь ошибки в табличках.', goal: 'Распознавание типичных орфографических ошибок (fourty, ninty, eightteen…).', items: () => shuffle(MISTAKES.filter((m, i, a) => a.findIndex((x) => x[0] === m[0]) === i)).slice(0, 8).map(fixItem) },
          { id: 'n3', type: 'seq', title: 'Listen and Choose', task: 'Listen to the announcement. Choose the number.', taskRu: 'Послушай и выбери число.', goal: 'Аудирование: различение 13/30, 14/40… и похожих чисел.', items: () => { const ns = shuffle(B.teen).slice(0, 3).concat(shuffle(B.tens.slice(1)).slice(0, 2), pickNumbers(3)); return shuffle(ns).map((n, i) => listenItem(n, i % 2 === 1)); } },
          { id: 'n4', type: 'seq', title: 'Type the Number', task: 'Write each number in words.', taskRu: 'Напиши число словами.', goal: 'Автоматизация письма числительных; составные числа через дефис.', items: () => pickNumbers(10).map(typeItem) },
          { id: 'n5', type: 'match', title: 'Flight Mission', task: 'Help the airport: match the radio calls, flight numbers and words.', taskRu: 'Соедини: аудио → номер рейса, затем номер → слова.', goal: 'Связать звучание, цифру и написание числа.',
            rounds: () => { const ns = pickNumbers(5); const ms = pickNumbers(5); return [
              { title: 'Radio check — match the sound and the flight', pairs: ns.map((n) => ({ l: { s: words(n) }, r: { t: 'Flight ' + n, mono: true } })) },
              { title: 'Gate board — match the flight and the words', pairs: ms.map((n) => ({ l: { t: 'Flight ' + n, mono: true }, r: { t: words(n) } })) }]; } },
          { id: 'n6', type: 'seq', title: 'Number Builder', task: 'Build the numbers from the tiles. Watch out for extra tiles!', taskRu: 'Собери число из букв или частей. Есть лишние плитки.', goal: 'Осознанное построение слова: основа + teen/ty, дефис.', items: () => shuffle([40, 18, 90, 12, 15].slice(0, 3)).concat(shuffle(B.tricky).slice(0, 3)).map(builderItem) },
          { id: 'n7', type: 'seq', title: 'Final Number Challenge', task: '12 questions. Most of them need writing — no hints until you try!', taskRu: 'Итоговая проверка: 12 заданий, в основном письменные.', goal: 'Контроль: самостоятельное написание 1–100 (минимум 80% — значок Number Pilot).', pass: 80, stamp: 'numbers',
            items: () => {
              const ns = pickNumbers(12);
              const its = [typeItem(ns[0]), typeItem(ns[1]), typeItem(ns[2]), boardItem(ns[3]), boardItem(ns[4]), dictationItem(ns[5]), dictationItem(ns[6]),
                fixItem(pick(MISTAKES)), listenItem(pick(B.teen), true), listenItem(pick(B.tens.slice(1)), false), builderItem(ns[7]), typeItem(ns[8])];
              return shuffle(its);
            } }
        ]
      };
    }
  };
})(window.MEA = window.MEA || {});
