/* Lesson 3C: prepositions with Biscuit the cat, Malik's bedroom scene and small objects */
(function (MEA) {
  'use strict';
  const { S, add, raw } = MEA.artKit;
  const cat = (x, y, w) => raw('cat').replace('<svg viewBox="0 0 100 100"', '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" viewBox="0 0 100 100"');
  const BG = '#EEF4FB', FL = '<rect x="0" y="100" width="160" height="20" fill="#DCE5F0"/>';
  const boxBack = '<rect x="58" y="62" width="56" height="40" fill="#C99460"/>';
  const boxFront = (y) => '<rect x="58" y="' + y + '" width="56" height="' + (102 - y) + '" fill="#E3B98A"/><path d="M58 ' + y + ' h56" stroke="#B9844C" stroke-width="3"/><path d="M76 ' + (y + 8) + ' h20" stroke="#B9844C" stroke-width="2"/>';
  const box = boxFront(62);
  const tbl = '<rect x="30" y="50" width="100" height="8" rx="2" fill="#B9844C"/><rect x="36" y="58" width="6" height="44" fill="#8A5A2B"/><rect x="118" y="58" width="6" height="44" fill="#8A5A2B"/>';

  add({
    'prep-in': () => S(FL + boxBack + cat(62, 30, 48) + boxFront(70), BG),
    'prep-on': () => S(FL + box + cat(62, 16, 48), BG),
    'prep-under': () => S(FL + tbl + cat(56, 58, 46), BG),
    'prep-behind': () => S(FL + cat(64, 26, 46) + box, BG),
    'prep-nextto': () => S(FL + box.replace(/x="58"/g, 'x="20"').replace(/M58/g, 'M20').replace(/M76/g, 'M38') + cat(90, 52, 50), BG),
    'prep-infrontof': () => S(FL + boxFront(44).replace(/x="58"/g, 'x="54"').replace(/width="56"/g, 'width="64"') + cat(54, 50, 62), BG),
    wall: () => S('<rect x="0" y="0" width="160" height="88" fill="#FF8A5B"/><rect x="0" y="88" width="160" height="32" fill="#E3B98A"/><rect x="96" y="18" width="40" height="34" rx="2" fill="#fff"/><circle cx="116" cy="35" r="9" fill="#FFC23D"/>' +
      '<path d="M40 26 q-8 18 6 30" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 58 l6 -2 -2 6" stroke="#fff" stroke-width="3" fill="none"/>', null),
    floor: () => S('<rect x="0" y="0" width="160" height="70" fill="#FFE3D3"/><rect x="0" y="70" width="160" height="50" fill="#FF8A5B"/>' + [80, 90, 100, 110].map((y) => '<path d="M0 ' + y + ' h160" stroke="#E86E3F" stroke-width="2"/>').join('') +
      '<path d="M80 40 v24" stroke="#1B2B44" stroke-width="3"/><path d="M74 58 l6 8 6 -8" stroke="#1B2B44" stroke-width="3" fill="none"/>', null),
    poster: () => S('<rect x="44" y="12" width="72" height="96" rx="2" fill="#1E3566"/><circle cx="80" cy="44" r="16" fill="#FFC23D"/><path d="M50 96 l20 -30 14 16 10 -10 16 24z" fill="#5FAE5D"/>' +
      '<g transform="translate(58 72) rotate(-20)"><rect x="0" y="0" width="28" height="5" rx="2.5" fill="#fff"/><path d="M10 2 l5 -8 h3 l-2 8z M10 3 l5 8 h3 l-2 -8z" fill="#E5484D"/></g><circle cx="48" cy="16" r="2" fill="#E5484D"/><circle cx="112" cy="16" r="2" fill="#E5484D"/>', BG),
    computer: () => S(FL + '<rect x="40" y="18" width="80" height="56" rx="4" fill="#1B2B44"/><rect x="46" y="24" width="68" height="44" fill="#8EC5FF"/><path d="M60 54 l14 -14 10 10 8 -6 16 14z" fill="#2F7BF6"/>' +
      '<rect x="72" y="74" width="16" height="12" fill="#38506F"/><rect x="58" y="86" width="44" height="5" rx="2" fill="#38506F"/><rect x="44" y="96" width="60" height="8" rx="2" fill="#C7CFDA"/><ellipse cx="118" cy="100" rx="7" ry="5" fill="#C7CFDA"/>', BG),
    football: () => S(FL + '<circle cx="80" cy="64" r="34" fill="#fff" stroke="#1B2B44" stroke-width="3"/><path d="M80 50 l12 9 -5 14 h-14 l-5 -14z" fill="#1B2B44"/>' +
      '<path d="M80 50 v-16 M92 59 l14 -6 M87 73 l9 13 M73 73 l-9 13 M68 59 l-14 -6" stroke="#1B2B44" stroke-width="3"/>', BG),
    schoolbag: () => S(FL + '<path d="M58 36 q22 -22 44 0" stroke="#1E3566" stroke-width="6" fill="none"/><rect x="46" y="34" width="68" height="70" rx="12" fill="#2F7BF6"/><rect x="56" y="64" width="48" height="30" rx="6" fill="#2667D6"/><rect x="74" y="62" width="12" height="8" rx="2" fill="#FFC23D"/>', BG)
  });

  /* ---------- Malik's bedroom: furniture base + objects placed at named spots ---------- */
  const SPOTS = {
    'under the bed': [20, 71], 'on the bed': [24, 43], 'behind the bed': [16, 25], 'in front of the bed': [30, 89],
    'on the desk': [47, 47], 'under the desk': [45, 72], 'in the bookcase': [74, 45], 'on the bookcase': [74, 22], 'in front of the wardrobe': [91, 85], 'on the wardrobe': [91, 12]
  };
  const OBJ = {
    football: '<circle cx="50" cy="50" r="40" fill="#fff" stroke="#1B2B44" stroke-width="6"/><path d="M50 32 l16 12 -6 18 h-20 l-6 -18z" fill="#1B2B44"/>',
    books: '<rect x="10" y="62" width="80" height="18" rx="3" fill="#2F7BF6"/><rect x="16" y="44" width="70" height="18" rx="3" fill="#E5484D"/><rect x="12" y="26" width="74" height="18" rx="3" fill="#5FAE5D"/>',
    lamp: '<ellipse cx="50" cy="92" rx="20" ry="6" fill="#1B2B44"/><rect x="47" y="40" width="6" height="52" fill="#38506F"/><path d="M24 44 h52 l-10 -32 h-32z" fill="#FFC23D"/>',
    computer: '<rect x="8" y="10" width="84" height="58" rx="5" fill="#1B2B44"/><rect x="14" y="16" width="72" height="46" fill="#8EC5FF"/><rect x="42" y="68" width="16" height="12" fill="#38506F"/><rect x="28" y="80" width="44" height="8" rx="2" fill="#38506F"/>',
    poster: '<rect x="18" y="4" width="64" height="90" rx="3" fill="#1E3566"/><circle cx="50" cy="34" r="14" fill="#FFC23D"/><path d="M24 86 l18 -26 12 14 10 -8 14 20z" fill="#5FAE5D"/>',
    schoolbag: '<path d="M30 24 q20 -20 40 0" stroke="#1E3566" stroke-width="7" fill="none"/><rect x="18" y="22" width="64" height="72" rx="14" fill="#2F7BF6"/><rect x="28" y="54" width="44" height="30" rx="6" fill="#2667D6"/>',
    teddy: '<circle cx="28" cy="20" r="11" fill="#B9844C"/><circle cx="72" cy="20" r="11" fill="#B9844C"/><circle cx="50" cy="36" r="24" fill="#C99460"/><ellipse cx="50" cy="76" rx="28" ry="22" fill="#C99460"/><circle cx="42" cy="32" r="3" fill="#1B2B44"/><circle cx="58" cy="32" r="3" fill="#1B2B44"/><ellipse cx="50" cy="44" rx="8" ry="6" fill="#F0D2AE"/>'
  };
  const objSvg = (n) => n === 'cat' ? raw('cat') : '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + OBJ[n] + '</svg>';

  function base() {
    return '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#FFE3D3"/><rect y="190" width="400" height="60" fill="#D9A86C"/>' + [205, 222, 239].map((y) => '<path d="M0 ' + y + ' h400" stroke="#C99460" stroke-width="2"/>').join('') +
      // window
      '<rect x="168" y="26" width="84" height="74" rx="3" fill="#fff"/><rect x="174" y="32" width="34" height="62" fill="#9FD0FF"/><rect x="212" y="32" width="34" height="62" fill="#9FD0FF"/>' +
      '<g transform="translate(184 52) rotate(-15)"><rect width="24" height="4" rx="2" fill="#fff"/><path d="M8 2 l4 -7 h3 l-2 7z M8 2 l4 7 h3 l-2 -7z" fill="#E5484D"/></g>' +
      // desk (under the window)
      '<rect x="160" y="132" width="100" height="8" rx="2" fill="#B9844C"/><rect x="164" y="140" width="6" height="52" fill="#8A5A2B"/><rect x="250" y="140" width="6" height="52" fill="#8A5A2B"/>' +
      // bookcase (next to the desk)
      '<rect x="270" y="70" width="52" height="122" rx="2" fill="#8A5A2B"/><rect x="275" y="76" width="42" height="36" fill="#F7E7D2"/><rect x="275" y="116" width="42" height="34" fill="#F7E7D2"/><rect x="275" y="154" width="42" height="34" fill="#F7E7D2"/>' +
      // wardrobe
      '<rect x="334" y="40" width="62" height="152" rx="3" fill="#6D4BC4"/><line x1="365" y1="44" x2="365" y2="188" stroke="#5A3AAE" stroke-width="2"/><rect x="358" y="104" width="3" height="16" fill="#FFC23D"/><rect x="369" y="104" width="3" height="16" fill="#FFC23D"/>' +
      // bed (high legs so you can see under it)
      '<rect x="8" y="96" width="14" height="104" rx="3" fill="#2F7BF6"/><rect x="16" y="132" width="128" height="26" rx="4" fill="#fff"/><rect x="22" y="124" width="34" height="14" rx="6" fill="#F2F5F9" stroke="#D9E3F0" stroke-width="2"/>' +
      '<path d="M58 128 h86 v30 h-86z" fill="#FF7A3D"/><rect x="26" y="158" width="110" height="40" fill="#6E4A2A" opacity=".18"/><rect x="20" y="158" width="6" height="42" fill="#2F7BF6"/><rect x="136" y="158" width="6" height="42" fill="#2F7BF6"/>' +
      // chair (in front of the desk)
      '<rect x="196" y="140" width="34" height="34" rx="5" fill="#E5484D"/><rect x="190" y="172" width="46" height="8" rx="3" fill="#C93A3F"/><rect x="194" y="180" width="5" height="26" fill="#C93A3F"/><rect x="227" y="180" width="5" height="26" fill="#C93A3F"/>' +
      '</svg>';
  }
  MEA.bedroom = {
    SPOTS, objSvg,
    html(objects, spots) {
      return '<div class="bedroom"><div class="br-base">' + base() + '</div>' +
        (objects || []).map((o) => { const [x, y] = SPOTS[o.at]; return '<div class="br-obj br-' + o.name + '" style="left:' + x + '%;top:' + y + '%">' + objSvg(o.name) + '</div>'; }).join('') +
        (spots || []).map((s) => { const [x, y] = SPOTS[s]; return '<button type="button" class="br-spot" data-spot="' + s + '" style="left:' + x + '%;top:' + y + '%" aria-label="' + s + '"></button>'; }).join('') + '</div>';
    }
  };
})(window.MEA = window.MEA || {});
