// Builds the package from svg/: reads every icon, checks it keeps to the
// set's rules, and writes dist/ (the drawing data, its types, and the React
// and React Native components).
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgDir = join(root, 'svg');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

// Every icon's root element, exactly: the grid, the line and its ends.
export const ROOT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';

// What an icon may draw with. Attribute names are plain words, so they read
// the same in SVG, React and react-native-svg (fill-rule is carried as
// fillRule).
const ELEMENTS = {
  path: ['d'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['x', 'y', 'width', 'height', 'rx'],
};
const PAINT = ['fill', 'stroke'];
// A solid icon may fill its holes even-odd.
const RULES = ['fill-rule'];
const NUMERIC = new Set([
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'width',
  'height',
]);

export const NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

// One icon's file, read into [tag, attributes] pairs; throws on anything
// outside the rules.
export function parseIcon(name, text) {
  if (!NAME.test(name))
    throw new Error(`${name}: names are lower-case words joined by "-"`);
  const lines = text.trim().split('\n');
  if (lines[0] !== ROOT)
    throw new Error(`${name}.svg: the root element must be exactly\n${ROOT}`);
  if (lines.at(-1) !== '</svg>')
    throw new Error(`${name}.svg: must end with </svg>`);
  const nodes = [];
  for (const line of lines.slice(1, -1)) {
    const m = /^\s*<(\w+)((?:\s+[\w-]+="[^"]*")*)\s*\/>\s*$/.exec(line);
    if (!m)
      throw new Error(
        `${name}.svg: one self-closing element per line, got: ${line.trim()}`,
      );
    const [, tag, rawAttrs] = m;
    const allowed = ELEMENTS[tag];
    if (!allowed)
      throw new Error(`${name}.svg: <${tag}> is not used in this set`);
    const attrs = {};
    for (const [, key, value] of rawAttrs.matchAll(/([\w-]+)="([^"]*)"/g)) {
      if (
        !allowed.includes(key) &&
        !PAINT.includes(key) &&
        !RULES.includes(key)
      ) {
        throw new Error(`${name}.svg: <${tag}> may not carry ${key}`);
      }
      if (PAINT.includes(key) && value !== 'currentColor' && value !== 'none') {
        throw new Error(`${name}.svg: ${key} must be currentColor or none`);
      }
      if (key === 'fill-rule') {
        if (value !== 'evenodd' && value !== 'nonzero')
          throw new Error(`${name}.svg: fill-rule must be evenodd or nonzero`);
        attrs.fillRule = value;
        continue;
      }
      if (NUMERIC.has(key)) {
        const n = Number(value);
        if (!Number.isFinite(n) || n < 0 || n > 24)
          throw new Error(
            `${name}.svg: ${key}="${value}" is off the 24-point grid`,
          );
        attrs[key] = n;
      } else {
        attrs[key] = value;
      }
    }
    nodes.push([tag, attrs]);
  }
  if (nodes.length === 0) throw new Error(`${name}.svg: draws nothing`);
  return nodes;
}

// Every icon in svg/, by name, in name order.
export function readIcons() {
  const icons = {};
  const names = readdirSync(svgDir)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.slice(0, -4));
  for (const name of names.sort()) {
    icons[name] = parseIcon(
      name,
      readFileSync(join(svgDir, `${name}.svg`), 'utf8'),
    );
  }
  for (const name of Object.keys(icons)) {
    if (name.endsWith('-fill') && !icons[name.slice(0, -5)]) {
      throw new Error(
        `${name}.svg: a solid icon needs its outline (${name.slice(0, -5)}.svg)`,
      );
    }
  }
  return icons;
}

function build() {
  const icons = readIcons();
  const names = Object.keys(icons);
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  const data = names
    .map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(icons[n])},`)
    .join('\n');
  writeFileSync(
    join(distDir, 'icons.js'),
    `// Generated from svg/ by scripts/build.mjs. Do not edit.\nexport const icons = {\n${data}\n};\n`,
  );
  writeFileSync(
    join(distDir, 'names.d.ts'),
    `// Generated from svg/ by scripts/build.mjs. Do not edit.\nexport type IconName =\n${names.map((n) => `  | ${JSON.stringify(n)}`).join('\n')};\n`,
  );
  for (const file of readdirSync(srcDir))
    copyFileSync(join(srcDir, file), join(distDir, file));
  console.log(
    `eotc-icons: ${names.length} icons (${names.filter((n) => n.endsWith('-fill')).length} solid) → dist/`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) build();
