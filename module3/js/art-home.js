/* Furniture & appliances (lesson 3B) — same flat style as art.js */
(function (MEA) {
  'use strict';
  const { S, grid, add } = MEA.artKit;
  const BG = '#EEF4FB', FL = '<rect x="0" y="104" width="160" height="16" fill="#DCE5F0"/>';
  add({
    wardrobe: () => S(FL + '<rect x="46" y="10" width="68" height="96" rx="3" fill="#B9844C"/><line x1="80" y1="14" x2="80" y2="102" stroke="#8A5A2B" stroke-width="2"/>' +
      '<rect x="72" y="50" width="3" height="14" rx="1" fill="#FFC23D"/><rect x="85" y="50" width="3" height="14" rx="1" fill="#FFC23D"/><rect x="50" y="104" width="6" height="6" fill="#8A5A2B"/><rect x="104" y="104" width="6" height="6" fill="#8A5A2B"/>', BG),
    bed: () => S(FL + '<rect x="18" y="40" width="12" height="66" rx="3" fill="#6D4BC4"/><rect x="24" y="70" width="118" height="20" rx="4" fill="#fff"/>' +
      '<rect x="30" y="60" width="30" height="14" rx="6" fill="#F2F5F9" stroke="#D9E3F0" stroke-width="2"/><path d="M62 64 h80 v26 h-80 z" fill="#2F7BF6"/><path d="M62 74 h80" stroke="#6FA8F5" stroke-width="3"/>' +
      '<rect x="134" y="62" width="10" height="44" rx="3" fill="#6D4BC4"/>', BG),
    lamp: () => S(FL + '<ellipse cx="80" cy="102" rx="22" ry="5" fill="#1B2B44"/><rect x="77" y="46" width="6" height="56" fill="#38506F"/><path d="M54 48 h52 l-10 -30 h-32 z" fill="#FFC23D"/><path d="M66 18 h28" stroke="#E09B00" stroke-width="3"/>' +
      '<path d="M60 56 l-10 20 M100 56 l10 20" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>', BG),
    desk: () => S(FL + '<rect x="18" y="52" width="124" height="10" rx="2" fill="#B9844C"/><rect x="22" y="62" width="8" height="44" fill="#8A5A2B"/><rect x="100" y="62" width="38" height="44" fill="#A87440"/>' +
      '<rect x="104" y="68" width="30" height="16" rx="2" fill="#B9844C"/><rect x="104" y="88" width="30" height="14" rx="2" fill="#B9844C"/><circle cx="119" cy="76" r="2" fill="#FFC23D"/><circle cx="119" cy="95" r="2" fill="#FFC23D"/>' +
      '<rect x="44" y="26" width="34" height="22" rx="2" fill="#1B2B44"/><rect x="47" y="29" width="28" height="16" fill="#8EC5FF"/><rect x="58" y="48" width="6" height="4" fill="#1B2B44"/>', BG),
    bookcase: () => S(FL + '<rect x="40" y="10" width="80" height="96" rx="2" fill="#8A5A2B"/>' +
      [16, 46, 76].map((y) => '<rect x="45" y="' + y + '" width="70" height="26" fill="#F7E7D2"/>' + [0, 1, 2, 3, 4, 5, 6].map((i) => '<rect x="' + (47 + i * 9.5) + '" y="' + (y + 4 + (i % 3) * 2) + '" width="8" height="' + (22 - (i % 3) * 2) + '" fill="' + ['#E5484D', '#2F7BF6', '#FFC23D', '#5FAE5D', '#6D4BC4', '#FF7A3D', '#38506F'][(i + y) % 7] + '"/>').join('')).join(''), BG),
    books: () => S(FL + '<rect x="40" y="86" width="80" height="16" rx="2" fill="#2F7BF6"/><rect x="46" y="70" width="70" height="16" rx="2" fill="#E5484D"/><rect x="42" y="54" width="74" height="16" rx="2" fill="#5FAE5D"/>' +
      '<path d="M42 58 h74 M46 74 h70 M40 90 h80" stroke="#fff" stroke-width="2" opacity=".6"/><rect x="68" y="20" width="16" height="34" rx="2" fill="#FFC23D" transform="rotate(12 76 37)"/>', BG),
    carpet: () => S('<path d="M30 40 h100 l20 60 h-140 z" fill="#B5523B"/><path d="M42 48 h76 l14 44 h-104 z" fill="#E8873A"/><path d="M80 56 l18 14 -18 14 -18 -14 z" fill="#FFC23D"/>' +
      grid(14, 102, 14, 1, 2, 8, 8, 0, '#FFC23D'), BG),
    mirror: () => S(FL + '<ellipse cx="80" cy="54" rx="30" ry="44" fill="#9AA7BA"/><ellipse cx="80" cy="54" rx="24" ry="38" fill="#CFE6FA"/><path d="M66 34 l24 -10 M64 48 l30 -14" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>', BG),
    washbasin: () => S(FL + '<rect x="72" y="70" width="16" height="36" fill="#E4E9F2"/><path d="M40 52 h80 q0 26 -40 26 q-40 0 -40 -26 z" fill="#fff" stroke="#C7CFDA" stroke-width="2"/>' +
      '<rect x="76" y="34" width="8" height="18" fill="#9AA7BA"/><path d="M84 36 h12 v6" stroke="#9AA7BA" stroke-width="5" fill="none"/><circle cx="70" cy="44" r="4" fill="#E5484D"/><circle cx="92" cy="50" r="2" fill="#6FB8F5"/>', BG),
    toilet: () => S(FL + '<rect x="88" y="22" width="34" height="34" rx="4" fill="#fff" stroke="#C7CFDA" stroke-width="2"/><path d="M40 58 h80 q0 26 -30 30 v16 h-24 v-16 q-26 -4 -26 -30 z" fill="#fff" stroke="#C7CFDA" stroke-width="2"/>' +
      '<rect x="36" y="54" width="88" height="8" rx="4" fill="#E4E9F2"/><rect x="112" y="28" width="6" height="3" fill="#9AA7BA"/>', BG),
    bath: () => S(FL + '<path d="M18 56 h124 v12 q0 26 -26 26 h-72 q-26 0 -26 -26 z" fill="#fff" stroke="#C7CFDA" stroke-width="2"/><rect x="22" y="52" width="116" height="8" rx="4" fill="#6FB8F5"/>' +
      '<rect x="34" y="94" width="6" height="10" fill="#9AA7BA"/><rect x="120" y="94" width="6" height="10" fill="#9AA7BA"/><path d="M128 52 v-24 h-12" stroke="#9AA7BA" stroke-width="4" fill="none"/><circle cx="60" cy="48" r="6" fill="#fff"/><circle cx="72" cy="46" r="4" fill="#fff"/>', BG),
    sink: () => S(FL + '<rect x="20" y="58" width="120" height="48" fill="#5FAE8A"/><rect x="16" y="52" width="128" height="8" fill="#C7CFDA"/><rect x="48" y="52" width="64" height="8" rx="2" fill="#7A8699"/>' +
      '<path d="M80 52 v-24 h14 v8" stroke="#9AA7BA" stroke-width="5" fill="none"/><rect x="28" y="66" width="44" height="34" rx="2" fill="#4E9E7A"/><rect x="88" y="66" width="44" height="34" rx="2" fill="#4E9E7A"/>', BG),
    cooker: () => S(FL + '<rect x="40" y="26" width="80" height="80" rx="4" fill="#E9EEF5" stroke="#C7CFDA" stroke-width="2"/><rect x="40" y="26" width="80" height="14" rx="4" fill="#1B2B44"/>' +
      [52, 68, 92, 108].map((x) => '<circle cx="' + x + '" cy="33" r="4" fill="#9AA7BA"/>').join('') + '<rect x="50" y="50" width="60" height="44" rx="3" fill="#1B2B44"/><rect x="56" y="58" width="48" height="26" rx="2" fill="#38506F"/><rect x="58" y="46" width="44" height="3" rx="1" fill="#9AA7BA"/>', BG),
    fridge: () => S(FL + '<rect x="50" y="8" width="60" height="98" rx="6" fill="#fff" stroke="#C7CFDA" stroke-width="2"/><line x1="50" y1="44" x2="110" y2="44" stroke="#C7CFDA" stroke-width="2"/>' +
      '<rect x="56" y="22" width="4" height="14" rx="2" fill="#9AA7BA"/><rect x="56" y="52" width="4" height="22" rx="2" fill="#9AA7BA"/><circle cx="96" cy="20" r="4" fill="#E5484D"/><rect x="86" y="26" width="12" height="8" fill="#FFC23D"/>', BG),
    chair: () => S(FL + '<rect x="58" y="16" width="44" height="50" rx="6" fill="#E5484D"/><rect x="64" y="22" width="32" height="6" rx="2" fill="#F07A7E"/><rect x="52" y="64" width="56" height="10" rx="3" fill="#C93A3F"/>' +
      '<rect x="56" y="74" width="6" height="32" fill="#C93A3F"/><rect x="98" y="74" width="6" height="32" fill="#C93A3F"/>', BG),
    table: () => S(FL + '<rect x="24" y="48" width="112" height="12" rx="3" fill="#B9844C"/><rect x="32" y="60" width="8" height="46" fill="#8A5A2B"/><rect x="120" y="60" width="8" height="46" fill="#8A5A2B"/>' +
      '<rect x="66" y="34" width="10" height="14" rx="2" fill="#fff" stroke="#C7CFDA"/><circle cx="96" cy="42" r="6" fill="#FF7A3D"/>', BG),
    painting: () => S('<rect x="30" y="18" width="100" height="76" rx="3" fill="#B9844C"/><rect x="38" y="26" width="84" height="60" fill="#CDE8FF"/><circle cx="104" cy="40" r="7" fill="#FFD166"/>' +
      '<path d="M38 86 l26 -30 18 18 14 -12 26 24 z" fill="#5FAE5D"/><path d="M52 44 l8 -2 2 -6 4 8 8 1 -12 2z" fill="#fff"/>', BG),
    armchair: () => S(FL + '<rect x="40" y="22" width="80" height="50" rx="16" fill="#6D4BC4"/><rect x="30" y="54" width="22" height="44" rx="10" fill="#5A3AAE"/><rect x="108" y="54" width="22" height="44" rx="10" fill="#5A3AAE"/>' +
      '<rect x="50" y="66" width="60" height="22" rx="8" fill="#8462E0"/><rect x="38" y="96" width="6" height="10" fill="#1B2B44"/><rect x="116" y="96" width="6" height="10" fill="#1B2B44"/>', BG),
    window: () => S('<rect x="34" y="14" width="92" height="80" rx="3" fill="#fff"/><rect x="40" y="20" width="38" height="32" fill="#8EC5FF"/><rect x="82" y="20" width="38" height="32" fill="#8EC5FF"/>' +
      '<rect x="40" y="56" width="38" height="32" fill="#8EC5FF"/><rect x="82" y="56" width="38" height="32" fill="#8EC5FF"/><rect x="28" y="92" width="104" height="8" rx="2" fill="#E4E9F2"/>' +
      '<path d="M24 10 q10 46 0 88 h-6 v-88 z M136 10 q-10 46 0 88 h6 v-88 z" fill="#FF7A3D"/><circle cx="62" cy="34" r="6" fill="#FFD166"/>', BG),
    sofa: () => S(FL + '<rect x="30" y="34" width="100" height="40" rx="12" fill="#5FAE5D"/><rect x="18" y="56" width="22" height="42" rx="10" fill="#4E9E4C"/><rect x="120" y="56" width="22" height="42" rx="10" fill="#4E9E4C"/>' +
      '<rect x="36" y="68" width="88" height="22" rx="6" fill="#76C273"/><line x1="80" y1="68" x2="80" y2="90" stroke="#5FAE5D" stroke-width="2"/><rect x="28" y="96" width="6" height="10" fill="#1B2B44"/><rect x="126" y="96" width="6" height="10" fill="#1B2B44"/>', BG),
    coffeetable: () => S(FL + '<ellipse cx="80" cy="66" rx="58" ry="12" fill="#8A5A2B"/><ellipse cx="80" cy="62" rx="58" ry="12" fill="#B9844C"/><rect x="40" y="68" width="6" height="38" fill="#8A5A2B"/><rect x="114" y="68" width="6" height="38" fill="#8A5A2B"/>' +
      '<rect x="62" y="48" width="14" height="12" rx="2" fill="#fff"/><path d="M76 52 q6 0 6 4 q0 4 -6 4" stroke="#fff" stroke-width="2" fill="none"/><rect x="88" y="54" width="20" height="6" rx="1" fill="#2F7BF6"/>', BG),
    tv: () => S(FL + '<rect x="30" y="18" width="100" height="64" rx="4" fill="#1B2B44"/><rect x="36" y="24" width="88" height="52" fill="#38506F"/><path d="M36 76 l30 -30 20 20 14 -10 24 20z" fill="#4A6488"/><rect x="72" y="82" width="16" height="10" fill="#1B2B44"/><rect x="58" y="92" width="44" height="6" rx="2" fill="#1B2B44"/>', BG)
  });
})(window.MEA = window.MEA || {});
