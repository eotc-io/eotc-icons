// Builds icons.eotc.io into site/dist: one static page to browse, search,
// copy and download the icons, every svg file, and a zip of them all. No
// framework and nothing fetched at run time; deploy site/dist as is.
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readIcons } from './build.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site', 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const icons = readIcons();
const names = Object.keys(icons);

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'svg'), { recursive: true });

const files = names.map((name) => {
  const data = readFileSync(join(root, 'svg', `${name}.svg`));
  copyFileSync(
    join(root, 'svg', `${name}.svg`),
    join(out, 'svg', `${name}.svg`),
  );
  return { path: `eotc-icons/${name}.svg`, data };
});
const zipName = `eotc-icons-${pkg.version}-svg.zip`;
writeFileSync(join(out, zipName), zip(files));

// The page's icon data: each icon's inner markup, as the files draw it.
const inner = Object.fromEntries(
  names.map((name) => [
    name,
    readFileSync(join(root, 'svg', `${name}.svg`), 'utf8')
      .trim()
      .split('\n')
      .slice(1, -1)
      .map((l) => l.trim())
      .join(''),
  ]),
);
const ROOT_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
const draw = (name) => `${ROOT_OPEN}${inner[name]}</svg>`;

const outlines = names.filter((n) => !n.endsWith('-fill'));
const solids = new Set(names.filter((n) => n.endsWith('-fill')));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>eotc icons</title>
<meta name="description" content="${names.length} hand-drawn icons for web and mobile, free under the MIT license. React, React Native and plain SVG.">
<link rel="icon" href="svg/cross.svg">
<script>try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch{}</script>
<style>
:root{--paper:#FAF7F0;--card:#FFFFFF;--ink:#0A0F0D;--body:#4A4F4C;--rule:rgba(60,46,16,.14);--mist:#F0ECE2;--accent:#1D6B45;--on-accent:#FFFFFF;--gold:#D9A521;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--paper:#0B0F0E;--card:#151A18;--ink:#E8ECE8;--body:#A9B0AC;--rule:rgba(255,255,255,.12);--mist:#1B211E;--accent:#5BBC6C;--on-accent:#0B0F0E;--gold:#E2C063;color-scheme:dark}}
:root[data-theme=dark]{--paper:#0B0F0E;--card:#151A18;--ink:#E8ECE8;--body:#A9B0AC;--rule:rgba(255,255,255,.12);--mist:#1B211E;--accent:#5BBC6C;--on-accent:#0B0F0E;--gold:#E2C063;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
.flag{height:6px;background:linear-gradient(90deg,#1D6B45 0 33.3%,#D9A521 33.3% 66.6%,#C8322B 66.6%)}
main{max-width:1120px;margin:0 auto;padding:40px 16px 64px}
header{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
h1{font-size:30px;line-height:1.1;margin:0}
.lede{color:var(--body);max-width:640px;margin:14px 0 0}
.lede a{color:var(--accent)}
.actions{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 16px;border-radius:21px;border:1px solid var(--rule);background:var(--card);color:var(--ink);font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}
.btn svg{width:18px;height:18px}
section{margin-top:40px}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--body);margin:0 0 12px}
.usage{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.usage div{background:var(--card);border:1px solid var(--rule);border-radius:16px;padding:16px;min-width:0}
.usage h3{margin:0 0 8px;font-size:15px}
pre{margin:0;overflow-x:auto;background:var(--mist);border-radius:10px;padding:12px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
.tools{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.search{flex:1;min-width:220px;display:flex;align-items:center;gap:8px;height:46px;padding:0 16px;border-radius:23px;background:var(--card);border:1px solid var(--rule)}
.search input{flex:1;border:0;background:none;color:inherit;font:inherit;outline:none;min-width:0}
.search svg{width:20px;height:20px;color:var(--body)}
.seg{display:flex;padding:4px;border-radius:23px;background:var(--card);border:1px solid var(--rule)}
.seg button{height:36px;padding:0 16px;border-radius:18px;border:0;background:none;color:var(--body);font:inherit;font-weight:600;cursor:pointer}
.seg button.on{background:var(--ink);color:var(--paper)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}
.cell{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 6px 12px;border-radius:16px;background:var(--card);border:1px solid var(--rule);color:var(--ink);cursor:pointer;font:inherit}
.cell:hover,.cell:focus-visible{border-color:var(--accent);outline:none}
.cell svg{width:28px;height:28px}
.cell span{font-size:12px;color:var(--body);word-break:break-word;text-align:center}
.empty{color:var(--body);padding:24px 0}
dialog{border:0;border-radius:22px;padding:0;background:var(--card);color:var(--ink);width:min(560px,calc(100vw - 32px));box-shadow:0 20px 60px rgba(0,0,0,.25)}
dialog::backdrop{background:rgba(20,16,8,.45)}
.sheet{padding:24px}
.sheet header{margin-bottom:16px}
.sheet h3{margin:0;font-size:20px}
.preview{display:flex;gap:24px;align-items:flex-end;justify-content:center;background:var(--mist);border-radius:16px;padding:28px 16px;margin-bottom:16px}
.preview svg{display:block}
.close{width:40px;height:40px;border-radius:20px;border:1px solid var(--rule);background:var(--card);color:var(--ink);cursor:pointer;display:grid;place-items:center}
.close svg{width:18px;height:18px}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.note{font-size:13px;color:var(--body)}
footer{margin-top:56px;color:var(--body);font-size:14px}
footer a{color:var(--accent)}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ink);color:var(--paper);padding:10px 18px;border-radius:20px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none}
.toast.on{opacity:1}
</style>
</head>
<body>
<div class="flag"></div>
<main>
<header>
  <h1>eotc icons</h1>
  <div class="actions">
    <button class="btn" id="theme" type="button" aria-label="Colour theme">${draw('sun')}<span>System</span></button>
    <a class="btn primary" href="${zipName}" download>${draw('download')}Download all SVGs</a>
    <a class="btn" href="https://github.com/eotc-io/eotc-icons">GitHub</a>
    <a class="btn" href="https://www.npmjs.com/package/${pkg.name}">npm</a>
  </div>
</header>
<p class="lede">${outlines.length} hand-drawn icons, each in outline and solid, made for <a href="https://eotc.io">eotc.io</a> and free for anyone to use. One set on a 24-point grid with a 1.7 line and round ends, drawn in the text colour. Version ${pkg.version}, MIT license.</p>

<section>
  <h2>Use them</h2>
  <div class="usage">
    <div><h3>Install</h3><pre>npm install ${pkg.name}</pre><p class="note">Or download the SVGs above and use them as files.</p></div>
    <div><h3>React</h3><pre>import { Icon } from '${pkg.name}/react';

&lt;Icon name="heart" size={24} /&gt;
&lt;Icon name="heart" filled title="Give" /&gt;</pre></div>
    <div><h3>React Native</h3><pre>// needs react-native-svg
import { Icon } from '${pkg.name}/native';

&lt;Icon name="church" color="#0A0F0D" /&gt;</pre></div>
    <div><h3>Plain SVG</h3><pre>import { toSvg } from '${pkg.name}';

el.innerHTML = toSvg('cross', { size: 20 });</pre></div>
  </div>
</section>

<section>
  <h2>Icons</h2>
  <div class="tools">
    <div class="search">${draw('search')}<input id="q" type="search" placeholder="Search ${outlines.length} icons" aria-label="Search icons" autocomplete="off"></div>
    <div class="seg" role="group" aria-label="Style">
      <button type="button" class="on" data-style="outline" aria-pressed="true">Outline</button>
      <button type="button" data-style="solid" aria-pressed="false">Solid</button>
    </div>
  </div>
  <div class="grid" id="grid"></div>
  <p class="empty" id="empty" hidden>No icon by that name yet. <a href="https://github.com/eotc-io/eotc-icons/issues">Ask for one</a>.</p>
</section>

<footer>Made for the Ethiopian Orthodox Tewahedo Church community by <a href="https://eotc.io">eotc.io</a>. Icons licensed under <a href="https://github.com/eotc-io/eotc-icons/blob/main/LICENSE">MIT</a>.</footer>
</main>

<dialog id="sheet">
  <div class="sheet">
    <header><h3 id="name"></h3><button class="close" id="close" aria-label="Close">${draw('x')}</button></header>
    <div class="preview" id="preview"></div>
    <pre id="code"></pre>
    <div class="row">
      <button class="btn primary" id="copy-svg">${draw('copy')}Copy SVG</button>
      <a class="btn" id="download">${draw('download')}Download</a>
      <button class="btn" id="copy-react">Copy React</button>
      <button class="btn" id="copy-native">Copy React Native</button>
    </div>
  </div>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
const PKG = ${JSON.stringify(pkg.name)};
const ICONS = ${JSON.stringify(inner)};
const OPEN = ${JSON.stringify(ROOT_OPEN)};
const svg = (n) => OPEN + ICONS[n] + '</svg>';
const fileOf = (n) => OPEN.replace('>', '>\\n  ') + ICONS[n].replace(/></g, '>\\n  <') + '\\n</svg>\\n';
const grid = document.getElementById('grid');
const q = document.getElementById('q');
let style = 'outline';
const sheet = document.getElementById('sheet');
let current = null;

function render() {
  const term = q.value.trim().toLowerCase();
  const names = Object.keys(ICONS).filter((n) => !n.endsWith('-fill') && n.includes(term));
  grid.innerHTML = names.map((n) => {
    const drawn = style === 'solid' ? n + '-fill' : n;
    return '<button class="cell" data-name="' + drawn + '">' + svg(drawn) + '<span>' + n + '</span></button>';
  }).join('');
  document.getElementById('empty').hidden = names.length > 0;
}

function open(n) {
  current = n;
  const base = n.replace(/-fill$/, '');
  document.getElementById('name').textContent = n;
  document.getElementById('preview').innerHTML = [40, 28, 20].map((s) => svg(n).replace('width="24" height="24"', 'width="' + s + '" height="' + s + '"')).join('');
  document.getElementById('code').textContent = "<Icon name=\\"" + base + "\\"" + (n.endsWith('-fill') ? ' filled' : '') + " />";
  const dl = document.getElementById('download');
  dl.href = 'svg/' + n + '.svg';
  dl.download = n + '.svg';
  sheet.showModal();
}

function toast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.add('on');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('on'), 1600);
}

async function copy(text, what) {
  try { await navigator.clipboard.writeText(text); toast(what + ' copied'); }
  catch { toast('Could not copy'); }
}

grid.addEventListener('click', (e) => { const b = e.target.closest('.cell'); if (b) open(b.dataset.name); });
q.addEventListener('input', render);
document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
  style = b.dataset.style;
  document.querySelectorAll('.seg button').forEach((o) => {
    o.classList.toggle('on', o === b);
    o.setAttribute('aria-pressed', String(o === b));
  });
  render();
}));

// The colour theme: the system's, or light or dark by choice (remembered).
const THEMES = ['system', 'light', 'dark'];
const LABEL = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON = { system: ${JSON.stringify(draw('sun'))}, light: ${JSON.stringify(draw('sun'))}, dark: ${JSON.stringify(draw('moon'))} };
let theme = 'system';
try { theme = localStorage.getItem('theme') || 'system'; } catch {}
function applyTheme() {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
  const b = document.getElementById('theme');
  b.innerHTML = ICON[theme] + '<span>' + LABEL[theme] + '</span>';
  b.setAttribute('aria-label', 'Colour theme: ' + LABEL[theme]);
}
document.getElementById('theme').addEventListener('click', () => {
  theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  try { localStorage.setItem('theme', theme); } catch {}
  applyTheme();
});
applyTheme();
document.getElementById('close').addEventListener('click', () => sheet.close());
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
document.getElementById('copy-svg').addEventListener('click', () => copy(fileOf(current), 'SVG'));
const usage = (from) => {
  const base = current.replace(/-fill$/, '');
  return "import { Icon } from '" + PKG + from + "';\\n\\n<Icon name=\\"" + base + "\\"" + (current.endsWith('-fill') ? ' filled' : '') + " />";
};
document.getElementById('copy-react').addEventListener('click', () => copy(usage('/react'), 'React'));
document.getElementById('copy-native').addEventListener('click', () => copy(usage('/native'), 'React Native'));
const fromHash = decodeURIComponent(location.hash.slice(1));
render();
if (ICONS[fromHash]) open(fromHash);
</script>
</body>
</html>
`;
writeFileSync(join(out, 'index.html'), html);
console.log(`site: ${names.length} icons, ${zipName} → site/dist/`);

// A zip of `files`, stored (not compressed): small svgs gain little, and
// this keeps the site build free of dependencies.
function zip(entries) {
  const table = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const local = [];
  const central = [];
  let offset = 0;
  for (const { path, data } of entries) {
    const name = Buffer.from(path);
    const crc = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(0x0800, 6);
    head.writeUInt16LE(0, 8);
    head.writeUInt32LE(0, 10);
    head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(data.length, 18);
    head.writeUInt32LE(data.length, 22);
    head.writeUInt16LE(name.length, 26);
    head.writeUInt16LE(0, 28);
    local.push(head, name, data);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(0, 10);
    dir.writeUInt32LE(0, 12);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(data.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(name.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, name);
    offset += head.length + name.length + data.length;
  }
  const size = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(size, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}
