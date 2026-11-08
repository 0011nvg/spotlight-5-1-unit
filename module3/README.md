# English Adventures

Универсальная интерактивная платформа по английскому (Spotlight 5). Статический сайт без сервера: можно открыть как артефакт Claude или выложить на GitHub Pages (просто загрузить папку в репозиторий).

## Структура

```
index.html                 оболочка, подключение скриптов
css/app.css                дизайн (токены в :root)
js/art.js                  SVG-иллюстрации и иконки
js/art-home.js             мебель и техника (урок 3B)
js/lang.js                 числительные, проверка ответов, разбор орфографических ошибок, озвучка
js/store.js                сохранение прогресса (localStorage; интерфейс load/save для будущего облака)
js/engine.js               движок упражнений (пошаговые задания)
js/activities.js           карточки, правила, match, memory, sort, gap fill, speaking, writing
js/activities-2.js         выбор нескольких ответов, сцена комнаты, игра Spell & Move, конструктор there is/are
js/app.js                  экраны, карта, паспорт, награды, кабинет, панель учителя
js/lessons/numbers.js      Numbers Airport (числа 1–100), переиспользуемый блок
js/lessons/lesson-3a.js    урок 3A At home
js/lessons/lesson-3b.js    урок 3B Move in!
```

## Как добавить следующий урок (3C)

1. Скопируйте `js/lessons/lesson-3b.js` в `lesson-3c.js`, поменяйте `id: '3c'`, `code`, `title`, этапы и задания.
2. Подключите файл в `index.html` после `lesson-3b.js`.
3. На карте урок 3C откроется автоматически (он уже есть в маршруте `ROUTE` в `app.js`).

## Типы заданий

Пошаговые (`type: 'seq'`, элементы `items`, у каждого `kind`): `choice`, `tf`, `typing`, `order`, `builder`, `lift`, `poll`, `multi`.
Целые экраны: `cards`, `rule`, `match`, `memory`, `sort`, `gapfill`, `speak`, `writing`, `boardgame`, `report`.

`items` может быть функцией — тогда вопросы генерируются заново при каждом прохождении (и учитывают Words to Practise).
Поле `pkey` у элемента включает слово в систему повторения.

## Облачное сохранение (на будущее)

Создайте объект с методами `load()` и `save(data)` (например, Supabase) и присвойте `MEA.Store.backend` до загрузки страницы.
