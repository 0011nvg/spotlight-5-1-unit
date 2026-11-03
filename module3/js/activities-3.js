/* Lesson 3C types: bedroom scene and "Tidy up!" placing items */
(function (MEA) {
  'use strict';
  const E = MEA.Engine, { esc, shuffle, $, $$ } = MEA.util;
  E.Scenes.bedroom = (sc) => MEA.bedroom.html(sc.objects);

  E.Items.place = {
    max: () => 2,
    render(it, el, api) {
      el.innerHTML = '<div class="audio-row">' + MEA.playBtn(it.audio, 'Listen', true) + '</div><p class="prompt">' + it.prompt + '</p>' +
        '<div class="place-wrap"><div class="place-obj" title="' + esc(it.obj) + '">' + MEA.bedroom.objSvg(it.obj) + '</div>' + MEA.bedroom.html(it.objects, it.spots) + '</div>';
      let sel = null;
      $$('.br-spot', el).forEach((b) => b.addEventListener('click', () => { if (b.disabled) return; $$('.br-spot', el).forEach((x) => x.classList.remove('is-sel')); b.classList.add('is-sel'); sel = b.dataset.spot; api.submit(); }));
      const put = (spot) => { const [x, y] = MEA.bedroom.SPOTS[spot]; $('.bedroom', el).insertAdjacentHTML('beforeend', '<div class="br-obj br-' + it.obj + ' br-new" style="left:' + x + '%;top:' + y + '%">' + MEA.bedroom.objSvg(it.obj) + '</div>'); $('.place-obj', el).classList.add('gone'); };
      return {
        check() {
          if (!sel) return { empty: true, msg: 'Tap a place in the room.' };
          const ok = sel === it.answer;
          if (!ok) { const b = $$('.br-spot', el).find((x) => x.dataset.spot === sel); b.classList.add('is-wrong'); b.disabled = true; }
          return { ok, given: sel, diag: ok ? null : { msg: 'Not there!', ru: 'Ты выбрал(а): ' + sel + '. Послушай ещё раз предлог.' } };
        },
        reveal() { put(it.answer); },
        lock(ok) { $$('.br-spot', el).forEach((b) => (b.disabled = true)); if (ok) put(it.answer); }
      };
    }
  };
})(window.MEA = window.MEA || {});

/* widget: make a plan of your home (rooms as tiles), saved in progress */
(function (MEA) {
  'use strict';
  const { esc, $, $$ } = MEA.util;
  const ROOMS = ['living room', 'kitchen', 'bedroom', 'bathroom', 'hall', 'dining room', 'toilet', 'balcony'];
  const RU = { 'living room': 'гостиная', kitchen: 'кухня', bedroom: 'спальня', bathroom: 'ванная', hall: 'прихожая', 'dining room': 'столовая', toilet: 'туалет', balcony: 'балкон' };
  MEA.widgets.planmaker = function (el, ctx) {
    const S = MEA.Store, key = (ctx ? ctx.key : 'plan') + ':plan';
    let plan = []; try { plan = JSON.parse(S.data.writing[key] || '[]'); } catch (e) { plan = []; }
    el.innerHTML = '<div class="pm"><div class="pm-tools"><b>1. Make the plan:</b> tap a room to add it (tap a room on the plan to remove it).<div class="pm-btns">' +
      ROOMS.map((r) => '<button type="button" class="chip" data-r="' + r + '">+ ' + r + ' <small>' + RU[r] + '</small></button>').join('') + '</div></div>' +
      '<div class="pm-plan" aria-label="Plan"></div><p class="pm-sum muted small"></p></div>';
    function draw() {
      $('.pm-plan', el).innerHTML = plan.length ? plan.map((r, i) => '<button type="button" class="pm-room pm-' + r.replace(' ', '-') + '" data-i="' + i + '">' + esc(r) + '</button>').join('') : '<span class="ph">Your plan is empty</span>';
      $$('.pm-room', el).forEach((b) => b.addEventListener('click', () => { plan.splice(+b.dataset.i, 1); save(); }));
      const cnt = {}; plan.forEach((r) => (cnt[r] = (cnt[r] || 0) + 1));
      const parts = Object.entries(cnt).map(([r, n]) => (n > 1 ? MEA.lang.numWords(n) + ' ' + r + 's' : (/^[aeiou]/.test(r) ? 'an ' : 'a ') + r));
      $('.pm-sum', el).textContent = plan.length ? 'Idea for your text: There ' + (plan.length > 1 ? 'are ' + MEA.lang.numWords(plan.length) + ' rooms' : 'is one room') + ': ' + parts.join(', ') + '.' : '';
    }
    function save() { S.data.writing[key] = JSON.stringify(plan); S.save(); draw(); }
    $$('.pm-btns .chip', el).forEach((b) => b.addEventListener('click', () => { if (plan.length < 12) { plan.push(b.dataset.r); save(); } }));
    draw();
  };
})(window.MEA = window.MEA || {});
