/* Lesson 3C "My bedroom" — Spotlight 5, Module 3, SB p. 50.
   Textbook goals: prepositions of place (in, on, under, behind, next to, in front of); wall, floor;
   Where's …? It's … / Where are …? They're …; reading a description of a bedroom (predicting words);
   Everyday English: asking about location (Where exactly is it?); study skill: start your writing with a question;
   portfolio paragraph about your bedroom (30–50 words). Texts and tasks below are original. */
(function (MEA) {
  'use strict';
  const L = MEA.lang, { shuffle, pick, esc } = MEA.util;

  const PREPS = [
    { word: 'in', ru: 'в', art: 'prep-in', ex: 'Keks is in the box.' }, { word: 'on', ru: 'на', art: 'prep-on', ex: 'Keks is on the box.' },
    { word: 'under', ru: 'под', art: 'prep-under', ex: 'Keks is under the table.' }, { word: 'behind', ru: 'за, позади', art: 'prep-behind', ex: 'Keks is behind the box.' },
    { word: 'next to', ru: 'рядом с', art: 'prep-nextto', ex: 'Keks is next to the box.' }, { word: 'in front of', ru: 'перед', art: 'prep-infrontof', ex: 'Keks is in front of the box.' }
  ];
  const WORDS = [
    { word: 'wall', ru: 'стена', art: 'wall', ex: 'There is a poster on the wall.' }, { word: 'floor', ru: 'пол', art: 'floor', ex: 'My football is on the floor.' },
    { word: 'poster', ru: 'постер, плакат', art: 'poster', ex: 'The poster is behind my bed.' }, { word: 'computer', ru: 'компьютер', art: 'computer', ex: 'The computer is on the desk.' },
    { word: 'football', ru: 'футбольный мяч', art: 'football', ex: 'The football is under the bed.' }, { word: 'schoolbag', ru: 'школьный рюкзак', art: 'schoolbag', ex: 'My schoolbag is in front of the wardrobe.' }
  ];
  const pMeta = (p) => ({ answer: p.word, answerText: p.word, mode: 'word', pkey: 'prep:' + p.word, plabel: p.ru, ru: p.ru, part: p.art, practiseAudio: p.word, log: p.ex });

  // Malik's bedroom (fixed scene)
  const ROOM = [
    { name: 'football', at: 'under the bed' }, { name: 'cat', at: 'on the bed' }, { name: 'poster', at: 'behind the bed' }, { name: 'computer', at: 'on the desk' },
    { name: 'books', at: 'in the bookcase' }, { name: 'lamp', at: 'on the bookcase' }, { name: 'schoolbag', at: 'in front of the wardrobe' }
  ];
  const scene = () => ({ type: 'bedroom', objects: ROOM });
  const FACTS = [
    ['football', 'the football', "It's", 'under the bed'], ['books', 'the books', "They're", 'in the bookcase'], ['cat', 'Keks', "He's", 'on the bed'],
    ['poster', 'the poster', "It's", 'behind the bed'], ['computer', 'the computer', "It's", 'on the desk'], ['lamp', 'the lamp', "It's", 'on the bookcase'],
    ['schoolbag', 'the schoolbag', "It's", 'in front of the wardrobe'], ['desk', 'the desk', "It's", 'under the window'], ['chair', 'the chair', "It's", 'in front of the desk'], ['bookcase', 'the bookcase', "It's", 'next to the desk']
  ];
  const AMBIG = { 'in the bookcase': ['on'], 'on the bookcase': ['in'], 'behind the bed': ['on', 'next to'], 'under the window': ['in front of'] };
  const okWrong = (place) => PREPS.filter((p) => p.word !== prepOf(place) && !(AMBIG[place] || []).includes(p.word));
  const where = (f) => (f[2] === "They're" ? 'Where are ' : f[1] === 'Keks' ? 'Where\'s ' : 'Where\'s ') + f[1] + '?';
  const prepOf = (place) => PREPS.map((p) => p.word).sort((a, b) => b.length - a.length).find((p) => place.startsWith(p + ' '));
  const objOf = (place) => place.slice(prepOf(place).length + 1);

  function whereChoice(f) {
    const right = f[2] + ' ' + f[3] + '.';
    const wrongs = shuffle(okWrong(f[3])).slice(0, 2).map((p) => f[2] + ' ' + p.word + ' ' + objOf(f[3]) + '.');
    const set = new Set([right, ...wrongs]);
    for (const x of shuffle(FACTS)) { if (set.size >= 4) break; if (objOf(x[3]) !== objOf(f[3])) set.add(f[2] + ' ' + x[3] + '.'); }
    return { kind: 'choice', scene: scene(), prompt: where(f), options: shuffle(Array.from(set)), answer: right, answerText: right, log: where(f) };
  }
  function prepTyping(f) {
    const pr = prepOf(f[3]); const p = PREPS.find((x) => x.word === pr);
    const subj = f[1][0].toUpperCase() + f[1].slice(1); const verb = f[2] === "They're" ? 'are' : 'is';
    return Object.assign(pMeta(p), { kind: 'typing', scene: scene(), prompt: 'Look at the room. Write the preposition.', before: subj + ' ' + verb, after: objOf(f[3]) + '.', log: subj + ' ' + verb + ' … ' + objOf(f[3]) });
  }
  function tfItem() {
    const f = pick(FACTS); const truth = Math.random() < 0.5;
    const place = truth ? f[3] : pick(okWrong(f[3])).word + ' ' + objOf(f[3]);
    const subj = f[1][0].toUpperCase() + f[1].slice(1); const verb = f[2] === "They're" ? 'are' : 'is';
    return { kind: 'tf', scene: scene(), prompt: subj + ' ' + verb + ' ' + place + '.', answer: truth, answerText: truth ? 'True' : 'False — ' + f[2].toLowerCase() + ' ' + f[3] + '.', log: subj + ' ' + verb + ' ' + place };
  }
  const PLACE_OBJ = ['football', 'books', 'lamp', 'computer', 'schoolbag', 'teddy', 'cat'];
  const NAMES = { football: 'the football', books: 'the books', lamp: 'the lamp', computer: 'the computer', schoolbag: 'the schoolbag', teddy: 'the teddy bear', cat: 'Keks' };
  function placeItem() {
    const obj = pick(PLACE_OBJ); const spots = Object.keys(MEA.bedroom.SPOTS);
    const target = pick(spots.filter((s) => !(obj === 'computer' && /under/.test(s))));
    const opts = shuffle([target].concat(shuffle(spots.filter((s) => s !== target)).slice(0, 4)));
    const verb = obj === 'cat' ? 'Help Keks: go ' : 'Put ' + NAMES[obj] + ' ';
    return { kind: 'place', obj, objects: [], spots: opts, answer: target, answerText: target, audio: (obj === 'cat' ? 'Keks, go ' : 'Put ' + NAMES[obj] + ' ') + target + ', please.', prompt: 'Listen and tap the right place in the room.', log: (obj === 'cat' ? 'Keks' : NAMES[obj]) + ' → ' + target };
  }
  const prepPic = (p) => Object.assign(pMeta(p), { kind: 'choice', audio: p.ex, prompt: 'Listen. Where is Keks?', options: shuffle([p].concat(shuffle(PREPS.filter((x) => x !== p)).slice(0, 3))).map((x) => ({ value: x.word, art: x.art })), answer: p.word });
  const prepWrite = (p) => Object.assign(pMeta(p), { kind: 'typing', art: p.art, prompt: 'Where is Keks? Write the preposition.', before: 'Keks is', after: (p.word === 'under' ? 'the table.' : 'the box.') });

  const TEXT = "What's your bedroom like? My bedroom is small, but I love it! Everything in it is green, so I call it the jungle room. I've got a bed, a desk, a chair and a big bookcase. My bed is next to the window. My desk is in front of the bed and there's a lamp and a computer on it. My books are in the bookcase behind the door. There's a poster of a jungle on the wall behind my bed. My cat, Luna, sleeps under my desk. I haven't got a TV, but I've got a guitar. I really like my bedroom!";
  const READ = { type: 'text', art: 'bed', title: 'My bedroom', html: '<p class="muted small">by Lucy, Sky Tower, fifth floor</p><p>' + esc(TEXT).replace(/(next to|in front of|behind|under|\bon it\b|\bin the\b)/g, '<b>$1</b>') + '</p>', audio: 'My bedroom, by Lucy. ' + TEXT, glossary: {} };
  const DLG = [['Malik', 'Is there a bookcase in your bedroom, Ann?'], ['Ann', 'Yes, there is.'], ['Malik', 'Where exactly is it?'], ['Ann', "It's next to my desk, behind the door."], ['Malik', 'Are there any posters?'], ['Ann', "Yes, there are two. They're on the wall behind my bed."]];
  const LISTEN = { type: 'audio', art: 'bookcase', title: 'Everyday English: Where exactly is it?', script: DLG.map((d) => d[1]).join(' ') };
  const FURN = ['bed', 'desk', 'chair', 'wardrobe', 'bookcase', 'lamp', 'computer', 'poster', 'window', 'carpet', 'armchair', 'mirror', 'books', 'shelf', 'TV'];

  MEA.registerLesson({
    id: '3c', code: '3C', module: 3, moduleTitle: 'My home, my castle', title: 'My bedroom', pages: 'SB p. 50',
    subtitle: 'in · on · under · behind · next to · in front of', destination: { name: 'Dream Room', code: 'DRM' }, learnedAfter: ['d4', 'f1'],
    vocab: PREPS.concat(WORDS).map((p) => ({ word: p.word, ru: p.ru, key: (PREPS.includes(p) ? 'prep:' : 'w3c:') + p.word })),
    stages: [
      { id: 'warmup', title: 'Warm-up', sub: 'Remember 3B', icon: 'plane', exercises: [
        { id: 'w1', type: 'seq', title: 'Remember lesson 3B', task: 'Furniture, there is / there are, and numbers.', taskRu: 'Повторим урок 3B.', goal: 'Интервальное повторение 3B (мебель, there is/are) и числительных.',
          items: () => {
            const f = shuffle([['wardrobe', 'wardrobe'], ['armchair', 'armchair'], ['bookcase', 'bookcase'], ['cooker', 'cooker'], ['mirror', 'mirror'], ['fridge', 'fridge']]).slice(0, 2);
            const n = MEA.Numbers.pickNumbers(1)[0];
            return f.map(([w, a]) => ({ kind: 'typing', art: a, prompt: 'What is it?', answer: w, answerText: w, mode: 'word', pkey: 'furn:' + w, plabel: w, practiseAudio: w, log: w }))
              .concat([{ kind: 'choice', prompt: 'There <b class="blank">___</b> two armchairs in the living room.', options: ['is', 'are'], keepOrder: true, answer: 'are', answerText: 'are', log: 'there are' },
                { kind: 'choice', prompt: 'Is there a TV in your bedroom? — No, there <b class="blank">___</b>.', options: ["isn't", "aren't"], keepOrder: true, answer: "isn't", answerText: "No, there isn't.", log: 'short answer' },
                { kind: 'typing', prompt: 'Write in words: <b class="digits">' + n + '</b>', answer: L.numWords(n), answerText: L.numWords(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: L.numWords(n), log: String(n) },
                { kind: 'poll', prompt: 'Have you got your own bedroom, Malik?', options: ['Yes, I have.', "No, I haven't. I share it."], reply: { 'Yes, I have.': "Great! Today you'll learn to describe it.", "No, I haven't. I share it.": "That's OK! Today you'll learn to describe your room." }, log: 'own bedroom' }]);
          } }
      ] },
      { id: 'discover', title: 'Discover', sub: 'Prepositions of place', icon: 'home', exercises: [
        { id: 'd1', type: 'cards', title: 'Where is Keks?', task: 'Look, listen and repeat. Then learn the new words for the room.', taskRu: 'Слушай и повторяй предлоги места и новые слова.', goal: 'Семантизация 6 предлогов места и слов wall, floor, poster, computer, football, schoolbag.',
          items: PREPS.concat(WORDS).map((p) => ({ word: p.word, ru: p.ru, art: p.art, example: p.ex })) },
        { id: 'd2', type: 'match', title: 'Picture match', task: 'Match the pictures and the prepositions.', taskRu: 'Соедини картинки и предлоги.', goal: 'Узнавание предлогов по картинке.',
          rounds: () => [{ pairs: shuffle(PREPS).map((p) => ({ l: { a: p.art }, r: { t: p.word, say: p.ex } })) }] },
        { id: 'd3', type: 'seq', title: 'Listen and point', task: 'Listen and choose the picture.', taskRu: 'Послушай и выбери картинку.', goal: 'Аудирование: различение предлогов.', items: () => shuffle(PREPS).map(prepPic) },
        { id: 'd4', type: 'seq', title: 'Write the prepositions', task: 'Write the preposition. Remember: next to and in front of have two or three words!', taskRu: 'Напиши предлог. next to — два слова, in front of — три.', goal: 'Самостоятельное письмо предлогов.', items: () => shuffle(PREPS).map(prepWrite) }
      ] },
      { id: 'learn', title: 'Learn', sub: "Where's…? Where are…?", icon: 'book', exercises: [
        { id: 'l1', type: 'rule', title: "Where's…? Where are…?", task: 'Ask and answer about things in a room.', goal: 'Вопросы Where’s/Where are, ответы It’s/They’re + предлог + the.',
          html: '<h3>Where is it?</h3><div class="rule-grid"><div class="rule-box"><h4>Один предмет</h4><p><b>Where\'s</b> the football? ' + MEA.playBtn("Where's the football?") + '</p><p><b>It\'s</b> under the bed. ' + MEA.playBtn("It's under the bed.") + '</p></div>' +
            '<div class="rule-box"><h4>Несколько предметов</h4><p><b>Where are</b> the books? ' + MEA.playBtn('Where are the books?') + '</p><p><b>They\'re</b> in the bookcase. ' + MEA.playBtn("They're in the bookcase.") + '</p></div></div>' +
            '<div class="rule-grid">' + PREPS.map((p) => '<div class="rule-box">' + MEA.art(p.art) + '<p><b>' + p.word + '</b> — ' + p.ru + '</p></div>').join('') + '</div>' +
            '<div class="rule-box hot"><h4>Запомни</h4><ul><li>После предлога обычно идёт <b>the</b> или <b>my/your…</b>: under <b>the</b> bed, next to <b>my</b> desk.</li><li><b>in front of</b> — «перед», <b>behind</b> — «за, позади». Не путай!</li><li>on the wall — <b>на</b> стене; on the floor — <b>на</b> полу.</li></ul></div>' },
        { id: 'l2', type: 'rule', title: 'Everyday English: Where exactly is it?', task: 'Asking about location.', goal: 'Речевая модель: Is there…? — Where exactly is it? — It’s … next to …',
          html: '<h3>Asking about location</h3><div class="dialog">' + DLG.map(([w, t]) => '<p><b>' + w + ':</b> ' + esc(t) + ' ' + MEA.playBtn(t) + '</p>').join('') + '</div>' +
            '<div class="rule-box"><h4>Как уточнить место</h4><p><b>Where exactly is it?</b> — «Где именно?». В ответе можно соединить два предлога: It\'s under the window <b>next to</b> my bed.</p></div>' },
        { id: 'l3', type: 'rule', title: 'Study skill: start with a question', task: 'How to start your writing.', goal: 'Стратегия письма: начинать текст с вопроса, чтобы заинтересовать читателя.',
          html: '<h3>Start your writing with a question</h3><p>Вопрос в начале текста делает его интересным: читателю хочется узнать ответ.</p><div class="rule-grid"><div class="rule-box"><h4>Скучно</h4><p>My bedroom is small.</p></div><div class="rule-box hot"><h4>Интересно</h4><p><b>What\'s your bedroom like?</b> My bedroom is small, but I love it!</p><p><b>Do you like green?</b> Everything in my room is green!</p></div></div>' }
      ] },
      { id: 'practise', title: 'Practise', sub: "Malik's bedroom", icon: 'check', exercises: [
        { id: 'p1', type: 'seq', title: "Where's the football?", task: "Look at Malik's bedroom. Choose the answer.", taskRu: 'Посмотри на комнату Малика и выбери ответ.', goal: 'Понимание предлогов в контексте комнаты.', items: () => shuffle(FACTS).slice(0, 7).map(whereChoice) },
        { id: 'p2', type: 'seq', title: "It's or They're?", task: 'Choose the right start of the answer.', taskRu: 'Выбери It’s или They’re.', goal: 'Согласование: один предмет — It’s, несколько — They’re.',
          items: () => shuffle([['Where are the books?', "They're", 'in the bookcase.'], ["Where's the lamp?", "It's", 'on the bookcase.'], ['Where are my shoes?', "They're", 'under the bed.'], ["Where's the poster?", "It's", 'on the wall.'], ['Where are the chairs?', "They're", 'in the kitchen.'], ["Where's my schoolbag?", "It's", 'in front of the wardrobe.']])
            .map(([q, a, rest]) => ({ kind: 'choice', prompt: q + ' — <b class="blank">___</b> ' + rest, options: ["It's", "They're"], keepOrder: true, answer: a, answerText: a + ' ' + rest, log: q, why: { "It's": 'Вопрос Where are…? — предметов много, ответ They’re.', "They're": 'Вопрос Where’s…? — один предмет, ответ It’s.' } })) },
        { id: 'p3', type: 'seq', title: 'Write the prepositions', task: "Look at Malik's bedroom. Write the missing words.", taskRu: 'Посмотри на комнату и впиши предлог.', goal: 'Самостоятельное употребление предлогов.', items: () => shuffle(FACTS).slice(0, 7).map(prepTyping) },
        { id: 'p4', type: 'seq', title: 'True or false?', task: "Look at Malik's bedroom. Is it true or false?", taskRu: 'Верно или неверно?', goal: 'Контроль понимания предлогов.', items: () => Array.from({ length: 7 }, tfItem) },
        { id: 'p5', type: 'seq', title: 'Make the sentences', task: 'Put the words in the right order.', taskRu: 'Составь предложение.', goal: 'Порядок слов в вопросах и ответах о местоположении.',
          items: () => shuffle(['Where exactly is it?', "It's under the window next to my bed.", 'Where are the books?', "They're in the bookcase.", 'Is there a desk in your bedroom?'])
            .map((a) => ({ kind: 'order', answer: a, answerText: a, log: a, tokens: a.replace(/([?.])/g, ' $1').split(/\s+/).filter(Boolean) })) }
      ] },
      { id: 'play', title: 'Play', sub: 'Games', icon: 'star', exercises: [
        { id: 'g1', type: 'seq', title: 'Tidy up!', task: "Malik's room is a mess! Listen to Mum and put the things in the right places.", taskRu: 'Послушай и нажми на место в комнате, куда нужно положить предмет.', goal: 'Аудирование + понимание предлогов (TPR в цифровом формате).', items: () => Array.from({ length: 8 }, placeItem) },
        { id: 'g2', type: 'memory', title: 'Memory flight', task: 'Find the pairs: a picture and a preposition.', taskRu: 'Найди пары.', goal: 'Закрепление предлогов в игре.', pairs: () => PREPS.map((p) => ({ word: p.word, art: p.art })) }
      ] },
      { id: 'challenge', title: 'Challenge', sub: 'Read · Listen · Speak · Write', icon: 'star', exercises: [
        { id: 'c1', type: 'seq', title: 'Reading 1: Predict and check', task: 'The title is "My bedroom". Read the text. Which six words can you find in it?', taskRu: 'Прочитай текст и отметь шесть слов, которые в нём есть.', goal: 'Стратегия чтения: прогнозирование лексики по заголовку и проверка.', panel: READ,
          items: [{ kind: 'multi', prompt: 'Which six words are in the text?', options: ['bed', 'desk', 'window', 'lamp', 'computer', 'poster', 'sofa', 'bath', 'fridge', 'cooker'].map((w) => ({ value: w, label: w })), answers: ['bed', 'desk', 'window', 'lamp', 'computer', 'poster'], answerText: 'bed, desk, window, lamp, computer, poster', log: 'six words' }] },
        { id: 'c2', type: 'seq', title: 'Reading 2: True or false?', task: 'Read the text again.', taskRu: 'Верно или неверно?', goal: 'Детальное понимание текста.', panel: READ,
          items: [
            { kind: 'tf', prompt: "1. Lucy's bedroom is big.", answer: false, answerText: "False — it's small.", log: 'big' },
            { kind: 'tf', prompt: '2. Everything in her room is green.', answer: true, answerText: 'True', log: 'green' },
            { kind: 'tf', prompt: '3. The desk is next to the window.', answer: false, answerText: 'False — the bed is next to the window.', log: 'desk' },
            { kind: 'tf', prompt: '4. The books are in the bookcase.', answer: true, answerText: 'True', log: 'books' },
            { kind: 'tf', prompt: '5. Luna sleeps on the bed.', answer: false, answerText: 'False — under the desk.', log: 'Luna' },
            { kind: 'tf', prompt: "6. Lucy hasn't got a TV.", answer: true, answerText: 'True', log: 'TV' }
          ] },
        { id: 'c3', type: 'seq', title: 'Reading 3: Where exactly?', task: 'Answer the questions. Write the prepositions or words.', taskRu: 'Ответь на вопросы по тексту.', goal: 'Поиск информации; письмо предлогов.', panel: READ,
          items: [
            { kind: 'typing', prompt: "Where's the bed?", before: "It's", after: 'the window.', answer: 'next to', answerText: 'next to', log: 'bed' },
            { kind: 'typing', prompt: "Where's the desk?", before: "It's", after: 'the bed.', answer: 'in front of', answerText: 'in front of', log: 'desk' },
            { kind: 'typing', prompt: "Where's the bookcase?", before: "It's", after: 'the door.', answer: 'behind', answerText: 'behind', log: 'bookcase' },
            { kind: 'typing', prompt: 'Where does Luna sleep?', before: 'She sleeps', after: 'the desk.', answer: 'under', answerText: 'under', log: 'Luna' },
            { kind: 'typing', prompt: 'What does Lucy call her bedroom?', before: 'the', after: 'room', answer: 'jungle', answerText: 'jungle', log: 'name' }
          ] },
        { id: 'c4', type: 'gapfill', title: 'Listening: Where exactly is it?', task: 'Listen to Malik and Ann. Fill in the gaps.', taskRu: 'Послушай диалог и заполни пропуски.', goal: 'Аудирование: речевые формулы Everyday English.', panel: LISTEN, revealScript: true,
          template: '<div class="advert dialog-txt"><div class="adv-tag">DIALOGUE</div><p><b>Malik:</b> Is [[there]] a bookcase in your bedroom, Ann?</p><p><b>Ann:</b> Yes, there is.</p><p><b>Malik:</b> Where [[exactly]] is it?</p><p><b>Ann:</b> It\'s [[next to]] my desk, [[behind]] the door.</p><p><b>Malik:</b> Are there any posters?</p><p><b>Ann:</b> Yes, there are two. They\'re on the [[wall]] behind my bed.</p></div>' },
        { id: 'c5', type: 'speak', title: 'Ask about your partner\'s bedroom', task: 'Read the dialogue in roles. Then ask your teacher about their bedroom.', taskRu: 'Прочитай диалог по ролям, потом расспроси учителя о его комнате.', goal: 'Диалог-расспрос о местоположении предметов.',
          notes: '<div class="rule-box"><h4>Ask</h4><ul><li>Is there a … in your bedroom?</li><li>Where exactly is it?</li><li>Are there any … ?</li></ul></div>',
          lines: DLG.map(([w, t]) => ({ text: t, ru: w })).concat([{ text: 'Ask your teacher three questions about their bedroom.', model: false }]) },
        { id: 'c6', type: 'writing', title: 'Portfolio: my bedroom', task: 'Write a paragraph about your bedroom (30–50 words). Start with a question!', taskRu: 'Напиши абзац о своей спальне (30–50 слов). Начни с вопроса.', goal: 'Письменное описание комнаты по модели; стратегия «начни с вопроса».',
          frames: ["What's your bedroom like?", 'My bedroom is …', "I've got a …", 'My bed is next to …', "There's a … on the wall.", '… is under …', "I haven't got a …", 'I like my bedroom very much.'],
          need: 5,
          checks: [
            { label: 'Start with a question', test: (t) => /^[^.!?]+\?/.test(t.trim()) },
            { label: '30–50 words', test: (t) => { const n = (t.trim().match(/\S+/g) || []).length; return n >= 30 && n <= 50; } },
            { label: 'Use 3 or more prepositions', test: (t) => ['in front of', 'next to', 'behind', 'under', ' on ', ' in '].filter((p) => (' ' + t.toLowerCase() + ' ').includes(p)).length >= 3 },
            { label: 'Name 3 or more things', test: (t) => FURN.filter((w) => new RegExp('\\b' + w + '\\b', 'i').test(t)).length >= 3 },
            { label: "Use I've got or There's / There is", test: (t) => /\b(i['’]ve got|i have got|there['’]s|there is|there are)\b/i.test(t) },
            { label: 'Every sentence starts with a capital letter', test: (t) => t.trim().length > 0 && t.trim().split(/(?<=[.!?])\s+/).every((s) => /^[A-Z"']/.test(s)) }
          ],
          model: "What's my bedroom like? It's small but cosy! I've got a bed, a desk and a wardrobe. My desk is under the window and there's a computer on it. There's a big poster of a plane behind my bed. My cat sleeps under the desk. I love my room!" }
      ] },
      { id: 'final', title: 'Final Mission', sub: 'Lesson check', icon: 'passport', exercises: [
        { id: 'f1', type: 'seq', title: 'Final Mission: Dream Room', task: '14 questions about the whole lesson. Get 70% or more to get your passport stamp!', taskRu: 'Итоговая проверка урока: 70% и больше — штамп в паспорт.', goal: 'Контроль: предлоги места, Where’s/Where are, It’s/They’re.', pass: 70, stamp: '3c',
          items: () => {
            const p = shuffle(PREPS), f = shuffle(FACTS), n = MEA.Numbers.pickNumbers(1)[0];
            const its = [prepPic(p[0]), prepPic(p[1]), prepWrite(p[2]), prepWrite(p[3]), whereChoice(f[0]), whereChoice(f[1]), prepTyping(f[2]), prepTyping(f[3]), tfItem(), placeItem(),
              { kind: 'choice', prompt: 'Where are the books? — <b class="blank">___</b> in the bookcase.', options: ["It's", "They're"], keepOrder: true, answer: "They're", answerText: "They're in the bookcase.", log: "They're" },
              { kind: 'order', answer: 'Where exactly is it?', answerText: 'Where exactly is it?', log: 'word order' },
              { kind: 'choice', prompt: 'There <b class="blank">___</b> any posters in my room.', options: ['is', 'are', "isn't", "aren't"], keepOrder: true, answer: "aren't", answerText: "There aren't any posters.", log: '3B check' },
              { kind: 'typing', prompt: 'Numbers check! Write in words: <b class="digits">' + n + '</b>', answer: L.numWords(n), answerText: L.numWords(n), mode: 'number', pkey: 'num:' + n, plabel: String(n), practiseAudio: L.numWords(n), log: String(n) }];
            return shuffle(its);
          } }
      ] },
      { id: 'progress', title: 'My Progress', sub: 'Results & tips', icon: 'user', exercises: [
        { id: 'r1', type: 'report', title: 'My Progress: lesson 3C', task: 'Your results, mistakes and what to practise next.', goal: 'Рефлексия: результаты, ошибки, рекомендации.' }
      ] }
    ]
  });
})(window.MEA = window.MEA || {});
