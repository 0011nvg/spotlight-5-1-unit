/* Lesson 3B "Move in!" — Spotlight 5, Module 3, SB pp. 48–49.
   Textbook goals: furniture & appliances by room; study skill "remember words with their place";
   there is / there are (+ negatives with any, questions, short answers); possessive adjectives;
   a dialogue about a new flat; talking about your flat; the "say and spell" board game.
   Texts and tasks are original material built on those goals. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick } = MEA.util;

  const F = [
    ['wardrobe', 'шкаф для одежды', 'bedroom', 'wardrobe'], ['bed', 'кровать', 'bedroom', 'bed'], ['lamp', 'лампа', 'bedroom', 'lamp'],
    ['desk', 'письменный стол', 'bedroom', 'desk'], ['bookcase', 'книжный шкаф', 'bedroom', 'bookcase'], ['carpet', 'ковёр', 'bedroom', 'carpet'],
    ['mirror', 'зеркало', 'bathroom', 'mirror'], ['washbasin', 'раковина (в ванной)', 'bathroom', 'washbasin'], ['toilet', 'унитаз, туалет', 'bathroom', 'toilet'], ['bath', 'ванна', 'bathroom', 'bath'],
    ['sink', 'раковина (на кухне)', 'kitchen', 'sink'], ['cooker', 'плита', 'kitchen', 'cooker'], ['fridge', 'холодильник', 'kitchen', 'fridge'], ['chair', 'стул', 'kitchen', 'chair'], ['table', 'стол', 'kitchen', 'table'],
    ['painting', 'картина', 'living room', 'painting'], ['armchair', 'кресло', 'living room', 'armchair'], ['window', 'окно', 'living room', 'window'], ['sofa', 'диван', 'living room', 'sofa'], ['coffee table', 'журнальный столик', 'living room', 'coffeetable']
  ].map(([word, ru, room, art]) => ({ word, ru, room, art }));
  const byWord = (w) => F.find((f) => f.word === w);
  const an = (w) => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;
  const pl = (w) => (w === 'tv' ? 'TVs' : w + 's');
  const NUMW = ['', 'one', 'two', 'three', 'four', 'five'];
  const fMeta = (f) => ({ answer: f.word, answerText: f.word, mode: 'word', pkey: 'furn:' + f.word, plabel: f.ru, ru: f.ru, part: f.art, practiseAudio: f.word, log: f.ru });
  const fTyping = (f, fromRu) => Object.assign(fMeta(f), fromRu
    ? { kind: 'typing', prompt: 'How do you say <b>«' + f.ru + '»</b> in English?', placeholder: 'word in English' }
    : { kind: 'typing', art: f.art, prompt: 'What is it? Write the word.', placeholder: 'word in English' });
  const fListen = (f) => Object.assign(fMeta(f), { kind: 'choice', audio: f.word, prompt: 'Listen and choose the picture.', answer: f.word,
    options: shuffle([f].concat(shuffle(F.filter((x) => x !== f)).slice(0, 3))).map((x) => ({ value: x.word, art: x.art })) });

  // rooms in Sara's new flat (Sky Tower, ninth floor) — used for scene questions
  const SETS = {
    'living room': { has: { sofa: 1, armchair: 2, 'coffee table': 1, painting: 3, window: 1, lamp: 1 }, not: ['TV', 'bookcase', 'bed'] },
    kitchen: { has: { cooker: 1, fridge: 1, sink: 1, table: 1, chair: 4 }, not: ['sofa', 'bath', 'armchair', 'mirror'] },
    bedroom: { has: { bed: 1, wardrobe: 1, desk: 1, lamp: 1, bookcase: 1, carpet: 1 }, not: ['mirror', 'armchair', 'cooker', 'sofa'] },
    bathroom: { has: { bath: 1, washbasin: 1, toilet: 1, mirror: 1 }, not: ['chair', 'carpet', 'fridge', 'painting'] }
  };
  const scene = (room) => ({ type: 'roomkit', title: "Sara's " + room, items: Object.entries(SETS[room].has).map(([w, n]) => ({ art: byWord(w).art, n })) });
  const word = (w) => (w === 'TV' ? 'TV' : w);

  function ynItem() {
    const room = pick(Object.keys(SETS)), S = SETS[room];
    const present = Math.random() < 0.5;
    const w = present ? pick(Object.keys(S.has)) : pick(S.not);
    const plural = present ? S.has[w] > 1 || Math.random() < 0.3 : Math.random() < 0.5;
    const q = plural ? 'Are there any ' + pl(word(w)) + ' in the ' + room + '?' : 'Is there ' + (w === 'TV' ? 'a TV' : an(w)) + ' in the ' + room + '?';
    const a = plural ? (present ? 'Yes, there are.' : "No, there aren't.") : (present ? 'Yes, there is.' : "No, there isn't.");
    return { kind: 'choice', scene: scene(room), prompt: q, options: ['Yes, there is.', "No, there isn't.", 'Yes, there are.', "No, there aren't."], keepOrder: true, answer: a, answerText: a, log: q,
      why: plural ? { 'Yes, there is.': 'Вопрос Are there…? — ответ с are.', "No, there isn't.": 'Вопрос Are there…? — ответ с are / aren\'t.' } : { 'Yes, there are.': 'Вопрос Is there…? — ответ с is.', "No, there aren't.": 'Вопрос Is there…? — ответ с is / isn\'t.' } };
  }
  function verbItem(withNeg) {
    const room = pick(Object.keys(SETS)), S = SETS[room];
    const present = !withNeg || Math.random() < 0.5;
    let s, a;
    if (present) { const w = pick(Object.keys(S.has)), n = S.has[w]; a = n > 1 ? 'are' : 'is'; s = 'There ___ ' + (n > 1 ? NUMW[n] + ' ' + pl(w) : an(w)) + ' in the ' + room + '.'; }
    else { const w = pick(S.not); const plural = Math.random() < 0.5; a = plural ? "aren't" : "isn't"; s = 'There ___ ' + (plural ? 'any ' + pl(word(w)) : (w === 'TV' ? 'a TV' : an(w))) + ' in the ' + room + '.'; }
    return { kind: 'choice', scene: withNeg ? scene(room) : null, prompt: s.replace('___', '<b class="blank">___</b>'), options: withNeg ? ['is', 'are', "isn't", "aren't"] : ['is', 'are'], keepOrder: true, answer: a, answerText: s.replace('___', a), log: s,
      why: { is: 'is — для одного предмета (a/an).', are: 'are — для нескольких предметов.', "isn't": "isn't — одного предмета нет (a/an).", "aren't": "aren't any — нескольких предметов нет." } };
  }
  function howMany() {
    const opts = [['kitchen', 'chair'], ['living room', 'painting'], ['living room', 'armchair']];
    return opts.map(([room, w]) => { const n = SETS[room].has[w]; return { kind: 'typing', scene: scene(room), prompt: 'How many ' + pl(w) + ' are there in the ' + room + '? Write the number in words.', before: 'There are', after: pl(w) + '.', answer: NUMW[n], answerText: NUMW[n], mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: NUMW[n], log: pl(w) }; });
  }

  const POSS = [
    ['This is Sara. That is ___ flat.', ['her', 'she'], 'her'], ['Mia and Tom live on the second floor. ___ flat has got a big kitchen.', ['Their', 'They'], 'Their'],
    ["I'm Malik. This is ___ bedroom.", ['my', 'I'], 'my'], ['Is this ___ book, Ann?', ['your', 'you'], 'your'], ['Captain Lee is a pilot. ___ car is in the garage.', ['His', 'He'], 'His'],
    ['We live in a block of flats. ___ flat is on the fifth floor.', ['Our', 'We'], 'Our'], ['Look at the sofa! ___ colour is green.', ['Its', 'It'], 'Its']
  ];
  const POSS_T = [['(I)', 'This is ___ desk.', 'my'], ['(he)', 'Keks is a cat. ___ bed is under the window.', 'His'], ['(they)', 'Mia and Tom are in ___ living room.', 'their'],
    ['(he)', 'Malik is in ___ bedroom.', 'his'], ['(we)', '___ kitchen is very big.', 'Our'], ['(you)', 'Is that ___ wardrobe?', 'your']];

  const DIALOGUE = [['Ann', "Hi, Sara! What's your new flat like?"], ['Sara', "It's lovely! It's on the ninth floor of Sky Tower."], ['Ann', 'Wow! How many rooms are there?'],
    ['Sara', 'There are four rooms: a living room, a kitchen, a bedroom and a small bathroom.'], ['Ann', 'Has it got any furniture?'],
    ['Sara', "Yes, it has. In the living room there's a big sofa and two armchairs, but there isn't a TV."], ['Ann', 'Is there a cooker in the kitchen?'],
    ['Sara', "Yes, there is. There's a fridge too, but there aren't any chairs."], ['Ann', 'And what about your bedroom?'],
    ['Sara', "There's a bed, a wardrobe and a lamp. And my favourite thing: there's a big window with a view of the planes!"], ['Ann', 'Sounds great!']];
  const dlgHtml = (lines) => '<div class="dialog-txt">' + lines.map(([w, t]) => '<p><b>' + w + ':</b> ' + MEA.util.esc(t) + '</p>').join('') + '</div>';
  const READ = { type: 'text', art: 'sofa', title: "Sara's new flat", html: dlgHtml(DIALOGUE), audio: DIALOGUE.map((l) => l[1]).join(' ') };
  const DREAM = "Hi, I'm Malik. This is my dream room! There's a big bed next to the window. There are two armchairs and a small coffee table. There's a desk with a computer on it, and there's a lamp too. There aren't any paintings on the walls, but there are lots of photos of planes! And there isn't a wardrobe. My clothes are in a big box under the bed!";
  const LISTEN = { type: 'audio', art: 'bed', title: "Radio: Malik's dream room", script: DREAM };
  const FURN_WORDS = F.map((f) => f.word).concat(['chairs', 'paintings', 'books', 'TV', 'television']);

  MEA.registerLesson({
    id: '3b', code: '3B', module: 3, moduleTitle: 'My home, my castle', title: 'Move in!', pages: 'SB pp. 48–49',
    subtitle: 'Furniture · There is / There are · my, your, his, her…',
    destination: { name: 'New Home', code: 'NEW' }, learnedAfter: ['d6', 'f1'],
    vocab: F.map((f) => ({ word: f.word, ru: f.ru, key: 'furn:' + f.word })),
    stages: [
      { id: 'warmup', title: 'Warm-up', sub: 'Remember 3A', icon: 'plane', exercises: [
        { id: 'w1', type: 'seq', title: 'Remember lesson 3A', task: 'A quick check of rooms, floors and numbers.', taskRu: 'Повторим урок 3A.', goal: 'Интервальное повторение: комнаты, порядковые и количественные числа.',
          items: () => {
            const rooms = shuffle([['kitchen', 'kitchen'], ['bathroom', 'bathroom'], ['living room', 'living'], ['bedroom', 'bedroom'], ['hall', 'hall'], ['garage', 'garage']]).slice(0, 2);
            const o = pick([5, 8, 9, 12, 20, 3]); const n = MEA.Numbers.pickNumbers(1)[0];
            return rooms.map(([w, a]) => ({ kind: 'typing', art: a, prompt: 'What room is it?', answer: w, answerText: w, mode: 'word', pkey: 'room:' + w, plabel: w, practiseAudio: w, log: w }))
              .concat([{ kind: 'typing', prompt: 'Write in words: <b class="digits">' + o + L.ordSuffix(o) + '</b>', answer: L.ordWords(o), answerText: L.ordWords(o), mode: 'ordinal', pkey: 'ord:' + o, plabel: o + L.ordSuffix(o), practiseAudio: L.ordWords(o), log: o + L.ordSuffix(o) },
                { kind: 'typing', audio: L.numWords(n), prompt: 'Listen and write the number in words.', answer: L.numWords(n), answerText: L.numWords(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: L.numWords(n), log: String(n) }]);
          } }
      ] },

      { id: 'discover', title: 'Discover', sub: 'Furniture & appliances', icon: 'home', exercises: [
        { id: 'd1', type: 'cards', title: 'What is in the rooms?', task: '<b>Study skill:</b> learn new words together with the place where they are. Look, listen and repeat.', taskRu: 'Запоминай слово вместе с комнатой, где стоит предмет.', goal: 'Семантизация 20 слов (мебель и техника) с опорой на комнату.',
          items: F.map((f) => ({ word: f.word, ru: f.ru, art: f.art, example: "There's " + an(f.word) + ' in the ' + f.room + '.' })) },
        { id: 'd2', type: 'sort', title: 'Which room?', task: 'Tap a word, listen, then put it in the right room.', taskRu: 'Распредели предметы по комнатам.', goal: 'Стратегия запоминания: слово + место.',
          bins: [{ id: 'bedroom', label: 'bedroom', sub: 'спальня' }, { id: 'bathroom', label: 'bathroom', sub: 'ванная' }, { id: 'kitchen', label: 'kitchen', sub: 'кухня' }, { id: 'living room', label: 'living room', sub: 'гостиная' }],
          items: F.filter((f) => !['lamp', 'carpet', 'window', 'table', 'chair'].includes(f.word)).map((f) => ({ t: f.word, bin: f.room, why: 'Подумай, где обычно стоит ' + f.word + '.' })) },
        { id: 'd3', type: 'match', title: 'Picture match', task: 'Match the pictures and the words.', taskRu: 'Соедини картинки и слова.', goal: 'Узнавание слов по картинке.',
          rounds: () => { const r = shuffle(F).slice(0, 10); return [{ pairs: r.slice(0, 5).map((x) => ({ l: { a: x.art }, r: { t: x.word, say: x.word } })) }, { pairs: r.slice(5).map((x) => ({ l: { a: x.art }, r: { t: x.word, say: x.word } })) }]; } },
        { id: 'd4', type: 'seq', title: 'Listen and point', task: 'Listen and choose the picture.', taskRu: 'Послушай и выбери картинку.', goal: 'Аудирование на уровне слова.', items: () => shuffle(F).slice(0, 6).map(fListen) },
        { id: 'd5', type: 'seq', title: 'Spell it!', task: 'Build the words from the letters.', taskRu: 'Собери слово из букв.', goal: 'Орфография новых слов.',
          items: () => shuffle(['wardrobe', 'cooker', 'fridge', 'mirror', 'armchair', 'washbasin', 'carpet', 'bookcase']).slice(0, 5).map((w) => { const f = byWord(w); return Object.assign(fMeta(f), { kind: 'builder', art: f.art, extra: shuffle(['e', 'a', 'o', 'i', 'r', 't']).slice(0, 2), prompt: 'Build the word.' }); }) },
        { id: 'd6', type: 'seq', title: 'Write the words', task: 'Write the words without help.', taskRu: 'Напиши слова сам. coffee table — два слова, armchair и bookcase — одно.', goal: 'Самостоятельное письмо лексики урока.',
          items: () => shuffle(F).slice(0, 12).map((f, i) => fTyping(f, i % 3 === 2)) }
      ] },

      { id: 'learn', title: 'Learn', sub: 'There is / are · my, your…', icon: 'book', exercises: [
        { id: 'l1', type: 'rule', title: 'There is / There are', task: 'How do we say what is in a room?', goal: 'Правило there is / there are: утверждение, отрицание с any, вопрос, краткие ответы.',
          html: '<h3>There is… / There are…</h3><p>Так говорят, что <b>где-то есть</b> предмет. Порядок: <b>There is/are + что + где.</b></p><div data-widget="thereis"></div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Один предмет</th><th>Несколько предметов</th></tr></thead><tbody>' +
            '<tr><th>+</th><td>There <b>is</b> (There\'s) a sofa in the living room.</td><td>There <b>are</b> two armchairs in the living room.</td></tr>' +
            '<tr><th>−</th><td>There <b>isn\'t</b> a TV in the kitchen.</td><td>There <b>aren\'t any</b> chairs in the bathroom.</td></tr>' +
            '<tr><th>?</th><td><b>Is there</b> a table in the kitchen?<br>Yes, there is. / No, there isn\'t.</td><td><b>Are there any</b> chairs in the kitchen?<br>Yes, there are. / No, there aren\'t.</td></tr></tbody></table></div>' +
            '<div class="rule-grid"><div class="rule-box"><h4>Запомни</h4><ul><li><b>is</b> — один предмет (a/an)</li><li><b>are</b> — несколько предметов</li><li><b>any</b> — в отрицаниях и вопросах во множественном числе</li></ul></div>' +
            '<div class="rule-box hot"><h4>a или an?</h4><p><b>an</b> перед гласным звуком: <b>an</b> armchair, <b>an</b> old desk. В остальных случаях <b>a</b>: a sofa, a lamp.</p></div></div>' },
        { id: 'l2', type: 'rule', title: 'my, your, his, her…', task: 'Whose is it?', goal: 'Притяжательные местоимения my, your, his, her, its, our, their.',
          html: '<h3>Possessive adjectives</h3><p>Отвечают на вопрос «чей?» и стоят <b>перед существительным</b>: <b>my</b> room, <b>their</b> flat.</p>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Кто</th><th>Чей</th><th>Пример</th></tr></thead><tbody>' +
            [['I', 'my', 'This is my bed.'], ['you', 'your', 'Is this your desk?'], ['he', 'his', 'Malik is in his bedroom.'], ['she', 'her', 'Sara likes her new flat.'], ['it', 'its', 'The sofa is nice. Its colour is green.'], ['we', 'our', 'Our kitchen is big.'], ['they', 'their', 'Mia and Tom love their flat.']]
              .map(([a, b, c]) => '<tr><td>' + a + '</td><td><b>' + b + '</b></td><td>' + MEA.playBtn(c) + ' ' + c + '</td></tr>').join('') + '</tbody></table></div>' +
            '<div class="rule-box hot"><h4>Ловушки</h4><ul><li><b>its</b> (его/её — о предмете или животном) ≠ <b>it\'s</b> (it is)</li><li><b>their</b> (их) ≠ <b>there</b> (там / there is)</li><li>После притяжательного слова не нужен a/the: <s>the my room</s> → my room</li></ul></div>' }
      ] },

      { id: 'practise', title: 'Practise', sub: 'From easy to hard', icon: 'check', exercises: [
        { id: 'p1', type: 'seq', title: 'is or are?', task: 'Choose is or are.', taskRu: 'Выбери is или are.', goal: 'Различение there is / there are.', items: () => Array.from({ length: 8 }, () => verbItem(false)) },
        { id: 'p2', type: 'seq', title: "Sara's flat: yes or no?", task: 'Look at the room. Answer the questions.', taskRu: 'Посмотри на комнату и ответь кратко.', goal: 'Вопросы Is there / Are there any и краткие ответы.', items: () => Array.from({ length: 7 }, ynItem) },
        { id: 'p3', type: 'seq', title: "is, are, isn't or aren't?", task: 'Look at the room. Complete the sentences.', taskRu: 'Посмотри на комнату: что есть, а чего нет?', goal: 'Утверждение и отрицание (isn\'t a / aren\'t any) по визуальной опоре.', items: () => Array.from({ length: 7 }, () => verbItem(true)) },
        { id: 'p4', type: 'seq', title: 'How many?', task: 'Count and write the number in words.', taskRu: 'Посчитай и напиши число словами.', goal: 'There are + число; письмо числительных.', items: howMany },
        { id: 'p5', type: 'seq', title: 'Whose is it?', task: 'Choose the right word.', taskRu: 'Выбери правильное слово.', goal: 'Притяжательные местоимения против личных.',
          items: () => shuffle(POSS).map(([s, o, a]) => ({ kind: 'choice', prompt: s.replace('___', '<b class="blank">___</b>'), options: o, answer: a, answerText: s.replace('___', a), log: s, why: { [o.find((x) => x !== a)]: 'Перед существительным нужно притяжательное слово (чей?): ' + a + '.' } })) },
        { id: 'p6', type: 'seq', title: 'Write the missing word', task: 'Write my, your, his, her, our or their.', taskRu: 'Впиши притяжательное местоимение.', goal: 'Самостоятельное употребление притяжательных местоимений.',
          items: () => shuffle(POSS_T).map(([who, s, a]) => { const [b, af] = s.split('___'); return { kind: 'typing', prompt: who + ' ' + s.replace('___', '<b class="blank">___</b>'), before: b.trim() || null, after: af.trim(), answer: a, answerText: a, mode: 'word', log: who + ' ' + s }; }) },
        { id: 'p7', type: 'seq', title: 'Make the sentences', task: 'Put the words in the right order.', taskRu: 'Составь предложение.', goal: 'Порядок слов в утверждении и вопросе.',
          items: () => shuffle(['Is there a cooker in the kitchen?', "There aren't any chairs in the bathroom.", 'Are there any books on the desk?', 'Their flat has got two bedrooms.', 'There is a big sofa in our living room.'])
            .map((a) => ({ kind: 'order', answer: a, answerText: a, log: a, tokens: a.replace(/([?.])/g, ' $1').split(/\s+/).filter(Boolean), tipRu: /^(Is|Are)/.test(a) ? 'Вопрос начинается с Is there / Are there.' : 'Начни с There is / There are или с чьего-то предмета.' })) }
      ] },

      { id: 'play', title: 'Play', sub: 'Games', icon: 'star', exercises: [
        { id: 'g1', type: 'memory', title: 'Memory flight', task: 'Find the pairs: a picture and a word.', taskRu: 'Найди пары.', goal: 'Закрепление лексики в игре.', pairs: () => shuffle(F).slice(0, 6) },
        { id: 'g2', type: 'seq', title: 'Name a room', task: 'Your partner names a room. Say two things it has got!', taskRu: 'Выбери два предмета, которые есть в этой комнате.', goal: 'It has got a … and a … (диалог из учебника в игровой форме).',
          items: () => shuffle(['bedroom', 'bathroom', 'kitchen', 'living room']).concat(shuffle(['bedroom', 'kitchen'])).map((room) => {
            const yes = shuffle(F.filter((f) => f.room === room)).slice(0, 2); const no = shuffle(F.filter((f) => f.room !== room && !['lamp', 'carpet', 'window', 'table', 'chair'].includes(f.word))).slice(0, 4);
            return { kind: 'multi', prompt: "It's " + an(room) + '. It has got…', options: yes.concat(no).map((f) => ({ value: f.word, art: f.art, label: f.word })), answers: yes.map((f) => f.word), answerText: 'It has got ' + an(yes[0].word) + ' and ' + an(yes[1].word) + '.', log: room, sayAfter: 'It has got ' + an(yes[0].word) + ' and ' + an(yes[1].word) + '.' };
          }) },
        { id: 'g3', type: 'boardgame', title: 'Spell & Move', task: 'Toss the coin: heads = 1 square, tails = 2 squares. Say and spell the word on your square. Make a mistake — move back one circle!', taskRu: 'Подбрось монетку и иди вперёд. На каждой картинке напиши слово по буквам. Ошибка — шаг назад.', goal: 'Игра из учебника: say and spell the word (table: T-A-B-L-E).',
          squares: ['desk', 'sink', 'chair', 'fridge', 'cooker', 'wardrobe', 'washbasin', 'armchair', 'sofa', 'bookcase', 'bath', 'mirror', 'carpet'].map((w) => { const f = byWord(w); return { word: f.word, art: f.art, ru: f.ru, pkey: 'furn:' + f.word }; }) }
      ] },

      { id: 'challenge', title: 'Challenge', sub: 'Read · Listen · Speak · Write', icon: 'star', exercises: [
        { id: 'c1', type: 'seq', title: 'Reading 1: What is it about?', task: 'Read the first two lines only. What is the dialogue about?', taskRu: 'Прочитай только первые две реплики. О чём диалог?', goal: 'Понимание основной темы по началу текста.',
          panel: Object.assign({}, READ, { html: dlgHtml(DIALOGUE.slice(0, 2)), audio: DIALOGUE[0][1] + ' ' + DIALOGUE[1][1] }),
          items: [{ kind: 'choice', prompt: 'The dialogue is about…', options: ["Sara's new flat", 'a new airport', "Ann's holiday"], answer: "Sara's new flat", answerText: "Sara's new flat", log: 'topic' }] },
        { id: 'c2', type: 'seq', title: 'Reading 2: Check the facts', task: 'Read the whole dialogue. Answer the questions.', taskRu: 'Прочитай весь диалог и ответь.', goal: 'Детальное понимание диалога.', panel: READ,
          items: [
            { kind: 'tf', prompt: "1. Sara's flat is on the ninth floor.", answer: true, answerText: 'True', log: 'ninth floor' },
            { kind: 'tf', prompt: '2. There are five rooms in the flat.', answer: false, answerText: 'False — there are four rooms.', log: 'five rooms' },
            { kind: 'tf', prompt: '3. There is a TV in the living room.', answer: false, answerText: "False — there isn't a TV.", log: 'TV' },
            { kind: 'multi', prompt: 'What furniture is there in the living room?', options: ['sofa', 'armchair', 'TV', 'coffee table', 'bookcase', 'lamp'].map((w) => ({ value: w, label: w, art: w === 'TV' ? 'tv' : byWord(w).art })), answers: ['sofa', 'armchair'], answerText: 'a sofa and two armchairs', log: 'living room furniture' },
            { kind: 'tf', prompt: '4. There are chairs in the kitchen.', answer: false, answerText: "False — there aren't any chairs.", log: 'chairs' },
            { kind: 'tf', prompt: "5. Sara's favourite thing is the big window.", answer: true, answerText: 'True', log: 'favourite thing' }
          ] },
        { id: 'c3', type: 'seq', title: 'Reading 3: Answer the questions', task: 'Write the answers.', taskRu: 'Напиши ответы.', goal: 'Письменные ответы на вопросы по тексту.', panel: READ,
          items: [
            { kind: 'typing', prompt: 'How many rooms are there in the flat?', before: 'There are', after: 'rooms.', answer: 'four', answerText: 'four', mode: 'number', pkey: 'num:4', plabel: '4', practiseAudio: 'four', log: 'rooms' },
            Object.assign({ kind: 'typing', prompt: 'Which floor is the flat on?', before: "It's on the", after: 'floor.', log: 'floor' }, { answer: 'ninth', answerText: 'ninth', mode: 'ordinal', pkey: 'ord:9', plabel: '9th', practiseAudio: 'ninth' }),
            { kind: 'typing', prompt: 'What isn\'t there in the kitchen?', before: "There aren't any", after: '.', answer: 'chairs', answerText: 'chairs', log: 'kitchen' },
            { kind: 'typing', prompt: 'What is there in the bedroom? Name one thing.', before: "There's a", after: '.', answer: ['bed', 'wardrobe', 'lamp', 'window', 'big window'], answerText: 'bed / wardrobe / lamp', log: 'bedroom' }
          ] },
        { id: 'c4', type: 'seq', title: "Listening 1: Malik's dream room", task: 'Listen. What is there in the room? Choose five things.', taskRu: 'Послушай и выбери 5 предметов, которые есть в комнате.', goal: 'Аудирование с выборочным извлечением информации.', panel: LISTEN,
          items: [{ kind: 'multi', autoplay: false, prompt: 'What is there in the dream room?', options: ['bed', 'armchair', 'coffee table', 'desk', 'lamp', 'wardrobe', 'painting', 'sofa'].map((w) => ({ value: w, label: w, art: byWord(w).art })), answers: ['bed', 'armchair', 'coffee table', 'desk', 'lamp'], answerText: 'bed, armchairs, coffee table, desk, lamp', log: 'dream room' }] },
        { id: 'c5', type: 'gapfill', title: 'Listening 2: Complete the text', task: 'Listen again and fill in the gaps.', taskRu: 'Послушай ещё раз и заполни пропуски.', goal: 'Аудирование: точное извлечение слов и форм there is / are.', panel: LISTEN, revealScript: true,
          template: '<div class="advert"><div class="adv-tag">MY DREAM ROOM</div><p>There\'s a big [[bed]] next to the [[window]].</p><p>There [[are]] [[n:two/2]] armchairs and a small coffee table.</p><p>There aren\'t [[any]] paintings on the walls.</p><p>There [[isn\'t/is not]] a wardrobe.</p></div>' },
        { id: 'c6', type: 'speak', title: 'Read the dialogue aloud', task: 'Listen to each line, then read it aloud. You can be Ann or Sara.', taskRu: 'Прочитай диалог вслух по ролям.', goal: 'Техника чтения, интонация вопросов.',
          lines: DIALOGUE.slice(0, 8).map(([w, t]) => ({ text: t, ru: w })) },
        { id: 'c7', type: 'speak', title: 'Talk about your new flat', task: 'Imagine you have got a new flat. Talk about it like Sara.', taskRu: 'Представь, что у тебя новая квартира. Расскажи о ней по образцу Сары.', goal: 'Диалог/монолог с there is/are по модели урока.',
          notes: '<div class="rule-grid"><div class="rule-box"><h4>Questions</h4><ul><li>What\'s your new flat like?</li><li>How many rooms are there?</li><li>Is there a … in the kitchen?</li><li>Are there any … in the living room?</li></ul></div><div class="rule-box"><h4>Answers</h4><ul><li>It\'s great / lovely / small.</li><li>There are … rooms.</li><li>There\'s a … but there isn\'t a …</li><li>There are two … but there aren\'t any …</li></ul></div></div>',
          lines: [{ text: 'Answer the questions about your new flat (5–6 sentences).', model: false }, { text: 'Describe one room. Say what there is and what there isn\'t.', model: false }] },
        { id: 'c8', type: 'writing', title: 'Message: my new flat', task: 'Write a message to a friend about your new (or dream) flat.', taskRu: 'Напиши сообщение другу о своей новой (или воображаемой) квартире.', goal: 'Письменная речь: there is/are, отрицания, притяжательные местоимения.',
          frames: ['Hi …!', 'My new flat is great!', 'There are … rooms.', "In the living room there's a …", "There isn't a …", "There aren't any …", 'My favourite room is …', 'Bye for now!'],
          need: 5,
          checks: [
            { label: 'Use "There is" or "There\'s"', test: (t) => /\bthere(\s+is|'s|’s)\b/i.test(t) },
            { label: 'Use "There are"', test: (t) => /\bthere\s+are\b/i.test(t) },
            { label: 'Say what there isn\'t / aren\'t', test: (t) => /\b(isn['’]t|aren['’]t|is not|are not)\b/i.test(t) },
            { label: 'Name 4 or more things (furniture)', test: (t) => FURN_WORDS.filter((w) => new RegExp('\\b' + w + '\\b', 'i').test(t)).length >= 4 },
            { label: 'Use my, our, his, her or their', test: (t) => /\b(my|our|his|her|their|your)\b/i.test(t) },
            { label: '5 sentences or more', test: (t) => (t.match(/[.!?](\s|$)/g) || []).length >= 5 }
          ],
          model: "Hi Ann! My new flat is great! There are three rooms: a living room, a kitchen and my bedroom. In the living room there's a big sofa and two armchairs, but there isn't a TV. There aren't any chairs in the kitchen yet. My favourite room is my bedroom because there's a big window with a view of the planes. Bye for now! Malik" }
      ] },

      { id: 'final', title: 'Final Mission', sub: 'Lesson check', icon: 'passport', exercises: [
        { id: 'f1', type: 'seq', title: 'Final Mission: New Home', task: '14 questions about the whole lesson. Get 70% or more to get your passport stamp!', taskRu: 'Итоговая проверка урока: 70% и больше — штамп в паспорт.', goal: 'Контроль: мебель, there is/are, притяжательные местоимения.', pass: 70, stamp: '3b',
          items: () => {
            const f = shuffle(F); const p = shuffle(POSS); const o = pick([4, 5, 8, 9, 12, 15]);
            const multiRoom = pick(['bedroom', 'bathroom', 'kitchen', 'living room']);
            const yes = shuffle(F.filter((x) => x.room === multiRoom)).slice(0, 2); const no = shuffle(F.filter((x) => x.room !== multiRoom)).slice(0, 4);
            const its = [fTyping(f[0]), fTyping(f[1]), fTyping(f[2]), fTyping(f[3], true), fListen(f[4]), verbItem(false), verbItem(true), ynItem(), howMany()[Math.floor(Math.random() * 3)],
              { kind: 'choice', prompt: p[0][0].replace('___', '<b class="blank">___</b>'), options: p[0][1], answer: p[0][2], answerText: p[0][0].replace('___', p[0][2]), log: p[0][0] },
              (() => { const [who, s, a] = pick(POSS_T); const [b, af] = s.split('___'); return { kind: 'typing', prompt: who + ' ' + s.replace('___', '<b class="blank">___</b>'), before: b.trim() || null, after: af.trim(), answer: a, answerText: a, log: who + ' ' + s }; })(),
              { kind: 'order', answer: 'Are there any chairs in the kitchen?', answerText: 'Are there any chairs in the kitchen?', log: 'word order' },
              { kind: 'multi', prompt: "It's " + an(multiRoom) + '. It has got…', options: yes.concat(no).map((x) => ({ value: x.word, art: x.art, label: x.word })), answers: yes.map((x) => x.word), answerText: yes.map((x) => x.word).join(' and '), log: multiRoom },
              { kind: 'typing', prompt: 'Lesson 3A check! Write in words: <b class="digits">' + o + L.ordSuffix(o) + '</b>', answer: L.ordWords(o), answerText: L.ordWords(o), mode: 'ordinal', pkey: 'ord:' + o, plabel: o + L.ordSuffix(o), practiseAudio: L.ordWords(o), log: o + L.ordSuffix(o) }];
            return shuffle(its);
          } }
      ] },

      { id: 'progress', title: 'My Progress', sub: 'Results & tips', icon: 'user', exercises: [
        { id: 'r1', type: 'report', title: 'My Progress: lesson 3B', task: 'Your results, mistakes and what to practise next.', goal: 'Рефлексия: результаты, ошибки, рекомендации.' }
      ] }
    ]
  });
})(window.MEA = window.MEA || {});
