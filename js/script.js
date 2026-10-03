/* ===== THEME SWITCHER ===== */
const themes = {
  cyan:   { hex:'#00f3ff', glow:'rgba(0,243,255,0.5)' },
  green:  { hex:'#00ff66', glow:'rgba(0,255,102,0.5)' },
  violet: { hex:'#a855f7', glow:'rgba(168,85,247,0.5)' },
  gold:   { hex:'#ffd700', glow:'rgba(255,215,0,0.5)' },
  crimson:{ hex:'#ff2d55', glow:'rgba(255,45,85,0.5)' },
  orange: { hex:'#ff8c00', glow:'rgba(255,140,0,0.5)' }
};
const root = document.documentElement;
const swatchRow = document.getElementById('swatchRow');
const themeDot = document.getElementById('themeDot');
const customColor = document.getElementById('customColor');

function applyTheme(hex, glow){
  root.style.setProperty('--neon', hex);
  root.style.setProperty('--neon-glow', glow || hexToRgba(hex,0.5));
  themeDot.style.background = hex;
  themeDot.style.boxShadow = '0 0 10px ' + (glow || hexToRgba(hex,0.5));
  localStorage.setItem('es_theme_color', hex);
}
function hexToRgba(hex, alpha){
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
Object.entries(themes).forEach(([name, val]) => {
  const sw = document.createElement('div');
  sw.className = 'swatch';
  sw.style.background = val.hex;
  sw.title = name;
  sw.addEventListener('click', () => { applyTheme(val.hex, val.glow); customColor.value = val.hex; });
  swatchRow.appendChild(sw);
});
customColor.addEventListener('input', (e) => applyTheme(e.target.value));

const savedColor = localStorage.getItem('es_theme_color');
if(savedColor){ applyTheme(savedColor); customColor.value = savedColor; }

const themeBtn = document.getElementById('themeBtn');
const themePopover = document.getElementById('themePopover');
themeBtn.addEventListener('click', (e) => { e.stopPropagation(); themePopover.classList.toggle('open'); });
document.addEventListener('click', (e) => { if(!themePopover.contains(e.target) && e.target !== themeBtn) themePopover.classList.remove('open'); });

/* ===== MOBILE MENU ===== */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => { burger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });

/* ===== NAV CLICK OVERLAY ANIMATIONS ===== */
const navOverlay = document.getElementById('navOverlay');
const navStage = document.getElementById('navStage');

const overlayTemplates = {
  home: `<div class="anim-pop"><div class="pc"><div class="pc-screen"><div class="pc-line" style="--w:70%;--d:.25s"></div><div class="pc-line g" style="--w:92%;--d:.5s"></div><div class="pc-line" style="--w:55%;--d:.75s"></div><div class="pc-line g" style="--w:80%;--d:1s"></div><div class="pc-cursor"></div></div><div class="pc-stand"></div><div class="pc-base"></div></div></div><div class="overlay-caption">&gt; BOOTING SYSTEM... {ES}</div>`,
  profile: `<svg class="anim-eagle" width="220" height="140" viewBox="0 0 220 140"><polygon points="110,20 160,70 130,65 160,110 110,90 60,110 90,65 60,70" fill="none" stroke="var(--neon)" stroke-width="3"/></svg><div class="overlay-caption">&gt; MENGAKSES PROFIL...</div>`,
  hobby: `<div class="anim-pop"><div style="font-size:4.2rem;">📖</div><div style="font-size:4.2rem;">🎮</div></div><div class="overlay-caption">&gt; MEMUAT HOBI...</div>`,
  idola: `<div class="anim-pop"><div style="font-size:2.6rem;">👨‍🔬</div><div style="font-size:2.6rem;">⚽</div><div style="font-size:2.6rem;">🏎️</div></div><div class="overlay-caption">&gt; IDOLA & INSPIRASI // LEGENDS ASSEMBLED</div>`,
  team: `<div class="anim-ball" style="font-size:4.5rem;">⚽</div><div class="anim-car" style="font-size:4.5rem; position:absolute;">🏎️</div><div class="overlay-caption">&gt; TIM FAVORIT...</div>`
};

function playNavAnim(type, targetSel){
  if(!overlayTemplates[type]){
    document.querySelector(targetSel)?.scrollIntoView({ behavior:'smooth' });
    return;
  }
  navStage.innerHTML = overlayTemplates[type];
  navOverlay.classList.add('show');
  document.querySelector(targetSel)?.scrollIntoView({ behavior:'smooth' });
  setTimeout(() => { navOverlay.classList.remove('show'); }, 1800);
}

document.querySelectorAll('[data-anim]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const type = el.getAttribute('data-anim');
    const target = el.getAttribute('data-target');
    burger.classList.remove('open'); mobileMenu.classList.remove('open');
    playNavAnim(type, target);
  });
});

/* ===== TYPING EFFECT ===== */
function startTyping(){
  const target = document.getElementById('typeTarget');
  const lines = ['> Status: Mahasiswa Ilmu Komputer...','> Target: Cyber Security Engineer...','> System: Universitas Negeri Medan_'];
  let lineIndex = 0, charIndex = 0, buffer = '';
  function tick(){
    if(lineIndex >= lines.length){ target.innerHTML = buffer + '<span class="cursor">&nbsp;</span>'; return; }
    const currentLine = lines[lineIndex];
    if(charIndex <= currentLine.length){
      target.innerHTML = buffer + currentLine.slice(0, charIndex) + '<span class="cursor">&nbsp;</span>';
      charIndex++; setTimeout(tick, 32);
    } else { buffer += currentLine + '\n'; lineIndex++; charIndex = 0; setTimeout(tick, 280); }
  }
  tick();
}
startTyping();

/* ===== BINARY RAIN (dynamic color) ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h, columns, drops;
function initCanvas(){ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; columns = Math.floor(w/16); drops = new Array(columns).fill(1); }
initCanvas();
window.addEventListener('resize', initCanvas);
function currentNeonRgba(alpha){
  const hex = getComputedStyle(root).getPropertyValue('--neon').trim() || '#00f3ff';
  return hexToRgba(hex, alpha);
}
function drawRain(){
  ctx.fillStyle = 'rgba(7,9,14,0.08)';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = currentNeonRgba(0.55);
  ctx.font = '16px JetBrains Mono, monospace';
  for(let i=0;i<drops.length;i++){
    const char = Math.random() > 0.5 ? '1' : '0';
    ctx.fillText(char, i*16, drops[i]*16);
    if(drops[i]*16 > h && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(drawRain);
}
drawRain();

/* ===== INTERSECTION OBSERVER REVEAL ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); } });
}, { threshold:0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== 3D TILT ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rotateX = ((y/rect.height) - 0.5) * -10;
    const rotateY = ((x/rect.width) - 0.5) * 10;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)'; });
});

/* ===== PROFILE PHOTO PIXEL EXPLOSION ===== */
const profilePhoto = document.getElementById('profilePhoto');
const explodeLayer = document.getElementById('explodeLayer');
const explodeColors = ['#00f3ff','#00ff66','#ff2d55','#ffd700','#a855f7','#ff8c00'];

profilePhoto.addEventListener('click', () => {
  const rect = profilePhoto.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;

  const ring = document.createElement('div');
  ring.className = 'shock-ring';
  ring.style.left = (cx - 30) + 'px';
  ring.style.top = (cy - 30) + 'px';
  explodeLayer.appendChild(ring);
  setTimeout(() => ring.remove(), 650);

  profilePhoto.classList.add('glitch');
  setTimeout(() => profilePhoto.classList.remove('glitch'), 420);

  for(let i=0; i<45; i++){
    const bit = document.createElement('div');
    bit.className = 'pixel-bit';
    bit.style.left = cx + 'px';
    bit.style.top = cy + 'px';
    bit.style.background = explodeColors[Math.floor(Math.random()*explodeColors.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const rot = Math.random() * 720 - 360;
    explodeLayer.appendChild(bit);
    bit.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity:1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0 }
    ], { duration: 700 + Math.random()*300, easing:'cubic-bezier(.2,.8,.3,1)' });
    setTimeout(() => bit.remove(), 1100);
  }
});

/* ===== IDOL PIXEL CHARACTER ===== */
const idolSprites = {
  tesla: {
    label:'Nikola Tesla',
    pal:{ H:'#1b1410', h:'#2e231b', S:'#e8c7a6', s:'#c9a483', E:'#111', M:'#241a14', p:'#b5787a', W:'#f4f4f4', B:'#16161c', T:'#00f3ff', Z:'#00f3ff' },
    rows:[
      "Z..............Z",
      "....HHHHHHHH....",
      "...HHHHhHHHHH...",
      "...HHHHhHHHHH...",
      "...HHSSSSSSHH...",
      "...HSHHSSHHSH...",
      "...SSESSSSESS...",
      "...SSSSssSSSS...",
      "...SMMMMMMMMS...",
      "...SSSSppSSSS...",
      "....SSSSSSSS....",
      ".....SSSSSS.....",
      "....WWWSSWWW....",
      "..BBBWWTTWWBBB..",
      ".BBBBBBTTBBBBBB.",
      "BBBBBBBTTBBBBBBB",
      "BBBBBBBTTBBBBBBB",
      "BBBBBBBBBBBBBBBB"
    ]
  },
  kroos: {
    label:'Toni Kroos',
    pal:{ H:'#a8854f', h:'#c4a26a', S:'#f0cfb0', s:'#d3ad8c', E:'#1d1d1d', n:'#cfae90', p:'#c98a86', W:'#f6f6f6', G:'#ffd700', Y:'#ffd700', V:'#2a3f8f' },
    rows:[
      "................",
      ".....hHHHHH.....",
      "....HHHHHHHHH...",
      "...HHHHHHHHHH...",
      "...HSSSSSSSSH...",
      "...SSHHSSHHSS...",
      "...SSESSSSESS...",
      "...SSSSssSSSS...",
      "...SSSSSSSSSS...",
      "...SnSSppSSnS...",
      "....SnnnnnnS....",
      ".....SSSSSS.....",
      "....GWSSSSWG....",
      "..WWWGWSSWGWWW..",
      "GWWWWWWWWWWWWWWG",
      "GWWWWWWWWWYYWWWG",
      "GWWWWWWWWWYVWWWG",
      "GWWWWWWWWWWWWWWG"
    ]
  },
  hamilton: {
    label:'Lewis Hamilton',
    pal:{ H:'#17110d', h:'#2c211a', S:'#a0674a', s:'#7f4d35', E:'#111', M:'#1f1612', p:'#7a3f3a', W:'#f4f4f4', R:'#e10600', Y:'#ffe600', K:'#9b0600' },
    rows:[
      "................",
      "....HHHHHHHH....",
      "...HhHhHhHhHH...",
      "...HHHHHHHHHH...",
      "...HSSSSSSSSH...",
      "..HSSHHSSHHSSH..",
      "..HSSESSSSESSH..",
      ".WHSSSSssSSSSH..",
      "..HSSMMMMMMSSH..",
      "...SMMSppSMMS...",
      "....MMMMMMMM....",
      ".....MMMMMM.....",
      "....RRWSSWRR....",
      "..RRRRRRRRRRRR..",
      ".RRRRRRRRRRRRRR.",
      "RRRRRRRRRRYYRRRR",
      "WRRRRRRRRRYYRRRW",
      "WRRRRRRRRRRRRRRW"
    ]
  }
};
function buildSprite(cfg){
  const rows = cfg.rows, W = 16, H = rows.length;
  let rects = '';
  rows.forEach((r, y) => {
    r = r.padEnd(W, '.');
    for(let x=0; x<W; x++){
      const c = cfg.pal[r[x]];
      if(r[x] !== '.' && c) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Karakter pixel ${cfg.label}">${rects}</svg><div class="pix-label">${cfg.label} • 8-bit</div>`;
}
document.querySelectorAll('.idol-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const idol = btn.getAttribute('data-idol');
    const box = document.getElementById('pixel-' + idol);
    if(!box.firstChild) box.innerHTML = buildSprite(idolSprites[idol]);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });
});

/* ===== BACKGROUND MUSIC (Starboy) ===== */
(function(){
  const bgm = document.getElementById('bgm'), btn = document.getElementById('bgmBtn');
  bgm.volume = 0.5;
  let wantPlay = true;
  const ui = p => { btn.textContent = p ? '🔊' : '🔇'; btn.classList.toggle('playing', p); };
  const start = () => bgm.play().then(() => { ui(true); removeUnlock(); }).catch(() => ui(false));
  const events = ['pointerdown','keydown','touchstart','wheel','scroll'];
  function onFirst(){ if(wantPlay) start(); }
  function removeUnlock(){ events.forEach(e => window.removeEventListener(e, onFirst)); }
  // coba langsung; jika diblokir browser, mulai saat interaksi pertama
  start();
  events.forEach(e => window.addEventListener(e, onFirst, { passive:true }));
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if(bgm.paused){ wantPlay = true; start(); } else { wantPlay = false; bgm.pause(); ui(false); }
  });
  bgm.addEventListener('error', () => { ui(false); btn.title = 'File music/starboy.mp3 tidak ditemukan'; });
  ui(false);
})();

/* ===== PIXEL VERSI ESA ===== */
const meSprite = {
  label:'Esa Sanjaya',
  pal:{ H:'#14141c', h:'#2a2a3a', S:'#e3b58f', s:'#c89773', E:'#0d0d12', p:'#b97b6f', W:'#f7f7fa', w:'#dcdce4', T:'#111118', K:'#15151c' },
  rows:[
    "................",
    "....HHHHHHHH....",
    "...HHHhHHHHHH...",
    "..HHHHHHHHHHHH..",
    "..HHHHHHHHHHHH..",
    "..HHHHHHSSHHHH..",
    "..HSHHSSSSHHSH..",
    "..HSSSSSSSSSSH..",
    "..SSEESSSSEESS..",
    "..SSSSSssSSSSS..",
    "..SSSSSSSSSSSS..",
    "...SSSSppSSSS...",
    "....SSSSSSSS....",
    ".....SSSSSS.....",
    "....WwwSSwwW....",
    "..WWWWwTTwWWWW..",
    ".WWWWWwTTwWWWWW.",
    "WKWWWWwTTwWWWWKW",
    "WKWWWWWTTWWWWWKW"
  ]
};
(function(){
  const box = document.getElementById('mePixel');
  box.innerHTML = buildSprite(meSprite).replace('• 8-bit','• versi pixel');
  box.addEventListener('click', () => {
    box.classList.remove('jump'); void box.offsetWidth; box.classList.add('jump');
  });
})();
