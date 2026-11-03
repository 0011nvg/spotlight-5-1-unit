# Malik's English Adventures

Персональная платформа по английскому для Малика (Spotlight 5). Статический сайт без сервера: можно открыть как артефакт Claude или выложить на GitHub Pages (просто загрузить папку в репозиторий).

## Структура

```
index.html                 оболочка, подключение скриптов
css/app.css                дизайн (токены в :root)
js/art.js                  SVG-иллюстрации и иконки
js/lang.js                 числительные, проверка ответов, разбор орфографических ошибок, озвучка
js/store.js                сохранение прогресса (localStorage; интерфейс load/save для будущего облака)
js/engine.js               движок упражнений (пошаговые задания)
js/activities.js           карточки, правила, match, memory, sort, gap fill, speaking, writing
js/app.js                  экраны, карта, паспорт, награды, кабинет, панель учителя
js/lessons/numbers.js      Numbers Airport (числа 1–100), переиспользуемый блок
js/lessons/lesson-3a.js    урок 3A At home
```

## Как добавить урок 3B

1. Скопируйте `js/lessons/lesson-3a.js` в `lesson-3b.js`, поменяйте `id: '3b'`, `code`, `title`, этапы и задания.
2. Подключите файл в `index.html` после `lesson-3a.js`.
3. На карте урок 3B откроется автоматически (он уже есть в маршруте `ROUTE` в `app.js`).

## Типы заданий

Пошаговые (`type: 'seq'`, элементы `items`, у каждого `kind`): `choice`, `tf`, `typing`, `order`, `builder`, `lift`, `poll`.
Целые экраны: `cards`, `rule`, `match`, `memory`, `sort`, `gapfill`, `speak`, `writing`, `report`.

`items` может быть функцией — тогда вопросы генерируются заново при каждом прохождении (и учитывают Words to Practise).
Поле `pkey` у элемента включает слово в систему повторения.

## Облачное сохранение (на будущее)

Создайте объект с методами `load()` и `save(data)` (например, Supabase) и присвойте `MEA.Store.backend` до загрузки страницы.
