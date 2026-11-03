/* Lesson 3D Culture Corner: a typical English house */
(function (MEA) {
  'use strict';
  const { S, grid, add } = MEA.artKit;
  const brick = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#B5523B"/>' +
    Array.from({ length: Math.floor(h / 6) }, (_, r) => '<path d="M' + x + ' ' + (y + r * 6) + ' h' + w + '" stroke="#9A4230" stroke-width="1"/>').join('');
  const half = (x, flip) => {
    const s = flip ? -1 : 1, cx = x;
    return brick(cx - (flip ? 56 : 0), 52, 56, 52) +
      '<polygon points="' + (cx) + ',22 ' + (cx + s * 60) + ',52 ' + cx + ',52" fill="#38506F"/>' +
      '<rect x="' + (flip ? cx - 44 : cx + 12) + '" y="60" width="18" height="14" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>' +
      '<rect x="' + (flip ? cx - 44 : cx + 12) + '" y="82" width="18" height="14" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>' +
      '<rect x="' + (flip ? cx - 20 : cx + 34) + '" y="80" width="12" height="24" rx="2" fill="' + (flip ? '#2F5DA8' : '#E5484D') + '"/>' +
      '<rect x="' + (flip ? cx - 22 : cx + 34) + '" y="60" width="16" height="14" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>';
  };
  add({
    semi: () => S('<rect x="0" y="104" width="160" height="16" fill="#7CC07A"/>' + half(80, false) + half(80, true) + '<line x1="80" y1="22" x2="80" y2="104" stroke="#fff" stroke-width="2"/>' +
      '<rect x="100" y="14" width="8" height="16" fill="#9A4230"/><rect x="52" y="14" width="8" height="16" fill="#9A4230"/>', '#DCEEFF'),
    bricks: () => S(grid(10, 22, 4, 1, 32, 16, 4, 0, '#B5523B') + grid(28, 42, 3, 1, 32, 16, 4, 0, '#C9613F') + grid(10, 62, 4, 1, 32, 16, 4, 0, '#B5523B') + grid(28, 82, 3, 1, 32, 16, 4, 0, '#C9613F'), '#EFE6DC'),
    fireplace: () => S('<rect x="0" y="100" width="160" height="20" fill="#D9A86C"/><rect x="30" y="20" width="100" height="84" fill="#B5523B"/><rect x="22" y="14" width="116" height="10" rx="2" fill="#8A5A2B"/>' +
      '<path d="M50 104 v-40 q30 -24 60 0 v40z" fill="#1B2B44"/><path d="M66 102 q-6 -18 8 -28 q-2 12 8 14 q4 -12 10 -16 q8 14 0 30z" fill="#FF7A3D"/><path d="M74 102 q0 -10 6 -14 q4 8 6 14z" fill="#FFC23D"/>' +
      '<rect x="56" y="4" width="12" height="10" fill="#FFC23D"/><circle cx="104" cy="9" r="5" fill="#5FAE5D"/>', '#FDEBD7'),
    radiator: () => S('<rect x="0" y="100" width="160" height="20" fill="#D9A86C"/>' + Array.from({ length: 8 }, (_, i) => '<rect x="' + (28 + i * 13) + '" y="40" width="10" height="56" rx="4" fill="#E9EEF5" stroke="#C7CFDA" stroke-width="2"/>').join('') +
      '<rect x="26" y="50" width="108" height="4" fill="#C7CFDA"/><rect x="26" y="82" width="108" height="4" fill="#C7CFDA"/><path d="M50 32 q4 -8 0 -16 M80 32 q4 -8 0 -16 M110 32 q4 -8 0 -16" stroke="#FF7A3D" stroke-width="3" fill="none" stroke-linecap="round"/>', '#FFF3E8'),
    frontgarden: () => S('<rect x="0" y="92" width="160" height="28" fill="#7CC07A"/>' + brick(40, 20, 80, 72) + '<rect x="72" y="62" width="16" height="30" fill="#2F5DA8"/><rect x="48" y="32" width="18" height="16" fill="#8EC5FF"/><rect x="94" y="32" width="18" height="16" fill="#8EC5FF"/>' +
      '<rect x="74" y="92" width="12" height="28" fill="#C7CFDA"/>' + [14, 26, 38, 116, 128, 140].map((x, i) => '<circle cx="' + x + '" cy="102" r="5" fill="' + ['#FF7A3D', '#FFC23D', '#E5484D'][i % 3] + '"/>').join('') + grid(0, 110, 16, 1, 6, 10, 4, 0, '#fff'), '#CDE8FF'),
    backgarden: () => S('<rect x="0" y="70" width="160" height="50" fill="#7CC07A"/>' + brick(0, 10, 50, 60) + '<rect x="14" y="24" width="18" height="16" fill="#8EC5FF"/>' +
      '<rect x="104" y="30" width="8" height="50" fill="#8A5A2B"/><circle cx="108" cy="28" r="22" fill="#4E9E4C"/><circle cx="100" cy="24" r="3" fill="#E5484D"/><circle cx="116" cy="32" r="3" fill="#E5484D"/>' +
      '<path d="M128 40 v40 M150 40 v40 M126 40 h26" stroke="#38506F" stroke-width="3"/><path d="M134 42 v26 M144 42 v26" stroke="#9AA7BA" stroke-width="1.5"/><rect x="132" y="68" width="14" height="4" fill="#E5484D"/>', '#CDE8FF'),
    updown: () => S('<polygon points="20,40 80,8 140,40" fill="#38506F"/><rect x="24" y="40" width="112" height="70" fill="#FFF4E6" stroke="#38506F" stroke-width="3"/><line x1="24" y1="75" x2="136" y2="75" stroke="#38506F" stroke-width="3"/>' +
      '<rect x="26" y="42" width="108" height="31" fill="#FFE2A8"/><text x="80" y="62" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1B2B44">UPSTAIRS</text>' +
      '<rect x="26" y="77" width="108" height="31" fill="#CFE6FA"/><text x="80" y="97" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1B2B44">DOWNSTAIRS</text>' +
      '<path d="M112 104 l6 -6 h6 l6 -6 h4" stroke="#B9844C" stroke-width="3" fill="none"/>', '#DCEEFF')
  });
})(window.MEA = window.MEA || {});
