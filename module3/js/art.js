/* Malik's English Adventures — illustrations (inline SVG, no external files) */
(function (MEA) {
  'use strict';
  const S = (body, bg) =>
    '<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
    (bg ? '<rect width="160" height="120" fill="' + bg + '"/>' : '') + body + '</svg>';

  function grid(x, y, cols, rows, w, h, gx, gy, fill) {
    let s = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      s += '<rect x="' + (x + c * (w + gx)) + '" y="' + (y + r * (h + gy)) + '" width="' + w + '" height="' + h + '" rx="1" fill="' + fill + '"/>';
    return s;
  }

  const ART = {
    house: () => S(
      '<circle cx="134" cy="22" r="10" fill="#FFD166"/>' +
      '<rect x="110" y="30" width="10" height="22" fill="#B5523B"/>' +
      '<polygon points="30,60 80,22 130,60" fill="#E8574B"/>' +
      '<rect x="40" y="58" width="80" height="44" fill="#FFF4E6"/>' +
      '<rect x="72" y="74" width="16" height="28" rx="2" fill="#2F5DA8"/><circle cx="84" cy="89" r="1.6" fill="#FFD166"/>' +
      '<rect x="48" y="66" width="17" height="14" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>' +
      '<rect x="95" y="66" width="17" height="14" fill="#8EC5FF" stroke="#fff" stroke-width="2"/>' +
      '<rect x="0" y="100" width="160" height="20" fill="#7CC07A"/>' +
      '<circle cx="28" cy="96" r="8" fill="#5FAE5D"/><circle cx="138" cy="96" r="7" fill="#5FAE5D"/>', '#DCEEFF'),

    flats: () => S(
      '<rect x="22" y="18" width="50" height="86" fill="#C9D3E3"/>' + grid(28, 24, 4, 8, 7, 6, 4, 4, '#6FA8F5') +
      '<rect x="80" y="34" width="58" height="70" fill="#E4E9F2"/>' + grid(86, 40, 5, 6, 6, 6, 4, 4, '#8EC5FF') +
      '<rect x="42" y="92" width="10" height="12" fill="#2F5DA8"/><rect x="104" y="92" width="10" height="12" fill="#2F5DA8"/>' +
      '<rect x="0" y="104" width="160" height="16" fill="#9AA7BA"/>', '#DCEEFF'),

    living: () => S(
      '<rect x="0" y="92" width="160" height="28" fill="#D9A86C"/>' +
      '<rect x="62" y="22" width="36" height="24" rx="2" fill="#F7D9B5" stroke="#B9844C" stroke-width="2"/>' +
      '<path d="M66 42 L76 32 L84 38 L94 28" stroke="#5FAE5D" stroke-width="3" fill="none"/>' +
      '<rect x="32" y="62" width="96" height="30" rx="8" fill="#2F7BF6"/>' +
      '<rect x="26" y="56" width="14" height="38" rx="6" fill="#2667D6"/><rect x="120" y="56" width="14" height="38" rx="6" fill="#2667D6"/>' +
      '<rect x="44" y="50" width="34" height="18" rx="6" fill="#4A90FF"/><rect x="82" y="50" width="34" height="18" rx="6" fill="#4A90FF"/>' +
      '<rect x="52" y="54" width="14" height="12" rx="3" fill="#FF7A3D"/>' +
      '<line x1="146" y1="40" x2="146" y2="92" stroke="#1B2B44" stroke-width="2"/><path d="M136 40 h20 l-5 -14 h-10 z" fill="#FFC23D"/>' +
      '<rect x="8" y="76" width="12" height="16" rx="2" fill="#B5523B"/><circle cx="14" cy="70" r="9" fill="#5FAE5D"/>', '#FDEBD7'),

    kitchen: () => S(
      grid(0, 0, 16, 6, 9, 9, 1, 1, '#DFF2E8') +
      '<rect x="0" y="66" width="160" height="54" fill="#F2F5F9"/>' +
      '<rect x="8" y="16" width="70" height="22" rx="2" fill="#5FAE8A"/><line x1="43" y1="16" x2="43" y2="38" stroke="#3E8A68" stroke-width="2"/>' +
      '<rect x="8" y="66" width="104" height="44" fill="#5FAE8A"/><rect x="4" y="62" width="112" height="6" fill="#C7CFDA"/>' +
      '<rect x="44" y="70" width="34" height="34" rx="3" fill="#1B2B44"/><rect x="48" y="76" width="26" height="16" rx="2" fill="#38506F"/>' +
      '<ellipse cx="54" cy="60" rx="10" ry="3" fill="#7A8699"/><rect x="44" y="50" width="20" height="10" rx="3" fill="#E5484D"/><line x1="64" y1="54" x2="74" y2="52" stroke="#1B2B44" stroke-width="3"/>' +
      '<path d="M50 44 q3 -6 0 -10 M56 44 q3 -6 0 -10" stroke="#9AA7BA" stroke-width="2" fill="none"/>' +
      '<rect x="120" y="20" width="32" height="90" rx="4" fill="#E9EEF5" stroke="#C7CFDA" stroke-width="2"/><line x1="120" y1="52" x2="152" y2="52" stroke="#C7CFDA" stroke-width="2"/>' +
      '<rect x="126" y="30" width="3" height="14" rx="1" fill="#9AA7BA"/><rect x="126" y="60" width="3" height="18" rx="1" fill="#9AA7BA"/>', '#EAF6EF'),

    bathroom: () => S(
      grid(0, 0, 16, 9, 9, 9, 1, 1, '#D7EAF7') +
      '<rect x="0" y="96" width="160" height="24" fill="#BFD6EA"/>' +
      '<path d="M18 40 v-14 q0 -8 8 -8 h10" stroke="#9AA7BA" stroke-width="3" fill="none"/><rect x="34" y="14" width="12" height="8" rx="2" fill="#9AA7BA"/>' +
      '<path d="M14 66 h104 v10 q0 22 -22 22 h-60 q-22 0 -22 -22 z" fill="#FFFFFF" stroke="#C7CFDA" stroke-width="2"/>' +
      '<rect x="18" y="62" width="96" height="8" rx="4" fill="#6FB8F5"/>' +
      '<circle cx="40" cy="58" r="6" fill="#fff"/><circle cx="50" cy="56" r="4" fill="#fff"/><circle cx="96" cy="58" r="5" fill="#fff"/>' +
      '<rect x="28" y="96" width="5" height="8" fill="#9AA7BA"/><rect x="100" y="96" width="5" height="8" fill="#9AA7BA"/>' +
      '<ellipse cx="80" cy="58" rx="7" ry="5" fill="#FFC23D"/><circle cx="85" cy="52" r="4" fill="#FFC23D"/><path d="M88 52 l4 1 -4 1z" fill="#FF7A3D"/>' +
      '<rect x="132" y="30" width="4" height="40" fill="#9AA7BA"/><rect x="126" y="36" width="20" height="32" rx="3" fill="#FF7A3D"/>', '#E3F1FA'),

    bedroom: () => S(
      '<rect x="96" y="14" width="48" height="36" rx="3" fill="#1E3566" stroke="#fff" stroke-width="3"/>' +
      '<circle cx="128" cy="28" r="7" fill="#FFE08A"/><circle cx="131" cy="26" r="6" fill="#1E3566"/><circle cx="108" cy="24" r="1.5" fill="#fff"/><circle cx="114" cy="38" r="1.2" fill="#fff"/>' +
      '<rect x="0" y="96" width="160" height="24" fill="#C7A27A"/>' +
      '<rect x="14" y="44" width="10" height="56" rx="3" fill="#6D4BC4"/>' +
      '<rect x="20" y="70" width="100" height="22" rx="4" fill="#FFFFFF"/>' +
      '<rect x="26" y="62" width="30" height="14" rx="6" fill="#F2F5F9" stroke="#D9E3F0" stroke-width="2"/>' +
      '<path d="M58 66 h62 v26 h-62 z" fill="#FF7A3D"/><path d="M58 74 h62" stroke="#FFA477" stroke-width="3"/>' +
      '<rect x="22" y="92" width="6" height="10" fill="#6D4BC4"/><rect x="112" y="92" width="6" height="10" fill="#6D4BC4"/>' +
      '<rect x="128" y="78" width="22" height="20" rx="2" fill="#B9844C"/><rect x="136" y="64" width="4" height="14" fill="#1B2B44"/><path d="M130 64 h16 l-4 -10 h-8 z" fill="#FFC23D"/>', '#EDE7FF'),

    hall: () => S(
      '<rect x="0" y="100" width="160" height="20" fill="#B9844C"/>' +
      '<rect x="40" y="18" width="44" height="84" rx="3" fill="#2F5DA8"/><rect x="48" y="26" width="28" height="22" rx="10" fill="#8EC5FF"/><circle cx="76" cy="66" r="3" fill="#FFC23D"/>' +
      '<rect x="36" y="100" width="52" height="6" rx="2" fill="#E5484D"/>' +
      '<rect x="18" y="26" width="3" height="76" fill="#1B2B44"/><path d="M8 34 h24" stroke="#1B2B44" stroke-width="3"/>' +
      '<path d="M10 36 q-4 18 4 30 h10 q6 -14 0 -30 z" fill="#FF7A3D"/>' +
      '<path d="M100 102 v-12 h12 v-12 h12 v-12 h12 v-12 h12 v-12 h12 v60 z" fill="#E3B98A"/>' +
      '<path d="M100 90 L158 30" stroke="#8A5A2B" stroke-width="3"/>', '#FFF3D6'),

    dining: () => S(
      '<line x1="80" y1="0" x2="80" y2="22" stroke="#1B2B44" stroke-width="2"/><path d="M66 32 q14 -16 28 0 z" fill="#FFC23D"/>' +
      '<rect x="0" y="98" width="160" height="22" fill="#D9A86C"/>' +
      '<rect x="18" y="44" width="8" height="58" rx="2" fill="#B5523B"/><rect x="18" y="72" width="22" height="6" fill="#B5523B"/><rect x="34" y="78" width="5" height="24" fill="#B5523B"/>' +
      '<rect x="134" y="44" width="8" height="58" rx="2" fill="#B5523B"/><rect x="120" y="72" width="22" height="6" fill="#B5523B"/><rect x="121" y="78" width="5" height="24" fill="#B5523B"/>' +
      '<path d="M38 64 h84 l6 16 h-96 z" fill="#FFFFFF"/><rect x="48" y="80" width="5" height="22" fill="#8A5A2B"/><rect x="107" y="80" width="5" height="22" fill="#8A5A2B"/>' +
      '<ellipse cx="62" cy="64" rx="10" ry="3" fill="#E9EEF5" stroke="#C7CFDA"/><ellipse cx="98" cy="64" rx="10" ry="3" fill="#E9EEF5" stroke="#C7CFDA"/>' +
      '<rect x="78" y="52" width="4" height="12" fill="#2F7BF6"/><circle cx="80" cy="50" r="4" fill="#E5484D"/>', '#FFE9E2'),

    garden: () => S(
      '<circle cx="132" cy="24" r="11" fill="#FFD166"/>' +
      '<rect x="0" y="78" width="160" height="42" fill="#7CC07A"/>' +
      grid(4, 64, 16, 1, 5, 20, 5, 0, '#FFFFFF') + '<rect x="0" y="68" width="160" height="3" fill="#FFFFFF"/>' +
      '<rect x="34" y="40" width="8" height="48" fill="#8A5A2B"/><circle cx="38" cy="36" r="20" fill="#4E9E4C"/><circle cx="26" cy="44" r="12" fill="#5FAE5D"/><circle cx="50" cy="44" r="12" fill="#5FAE5D"/>' +
      '<circle cx="44" cy="40" r="3" fill="#E5484D"/><circle cx="30" cy="30" r="3" fill="#E5484D"/>' +
      [80, 96, 112, 128, 144].map((x, i) => '<line x1="' + x + '" y1="104" x2="' + x + '" y2="90" stroke="#3E8A3C" stroke-width="2"/><circle cx="' + x + '" cy="88" r="5" fill="' + ['#FF7A3D', '#FFC23D', '#E5484D', '#6D4BC4', '#FF7A3D'][i] + '"/>').join(''), '#CDE8FF'),

    garage: () => S(
      '<rect x="0" y="100" width="160" height="20" fill="#9AA7BA"/>' +
      '<polygon points="20,40 80,14 140,40" fill="#38506F"/><rect x="26" y="40" width="108" height="62" fill="#E4E9F2"/>' +
      '<rect x="36" y="48" width="88" height="54" fill="#1B2B44"/>' + grid(36, 48, 1, 3, 88, 4, 0, 4, '#5B6B85') +
      '<path d="M46 92 q2 -14 14 -16 h34 q12 2 16 16 z" fill="#E5484D"/><rect x="42" y="88" width="76" height="10" rx="4" fill="#E5484D"/>' +
      '<rect x="64" y="78" width="28" height="9" rx="2" fill="#8EC5FF"/>' +
      '<circle cx="58" cy="99" r="7" fill="#1B2B44" stroke="#C7CFDA" stroke-width="3"/><circle cx="104" cy="99" r="7" fill="#1B2B44" stroke="#C7CFDA" stroke-width="3"/>', '#DCEEFF'),

    tower: () => S(
      '<rect x="0" y="104" width="160" height="16" fill="#7CC07A"/>' +
      '<rect x="62" y="40" width="36" height="66" fill="#E4E9F2"/>' + grid(70, 50, 2, 5, 7, 6, 6, 4, '#8EC5FF') +
      '<path d="M50 40 h60 l-6 -18 h-48 z" fill="#38506F"/><rect x="56" y="24" width="48" height="12" fill="#8EC5FF"/>' +
      '<rect x="54" y="14" width="52" height="8" rx="2" fill="#1B2B44"/><line x1="80" y1="14" x2="80" y2="2" stroke="#1B2B44" stroke-width="2"/><circle cx="80" cy="3" r="2" fill="#E5484D"/>' +
      '<rect x="74" y="92" width="12" height="14" fill="#2F5DA8"/>' +
      '<g transform="translate(118 30) rotate(-12)"><rect x="0" y="4" width="30" height="6" rx="3" fill="#fff"/><path d="M10 7 l6 -9 h4 l-3 9z M10 7 l6 9 h4 l-3 -9z" fill="#2F7BF6"/><path d="M0 7 l-2 -6 h4 l3 6z" fill="#FF7A3D"/></g>', '#DCEEFF'),

    lift: () => S(
      '<rect x="40" y="16" width="80" height="94" rx="4" fill="#9AA7BA"/>' +
      '<rect x="46" y="30" width="33" height="80" fill="#C7CFDA"/><rect x="81" y="30" width="33" height="80" fill="#C7CFDA"/>' +
      '<rect x="62" y="18" width="36" height="10" rx="2" fill="#1B2B44"/><text x="80" y="26" font-size="8" text-anchor="middle" fill="#FFC23D" font-family="monospace">7</text>' +
      '<rect x="128" y="50" width="16" height="30" rx="3" fill="#E4E9F2"/><path d="M136 56 l-4 6 h8z M136 74 l-4 -6 h8z" fill="#2F7BF6"/>' +
      '<rect x="0" y="110" width="160" height="10" fill="#B9844C"/>', '#EEF2F7'),

    steps: () => S(
      '<path d="M10 110 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v94 z" fill="#E3B98A"/>' +
      '<path d="M10 96 h20 M30 82 h20 M50 68 h20 M70 54 h20 M90 40 h20 M110 26 h20" stroke="#B9844C" stroke-width="3"/>', '#FFF3D6'),

    plane: () => S(
      '<path d="M18 66 q0 -10 14 -10 h86 q22 0 30 10 q-8 10 -30 10 h-86 q-14 0 -14 -10z" fill="#FFFFFF" stroke="#C7CFDA" stroke-width="2"/>' +
      '<path d="M70 62 l-16 -34 h12 l30 34z" fill="#2F7BF6"/><path d="M70 70 l-16 30 h12 l30 -30z" fill="#2667D6"/>' +
      '<path d="M22 60 l-6 -22 h10 l14 22z" fill="#FF7A3D"/>' + grid(56, 61, 8, 1, 5, 4, 5, 0, '#8EC5FF') +
      '<path d="M132 58 q10 2 14 8 h-14z" fill="#38506F"/>', '#DCEEFF'),

    cat: () =>
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M78 84 q20 -6 12 -26" stroke="#E8873A" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="74" rx="28" ry="22" fill="#F29A4A"/>' +
      '<path d="M26 30 l4 -20 l14 14z M74 30 l-4 -20 l-14 14z" fill="#F29A4A"/><path d="M30 26 l2 -10 l7 7z M70 26 l-2 -10 l-7 7z" fill="#FFC9A3"/>' +
      '<circle cx="50" cy="40" r="25" fill="#F29A4A"/>' +
      '<path d="M30 30 q20 -10 40 0" stroke="#E8873A" stroke-width="4" fill="none"/>' +
      '<rect x="27" y="22" width="46" height="8" rx="4" fill="#38506F"/><circle cx="40" cy="26" r="6" fill="#8EC5FF" stroke="#38506F" stroke-width="2"/><circle cx="60" cy="26" r="6" fill="#8EC5FF" stroke="#38506F" stroke-width="2"/>' +
      '<circle cx="41" cy="42" r="3.5" fill="#1B2B44"/><circle cx="59" cy="42" r="3.5" fill="#1B2B44"/><circle cx="42" cy="41" r="1" fill="#fff"/><circle cx="60" cy="41" r="1" fill="#fff"/>' +
      '<path d="M47 50 h6 l-3 3z" fill="#E5484D"/><path d="M50 53 q-4 4 -8 2 M50 53 q4 4 8 2" stroke="#1B2B44" stroke-width="1.5" fill="none"/>' +
      '<path d="M30 50 h-12 M30 54 h-11 M70 50 h12 M70 54 h11" stroke="#FFF4E6" stroke-width="1.2"/>' +
      '<ellipse cx="50" cy="80" rx="14" ry="12" fill="#FFC9A3"/></svg>',

    dog: () =>
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="50" cy="78" rx="26" ry="20" fill="#B9844C"/>' +
      '<circle cx="50" cy="44" r="24" fill="#C99460"/>' +
      '<ellipse cx="26" cy="48" rx="8" ry="16" fill="#8A5A2B"/><ellipse cx="74" cy="48" rx="8" ry="16" fill="#8A5A2B"/>' +
      '<path d="M28 28 q22 -22 44 0 z" fill="#1E3566"/><rect x="24" y="26" width="52" height="6" rx="3" fill="#1E3566"/><rect x="44" y="18" width="12" height="6" rx="2" fill="#FFC23D"/>' +
      '<circle cx="41" cy="42" r="3.5" fill="#1B2B44"/><circle cx="59" cy="42" r="3.5" fill="#1B2B44"/><circle cx="42" cy="41" r="1" fill="#fff"/><circle cx="60" cy="41" r="1" fill="#fff"/>' +
      '<ellipse cx="50" cy="56" rx="12" ry="9" fill="#F0D2AE"/><ellipse cx="50" cy="51" rx="5" ry="3.5" fill="#1B2B44"/>' +
      '<path d="M50 55 v4 M44 60 q6 4 12 0" stroke="#1B2B44" stroke-width="1.5" fill="none"/><path d="M48 62 q2 6 4 0" fill="#E5484D"/></svg>'
  };

  const ICONS = {
    speaker: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none"/>',
    cross: '<path d="M6 6l12 12M18 6L6 18" fill="none"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    home: '<path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5" fill="none"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14 M15 6v14" fill="none"/>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="2" fill="none"/><circle cx="12" cy="11" r="3.5" fill="none"/><path d="M9 17h6" fill="none"/>',
    user: '<circle cx="12" cy="8" r="4" fill="none"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20" fill="none"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2" fill="none"/><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4" fill="none"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6" fill="none"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6" fill="none"/>',
    skip: '<path d="M5 6l8 6-8 6zM16 6v12" fill="none"/>',
    retry: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" fill="none"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none"/><circle cx="12" cy="12" r="3" fill="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" fill="none"/>',
    plane: '<path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 0 0-3 0v4.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill="none"/>',
    backspace: '<path d="M21 5H9l-6 7 6 7h12z M12 9l6 6M18 9l-6 6" fill="none"/>',
    slow: '<circle cx="12" cy="12" r="8.5" fill="none"/><path d="M12 7v5l3 2" fill="none"/>'
  };

  MEA.artKit = { S, grid, add: (o) => Object.assign(ART, o), raw: (n) => (ART[n] ? ART[n]() : '') };
  MEA.keks = (cls) => '<img class="keks ' + (cls || '') + '" src="img/keks.webp" width="640" height="427" alt="Keks, a striped tabby cat with a blue scarf, a suitcase and a map">';
  MEA.art = function (name, cls) {
    const f = ART[name];
    return '<div class="art ' + (cls || '') + '">' + (f ? f() : '') + '</div>';
  };
  MEA.hasArt = (n) => !!ART[n];
  MEA.icon = function (name, cls) {
    const filled = /^(star|play|stop|plane)$/.test(name);
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" ' +
      (filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') +
      '>' + (ICONS[name] || '') + '</svg>';
  };
})(window.MEA = window.MEA || {});
