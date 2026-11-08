/* Lesson 3A "At home" — Spotlight 5, Module 3 (My home, my castle), SB pp. 46–47.
   Goals from the textbook: rooms & types of home; ordinal numbers 1st–20th; "Which floor is … on?";
   predicting content (reading); listening to an advert; /θ/ – /ð/; describing your home (speaking, writing).
   All texts and tasks below are original material built on those goals. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick } = MEA.util;

  const ROOMS = [
    { word: 'living room', ru: 'гостиная', art: 'living', example: 'We watch TV in the living room.', clue: 'watch TV on the sofa' },
    { word: 'kitchen', ru: 'кухня', art: 'kitchen', example: 'Mum cooks dinner in the kitchen.', clue: 'cook dinner' },
    { word: 'bathroom', ru: 'ванная комната', art: 'bathroom', example: 'I have a bath in the bathroom.', clue: 'have a bath' },
    { word: 'bedroom', ru: 'спальня', art: 'bedroom', example: 'I sleep in my bedroom.', clue: 'sleep' },
    { word: 'hall', ru: 'прихожая, холл', art: 'hall', example: 'My coat is in the hall.', clue: 'take off your coat and shoes' },
    { word: 'dining room', ru: 'столовая', art: 'dining', example: 'We have lunch in the dining room.', clue: 'have lunch at a big table' },
    { word: 'garden', ru: 'сад', art: 'garden', example: 'My dog plays in the garden.', clue: 'play outside with the dog' },
    { word: 'garage', ru: 'гараж', art: 'garage', example: "Dad's car is in the garage.", clue: 'park the car' }
  ];
  const HOMES = [
    { word: 'house', ru: 'дом (частный)', art: 'house', example: 'My grandma lives in a house with a garden.' },
    { word: 'block of flats', ru: 'многоквартирный дом', art: 'flats', example: 'I live in a block of flats.' }
  ];
  const ART = Object.fromEntries(ROOMS.concat(HOMES).map((r) => [r.word, r.art]));
  const roomMeta = (r) => ({ answer: r.word, answerText: r.word, mode: 'word', pkey: 'room:' + r.word, plabel: r.ru, ru: r.ru, part: r.art, practiseAudio: r.word, log: r.ru });
  const ordMeta = (n) => ({ answer: L.ordWords(n), answerText: L.ordWords(n), mode: 'ordinal', pkey: 'ord:' + n, plabel: n + L.ordSuffix(n), practiseAudio: L.ordWords(n), log: n + L.ordSuffix(n) });
  const ordLabel = (n) => n + L.ordSuffix(n);

  // Sky Tower: our own building for floor questions
  const TOWER = [
    { n: 0, who: 'Mr Brown (reception)' }, { n: 1, who: 'Captain Lee' }, { n: 2, who: 'Mia and Tom' }, { n: 3, who: 'Ann' },
    { n: 4, who: 'Mr Green' }, { n: 5, who: 'Lucy' }, { n: 6, who: 'Keks the cat', pet: 'cat' },
    { n: 7, who: 'John and Bob' }, { n: 8, who: 'Professor Hill' }, { n: 9, who: 'Sara' }, { n: 10, who: 'Helen' }
  ];
  const tower = (mark) => ({ type: 'building', title: 'SKY TOWER', floors: TOWER, mark });

  const TRAP_ORD = [1, 2, 3, 5, 8, 9, 12, 20];
  function pickOrd(k) {
    const weak = MEA.Store.weakKeys('ord:').map((x) => +x.slice(4));
    const out = new Set(shuffle(weak).slice(0, Math.floor(k / 3)));
    shuffle(TRAP_ORD).slice(0, Math.ceil(k / 2)).forEach((n) => out.size < k && out.add(n));
    while (out.size < k) out.add(1 + Math.floor(Math.random() * 20));
    return shuffle(Array.from(out));
  }
  const ordTyping = (n) => Object.assign(ordMeta(n), { kind: 'typing', prompt: 'Write in words: <b class="digits">' + ordLabel(n) + '</b>', placeholder: 'e.g. fourth' });
  const roomTyping = (r, fromRu) => Object.assign(roomMeta(r), fromRu
    ? { kind: 'typing', prompt: 'How do you say <b>«' + r.ru + '»</b> in English?', placeholder: 'room in English' }
    : { kind: 'typing', art: r.art, prompt: 'What room is it? Write the word.', placeholder: 'room in English' });
  const roomListen = (r) => Object.assign(roomMeta(r), { kind: 'choice', audio: r.word, prompt: 'Listen and choose the picture.',
    options: shuffle([r].concat(shuffle(ROOMS.filter((x) => x !== r)).slice(0, 3))).map((x) => ({ value: x.word, art: x.art })), answer: r.word });

  function liftItem(n, from) {
    const phrase = n === 0 ? 'the ground floor' : 'the ' + L.ordWords(n) + ' floor';
    return { kind: 'lift', audio: 'Go to ' + phrase + ', please.', from, answer: n, answerText: n === 0 ? 'G (ground floor)' : n + ' (' + phrase + ')', prompt: 'Listen to the passenger and press the right button.', log: 'lift: ' + phrase, explain: phrase,
      why: L.teenTyPair ? 'Слушай окончание: -teenth — это 13–19 этаж, без -teen — 1–9.' : '' };
  }
  function liftSet(k) {
    const pool = shuffle([3, 13, 5, 15, 8, 18, 4, 14, 9, 19, 2, 12, 1, 11, 20, 6, 16, 7, 17, 10]);
    const ns = [0].concat(pool.slice(0, k - 1)); let from = 0;
    return shuffle(ns).map((n) => { const it = liftItem(n, from); from = n; return it; });
  }

  /* ---------- texts (original) ---------- */
  const READING = {
    type: 'text', art: 'tower', title: 'A Home in the Tower!', glossary: {
      unusual: 'необычный', 'control tower': 'диспетчерская вышка', pilot: 'пилот', floors: 'этажи', steps: 'ступеньки', lift: 'лифт', 'keep fit': 'быть в форме', view: 'вид (из окна)'
    },
    html: '<p>Near a small airport in the north of Scotland, there is a very <b>unusual</b> home. It is an old <b>control tower</b>! Today it is the home of Rosa Grant, a <b>pilot</b>, and her cat, Pepper.</p>' +
      '<p>The tower is 70 years old and it has got seven <b>floors</b>. The hall is on the ground floor. The kitchen and the dining room are on the first floor. The bedrooms are on the second and third floors, and the bathroom is on the fourth floor. Pepper\'s room is on the fifth floor. It has got a big cat bed and lots of toys!</p>' +
      '<p>The living room is on the sixth floor, at the top. It has got big windows and a fantastic <b>view</b> of the planes. There are 96 <b>steps</b> to the living room and there isn\'t a <b>lift</b>. It\'s a great way to <b>keep fit</b>!</p>',
    audio: 'A Home in the Tower! Near a small airport in the north of Scotland, there is a very unusual home. It is an old control tower! Today it is the home of Rosa Grant, a pilot, and her cat, Pepper. The tower is 70 years old and it has got seven floors. The hall is on the ground floor. The kitchen and the dining room are on the first floor. The bedrooms are on the second and third floors, and the bathroom is on the fourth floor. Pepper\'s room is on the fifth floor. It has got a big cat bed and lots of toys! The living room is on the sixth floor, at the top. It has got big windows and a fantastic view of the planes. There are ninety-six steps to the living room and there isn\'t a lift. It\'s a great way to keep fit!'
  };
  const ADVERT_SCRIPT = "Flat for rent! Are you looking for a new home? This flat is in a new block of flats near the airport. It's on the twelfth floor, but don't worry, there's a lift! The flat has got two bedrooms, a big living room, a kitchen and a bathroom. There's also a garage for your car. And from the living room, there's a fantastic view of the airport. You can watch the planes all day! Call Tom on oh one six one, five five five, seven two eight oh.";
  const LISTENING = { type: 'audio', art: 'flats', title: 'Radio: Flat for rent', script: ADVERT_SCRIPT };

  const ROOM_WORDS = ROOMS.map((r) => r.word).concat(['room', 'rooms']);

  /* ---------- lesson definition ---------- */
  MEA.registerLesson({
    id: '3a', code: '3A', module: 3, moduleTitle: 'My home, my castle', title: 'At home', pages: 'SB pp. 46–47',
    subtitle: 'Rooms · Ordinal numbers 1st–20th · Which floor?',
    destination: { name: 'Home Sweet Home', code: 'HSH' },
    vocab: ROOMS.concat(HOMES).map((r) => ({ word: r.word, ru: r.ru, key: 'room:' + r.word })),
    stages: [
      { id: 'warmup', title: 'Warm-up', sub: 'Boarding', icon: 'plane', exercises: [
        { id: 'w1', type: 'seq', title: 'Where do people live?', task: 'Look at the pictures and answer.', taskRu: 'Посмотри на картинки и ответь.', goal: 'Ввести тему урока, активизировать house / flat.',
          items: [
            { kind: 'choice', art: 'flats', prompt: 'Is it a house or a block of flats?', options: ['a house', 'a block of flats'], answer: 'a block of flats', answerText: 'a block of flats', keepOrder: true, log: 'block of flats' },
            { kind: 'choice', art: 'house', prompt: 'Is it a house or a block of flats?', options: ['a house', 'a block of flats'], answer: 'a house', answerText: 'a house', keepOrder: true, log: 'house' },
            { kind: 'poll', prompt: 'And you, Alex? Where do you live?', options: ['I live in a flat.', 'I live in a house.'], reply: { 'I live in a flat.': 'Cool! Lots of people in Russia live in flats.', 'I live in a house.': 'Nice! Has it got a garden?' }, log: 'my home' }
          ] },
        { id: 'w2', type: 'seq', title: 'Quick radio check: numbers', task: 'Listen and choose the number. You know these!', taskRu: 'Разминка: послушай и выбери число.', goal: 'Актуализировать числа 1–20 перед порядковыми числительными.',
          items: () => shuffle([3, 5, 8, 12, 13, 15, 20, 9]).slice(0, 4).map((n) => ({ kind: 'choice', audio: L.numWords(n), prompt: 'Which number do you hear?', mono: true,
            options: shuffle(Array.from(new Set([n, n + 10 <= 20 ? n + 10 : n - 10, n + 1, n - 1]))).map(String), answer: String(n), answerText: String(n), log: 'listen ' + n })) }
      ] },

      MEA.Numbers.stage(),

      { id: 'discover', title: 'Discover', sub: 'Rooms', icon: 'home', exercises: [
        { id: 'd1', type: 'cards', title: 'Rooms in a home', task: 'Listen, look and repeat. Open the translation if you need it.', taskRu: 'Слушай, смотри и повторяй вслух.', goal: 'Семантизация лексики урока: 8 комнат + house / block of flats.', items: HOMES.concat(ROOMS) },
        { id: 'd2', type: 'match', title: 'Picture match', task: 'Match the pictures and the words.', taskRu: 'Соедини картинки и слова.', goal: 'Узнавание слов по картинке.',
          rounds: () => { const r = shuffle(ROOMS); return [{ pairs: r.slice(0, 4).map((x) => ({ l: { a: x.art }, r: { t: x.word, say: x.word } })) }, { pairs: r.slice(4).map((x) => ({ l: { a: x.art }, r: { t: x.word, say: x.word } })) }]; } },
        { id: 'd3', type: 'seq', title: 'Listen and point', task: 'Listen and choose the right room.', taskRu: 'Послушай слово и выбери картинку.', goal: 'Аудирование на уровне слова.', items: () => shuffle(ROOMS).slice(0, 6).map(roomListen) },
        { id: 'd4', type: 'seq', title: 'Which room?', task: 'Where do you do it? Choose the room.', taskRu: 'Где ты это делаешь? Выбери комнату.', goal: 'Связать комнату с действием (лексика в контексте).',
          items: () => shuffle(ROOMS).slice(0, 6).map((r) => Object.assign(roomMeta(r), { kind: 'choice', prompt: 'Where do you <b>' + r.clue + '</b>?', options: shuffle([r.word].concat(shuffle(ROOMS.filter((x) => x !== r)).slice(0, 3).map((x) => x.word))), answer: r.word, log: r.clue })) },
        { id: 'd5', type: 'seq', title: 'Spell it!', task: 'Build the words from the letters.', taskRu: 'Собери слово из букв.', goal: 'Зрительный образ слова, орфография.',
          items: () => shuffle(['kitchen', 'bedroom', 'bathroom', 'garden', 'garage', 'hall']).slice(0, 5).map((w) => { const r = ROOMS.find((x) => x.word === w); return Object.assign(roomMeta(r), { kind: 'builder', art: r.art, extra: shuffle(['e', 'a', 'o', 'i', 'r', 'n']).slice(0, 2), prompt: 'Build the word.' }); }) },
        { id: 'd6', type: 'seq', title: 'Write the rooms', task: 'Write the room words without help.', taskRu: 'Напиши слова сам. bedroom — одно слово, living room — два!', goal: 'Самостоятельное письмо лексики урока.',
          items: () => shuffle(ROOMS).map((r, i) => roomTyping(r, i % 3 === 2)) }
      ] },

      { id: 'learn', title: 'Learn', sub: 'Ordinal numbers & floors', icon: 'book', exercises: [
        { id: 'l1', type: 'rule', title: 'Ordinal numbers 1st–20th', task: 'How do we make ordinal numbers?', goal: 'Правило образования порядковых числительных 1st–20th.',
          html: '<h3>How many? → Which one?</h3><p><b>Количественные</b> числа отвечают на вопрос «сколько?» (five floors). <b>Порядковые</b> — «который по счёту?» (the fifth floor).</p>' +
            '<div data-widget="ordinals"></div>' +
            '<div class="rule-grid"><div class="rule-box"><h4>Обычно: число + th</h4><p>four → four<b>th</b>, six → six<b>th</b>, seventeen → seventeen<b>th</b></p></div>' +
            '<div class="rule-box hot"><h4>Особые формы</h4><ul><li>1st <b>first</b>, 2nd <b>second</b>, 3rd <b>third</b></li><li>five → fi<b>f</b>th, twelve → twel<b>f</b>th</li><li>eight → eight<b>h</b>, nine → nin<b>th</b></li><li>twenty → twent<b>ie</b>th</li></ul></div>' +
            '<div class="rule-box"><h4>Сокращения</h4><p class="mono big">1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup> 4<sup>th</sup>…</p><p>Но: 11<sup>th</sup>, 12<sup>th</sup>, 13<sup>th</sup> — всегда th.</p></div></div>' },
        { id: 'l2', type: 'rule', title: 'Which floor?', task: 'Ask and answer about floors.', goal: 'Конструкция Which floor is … on? — He’s/She’s on the … floor; ground floor.',
          html: '<h3>Which floor is Ann on?</h3><div class="dialog"><p><b>A:</b> Which floor is Ann on? ' + MEA.playBtn('Which floor is Ann on?') + '</p><p><b>B:</b> She\'s on the third floor. ' + MEA.playBtn("She's on the third floor.") + '</p></div>' +
            '<div class="rule-grid"><div class="rule-box"><h4>Запомни</h4><ul><li><b>on</b> the third floor — предлог on</li><li><b>the</b> перед порядковым числом</li><li>He\'s = He is, She\'s = She is, They\'re = They are</li></ul></div>' +
            '<div class="rule-box hot"><h4>Ground floor</h4><p>В Великобритании этаж на уровне улицы — <b>ground floor</b>. Следующий — first floor.</p><div data-widget="floors"></div></div></div>' },
        { id: 'l3', type: 'rule', title: 'Sounds /θ/ and /ð/', task: 'Listen to the two sounds of "th".', goal: 'Произношение: /θ/ (глухой) и /ð/ (звонкий).',
          html: '<h3>Two sounds of th</h3><div class="rule-grid"><div class="rule-box"><h4>/θ/ — без голоса</h4><p>Кончик языка между зубами, выдыхай воздух, как будто дуешь.</p><p class="words">' + ['sixth', 'seventh', 'tenth', 'three', 'bathroom'].map((w) => MEA.playBtn(w, w)).join(' ') + '</p></div>' +
            '<div class="rule-box"><h4>/ð/ — с голосом</h4><p>Язык там же, но включи голос — почувствуй вибрацию.</p><p class="words">' + ['the', 'this', 'those', 'there', 'mother'].map((w) => MEA.playBtn(w, w)).join(' ') + '</p></div></div>' +
            '<p class="note">Не заменяй th на «с», «з», «ф» или «т». Все порядковые числа на -th заканчиваются звуком /θ/.</p>' }
      ] },

      { id: 'practise', title: 'Practise', sub: 'From easy to hard', icon: 'check', exercises: [
        { id: 'p1', type: 'match', title: 'Number pairs', task: 'Match the short form and the word.', taskRu: 'Соедини сокращение и слово.', goal: 'Узнавание порядковых числительных.',
          rounds: () => { const a = pickOrd(12); return [{ pairs: a.slice(0, 6).map((n) => ({ l: { t: ordLabel(n), mono: true }, r: { t: L.ordWords(n), say: L.ordWords(n) } })) }, { pairs: a.slice(6).map((n) => ({ l: { t: ordLabel(n), mono: true }, r: { t: L.ordWords(n), say: L.ordWords(n) } })) }]; } },
        { id: 'p2', type: 'seq', title: 'st, nd, rd or th?', task: 'Choose the right ending.', taskRu: 'Выбери окончание.', goal: 'Сокращённая запись порядковых чисел, исключения 11–13.',
          items: () => shuffle([1, 2, 3, 4, 11, 12, 13, 20, 7, 18]).slice(0, 7).map((n) => ({ kind: 'choice', mono: true, prompt: '<b class="digits">' + n + '__</b>  (' + L.ordWords(n) + ')', options: ['st', 'nd', 'rd', 'th'], keepOrder: true, answer: L.ordSuffix(n), answerText: ordLabel(n), log: String(n),
            why: n > 10 && n < 14 ? { st: '11, 12, 13 — всегда th: eleventh, twelfth, thirteenth.', nd: '11, 12, 13 — всегда th.', rd: '11, 12, 13 — всегда th.' } : null })) },
        { id: 'p3', type: 'seq', title: 'Write the ordinal numbers', task: 'Write the numbers in words.', taskRu: 'Напиши порядковые числа словами.', goal: 'Самостоятельное письмо порядковых числительных, особые формы.', items: () => pickOrd(10).map(ordTyping) },
        { id: 'p4', type: 'seq', title: 'Fix the lift buttons', task: 'The lift labels have mistakes. Write them correctly.', taskRu: 'На кнопках лифта ошибки — исправь их.', goal: 'Распознавание ошибок: fiveth, nineth, twelveth, twentyth…',
          items: () => shuffle([['fiveth', 5], ['eightth', 8], ['nineth', 9], ['twelveth', 12], ['twentyth', 20], ['forth', 4], ['threeth', 3], ['fiveteenth', 15]]).slice(0, 6).map(([w, n]) => Object.assign(ordMeta(n), { kind: 'typing', sameAsWrong: w, scene: { type: 'ticket', wrong: w.toUpperCase(), digits: ordLabel(n) }, prompt: 'Find the mistake and write the word correctly.', log: w })) },
        { id: 'p5', type: 'seq', title: 'Sky Tower', task: 'Look at the building. Answer the questions.', taskRu: 'Посмотри на дом и ответь на вопросы.', goal: 'Which floor is … on? — порядковые числа в речевой конструкции.',
          items: [
            { kind: 'choice', scene: tower(), prompt: 'Which floor is Mr Green on?', options: ['the fourth floor', 'the fourteenth floor', 'the fifth floor', 'the third floor'], answer: 'the fourth floor', answerText: 'the fourth floor', log: 'Mr Green' },
            Object.assign(ordMeta(6), { kind: 'typing', scene: tower(), prompt: 'Which floor is Keks the cat on?', before: "He's on the", after: 'floor.', log: 'Keks' }),
            Object.assign(ordMeta(8), { kind: 'typing', scene: tower(), prompt: 'Which floor is Professor Hill on?', before: "He's on the", after: 'floor.', log: 'Professor Hill' }),
            { kind: 'choice', scene: tower(), prompt: 'Who is on the ninth floor?', options: ['Sara', 'Helen', 'Lucy', 'Ann'], answer: 'Sara', answerText: 'Sara', log: 'ninth floor' },
            Object.assign(ordMeta(2), { kind: 'typing', scene: tower(), prompt: 'Which floor are Mia and Tom on?', before: "They're on the", after: 'floor.', log: 'Mia and Tom' }),
            { kind: 'typing', scene: tower(), prompt: 'Which floor is Mr Brown on?', before: "He's on the", after: 'floor.', answer: 'ground', answerText: 'ground', mode: 'word', log: 'Mr Brown', explain: 'The floor at street level is the ground floor.' },
            { kind: 'choice', scene: tower(), prompt: 'Ann is on the third floor. Как это сказать по-русски?', options: ['на 3-м этаже', 'на 4-м этаже', 'на 2-м этаже'], answer: 'на 4-м этаже', answerText: 'на 4-м этаже', log: 'third floor = 4-й этаж', why: { 'на 3-м этаже': 'Помни: ground floor = 1-й этаж, first floor = 2-й. Значит third floor = 4-й.', 'на 2-м этаже': 'ground floor = 1-й этаж, поэтому third floor = 4-й.' } }
          ] },
        { id: 'p6', type: 'seq', title: 'Make the sentences', task: 'Put the words in the right order.', taskRu: 'Составь предложение из слов.', goal: 'Порядок слов в вопросе и ответе (Which floor…? / She’s on…).',
          items: () => shuffle([
            { kind: 'order', answer: 'Which floor is Ann on?', answerText: 'Which floor is Ann on?', tipRu: 'Вопрос начинается с Which floor, предлог on — в конце.' },
            { kind: 'order', answer: "She's on the third floor.", answerText: "She's on the third floor.", tokens: ["She's", 'on', 'the', 'third', 'floor', '.'] },
            { kind: 'order', answer: 'The kitchen is on the first floor.', answerText: 'The kitchen is on the first floor.' },
            { kind: 'order', answer: 'My flat is on the ninth floor.', answerText: 'My flat is on the ninth floor.' },
            { kind: 'order', answer: 'Is the bathroom on the second floor?', answerText: 'Is the bathroom on the second floor?', tipRu: 'Общий вопрос начинается с Is.' }
          ]).map((x) => Object.assign(x, { log: x.answer })) },
        { id: 'p7', type: 'sort', title: '/θ/ or /ð/?', task: 'Tap a word, listen, then put it in the right group.', taskRu: 'Нажми на слово, послушай и распредели по звукам.', goal: 'Фонематический слух: /θ/ vs /ð/.',
          bins: [{ id: 't', label: '/θ/', sub: 'no voice: three' }, { id: 'd', label: '/ð/', sub: 'voice: the' }],
          items: [['sixth', 't'], ['three', 't'], ['tenth', 't'], ['bathroom', 't'], ['fifth', 't'], ['thank', 't'], ['the', 'd'], ['this', 'd'], ['those', 'd'], ['there', 'd'], ['mother', 'd'], ['they', 'd']].map(([t, bin]) => ({ t, bin })) }
      ] },

      { id: 'play', title: 'Play', sub: 'Games', icon: 'star', exercises: [
        { id: 'g1', type: 'memory', title: 'Memory flight', task: 'Find the pairs: a picture and a word.', taskRu: 'Найди пары: картинка + слово.', goal: 'Закрепление лексики в игре.', pairs: () => shuffle(ROOMS).slice(0, 6) },
        { id: 'g2', type: 'seq', title: "Where's Keks?", task: 'Keks the cat is hiding. Read the clue and ask the right question.', taskRu: 'Прочитай подсказку и выбери правильный вопрос.', goal: 'Вопрос Are you in the …? — адаптация игры-пантомимы из учебника.',
          items: () => shuffle([
            ['bedroom', "I'm sleeping on a big bed. Zzz…", 58, 38], ['kitchen', "I'm next to the fridge. Is there any fish?", 62, 42], ['bathroom', "I'm next to the bath. I don't like water!", 30, 30],
            ['living room', "I'm on the sofa. I'm watching TV.", 40, 22], ['garage', "I'm next to Dad's car.", 76, 40], ['garden', "I'm under the tree. I can see flowers.", 8, 52],
            ['hall', "I'm next to the front door and the coats.", 60, 50], ['dining room', "I'm under the big table. It's lunchtime!", 38, 52]
          ]).slice(0, 6).map(([w, cap, x, y]) => { const r = ROOMS.find((q) => q.word === w); return Object.assign(roomMeta(r), { kind: 'choice', scene: { type: 'roomcat', room: r.art, caption: '«' + cap + '»', x, y },
            prompt: 'What do you ask Keks?', options: shuffle([r].concat(shuffle(ROOMS.filter((q) => q !== r)).slice(0, 2))).map((q) => 'Are you in the ' + q.word + '?'), answer: 'Are you in the ' + w + '?', answerText: 'Are you in the ' + w + '?', sayAfter: 'Yes, I am!', log: cap }); }) },
        { id: 'g3', type: 'seq', title: 'Lift operator', task: 'You work in the Sky Tower lift. Listen to the passengers and press the buttons.', taskRu: 'Ты лифтёр! Послушай пассажира и нажми нужный этаж.', goal: 'Аудирование порядковых числительных; различение third / thirteenth.', items: () => liftSet(8) }
      ] },

      { id: 'challenge', title: 'Challenge', sub: 'Read · Listen · Speak · Write', icon: 'star', exercises: [
        { id: 'c1', type: 'seq', title: 'Reading 1: Predict', task: '<b>Study skill:</b> the title and the picture help you guess what a text is about. Look before you read!', taskRu: 'Посмотри на заголовок и картинку. О чём текст?', goal: 'Стратегия чтения: прогнозирование содержания по заголовку и иллюстрации.', panel: Object.assign({}, READING, { html: '<p class="muted">Don\'t read the text yet. Look at the title and the picture.</p>', audio: null }),
          items: [{ kind: 'choice', prompt: 'What is the text about?', options: ['a home in an old tower', 'a new airport', 'a cat show'], answer: 'a home in an old tower', answerText: 'a home in an old tower', log: 'predict' }] },
        { id: 'c2', type: 'seq', title: 'Reading 2: True or False?', task: 'Read the text. Are the sentences true or false?', taskRu: 'Прочитай текст. Верно или неверно?', goal: 'Детальное понимание текста.', panel: READING,
          items: [
            { kind: 'tf', prompt: '1. The tower is new.', answer: false, answerText: 'False — it is 70 years old.', log: 'The tower is new.' },
            { kind: 'tf', prompt: '2. Rosa Grant is a pilot.', answer: true, answerText: 'True', log: 'Rosa is a pilot.' },
            { kind: 'tf', prompt: '3. The kitchen is on the ground floor.', answer: false, answerText: 'False — it is on the first floor.', log: 'Kitchen on the ground floor.' },
            { kind: 'tf', prompt: '4. The living room is at the top of the tower.', answer: true, answerText: 'True', log: 'Living room at the top.' },
            { kind: 'tf', prompt: '5. There is a lift in the tower.', answer: false, answerText: "False — there isn't a lift.", log: 'There is a lift.' },
            { kind: 'tf', prompt: '6. Pepper has got her own room.', answer: true, answerText: 'True — on the fifth floor.', log: "Pepper's room." }
          ] },
        { id: 'c3', type: 'seq', title: 'Reading 3: Answer the questions', task: 'Find the answers in the text and write them.', taskRu: 'Найди ответы в тексте и напиши.', goal: 'Поиск информации и письменный ответ.', panel: READING,
          items: [
            Object.assign(ordMeta(4), { kind: 'typing', prompt: 'Which floor is the bathroom on?', before: "It's on the", after: 'floor.', log: 'bathroom floor' }),
            Object.assign(ordMeta(5), { kind: 'typing', prompt: "Which floor is Pepper's room on?", before: "It's on the", after: 'floor.', log: "Pepper's floor" }),
            { kind: 'typing', prompt: 'Which floor is the hall on?', before: "It's on the", after: 'floor.', answer: 'ground', answerText: 'ground', log: 'hall floor' },
            Object.assign({ answer: 'ninety-six', answerText: 'ninety-six', mode: 'number', pkey: 'num:96', plabel: '96', practiseAudio: 'ninety-six' }, { kind: 'typing', prompt: 'How many steps are there to the living room? Write the number in words.', before: 'There are', after: 'steps.', log: 'steps' }),
            { kind: 'typing', prompt: 'What is Rosa\'s job?', before: 'She is a', after: '.', answer: 'pilot', answerText: 'pilot', log: 'job' }
          ] },
        { id: 'c4', type: 'seq', title: 'Listening 1: What is it?', task: 'Listen to the radio. Answer the questions.', taskRu: 'Послушай радио и ответь.', goal: 'Понимание основного содержания (жанр, тема).', panel: LISTENING,
          items: [
            { kind: 'choice', prompt: 'Is it an advert or a letter?', options: ['an advert', 'a letter'], answer: 'an advert', answerText: 'an advert', autoplay: false, log: 'advert or letter' },
            { kind: 'choice', prompt: 'What is it about?', options: ['a flat', 'a house', 'a garage'], answer: 'a flat', answerText: 'a flat', log: 'what for rent' }
          ] },
        { id: 'c5', type: 'gapfill', title: 'Listening 2: Complete the advert', task: 'Listen again and fill in the gaps (1–5).', taskRu: 'Послушай ещё раз и заполни пропуски. Числа можно писать цифрами или словами.', goal: 'Извлечение конкретной информации на слух.', panel: LISTENING, revealScript: true,
          template: '<div class="advert"><div class="adv-tag">FOR RENT</div><h4>Flat near the airport</h4><ul>' +
            '<li>on the [[o:twelfth/12th]] floor — there\'s a lift</li><li>[[n:two/2]] bedrooms</li><li>a big [[living]] room</li><li>a [[garage]] for your car</li><li>a fantastic view of the [[airport]]</li></ul>' +
            '<p class="adv-contact">Call Tom: 0161 555 7280</p></div>' },
        { id: 'c6', type: 'speak', title: 'Say it right: th', task: 'Listen to the model and say the sentences.', taskRu: 'Послушай образец и произнеси предложения.', goal: 'Произношение /θ/, /ð/ во фразах.',
          lines: [{ text: 'The bathroom is on the third floor.' }, { text: 'This is the thirteenth floor.' }, { text: 'There are three bedrooms.' }, { text: 'My flat is on the fifth floor.' }] },
        { id: 'c7', type: 'speak', title: 'Talk about it', task: 'Make notes in your head, then talk. Use full sentences.', taskRu: 'Расскажи о башне из текста, а потом о своём доме.', goal: 'Монологическое высказывание по опорам (where, rooms/floors, special features).',
          notes: '<div class="rule-grid"><div class="rule-box"><h4>The tower</h4><ul><li>Where is it?</li><li>How many floors has it got?</li><li>Which floor is the kitchen / living room on?</li></ul></div><div class="rule-box"><h4>My home</h4><ul><li>I live in a house / a flat.</li><li>It\'s on the … floor.</li><li>It has got … rooms.</li><li>There is a … / There isn\'t a …</li></ul></div></div>',
          lines: [{ text: 'Talk about the tower (4–5 sentences).', model: false }, { text: 'Talk about your home (4–5 sentences).', model: false }] },
        { id: 'c8', type: 'writing', title: 'Portfolio: my home', task: 'Write a short paragraph about your house or flat: rooms, floor, special features (garden, garage, view…).', taskRu: 'Напиши абзац о своём доме или квартире.', goal: 'Письменное высказывание (portfolio), 5+ предложений.',
          frames: ['I live in a flat.', 'I live in a house.', 'My flat is on the … floor.', 'It has got … rooms:', 'My favourite room is the …', 'There is a …', "There isn't a …"],
          need: 5,
          checks: [
            { label: 'Say if it is a house or a flat', test: (t) => /\b(house|flat|block of flats)\b/i.test(t) },
            { label: 'Name 3 or more rooms', test: (t) => ROOM_WORDS.slice(0, 8).filter((w) => new RegExp('\\b' + w + '\\b', 'i').test(t)).length >= 3 },
            { label: 'Use a number or "… floor"', test: (t) => /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|ground)\b/i.test(t) },
            { label: '5 sentences or more', test: (t) => (t.match(/[.!?](\s|$)/g) || []).length >= 5 },
            { label: 'Every sentence starts with a capital letter', test: (t) => t.trim().length > 0 && t.trim().split(/(?<=[.!?])\s+/).every((s) => /^[A-Z"']/.test(s)) },
            { label: '35 words or more', test: (t) => (t.trim().match(/\S+/g) || []).length >= 35 }
          ],
          model: 'I live in a flat in a big block of flats. My flat is on the fifth floor, and there is a lift. It has got five rooms: a living room, a kitchen, a bathroom and two bedrooms. My favourite room is my bedroom because I can see the planes from my window! There isn\'t a garden, but there is a garage for our car.' }
      ] },

      { id: 'final', title: 'Final Mission', sub: 'Lesson check', icon: 'passport', exercises: [
        { id: 'f1', type: 'seq', title: 'Final Mission: Home Sweet Home', task: '14 questions about the whole lesson. Get 70% or more to get your passport stamp!', taskRu: 'Итоговая проверка урока: 70% и больше — штамп в паспорт.', goal: 'Контроль: лексика комнат, порядковые числа, этажи, письмо.', pass: 70, stamp: '3a',
          items: () => {
            const rooms = shuffle(ROOMS); const ords = pickOrd(3); const fl = shuffle(TOWER.filter((t) => t.n > 0 && t.n !== 6));
            const nums = MEA.Numbers.pickNumbers(2);
            const its = [roomTyping(rooms[0]), roomTyping(rooms[1]), roomTyping(rooms[2]), roomTyping(rooms[3], true), roomListen(rooms[4])]
              .concat(ords.map(ordTyping), [liftItem(pick([13, 15, 18, 3, 12]), 0)],
                [Object.assign(ordMeta(fl[0].n), { kind: 'typing', scene: tower(), prompt: 'Which floor is ' + fl[0].who + ' on?', before: (/ and /.test(fl[0].who) ? "They're" : /^(Ann|Lucy|Sara|Helen)$/.test(fl[0].who) ? "She's" : "He's") + ' on the', after: 'floor.', log: fl[0].who }),
                  { kind: 'choice', scene: tower(), prompt: 'Who is on the ' + L.ordWords(fl[1].n) + ' floor?', options: shuffle([fl[1], fl[2], fl[3]]).map((f) => f.who), answer: fl[1].who, answerText: fl[1].who, log: L.ordWords(fl[1].n) + ' floor' },
                  { kind: 'order', answer: 'Which floor is the kitchen on?', answerText: 'Which floor is the kitchen on?', log: 'word order' }],
                nums.map((n) => Object.assign({ kind: 'typing', prompt: 'Numbers check! Write in words: <b class="digits">' + n + '</b>', answer: L.numWords(n), answerText: L.numWords(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: L.numWords(n), log: String(n) })));
            return shuffle(its);
          } }
      ] },

      { id: 'progress', title: 'My Progress', sub: 'Results & tips', icon: 'user', exercises: [
        { id: 'r1', type: 'report', title: 'My Progress: lesson 3A', task: 'Your results, mistakes and what to practise next.', goal: 'Рефлексия: результаты, ошибки, рекомендации по повторению.' }
      ] }
    ]
  });
})(window.MEA = window.MEA || {});
