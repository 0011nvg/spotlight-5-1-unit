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
