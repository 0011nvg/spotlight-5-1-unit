/* Lesson 3D Culture Corner "A Typical English House" — Spotlight 5, Module 3, SB p. 51.
   Textbook goals: predicting words from a title and picture; a text about a semi-detached house
   (upstairs / downstairs, bricks, fireplace, central heating, carpets, front / back garden);
   filling in missing words; notes under headings (type, inside, outside, special features); completing a plan;
   project: a plan of a typical home in your country. Texts and tasks are original. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick, esc } = MEA.util;

  const W = [
    { word: 'semi-detached house', ru: 'дом на две семьи (с общей стеной)', art: 'semi', ex: 'Our house is a semi-detached house.' },
    { word: 'bricks', ru: 'кирпичи', art: 'bricks', ex: 'The house is made of red bricks.' },
    { word: 'upstairs', ru: 'наверху, на втором этаже', art: 'updown', ex: 'The bedrooms are upstairs.' },
    { word: 'downstairs', ru: 'внизу, на первом этаже', art: 'updown', ex: 'The kitchen is downstairs.' },
    { word: 'fireplace', ru: 'камин', art: 'fireplace', ex: "There's a fireplace in the living room." },
    { word: 'central heating', ru: 'центральное отопление', art: 'radiator', ex: "We've got central heating in all the rooms." },
    { word: 'front garden', ru: 'сад перед домом', art: 'frontgarden', ex: 'There are flowers in the front garden.' },
    { word: 'back garden', ru: 'сад за домом', art: 'backgarden', ex: 'The back garden is behind the house.' }
  ];
  const wMeta = (w) => ({ answer: w.word, answerText: w.word, mode: 'word', pkey: 'cult:' + w.word, plabel: w.ru, ru: w.ru, part: w.art, practiseAudio: w.word, log: w.ru });
  const PICS = W.filter((w) => w.word !== 'upstairs' && w.word !== 'downstairs');
  const wTyping = (w, fromRu) => Object.assign(wMeta(w), fromRu ? { kind: 'typing', prompt: 'How do you say <b>«' + w.ru + '»</b> in English?', placeholder: 'in English' } : { kind: 'typing', art: w.art, prompt: 'What is it? Write the word(s).', placeholder: 'in English' });
  const wListen = (w) => Object.assign(wMeta(w), { kind: 'choice', audio: w.word, prompt: 'Listen and choose the picture.', answer: w.word, options: shuffle([w].concat(shuffle(PICS.filter((x) => x !== w)).slice(0, 3))).map((x) => ({ value: x.word, art: x.art })) });

  const TEXT = "Hi! My name's Emma and I'm from England. I live in Manchester with my mum, my dad and my little brother. Our house is a semi-detached house. It's made of red bricks, like a lot of houses in England. There are three rooms downstairs: a living room, a kitchen and a dining room. There's a big fireplace in our living room, but we don't use it very often because we've got central heating in all the rooms. Upstairs, there are three bedrooms and a bathroom. All the bedrooms have got carpets on the floor, so they're warm and cosy. Outside, there's a small front garden with flowers and a big back garden behind the house. My favourite place is the back garden because there's a swing and an apple tree!";
  const PANEL = { type: 'text', art: 'semi', title: 'A Typical English House', html: '<p>' + esc(TEXT).replace(/(semi-detached house|bricks|downstairs|Upstairs|fireplace|central heating|carpets|front garden|back garden)/g, '<b>$1</b>') + '</p>', audio: 'A typical English house. ' + TEXT,
    glossary: { 'semi-detached house': 'дом на две семьи', bricks: 'кирпичи', downstairs: 'внизу', upstairs: 'наверху', fireplace: 'камин', 'central heating': 'центральное отопление', carpets: 'ковровые покрытия', 'front garden': 'сад перед домом', 'back garden': 'сад за домом' } };
  const LISTEN = { type: 'audio', art: 'semi', title: "Emma's house", script: TEXT, sub: 'Listen and check your answers. Use Slow if you need it.' };

  const TF = [['Emma is from Manchester, in England.', true, 'True'], ['Her house is made of wood.', false, 'False — it is made of red bricks.'], ['There are three rooms downstairs.', true, 'True'],
    ['The family uses the fireplace every day.', false, "False — they don't use it very often."], ['The bathroom is upstairs.', true, 'True'], ['The back garden is in front of the house.', false, 'False — it is behind the house.']];
  const tf = (x) => ({ kind: 'tf', prompt: x[0], answer: x[1], answerText: x[2], log: x[0] });
  const UD = [['Where is the kitchen in Emma\'s house?', 'downstairs'], ['Where are the bedrooms?', 'upstairs'], ['Where is the dining room?', 'downstairs'], ['Where is the bathroom?', 'upstairs'], ['Where is the fireplace?', 'downstairs']];
  const ud = (x) => ({ kind: 'choice', prompt: x[0], options: ['upstairs', 'downstairs'], keepOrder: true, answer: x[1], answerText: x[1], log: x[0] });

  MEA.registerLesson({
    id: '3d', code: '3D', module: 3, moduleTitle: 'My home, my castle', title: 'A typical English house', pages: 'SB p. 51 · Culture Corner',
    subtitle: 'Semi-detached house · upstairs / downstairs · a plan', destination: { name: 'Culture Corner', code: 'UK' }, learnedAfter: ['d4', 'f1'],
    vocab: W.map((w) => ({ word: w.word, ru: w.ru, key: 'cult:' + w.word })),
    stages: [
      { id: 'warmup', title: 'Warm-up', sub: 'Remember 3A–3C', icon: 'plane', exercises: [
        { id: 'w1', type: 'seq', title: 'Remember Module 3', task: 'Rooms, furniture and prepositions.', taskRu: 'Повторим модуль 3.', goal: 'Интервальное повторение 3A–3C перед текстом.',
          items: () => {
            const room = pick([['kitchen', 'kitchen'], ['living room', 'living'], ['bathroom', 'bathroom'], ['dining room', 'dining']]);
            const furn = pick([['wardrobe', 'wardrobe'], ['armchair', 'armchair'], ['fridge', 'fridge'], ['carpet', 'carpet']]);
            const prep = pick([['under', 'prep-under', 'the table'], ['behind', 'prep-behind', 'the box'], ['in front of', 'prep-infrontof', 'the box'], ['next to', 'prep-nextto', 'the box']]);
            return [
              { kind: 'typing', art: room[1], prompt: 'What room is it?', answer: room[0], answerText: room[0], pkey: 'room:' + room[0], plabel: room[0], practiseAudio: room[0], log: room[0] },
              { kind: 'typing', art: furn[1], prompt: 'What is it?', answer: furn[0], answerText: furn[0], pkey: 'furn:' + furn[0], plabel: furn[0], practiseAudio: furn[0], log: furn[0] },
              { kind: 'typing', art: prep[1], prompt: 'Where is Biscuit?', before: 'Biscuit is', after: prep[2] + '.', answer: prep[0], answerText: prep[0], pkey: 'prep:' + prep[0], plabel: prep[0], practiseAudio: prep[0], log: prep[0] },
              { kind: 'choice', art: 'semi', prompt: 'Look at the picture and the title «A Typical English House». What is the text about?', options: ['a house in England', 'a flat in Moscow', 'a hotel near the airport'], answer: 'a house in England', answerText: 'a house in England', log: 'predict' }
            ];
          } }
      ] },
      { id: 'discover', title: 'Discover', sub: 'House words', icon: 'home', exercises: [
        { id: 'd1', type: 'cards', title: 'An English house', task: 'Look, listen and repeat.', taskRu: 'Слушай и повторяй новые слова.', goal: 'Семантизация лексики Culture Corner.', items: W.map((w) => ({ word: w.word, ru: w.ru, art: w.art, example: w.ex })) },
        { id: 'd2', type: 'match', title: 'Picture match', task: 'Match the pictures and the words.', taskRu: 'Соедини картинки и слова.', goal: 'Узнавание новых слов.', rounds: () => [{ pairs: shuffle(PICS).map((w) => ({ l: { a: w.art }, r: { t: w.word, say: w.word } })) }] },
        { id: 'd3', type: 'seq', title: 'Listen and point', task: 'Listen and choose the picture.', taskRu: 'Послушай и выбери картинку.', goal: 'Аудирование на уровне слова.', items: () => shuffle(PICS).map(wListen) },
        { id: 'd4', type: 'seq', title: 'Write the words', task: 'Write the words. semi-detached has a hyphen!', taskRu: 'Напиши слова. В semi-detached есть дефис.', goal: 'Письмо новой лексики.',
          items: () => shuffle(PICS).map((w, i) => wTyping(w, i % 3 === 2)).concat([{ kind: 'choice', art: 'updown', prompt: 'The bedrooms are on the top floor. They are…', options: ['upstairs', 'downstairs'], keepOrder: true, answer: 'upstairs', answerText: 'upstairs', log: 'upstairs' }]) }
      ] },
      { id: 'read', title: 'Read', sub: "Emma's house", icon: 'book', exercises: [
        { id: 'r1', type: 'seq', title: 'Reading 1: Predict and check', task: 'Read the text. Which five words can you find in it?', taskRu: 'Прочитай текст и отметь пять слов, которые в нём есть.', goal: 'Прогнозирование и проверка (ознакомительное чтение).', panel: PANEL,
          items: [{ kind: 'multi', prompt: 'Which five words are in the text?', options: ['bricks', 'downstairs', 'fireplace', 'garden', 'bedrooms', 'lift', 'balcony', 'garage', 'sofa'].map((w) => ({ value: w, label: w })), answers: ['bricks', 'downstairs', 'fireplace', 'garden', 'bedrooms'], answerText: 'bricks, downstairs, fireplace, garden, bedrooms', log: 'five words' }] },
        { id: 'r2', type: 'gapfill', title: 'Reading 2: Missing words', task: 'Fill in the missing words (1–5). Then listen and check.', taskRu: 'Впиши пропущенные слова, затем послушай и проверь.', goal: 'Грамматика в контексте: there are, предлоги, have got.', panel: LISTEN,
          template: '<div class="advert"><div class="adv-tag">EMMA\'S HOUSE</div><p>Hi! My name\'s Emma and I\'m <b>from</b> England. Our house is a semi-detached house. It\'s made of red bricks. There [[are]] three rooms downstairs: a living room, a kitchen and a dining room. There\'s a big fireplace [[in]] our living room, but we\'ve [[got]] central heating in all the rooms. Upstairs, there are three bedrooms and a bathroom. All the bedrooms have got carpets [[on]] the floor. Outside, there\'s a small front garden and a big back garden [[behind]] the house.</p></div>' },
        { id: 'r3', type: 'seq', title: 'Reading 3: True or false?', task: 'Read the text again.', taskRu: 'Верно или неверно?', goal: 'Детальное понимание текста.', panel: PANEL, items: TF.map(tf) },
        { id: 'r4', type: 'sort', title: 'Reading 4: Make notes', task: 'Put the notes under the right headings.', taskRu: 'Распредели заметки по заголовкам: тип дома, внутри, снаружи, особенности.', goal: 'Структурирование информации (заметки по заголовкам) — опора для пересказа.',
          bins: [{ id: 'type', label: 'Type', sub: 'тип дома' }, { id: 'in', label: 'Inside', sub: 'внутри' }, { id: 'out', label: 'Outside', sub: 'снаружи' }, { id: 'sp', label: 'Special features', sub: 'особенности' }],
          items: [['semi-detached', 'type'], ['made of red bricks', 'type'], ['3 rooms downstairs', 'in'], ['3 bedrooms upstairs', 'in'], ['front garden with flowers', 'out'], ['big back garden', 'out'], ['a fireplace', 'sp'], ['central heating', 'sp'], ['carpets in the bedrooms', 'sp']].map(([t, bin]) => ({ t, bin })) },
        { id: 'r5', type: 'gapfill', title: 'Reading 5: Complete the plan', task: "Complete the plan of Emma's house.", taskRu: 'Подпиши комнаты на плане дома Эммы.', goal: 'Перенос информации из текста на план (как в учебнике, упр. 4).',
          template: '<div class="plan"><div><h5>Downstairs</h5><div class="plan-floor"><div class="plan-room static wide">front garden</div><div class="plan-room"><small>1) l…</small>[[living room]]</div><div class="plan-room"><small>2) k…</small>[[kitchen]]</div><div class="plan-room wide"><small>3) d…</small>[[dining room]]</div><div class="plan-room static wide">back garden</div></div></div>' +
            '<div><h5>Upstairs</h5><div class="plan-floor"><div class="plan-room"><small>4) b…</small>[[bedroom]]</div><div class="plan-room"><small>5) b…</small>[[bedroom]]</div><div class="plan-room"><small>6) b…</small>[[bedroom]]</div><div class="plan-room"><small>7) ba…</small>[[bathroom]]</div></div></div></div>' },
        { id: 'r6', type: 'seq', title: 'Upstairs or downstairs?', task: "Where are the rooms in Emma's house?", taskRu: 'Где эти комнаты в доме Эммы — наверху или внизу?', goal: 'Закрепление upstairs / downstairs.', items: () => shuffle(UD).map(ud) }
      ] },
      { id: 'speak', title: 'Speak', sub: 'Tell about the house', icon: 'star', exercises: [
        { id: 's1', type: 'speak', title: "Tell about Emma's house", task: 'Use your notes (type, inside, outside, special features) and tell about Emma\'s house.', taskRu: 'Расскажи о доме Эммы по заметкам.', goal: 'Пересказ с опорой на заметки (упр. 3 учебника).',
          notes: '<div class="rule-grid"><div class="rule-box"><h4>Type</h4><p>Emma\'s house is a … house. It\'s made of …</p></div><div class="rule-box"><h4>Inside</h4><p>Downstairs there are … Upstairs there are …</p></div><div class="rule-box"><h4>Outside</h4><p>There\'s a … and a …</p></div><div class="rule-box"><h4>Special features</h4><p>It has got … but …</p></div></div>',
          lines: [{ text: "Emma's house is a semi-detached house.", ru: 'образец' }, { text: 'There are three bedrooms upstairs.', ru: 'образец' }, { text: "Now tell about Emma's house (5–6 sentences).", model: false }] }
      ] },
      { id: 'project', title: 'Project', sub: 'A home in my country', icon: 'map', exercises: [
        { id: 'pr1', type: 'writing', widget: 'planmaker', title: 'Project: a typical home in my country', task: 'Make a plan of a typical home in Russia (or your own home). Then write about it and present it to your teacher.', taskRu: 'Составь план типичного жилья в России (или своего дома), опиши его и расскажи учителю.', goal: 'Проект (портфолио): план и описание типичного жилья своей страны, сопоставление культур.',
          frames: ['In Russia, a lot of people live in …', 'A typical flat is in a …', 'It has got … rooms:', 'There is a …', 'There are …', "There isn't a …", 'The kitchen is next to …', 'It is different from an English house because …'],
          need: 4,
          checks: [
            { label: 'Say what type of home it is (flat / house)', test: (t) => /\b(flat|house|block of flats|semi-detached)\b/i.test(t) },
            { label: 'Name 4 or more rooms', test: (t) => ['living room', 'kitchen', 'bedroom', 'bathroom', 'hall', 'dining room', 'toilet', 'balcony'].filter((w) => new RegExp('\\b' + w, 'i').test(t)).length >= 4 },
            { label: 'Use there is / there are', test: (t) => /\bthere\s+(is|are)\b|\bthere['’]s\b/i.test(t) },
            { label: 'Compare with an English house', test: (t) => /\b(english|england|different|but)\b/i.test(t) },
            { label: '5 sentences or more', test: (t) => (t.match(/[.!?](\s|$)/g) || []).length >= 5 }
          ],
          model: 'In Russia, a lot of people live in flats. A typical flat is in a big block of flats. It has got four rooms: a living room, two bedrooms and a kitchen. There is a hall, a bathroom and a toilet too. There is a balcony, but there isn\'t a garden. It is different from an English house because it hasn\'t got an upstairs and a downstairs.' }
      ] },
      { id: 'final', title: 'Final Mission', sub: 'Module check', icon: 'passport', exercises: [
        { id: 'f1', type: 'seq', title: 'Final Mission: Culture Corner', task: '14 questions about this lesson and Module 3. Get 70% or more to get your passport stamp!', taskRu: 'Итоговая проверка: 70% и больше — штамп в паспорт.', goal: 'Контроль 3D и обобщающее повторение модуля 3.', pass: 70, stamp: '3d',
          items: () => {
            const p = shuffle(PICS), t = shuffle(TF), u = shuffle(UD), n = MEA.Numbers.pickNumbers(1)[0], o = pick([3, 5, 8, 9, 12, 20]);
            const its = [wTyping(p[0]), wTyping(p[1]), wTyping(p[2], true), wListen(p[3]), tf(t[0]), tf(t[1]), ud(u[0]), ud(u[1]),
              { kind: 'choice', prompt: 'There <b class="blank">___</b> three bedrooms upstairs.', options: ['is', 'are'], keepOrder: true, answer: 'are', answerText: 'are', log: 'there are' },
              { kind: 'choice', prompt: 'The back garden is <b class="blank">___</b> the house.', options: ['behind', 'on', 'in'], keepOrder: true, answer: 'behind', answerText: 'behind', log: 'behind' },
              { kind: 'typing', art: pick(['kitchen', 'bathroom', 'bedroom']), prompt: 'Module 3 check: what room is it?', answer: ['kitchen', 'bathroom', 'bedroom'], answerText: 'the room in the picture', log: 'room' },
              { kind: 'order', answer: 'There is a fireplace in the living room.', answerText: 'There is a fireplace in the living room.', log: 'word order' },
              { kind: 'typing', prompt: 'Write in words: <b class="digits">' + o + L.ordSuffix(o) + '</b>', answer: L.ordWords(o), answerText: L.ordWords(o), mode: 'ordinal', pkey: 'ord:' + o, plabel: o + L.ordSuffix(o), practiseAudio: L.ordWords(o), log: o + L.ordSuffix(o) },
              { kind: 'typing', prompt: 'Write in words: <b class="digits">' + n + '</b>', answer: L.numWords(n), answerText: L.numWords(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: L.numWords(n), log: String(n) }];
            // the room item must check the room actually shown
            const r = its[10]; r.answer = r.art === 'kitchen' ? 'kitchen' : r.art === 'bathroom' ? 'bathroom' : 'bedroom'; r.answerText = r.answer; r.pkey = 'room:' + r.answer; r.plabel = r.answer; r.practiseAudio = r.answer;
            return shuffle(its);
          } }
      ] },
      { id: 'progress', title: 'My Progress', sub: 'Results & tips', icon: 'user', exercises: [
        { id: 'r9', type: 'report', title: 'My Progress: Culture Corner', task: 'Your results, mistakes and what to practise next.', goal: 'Рефлексия по уроку и модулю.' }
      ] }
    ]
  });
})(window.MEA = window.MEA || {});
