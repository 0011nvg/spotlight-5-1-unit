/* End of Module 3 — Spotlight 5 SB pp. 52–54:
   English in Use 3 "Viewing a house" (functional phrases, /ʊ/–/uː/), Extensive Reading 3 "Taj Mahal" (Art & Design),
   Progress Check 3 (same five parts and points as the textbook: 21 + 20 + 25 + 16 + 18 = 100).
   All dialogues, texts and test items are original. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick, esc } = MEA.util;
  const report = (title) => ({ id: 'progress', title: 'My Progress', sub: 'Results & tips', icon: 'user', exercises: [{ id: 'r1', type: 'report', title: title, goal: 'Рефлексия.' }] });

  /* ================= English in Use 3 ================= */
  const PHRASES = [['Which house is it, Mum?', 'Malik'], ['This one. Here we are.', 'Mum'], ["Let's go in.", 'Mum'], ['The living room is very big!', 'Malik'], ["Let's go upstairs.", 'Mum'], ['Which is my bedroom?', 'Malik'], ["It's great, Mum!", 'Malik']];
  const DLG = [['Malik', 'Which house is it, Mum?'], ['Mum', 'This one, with the red door. Here we are.'], ['Malik', "Wow! It's really nice, and look at that big tree!"], ['Mum', "I've got the keys. Let's go in."],
    ['Malik', 'The living room is very big!'], ['Mum', "Yes, but the kitchen is quite small. Let's go upstairs."], ['Malik', 'Which is my bedroom?'], ['Mum', "This one here, next to the bathroom. It's got a big window."], ['Malik', "I can see the airport from here! It's great, Mum!"]];
  const dlgHtml = '<div class="dialog-txt">' + DLG.map(([w, t]) => '<p><b>' + w + ':</b> ' + esc(t) + '</p>').join('') + '</div>';
  const DPANEL = { type: 'text', art: 'keys', title: 'Viewing a house', html: dlgHtml, audio: DLG.map((d) => d[1]).join(' ') };
  const OO = [['book', 'u'], ['cook', 'u'], ['look', 'u'], ['good', 'u'], ['foot', 'u'], ['wood', 'u'], ['room', 'uu'], ['food', 'uu'], ['moon', 'uu'], ['spoon', 'uu'], ['school', 'uu'], ['pool', 'uu']];

  MEA.registerLesson({
    id: 'eu3', code: 'EiU', module: 3, moduleTitle: 'My home, my castle', title: 'Viewing a house', pages: 'SB p. 52 · English in Use 3',
    subtitle: 'Which house is it? · Let\'s go in · /ʊ/ and /uː/', destination: { name: 'House viewing', code: 'KEY' }, learnedAfter: ['e2'],
    vocab: PHRASES.map(([p]) => ({ word: p, ru: '', key: 'eu:' + p })),
    stages: [
      { id: 'phrases', title: 'Listen & say', sub: 'Useful phrases', icon: 'home', exercises: [
        { id: 'e1', type: 'speak', title: 'Useful phrases', task: 'Listen and repeat the phrases. People say them when they look at a new house.', taskRu: 'Послушай и повтори фразы для осмотра дома.', goal: 'Функциональные фразы «Viewing a house».',
          lines: PHRASES.map(([t]) => ({ text: t })) },
        { id: 'e2', type: 'seq', title: 'Who says it?', task: 'Malik and his mum are looking at a new house. Who says each sentence?', taskRu: 'Кто это говорит — Малик или мама?', goal: 'Понимание ролей в диалоге (упр. 1b).', panel: DPANEL,
          items: () => PHRASES.map(([t, who]) => ({ kind: 'choice', prompt: '«' + esc(t) + '»', options: ['Malik', 'Mum'], keepOrder: true, answer: who, answerText: who, log: t })) }
      ] },
      { id: 'dialogue', title: 'Dialogue', sub: 'Read and understand', icon: 'book', exercises: [
        { id: 'e3', type: 'seq', title: 'What is "it"?', task: 'Read the dialogue. What do the words in bold mean?', taskRu: 'Что обозначают выделенные слова? (упр. 2a)', goal: 'Понимание местоимений-заместителей в тексте.', panel: DPANEL,
          items: [
            { kind: 'choice', prompt: '<b>It</b> is quite small.', options: ['the kitchen', 'the living room', 'the tree'], answer: 'the kitchen', answerText: 'the kitchen', log: 'small' },
            { kind: 'choice', prompt: '<b>It</b>\'s got a big window.', options: ['my bedroom', 'the bathroom', 'the house'], answer: 'my bedroom', answerText: 'my bedroom', log: 'window' },
            { kind: 'choice', prompt: '<b>This one</b>, with the red door.', options: ['the house', 'the key', 'the kitchen'], answer: 'the house', answerText: 'the house', log: 'this one' },
            { kind: 'choice', prompt: '<b>This one</b> here, next to the bathroom.', options: ["Malik's bedroom", 'the living room', 'the garden'], answer: "Malik's bedroom", answerText: "Malik's bedroom", log: 'this one here' }
          ] },
        { id: 'e4', type: 'seq', title: 'Which is their house?', task: 'Read the dialogue again. Look at the pictures. Which is their new house?', taskRu: 'Какой дом их? Ищи подсказки в диалоге.', goal: 'Поиск деталей в тексте (упр. 2b).', panel: DPANEL,
          items: [{ kind: 'choice', prompt: 'Which is their house?', options: [{ value: 'A', art: 'houseA', label: 'A' }, { value: 'B', art: 'houseB', label: 'B' }], keepOrder: true, answer: 'B', answerText: 'B — red door and a big tree', log: 'house', explain: 'Подсказки: the red door, a big tree.' }] },
        { id: 'e5', type: 'seq', title: 'Make the phrases', task: 'Put the words in order.', taskRu: 'Составь фразу.', goal: 'Запоминание функциональных фраз.',
          items: () => shuffle(['Which house is it?', "Let's go upstairs.", 'Which is my bedroom?', 'This one. Here we are.']).map((a) => ({ kind: 'order', answer: a, answerText: a, log: a, tokens: a.replace(/([?.])/g, ' $1').split(/\s+/).filter(Boolean) })) },
        { id: 'e6', type: 'speak', title: 'Portfolio: act it out', task: 'Imagine your parents want to buy a new house or flat. Act out the dialogue with your teacher. Use the phrases!', taskRu: 'Разыграй диалог: родители показывают тебе новый дом. Можно записать себя.', goal: 'Ролевая игра (упр. 3, portfolio).',
          lines: DLG.map(([w, t]) => ({ text: t, ru: w })) }
      ] },
      { id: 'sounds', title: 'Pronunciation', sub: '/ʊ/ and /uː/', icon: 'star', exercises: [
        { id: 'e7', type: 'rule', title: 'Reading rules: oo', task: 'Two sounds of oo.', goal: 'Правила чтения oo: /ʊ/ и /uː/.',
          html: '<h3>oo: /ʊ/ or /uː/?</h3><div class="rule-grid"><div class="rule-box"><h4>/ʊ/ — короткий</h4><p>Обычно перед <b>k</b>: b<b>oo</b>k, l<b>oo</b>k, c<b>oo</b>k. И в словах good, foot, wood.</p><p class="words">' + ['book', 'look', 'cook', 'good'].map((w) => MEA.playBtn(w, w)).join(' ') + '</p></div>' +
            '<div class="rule-box"><h4>/uː/ — долгий</h4><p>Тяни звук: r<b>oo</b>m, f<b>oo</b>d, m<b>oo</b>n, sp<b>oo</b>n.</p><p class="words">' + ['room', 'food', 'moon', 'spoon'].map((w) => MEA.playBtn(w, w)).join(' ') + '</p></div></div>' },
        { id: 'e8', type: 'sort', title: '/ʊ/ or /uː/?', task: 'Tap a word, listen, then put it in the right group.', taskRu: 'Распредели слова по звукам.', goal: 'Фонематический слух: /ʊ/ vs /uː/.',
          bins: [{ id: 'u', label: '/ʊ/', sub: 'short: book' }, { id: 'uu', label: '/uː/', sub: 'long: room' }], items: OO.map(([t, bin]) => ({ t, bin })) },
        { id: 'e9', type: 'speak', title: 'Say it right', task: 'Listen and say the sentences.', taskRu: 'Произнеси предложения.', goal: 'Произношение /ʊ/ и /uː/ во фразах.',
          lines: [{ text: 'Look at the book in my room.' }, { text: 'Mum cooks good food at noon.' }, { text: 'There is a pool next to the school.' }] }
      ] },
      report('My Progress: English in Use 3')
    ]
  });

  /* ================= Extensive Reading 3: Taj Mahal ================= */
  const TAJ = 'The Taj Mahal is in Agra, a city in India. It is one of the most famous buildings in the world, and it is one of the New Seven Wonders of the World. It is about 370 years old. The building is made of white marble, and there are precious stones in the walls. In the morning the marble looks pink, in the afternoon it looks white, and in the evening it looks gold! There is a big dome in the centre and there are four tall minarets, one at each corner. Outside, there is a beautiful garden with long pools. Every year, millions of people visit the Taj Mahal.';
  const TPANEL = { type: 'text', art: 'taj', title: 'The Taj Mahal', html: '<p>' + esc(TAJ).replace(/\b(marble|precious stones|dome|minarets|pools|walls)\b/g, '<b>$1</b>') + '</p>', audio: TAJ,
    glossary: { marble: 'мрамор', 'precious stones': 'драгоценные камни', dome: 'купол', minarets: 'минареты', pools: 'бассейны, водоёмы', walls: 'стены' } };
  const TW = [['glass', 'стекло', 'glass'], ['marble', 'мрамор', 'marble'], ['brick', 'кирпич', 'bricks'], ['stones', 'камни', 'stones'], ['dome', 'купол', 'dome'], ['minaret', 'минарет', 'minaret'], ['pool', 'бассейн, водоём', 'pool'], ['wall', 'стена', 'wall']].map(([word, ru, art]) => ({ word, ru, art }));
  const twMeta = (w) => ({ answer: w.word, answerText: w.word, mode: 'word', pkey: 'taj:' + w.word, plabel: w.ru, ru: w.ru, part: w.art, practiseAudio: w.word, log: w.ru });
  const TTF = [['The Taj Mahal is in China.', false, 'False — it is in Agra, India.'], ['It is made of white marble.', true, 'True'], ['There are two minarets.', false, 'False — there are four minarets.'],
    ['The marble looks gold in the evening.', true, 'True'], ['There is a garden with long pools.', true, 'True'], ['It is about 100 years old.', false, 'False — it is about 370 years old.']];

  MEA.registerLesson({
    id: 'er3', code: 'ER', module: 3, moduleTitle: 'My home, my castle', title: 'The Taj Mahal', pages: 'SB p. 53 · Extensive Reading 3',
    subtitle: 'Art & Design · materials · a famous building', destination: { name: 'Agra, India', code: 'IND' }, learnedAfter: ['t3'],
    vocab: TW.map((w) => ({ word: w.word, ru: w.ru, key: 'taj:' + w.word })),
    stages: [
      { id: 'materials', title: 'Materials', sub: 'Art & Design', icon: 'home', exercises: [
        { id: 't1', type: 'cards', title: 'Materials and parts', task: 'Look, listen and repeat: what can buildings be made of?', taskRu: 'Материалы и части здания.', goal: 'Лексика: glass, marble, brick, stones; dome, minaret, pool, wall.',
          items: TW.map((w) => ({ word: w.word, ru: w.ru, art: w.art, example: { glass: 'Windows are made of glass.', marble: 'The Taj Mahal is made of marble.', brick: 'My house is made of brick.', stones: 'There are precious stones in the walls.', dome: 'There is a big dome in the centre.', minaret: 'There are four minarets.', pool: 'There are long pools in the garden.', wall: 'The walls are white.' }[w.word] })) },
        { id: 't2', type: 'match', title: 'Picture match', task: 'Match the pictures and the words.', taskRu: 'Соедини картинки и слова.', goal: 'Узнавание лексики.', rounds: () => [{ pairs: shuffle(TW).slice(0, 6).map((w) => ({ l: { a: w.art }, r: { t: w.word, say: w.word } })) }] },
        { id: 't3', type: 'seq', title: 'Write the words', task: 'Write the words.', taskRu: 'Напиши слова.', goal: 'Письмо лексики.', items: () => shuffle(TW).slice(0, 6).map((w) => Object.assign(twMeta(w), { kind: 'typing', art: w.art, prompt: 'What is it?' })) }
      ] },
      { id: 'reading', title: 'Read', sub: 'The Taj Mahal', icon: 'book', exercises: [
        { id: 't4', type: 'seq', title: 'What is it made of?', task: 'Read the text. What is the Taj Mahal made of? Choose two.', taskRu: 'Из чего сделан Тадж-Махал? Выбери два ответа.', goal: 'Поиск информации (упр. 1b).', panel: TPANEL,
          items: [{ kind: 'multi', prompt: 'The Taj Mahal is made of…', options: ['marble', 'stones', 'glass', 'brick'].map((w) => ({ value: w, label: w, art: w === 'brick' ? 'bricks' : w })), answers: ['marble', 'stones'], answerText: 'white marble and precious stones', log: 'made of' }] },
        { id: 't5', type: 'seq', title: 'Complete the sentences', task: 'Read and complete the sentences.', taskRu: 'Дополни предложения по тексту (упр. 2).', goal: 'Детальное чтение, письменный ответ.', panel: TPANEL,
          items: [
            { kind: 'typing', prompt: 'Where is the Taj Mahal?', before: 'The Taj Mahal is in', after: '.', answer: ['Agra', 'India', 'Agra, India', 'Agra in India'], answerText: 'Agra, India', mode: 'phrase', log: 'place' },
            { kind: 'typing', prompt: 'What is in the centre?', before: 'There is a big', after: 'in the centre.', answer: 'dome', answerText: 'dome', pkey: 'taj:dome', plabel: 'купол', practiseAudio: 'dome', log: 'centre' },
            { kind: 'typing', prompt: 'What is at each corner?', before: 'There are four', after: '.', answer: ['minarets', 'tall minarets'], answerText: 'minarets', log: 'corners' },
            { kind: 'typing', prompt: 'What is there in the garden?', before: 'In the garden there are long', after: '.', answer: 'pools', answerText: 'pools', log: 'garden' },
            { kind: 'choice', prompt: 'How old is it?', options: ['about 37 years old', 'about 370 years old', 'about 3,700 years old'], keepOrder: true, answer: 'about 370 years old', answerText: 'about 370 years old', log: 'age' }
          ] },
        { id: 't6', type: 'seq', title: 'Right or wrong?', task: 'Your partner describes the Taj Mahal. Some sentences are wrong. Find them!', taskRu: 'Найди неверные утверждения (упр. 3).', goal: 'Проверка понимания; подготовка к игре «исправь меня».', panel: TPANEL,
          items: TTF.map(([p, a, t]) => ({ kind: 'tf', prompt: p, answer: a, answerText: t, log: p })) },
        { id: 't7', type: 'speak', title: 'Describe the Taj Mahal', task: 'Make notes: name, place, colour/material, inside, outside. Describe the Taj Mahal to your teacher. Say one wrong sentence — your teacher corrects you!', taskRu: 'Опиши Тадж-Махал по заметкам; специально скажи одну ошибку — пусть учитель тебя поправит.', goal: 'Монолог по заметкам + игра «найди ошибку» (упр. 3).',
          notes: '<div class="rule-grid"><div class="rule-box"><h4>Name & place</h4><p>The Taj Mahal is in …</p></div><div class="rule-box"><h4>Colour / material</h4><p>It is made of … It looks … in the …</p></div><div class="rule-box"><h4>Outside</h4><p>There is a … There are four …</p></div></div>',
          lines: [{ text: 'Describe the Taj Mahal (5–6 sentences, one of them wrong!).', model: false }] }
      ] },
      { id: 'project', title: 'Project', sub: 'A famous building in Russia', icon: 'map', exercises: [
        { id: 't8', type: 'writing', title: 'Project: a famous building in my country', task: 'Choose a famous building in Russia (for example, Saint Basil\'s Cathedral, the Winter Palace or a building in your city). Write about it. Think about: floors, colour, material, rooms, inside/outside, special features.', taskRu: 'Выбери известное здание в России и опиши его. Потом нарисуй его и представь учителю.', goal: 'Проект (portfolio): описание знаменитого здания своей страны.',
          frames: ['… is in …', 'It is made of …', 'It is … and …', 'There is a … in the centre.', 'There are … domes / floors / rooms.', 'Outside, there is …', 'Every year, … people visit it.'],
          need: 4,
          checks: [
            { label: 'Say where it is (is in …)', test: (t) => /\bis in\b/i.test(t) },
            { label: 'Say what it is made of', test: (t) => /\bmade of\b/i.test(t) },
            { label: 'Name a colour', test: (t) => /\b(white|red|green|blue|yellow|gold|grey|pink|orange|brown|black)\b/i.test(t) },
            { label: 'Use there is / there are', test: (t) => /\bthere\s+(is|are)\b|\bthere['’]s\b/i.test(t) },
            { label: '5 sentences or more', test: (t) => (t.match(/[.!?](\s|$)/g) || []).length >= 5 }
          ],
          model: "Saint Basil's Cathedral is in Moscow, in Red Square. It is made of red brick and stone. It is very colourful: red, green, blue, yellow and white. There are nine churches inside, and there are a lot of domes. Outside, there is a big square. Every year, millions of people visit it." }
      ] },
      report('My Progress: The Taj Mahal')
    ]
  });

  /* ================= Progress Check 3 ================= */
  const DIN = { type: 'roomkit', title: 'Our dining room', items: [{ art: 'chair', n: 4 }, { art: 'table', n: 1 }, { art: 'carpet', n: 1 }, { art: 'painting', n: 1 }, { art: 'window', n: 2 }] };
  const P1 = [['four chairs', 'are'], ['a table', 'is'], ['a carpet', 'is'], ['a lamp', "isn't"], ['a painting', 'is'], ['two windows', 'are'], ['any books', "aren't"]];
  const P2 = [[['wardrobe', 'bed', 'cooker', 'desk'], 'cooker', 'cooker — кухня, остальное — спальня'], [['fridge', 'sink', 'bath', 'cooker'], 'bath', 'bath — ванная, остальное — кухня'], [['sofa', 'armchair', 'coffee table', 'toilet'], 'toilet', 'toilet — ванная'],
    [['kitchen', 'hall', 'lamp', 'bathroom'], 'lamp', 'lamp — предмет, остальное — комнаты'], [['under', 'behind', 'next to', 'carpet'], 'carpet', 'carpet — предмет, остальное — предлоги']];
  const P3Q = [['Which floor is your flat on?', "It's on the ninth floor."], ["What's your new house like?", "It's lovely!"], ['Where are my books?', "They're on the desk."], ['Which house is it?', 'This one, with the red door.'], ['Is there a garage?', 'Yes, there is.']];
  const P4 = [5, 3, 1, 9, 12, 20, 15, 2];
  const P5 = [['The football is', 'the bed.', 'under'], ['Keks is', 'the bed.', 'on'], ['The books are', 'the bookcase.', 'in'], ['The poster is', 'the bed.', 'behind'], ['The chair is', 'the desk.', 'in front of'], ['The schoolbag is', 'the wardrobe.', 'in front of']];
  const BR = () => ({ type: 'bedroom', objects: [{ name: 'football', at: 'under the bed' }, { name: 'cat', at: 'on the bed' }, { name: 'poster', at: 'behind the bed' }, { name: 'computer', at: 'on the desk' }, { name: 'books', at: 'in the bookcase' }, { name: 'lamp', at: 'on the bookcase' }, { name: 'schoolbag', at: 'in front of the wardrobe' }] });
  const CAN = ['I can talk and write about my house and my bedroom.', 'I can say where things are in a room.', 'I can talk about typical houses in my country.', 'I can talk about famous buildings.'];

  MEA.registerLesson({
    id: 'pc3', code: 'PC3', module: 3, moduleTitle: 'My home, my castle', title: 'Progress Check 3', pages: 'SB p. 54',
    subtitle: 'Module 3 test · 100 points', destination: { name: 'Module 3 complete', code: 'M3' },
    vocab: [],
    stages: [
      { id: 'test', title: 'Progress Check', sub: '100 points', icon: 'passport', exercises: [
        { id: 'pc', type: 'seq', test: true, title: 'Progress Check 3', task: 'One try for each question — like a real test! Points: part 1 — 3, part 2 — 4, part 3 — 5, part 4 — 2, part 5 — 3.', taskRu: 'Контрольная модуля 3: одна попытка на вопрос. Баллы как в учебнике, всего 100. 70+ — штамп M3.', goal: 'Контроль модуля 3 в формате Progress Check учебника (21 + 20 + 25 + 16 + 18 = 100).', pass: 70, stamp: 'pc3',
          items: () => [].concat(
            P1.map(([t, a], i) => ({ kind: 'choice', w: 3, scene: DIN, prompt: '<small class="part">Part 1 · ' + (i + 1) + '/7</small> There <b class="blank">___</b> ' + t + '.', options: ['is', "isn't", 'are', "aren't"], keepOrder: true, answer: a, answerText: 'There ' + a + ' ' + t + '.', log: 'There … ' + t })),
            P2.map(([o, a, why], i) => ({ kind: 'choice', w: 4, prompt: '<small class="part">Part 2 · ' + (i + 1) + '/5</small> Find the odd word out.', options: o, answer: a, answerText: a, explain: why, log: o.join(' – ') })),
            P3Q.map(([q, a], i) => ({ kind: 'choice', w: 5, prompt: '<small class="part">Part 3 · ' + (i + 1) + '/5</small> ' + esc(q), options: P3Q.map((x) => x[1]), keepOrder: true, answer: a, answerText: a, log: q })),
            P4.map((n, i) => ({ kind: 'typing', w: 2, prompt: '<small class="part">Part 4 · ' + (i + 1) + '/8</small> Write the ordinal number: <b class="digits">' + n + L.ordSuffix(n) + '</b>', answer: L.ordWords(n), answerText: L.ordWords(n), mode: 'ordinal', pkey: 'ord:' + n, plabel: n + L.ordSuffix(n), practiseAudio: L.ordWords(n), log: n + L.ordSuffix(n) })),
            P5.map(([b, a, ans], i) => ({ kind: 'typing', w: 3, scene: BR(), prompt: '<small class="part">Part 5 · ' + (i + 1) + '/6</small> Look at the room. Fill in: on, under, in, behind, in front of.', before: b, after: a, answer: ans, answerText: ans, log: b + ' … ' + a }))) },
        { id: 'can', type: 'seq', title: 'Now I can…', task: 'Think about Module 3. What can you do in English now?', taskRu: 'Самооценка: что ты теперь умеешь?', goal: 'Рефлексия «Now I can…» (самооценка по учебнику).',
          items: CAN.map((c) => ({ kind: 'poll', prompt: c, options: ['Yes, I can!', 'Not yet'], reply: { 'Yes, I can!': 'Great job, Malik!', 'Not yet': 'No problem! Open My Words and repeat the lesson.' }, log: c })) }
      ] },
      report('My Progress: Module 3')
    ]
  });
})(window.MEA = window.MEA || {});
