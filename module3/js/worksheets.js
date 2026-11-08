/* Printable worksheets: one Classwork and one Homework sheet per lesson, with a teacher's answer key.
   All tasks are original and follow the goals of each Spotlight 5 lesson. */
(function (MEA) {
  'use strict';
  const L = MEA.lang;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* deterministic random so every printout and its key match */
  function rng(seed) { let h = 1779033703 ^ seed.length; for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
  const shuf = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LET = 'abcdefghijklmnop';
  const line = (w) => '<span class="ln" style="width:' + (w || 34) + 'mm"></span>';

  /* ---------- task renderers: each returns {html, key} ---------- */
  const R = {
    pics(t) {
      return { html: '<div class="w-pics">' + t.items.map((it, i) => '<div class="w-pic"><span class="n">' + (i + 1) + '</span>' + MEA.art(it.art) + '<div class="w-write">' + (t.hint ? '<b>' + esc(it.ans[0]) + '</b>' : '') + line(30) + '</div></div>').join('') + '</div>',
        key: t.items.map((it, i) => (i + 1) + ') ' + it.ans).join(' · ') };
    },
    numwords(t) {
      return { html: '<ol class="w-cols2">' + t.nums.map((n) => '<li><b class="dg">' + n + '</b> ' + line(52) + '</li>').join('') + '</ol>', key: t.nums.map((n, i) => (i + 1) + ') ' + (t.ord ? L.ordWords(n) : L.numWords(n))).join(' · ') };
    },
    match(t, r) {
      const order = shuf(t.pairs.map((_, i) => i), r);
      const cell = (c) => (c.art ? MEA.art(c.art) : '') + (c.t ? '<span>' + esc(c.t) + '</span>' : '');
      return { html: '<div class="w-match"><ol>' + t.pairs.map((p) => '<li>' + cell(p.l) + '</li>').join('') + '</ol><ol type="a">' + order.map((i) => '<li>' + cell(t.pairs[i].r) + '</li>').join('') + '</ol></div>' +
          '<p class="w-boxes">' + t.pairs.map((_, i) => (i + 1) + ' <span class="bx"></span>').join(' ') + '</p>',
        key: t.pairs.map((_, i) => (i + 1) + '–' + LET[order.indexOf(i)]).join(', ') };
    },
    gaps(t) {
      return { html: (t.bank ? '<p class="w-bank">' + t.bank.map(esc).join(' &nbsp;·&nbsp; ') + '</p>' : '') + '<ol class="w-list">' + t.items.map((it) => '<li>' + esc(it.s).replace('___', line(it.w || 24)) + '</li>').join('') + '</ol>',
        key: t.items.map((it, i) => (i + 1) + ') ' + it.a).join(' · ') };
    },
    circle(t) {
      return { html: '<ol class="w-list">' + t.items.map((it) => '<li>' + esc(it.s).replace(/\(([^)]+)\)/, (m, g) => '<span class="w-or">' + g.split('/').map((x) => '<i>' + x.trim() + '</i>').join(' / ') + '</span>') + '</li>').join('') + '</ol>',
        key: t.items.map((it, i) => (i + 1) + ') ' + it.a).join(' · ') };
    },
    order(t, r) {
      return { html: '<ol class="w-list">' + t.items.map((a) => { const w = a.replace(/([?.!])$/, ' $1').split(' '); let s; let k = 0; do { s = shuf(w, r); k++; } while (s.join(' ') === w.join(' ') && k < 5);
        return '<li><span class="w-scr">' + s.map(esc).join(' &nbsp;/&nbsp; ') + '</span><br>' + line(150) + '</li>'; }).join('') + '</ol>', key: t.items.map((a, i) => (i + 1) + ') ' + a).join(' · ') };
    },
    odd(t) {
      return { html: '<ol class="w-list">' + t.items.map((it) => '<li>' + it.w.map(esc).join(' &nbsp;–&nbsp; ') + '</li>').join('') + '</ol>', key: t.items.map((it, i) => (i + 1) + ') ' + it.a).join(' · ') };
    },
    tf(t) {
      return { html: (t.text ? '<div class="w-text">' + t.text + '</div>' : '') + '<ol class="w-list w-tf">' + t.items.map((it) => '<li><span>' + esc(it.s) + '</span><span class="tfb"><i>T</i><i>F</i></span></li>').join('') + '</ol>',
        key: t.items.map((it, i) => (i + 1) + ') ' + (it.a ? 'T' : 'F')).join(' · ') };
    },
    qa(t) {
      return { html: (t.text ? '<div class="w-text">' + t.text + '</div>' : '') + (t.scene ? '<div class="w-scene">' + t.scene() + '</div>' : '') +
          '<ol class="w-list">' + t.items.map((it) => '<li>' + esc(it.q) + '<br>' + (it.b ? esc(it.b) + ' ' : '') + line(it.b ? 60 : 150) + (it.e ? ' ' + esc(it.e) : '') + '</li>').join('') + '</ol>',
        key: t.items.map((it, i) => (i + 1) + ') ' + it.a).join(' · ') };
    },
    write(t) {
      return { html: (t.frames ? '<p class="w-bank">' + t.frames.map(esc).join(' &nbsp;·&nbsp; ') + '</p>' : '') + '<div class="w-lines">' + '<span class="wl"></span>'.repeat(t.lines || 6) + '</div>', key: t.key || 'Свободный ответ. Проверьте: ' + (t.check || 'полные предложения, заглавные буквы, точки.') };
    },
    draw(t) {
      return { html: '<div class="w-draw" style="height:' + (t.h || 70) + 'mm">' + (t.base ? '<div class="w-draw-base">' + t.base() + '</div>' : '') + '</div>', key: t.key || 'Проверьте рисунок по инструкции.' };
    },
    sort(t) {
      const rows = Math.max(...Object.values(t.cols).map((a) => a.length));
      const blank = [].concat(...Object.values(t.cols)).every((w) => !w);
      return { html: (blank ? '' : '<p class="w-bank">' + shuf([].concat(...Object.values(t.cols)), rng(t.title)).map(esc).join(' &nbsp;·&nbsp; ') + '</p>') + '<table class="w-tbl"><tr>' + Object.keys(t.cols).map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>' +
          Array.from({ length: rows }, () => '<tr>' + Object.keys(t.cols).map(() => '<td></td>').join('') + '</tr>').join('') + '</table>',
        key: blank ? 'Свободный ответ (комнаты своего дома).' : Object.entries(t.cols).map(([c, w]) => c + ': ' + w.join(', ')).join(' | ') };
    },
    wordsearch(t, r) {
      const N = t.size || 10; const g = Array.from({ length: N }, () => Array(N).fill(''));
      const words = t.words.map((w) => w.replace(/ /g, '').toUpperCase());
      words.forEach((w) => {
        for (let tries = 0; tries < 300; tries++) {
          const down = r() < 0.5, x = Math.floor(r() * (N - (down ? 0 : w.length - 1))), y = Math.floor(r() * (N - (down ? w.length - 1 : 0)));
          if (x < 0 || y < 0) continue;
          let ok = true; for (let i = 0; i < w.length; i++) { const c = g[y + (down ? i : 0)][x + (down ? 0 : i)]; if (c && c !== w[i]) { ok = false; break; } }
          if (!ok) continue; for (let i = 0; i < w.length; i++) g[y + (down ? i : 0)][x + (down ? 0 : i)] = w[i]; break;
        }
      });
      const AB = 'ABCDEFGHIJKLMNOPRSTUVWY';
      return { html: '<div class="w-ws-wrap"><table class="w-ws">' + g.map((row) => '<tr>' + row.map((c) => '<td>' + (c || AB[Math.floor(r() * AB.length)]) + '</td>').join('') + '</tr>').join('') + '</table>' +
          '<ul class="w-ws-list">' + t.words.map((w) => '<li>' + (t.pics ? MEA.art(t.pics[w]) : '<b>' + esc(w) + '</b>') + '</li>').join('') + '</ul></div>',
        key: 'Слова: ' + t.words.join(', ') + ' (по горизонтали → или вертикали ↓)' };
    }
  };

  /* ---------- shared data ---------- */
  const TOWER = [{ n: 0, who: 'Mr Brown (reception)' }, { n: 1, who: 'Captain Lee' }, { n: 2, who: 'Mia and Tom' }, { n: 3, who: 'Ann' }, { n: 4, who: 'Mr Green' }, { n: 5, who: 'Lucy' },
    { n: 6, who: 'Keks the cat', pet: 'cat' }, { n: 7, who: 'John and Bob' }, { n: 8, who: 'Professor Hill' }, { n: 9, who: 'Sara' }, { n: 10, who: 'Helen' }];
  const ROOMART = { 'living room': 'living', kitchen: 'kitchen', bathroom: 'bathroom', bedroom: 'bedroom', hall: 'hall', 'dining room': 'dining', garden: 'garden', garage: 'garage' };
  const room = () => MEA.bedroom.html([{ name: 'football', at: 'under the bed' }, { name: 'cat', at: 'on the bed' }, { name: 'poster', at: 'behind the bed' }, { name: 'computer', at: 'on the desk' }, { name: 'books', at: 'in the bookcase' }, { name: 'lamp', at: 'on the bookcase' }, { name: 'schoolbag', at: 'in front of the wardrobe' }]);
  const emptyRoom = () => MEA.bedroom.html([]);

  /* ---------- sheets ---------- */
  const S = {
    '3a': {
      class: { title: 'At home · Classwork', tasks: [
        { t: 'pics', title: 'Write the rooms.', ru: 'Подпиши комнаты.', hint: true, items: ['kitchen', 'bedroom', 'bathroom', 'living room', 'hall', 'dining room', 'garden', 'garage'].map((w) => ({ art: ROOMART[w], ans: w })) },
        { t: 'numwords', title: 'Flight numbers. Write them in words.', ru: 'Напиши номера рейсов словами (21–99 — через дефис).', nums: [27, 43, 68, 95, 14, 40, 18, 99] },
        { t: 'match', title: 'Match.', ru: 'Соедини сокращение и слово.', pairs: [1, 2, 3, 5, 8, 9, 12, 20].map((n) => ({ l: { t: n + L.ordSuffix(n) }, r: { t: L.ordWords(n) } })) },
        { t: 'qa', title: 'Look at Sky Tower. Answer the questions.', ru: 'Посмотри на дом и ответь.', scene: () => MEA.Engine.Scenes.building({ title: 'SKY TOWER', floors: TOWER }),
          items: [{ q: 'Which floor is Mr Green on?', b: "He's on the", e: 'floor.', a: 'fourth' }, { q: 'Which floor is Sara on?', b: "She's on the", e: 'floor.', a: 'ninth' }, { q: 'Which floor are John and Bob on?', b: "They're on the", e: 'floor.', a: 'seventh' }, { q: 'Who is on the ground floor?', a: 'Mr Brown' }] },
        { t: 'write', title: 'About you.', ru: 'Ответь полными предложениями.', frames: ['Do you live in a house or a flat?', 'Which floor is your flat on?', 'How many rooms are there?'], lines: 4, check: 'I live in a …; It\'s on the … floor; There are … rooms.' }
      ] },
      home: { title: 'At home · Homework', tasks: [
        { t: 'gaps', title: 'Find the mistake. Write the word correctly.', ru: 'Найди ошибку и напиши правильно.', items: [['fourty', 'forty'], ['fiveth', 'fifth'], ['ninty', 'ninety'], ['twelveth', 'twelfth'], ['eightteen', 'eighteen'], ['nineth', 'ninth']].map(([w, a]) => ({ s: w.toUpperCase() + ' → ___', a, w: 40 })) },
        { t: 'wordsearch', title: 'Find 8 rooms.', ru: 'Найди 8 комнат (→ и ↓).', words: ['kitchen', 'bedroom', 'bathroom', 'hall', 'garden', 'garage', 'livingroom', 'diningroom'], size: 11 },
        { t: 'tf', title: 'Read and write T (true) or F (false).', ru: 'Прочитай и отметь T или F.', text: '<p><b>My home</b> — by Max. I live in a block of flats in Moscow. My flat is on the eighth floor and there is a lift. There are four rooms: a living room, a kitchen, a bathroom and my bedroom. There isn\'t a garden, but there is a big park near my block of flats.</p>',
          items: [{ s: 'Max lives in a house.', a: false }, { s: 'His flat is on the eighth floor.', a: true }, { s: 'There is a lift.', a: true }, { s: 'There is a garden.', a: false }] },
        { t: 'numwords', title: 'Write in words.', ru: 'Напиши словами.', nums: [3, 5, 12, 20, 13, 15], ord: true },
        { t: 'write', title: 'My home. Write 5 sentences.', ru: 'Напиши о своём доме (5 предложений).', frames: ['I live in a …', 'My flat is on the … floor.', 'There are … rooms.', 'My favourite room is …'], lines: 6 }
      ] }
    },
    '3b': {
      class: { title: 'Move in! · Classwork', tasks: [
        { t: 'pics', title: 'What is it? Write.', ru: 'Подпиши предметы.', items: ['wardrobe', 'bed', 'desk', 'bookcase', 'mirror', 'bath', 'cooker', 'fridge', 'armchair', 'sofa'].map((w) => ({ art: w, ans: w })) },
        { t: 'sort', title: 'Where is it? Write the words in the table.', ru: 'Запиши слова в нужную комнату.', cols: { bedroom: ['wardrobe', 'bed', 'desk'], bathroom: ['washbasin', 'toilet', 'bath'], kitchen: ['sink', 'cooker', 'fridge'], 'living room': ['sofa', 'armchair', 'coffee table'] } },
        { t: 'gaps', title: "Look at the room. Write is, are, isn't or aren't.", ru: 'Посмотри на комнату и вставь слово.', bank: ['is', 'are', "isn't", "aren't"],
          items: [{ s: 'There ___ a sofa.', a: 'is' }, { s: 'There ___ two armchairs.', a: 'are' }, { s: 'There ___ a TV.', a: "isn't" }, { s: 'There ___ three paintings.', a: 'are' }, { s: 'There ___ any chairs.', a: "aren't" }],
          scene: true },
        { t: 'circle', title: 'Circle the correct word.', ru: 'Обведи правильное слово.', items: [{ s: 'This is Ann. That is (her / she) desk.', a: 'her' }, { s: "Mia and Tom are in (they / their) kitchen.", a: 'their' }, { s: "I'm Alex. This is (my / I) bed.", a: 'my' }, { s: 'We live in a flat. (We / Our) flat is big.', a: 'Our' }, { s: 'Is this (you / your) lamp?', a: 'your' }] },
        { t: 'order', title: 'Put the words in order.', ru: 'Составь предложения.', items: ['Is there a cooker in the kitchen?', "There aren't any chairs in the bathroom.", 'Their flat has got two bedrooms.'] }
      ] },
      home: { title: 'Move in! · Homework', tasks: [
        { t: 'wordsearch', title: 'Find the furniture.', ru: 'Найди 8 предметов мебели.', words: ['sofa', 'bed', 'desk', 'lamp', 'fridge', 'cooker', 'mirror', 'carpet'], size: 10 },
        { t: 'gaps', title: 'Complete with is or are, then answer.', ru: 'Вставь is / are и ответь о своей квартире.', items: [{ s: '___ there a fridge in your kitchen?', a: 'Is' }, { s: '___ there any armchairs in your living room?', a: 'Are' }, { s: '___ there a desk in your bedroom?', a: 'Is' }, { s: '___ there any paintings on your walls?', a: 'Are' }] },
        { t: 'gaps', title: 'Write my, your, his, her, our or their.', ru: 'Впиши притяжательное местоимение.', bank: ['my', 'your', 'his', 'her', 'our', 'their'], items: [{ s: 'Alex is in ___ bedroom. (he)', a: 'his' }, { s: 'Sara loves ___ new flat. (she)', a: 'her' }, { s: 'We like ___ kitchen. (we)', a: 'our' }, { s: 'Is this ___ book? (you)', a: 'your' }, { s: 'Mia and Tom are in ___ garden. (they)', a: 'their' }, { s: 'This is ___ sofa. (I)', a: 'my' }] },
        { t: 'draw', title: 'Draw your dream living room.', ru: 'Нарисуй гостиную своей мечты.', h: 60 },
        { t: 'write', title: 'Describe it: 4 sentences with there is / there are.', ru: 'Опиши её: 4 предложения с there is / there are.', frames: ["There's a …", 'There are two …', "There isn't a …", "There aren't any …"], lines: 4 }
      ] }
    },
    '3c': {
      class: { title: 'My bedroom · Classwork', tasks: [
        { t: 'pics', title: 'Where is Keks? Write the preposition.', ru: 'Где кот? Напиши предлог.', items: [['prep-in', 'in'], ['prep-on', 'on'], ['prep-under', 'under'], ['prep-behind', 'behind'], ['prep-nextto', 'next to'], ['prep-infrontof', 'in front of']].map(([art, ans]) => ({ art, ans })) },
        { t: 'qa', title: "Look at a bedroom. Complete the sentences.", ru: 'Посмотри на комнату и допиши.', scene: room,
          items: [{ q: "Where's the football?", b: "It's", e: 'the bed.', a: 'under' }, { q: 'Where are the books?', b: "They're", e: 'the bookcase.', a: 'in' }, { q: "Where's the poster?", b: "It's", e: 'the bed.', a: 'behind' }, { q: "Where's the computer?", b: "It's", e: 'the desk.', a: 'on' }, { q: "Where's the schoolbag?", b: "It's", e: 'the wardrobe.', a: 'in front of' }] },
        { t: 'circle', title: "Circle It's or They're.", ru: 'Обведи It’s или They’re.', items: [{ s: "Where's the lamp? (It's / They're) on the bookcase.", a: "It's" }, { s: "Where are my shoes? (It's / They're) under the bed.", a: "They're" }, { s: "Where's Keks? (He's / They're) on the bed.", a: "He's" }, { s: "Where are the chairs? (It's / They're) in the kitchen.", a: "They're" }] },
        { t: 'order', title: 'Put the dialogue in order.', ru: 'Составь реплики диалога.', items: ['Is there a desk in your bedroom?', 'Where exactly is it?', "It's under the window next to my bed."] }
      ] },
      home: { title: 'My bedroom · Homework', tasks: [
        { t: 'draw', title: 'Listen to your teacher or read and draw.', ru: 'Прочитай и дорисуй: a ball under the desk, a cat on the chair, a teddy bear in front of the wardrobe, a picture behind the bed.', h: 78, base: emptyRoom, key: 'ball — под столом, кот — на стуле, мишка — перед шкафом, картина — над/за кроватью.' },
        { t: 'tf', title: 'Read and write T or F.', ru: 'Прочитай и отметь T или F.', text: '<p>What\'s my bedroom like? It\'s small and yellow. My bed is next to the window. My desk is in front of the bed, and there\'s a lamp on it. My guitar is behind the door. My dog sleeps under my bed! — <i>Tom</i></p>',
          items: [{ s: "Tom's bedroom is big.", a: false }, { s: 'The bed is next to the window.', a: true }, { s: 'The lamp is on the desk.', a: true }, { s: 'The dog sleeps on the bed.', a: false }] },
        { t: 'write', title: 'Portfolio: my bedroom (30–50 words). Start with a question!', ru: 'Опиши свою спальню (30–50 слов). Начни с вопроса.', frames: ["What's my bedroom like?", "I've got a …", 'My bed is next to …', "There's a … on the wall."], lines: 7, check: 'вопрос в начале, 30–50 слов, 3+ предлога.' }
      ] }
    },
    '3d': {
      class: { title: 'A typical English house · Classwork', tasks: [
        { t: 'match', title: 'Match the pictures and the words.', ru: 'Соедини картинки и слова.', pairs: [['semi', 'semi-detached house'], ['bricks', 'bricks'], ['fireplace', 'fireplace'], ['radiator', 'central heating'], ['frontgarden', 'front garden'], ['backgarden', 'back garden']].map(([a, t]) => ({ l: { art: a }, r: { t } })) },
        { t: 'gaps', title: "Read about Emma's house. Fill in the words.", ru: 'Вставь слова из рамки.', bank: ['are', 'in', 'got', 'on', 'behind'],
          items: [{ s: 'There ___ three rooms downstairs.', a: 'are' }, { s: "There's a big fireplace ___ the living room.", a: 'in' }, { s: "We've ___ central heating in all the rooms.", a: 'got' }, { s: 'The bedrooms have got carpets ___ the floor.', a: 'on' }, { s: 'The back garden is ___ the house.', a: 'behind' }] },
        { t: 'sort', title: "Emma's house: upstairs or downstairs?", ru: 'Распредели комнаты дома Эммы.', cols: { downstairs: ['living room', 'kitchen', 'dining room'], upstairs: ['3 bedrooms', 'bathroom'], outside: ['front garden', 'back garden'] } },
        { t: 'odd', title: 'Cross the odd word out.', ru: 'Вычеркни лишнее слово.', items: [{ w: ['upstairs', 'downstairs', 'fireplace', 'outside'], a: 'fireplace' }, { w: ['bricks', 'garden', 'marble', 'glass'], a: 'garden' }, { w: ['kitchen', 'carpet', 'bedroom', 'hall'], a: 'carpet' }] }
      ] },
      home: { title: 'A typical English house · Homework', tasks: [
        { t: 'sort', title: 'My home: write the rooms.', ru: 'Твой дом: запиши комнаты (если нет второго этажа — пиши всё в первый столбец).', cols: { 'inside (downstairs)': ['', '', '', ''], 'upstairs': ['', ''], 'outside': ['', ''] } },
        { t: 'draw', title: 'Project: draw a plan of a typical flat in Russia. Label the rooms.', ru: 'Нарисуй план типичной квартиры в России и подпиши комнаты.', h: 70 },
        { t: 'write', title: 'Write about it (5 sentences).', ru: 'Опиши план (5 предложений).', frames: ['In Russia, a lot of people live in …', 'There are … rooms.', 'There is a … but there isn\'t a …', 'It is different from an English house because …'], lines: 6 }
      ] }
    },
    eu3: {
      class: { title: 'Viewing a house · Classwork', tasks: [
        { t: 'match', title: 'Match the questions and the answers.', ru: 'Соедини вопрос и ответ.', pairs: [['Which house is it?', 'This one. Here we are.'], ['Which is my bedroom?', 'This one here, next to the bathroom.'], ['Is the kitchen big?', "No, it's quite small."], ['Where are the keys?', "They're on the table."]].map(([l, r]) => ({ l: { t: l }, r: { t: r } })) },
        { t: 'circle', title: 'Who says it? Circle.', ru: 'Кто это говорит: родитель или ребёнок?', items: [{ s: 'Which is my bedroom? (parent / child)', a: 'child' }, { s: "I've got the keys. Let's go in. (parent / child)", a: 'parent' }, { s: "It's great, Mum! (parent / child)", a: 'child' }] },
        { t: 'sort', title: 'oo: /ʊ/ or /uː/? Write the words.', ru: 'Распредели слова по звукам.', cols: { '/ʊ/ book': ['look', 'cook', 'good', 'foot'], '/uː/ room': ['food', 'moon', 'spoon', 'school'] } }
      ] },
      home: { title: 'Viewing a house · Homework', tasks: [
        { t: 'order', title: 'Put the words in order.', ru: 'Составь фразы.', items: ['Which house is it?', "Let's go upstairs.", 'The living room is very big.'] },
        { t: 'write', title: 'Write a short dialogue: you and your mum/dad look at a new flat.', ru: 'Напиши диалог: ты и мама/папа смотрите новую квартиру (6 реплик).', frames: ['Which flat is it?', 'Here we are.', "Let's go in.", 'Which is my bedroom?', "It's great!"], lines: 7 }
      ] }
    },
    er3: {
      class: { title: 'The Taj Mahal · Classwork', tasks: [
        { t: 'match', title: 'Materials. Match.', ru: 'Соедини картинки и материалы.', pairs: [['glass', 'glass'], ['marble', 'marble'], ['bricks', 'brick'], ['stones', 'stones']].map(([a, t]) => ({ l: { art: a }, r: { t } })) },
        { t: 'qa', title: 'Read and answer.', ru: 'Прочитай и ответь.', text: '<p>The Taj Mahal is in Agra, India. It is made of white marble with precious stones. There is a big dome in the centre and four minarets. Outside, there is a garden with long pools.</p>',
          items: [{ q: 'Where is the Taj Mahal?', a: 'in Agra, India' }, { q: 'What is it made of?', a: 'white marble and precious stones' }, { q: 'How many minarets are there?', a: 'four' }, { q: 'What is there in the garden?', a: 'long pools' }] },
        { t: 'tf', title: 'True or false?', ru: 'Верно или неверно?', items: [{ s: 'The Taj Mahal is in China.', a: false }, { s: 'There is a dome in the centre.', a: true }, { s: 'It is made of red brick.', a: false }] }
      ] },
      home: { title: 'The Taj Mahal · Homework', tasks: [
        { t: 'draw', title: 'Project: draw a famous building in Russia.', ru: 'Нарисуй знаменитое здание России.', h: 75 },
        { t: 'write', title: 'Write about it.', ru: 'Опиши его: где, из чего, какого цвета, что внутри и снаружи.', frames: ['… is in …', 'It is made of …', 'It is … (colour)', 'There is/are …', 'Outside, there is …'], lines: 6 }
      ] }
    },
    pc3: {
      class: { title: 'Module 3 · Revision', tasks: [
        { t: 'pics', title: 'Rooms and furniture. Write.', ru: 'Подпиши.', items: [['kitchen', 'kitchen'], ['bedroom', 'bedroom'], ['wardrobe', 'wardrobe'], ['armchair', 'armchair'], ['fridge', 'fridge'], ['mirror', 'mirror']].map(([art, ans]) => ({ art, ans })) },
        { t: 'numwords', title: 'Ordinal numbers.', ru: 'Напиши порядковые числительные.', nums: [1, 2, 3, 5, 8, 9, 12, 20], ord: true },
        { t: 'gaps', title: "is, isn't, are or aren't?", ru: 'Вставь слово.', items: [{ s: 'There ___ four chairs in the kitchen. ✓', a: 'are' }, { s: 'There ___ a TV in my bedroom. ✗', a: "isn't" }, { s: 'There ___ a lamp on the desk. ✓', a: 'is' }, { s: 'There ___ any books on the sofa. ✗', a: "aren't" }] },
        { t: 'qa', title: "Look at Alex's room. Where are the things?", ru: 'Где предметы?', scene: room, items: [{ q: 'the football', a: "It's under the bed." }, { q: 'Keks', a: "He's on the bed." }, { q: 'the lamp', a: "It's on the bookcase." }] }
      ] },
      home: { title: 'Module 3 · Practice test', tasks: [
        { t: 'odd', title: 'Cross the odd word out.', ru: 'Вычеркни лишнее.', items: [{ w: ['sofa', 'armchair', 'cooker', 'coffee table'], a: 'cooker' }, { w: ['bath', 'toilet', 'washbasin', 'desk'], a: 'desk' }, { w: ['hall', 'garage', 'lamp', 'kitchen'], a: 'lamp' }, { w: ['under', 'on', 'carpet', 'behind'], a: 'carpet' }] },
        { t: 'match', title: 'Match the exchanges.', ru: 'Соедини вопрос и ответ.', pairs: [['Which floor is your flat on?', 'The tenth.'], ["What's your new flat like?", "It's lovely."], ["Where's the lamp?", "It's on the desk."], ['Is there a garden?', "No, there isn't."]].map(([l, r]) => ({ l: { t: l }, r: { t: r } })) },
        { t: 'circle', title: 'Circle the correct word.', ru: 'Обведи правильный вариант.', items: [{ s: 'This is Sara. That is (her / his) flat.', a: 'her' }, { s: 'The books are (in / on) the bookcase.', a: 'in' }, { s: 'There (is / are) two windows.', a: 'are' }, { s: 'The bedrooms are (upstairs / downstairs).', a: 'upstairs' }] },
        { t: 'write', title: 'Describe your bedroom (5 sentences).', ru: 'Опиши свою спальню.', lines: 6 }
      ] }
    }
  };
  // a scene for 3B task 3 (Sara's living room)
  S['3b'].class.tasks[2].sceneHtml = () => MEA.Engine.Scenes.roomkit({ title: "Sara's living room", items: [{ art: 'sofa', n: 1 }, { art: 'armchair', n: 2 }, { art: 'painting', n: 3 }, { art: 'window', n: 1 }, { art: 'lamp', n: 1 }] });

  function render(lessonId, type, lesson) {
    const sh = S[lessonId] && S[lessonId][type]; if (!sh) return null;
    const r = rng(lessonId + type);
    const keys = [];
    const body = sh.tasks.map((t, i) => {
      const out = R[t.t](t, r);
      keys.push('<li><b>' + (i + 1) + '.</b> ' + esc(out.key) + '</li>');
      return '<section class="w-task"><h3><span class="tn">' + (i + 1) + '</span>' + esc(t.title) + '</h3><p class="ru">' + esc(t.ru) + '</p>' + (t.sceneHtml ? '<div class="w-scene">' + t.sceneHtml() + '</div>' : '') + out.html + '</section>';
    }).join('');
    return { title: sh.title, body, key: '<ol class="w-key">' + keys.join('') + '</ol>', type };
  }
  MEA.Worksheets = { render, has: (id) => !!S[id] };
})(window.MEA = window.MEA || {});
