/* English in Use 3 & Extensive Reading 3: houses to choose, the Taj Mahal and materials */
(function (MEA) {
  'use strict';
  const { S, grid, add } = MEA.artKit;
  const W = '#FBF7F0', SH = '#E6DDCF';
  const minaret = (x) => '<rect x="' + x + '" y="34" width="8" height="70" fill="' + W + '" stroke="' + SH + '"/>' + [50, 68, 86].map((y) => '<rect x="' + (x - 2) + '" y="' + y + '" width="12" height="3" fill="' + SH + '"/>').join('') +
    '<path d="M' + (x - 2) + ' 34 q6 -14 12 0z" fill="' + W + '" stroke="' + SH + '"/><line x1="' + (x + 4) + '" y1="20" x2="' + (x + 4) + '" y2="26" stroke="#B9A88A"/>';
  const taj = (extra) => S('<rect x="0" y="0" width="160" height="80" fill="#FFE2C4"/><circle cx="130" cy="20" r="9" fill="#FFC23D"/>' +
    '<rect x="0" y="104" width="160" height="16" fill="#7CC07A"/><rect x="66" y="104" width="28" height="16" fill="#6FB8F5"/>' +
    minaret(18) + minaret(134) + '<rect x="34" y="62" width="92" height="42" fill="' + W + '" stroke="' + SH + '"/>' +
    '<path d="M62 62 q18 -48 36 0z" fill="' + W + '" stroke="' + SH + '"/><line x1="80" y1="8" x2="80" y2="18" stroke="#B9A88A" stroke-width="2"/>' +
    '<path d="M38 62 q6 -12 12 0z M110 62 q6 -12 12 0z" fill="' + W + '" stroke="' + SH + '"/>' +
    '<path d="M70 104 v-26 q10 -14 20 0 v26z" fill="#E9DFCC"/><path d="M42 98 v-14 q5 -8 10 0 v14z M108 98 v-14 q5 -8 10 0 v14z" fill="#E9DFCC"/>' + (extra || ''), null);
  const ring = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="#E5484D" stroke-width="3" stroke-dasharray="5 3"/>';
  add({
    taj: () => taj(),
    dome: () => taj(ring(80, 42, 22)),
    minaret: () => taj(ring(22, 62, 14) + ring(138, 62, 14)),
    pool: () => taj(ring(80, 110, 16)),
    glass: () => S('<rect x="30" y="16" width="100" height="88" rx="4" fill="#CFE6FA" stroke="#9FC4E6" stroke-width="3"/><path d="M48 34 l30 -10 M46 48 l50 -18 M90 92 l26 -10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>', '#EEF4FB'),
    marble: () => S('<rect x="20" y="16" width="120" height="88" rx="4" fill="#F7F3EC"/><path d="M20 40 q30 10 50 -6 t70 14 M20 78 q40 -14 60 6 t60 -10 M60 16 q-6 30 20 48 t14 40" stroke="#C9B9A0" stroke-width="2" fill="none"/><path d="M30 60 q20 4 30 -8" stroke="#E0A87C" stroke-width="1.5" fill="none"/>', '#EEF4FB'),
    stones: () => S([['#E5484D', 40, 50, 16], ['#2F7BF6', 76, 44, 14], ['#5FAE5D', 110, 54, 15], ['#6D4BC4', 58, 80, 13], ['#FFC23D', 96, 84, 12], ['#38B6C9', 128, 86, 10], ['#FF7A3D', 30, 88, 10]]
      .map(([c, x, y, r]) => '<polygon points="' + [0, 60, 120, 180, 240, 300].map((a) => (x + r * Math.cos(a * Math.PI / 180)).toFixed(1) + ',' + (y + r * Math.sin(a * Math.PI / 180)).toFixed(1)).join(' ') + '" fill="' + c + '"/><path d="M' + (x - r / 2) + ' ' + (y - r / 3) + ' l' + r / 3 + ' -' + r / 4 + '" stroke="#fff" stroke-width="2" opacity=".8"/>').join(''), '#EEF4FB'),
    houseA: () => S('<rect x="0" y="100" width="160" height="20" fill="#7CC07A"/><polygon points="24,52 80,20 136,52" fill="#5B6B85"/><rect x="32" y="52" width="96" height="50" fill="#FFE08A"/>' +
      '<rect x="40" y="62" width="20" height="16" fill="#8EC5FF" stroke="#fff" stroke-width="2"/><rect x="100" y="62" width="20" height="16" fill="#8EC5FF" stroke="#fff" stroke-width="2"/><rect x="72" y="70" width="16" height="32" fill="#2F5DA8"/>' +
      '<rect x="22" y="94" width="10" height="8" fill="#E5484D"/><circle cx="14" cy="92" r="8" fill="#5FAE5D"/>', '#DCEEFF'),
    houseB: () => S('<rect x="0" y="100" width="160" height="20" fill="#7CC07A"/><polygon points="20,56 80,18 140,56" fill="#38506F"/><rect x="58" y="34" width="16" height="14" fill="#fff"/><rect x="88" y="34" width="16" height="14" fill="#fff"/>' +
      '<rect x="28" y="56" width="104" height="46" fill="#F2F5F9"/><rect x="38" y="66" width="18" height="16" fill="#8EC5FF" stroke="#fff" stroke-width="2"/><rect x="104" y="66" width="18" height="16" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>' +
      '<rect x="72" y="70" width="16" height="32" fill="#E5484D"/><rect x="118" y="26" width="10" height="20" fill="#B5523B"/><circle cx="148" cy="80" r="14" fill="#4E9E4C"/><rect x="146" y="88" width="4" height="14" fill="#8A5A2B"/>', '#DCEEFF'),
    keys: () => S('<circle cx="60" cy="56" r="20" fill="none" stroke="#FFC23D" stroke-width="8"/><rect x="76" y="52" width="56" height="8" rx="3" fill="#FFC23D"/><rect x="114" y="60" width="6" height="14" fill="#FFC23D"/><rect x="124" y="60" width="6" height="10" fill="#FFC23D"/>', '#EEF4FB')
  });
})(window.MEA = window.MEA || {});
