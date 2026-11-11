import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { parseIcon, readIcons, ROOT } from '../scripts/build.mjs';
import {
  iconNames,
  icons,
  resolveName,
  STROKE_WIDTH,
  toSvg,
} from '../dist/index.js';
import { Icon } from '../dist/react.js';

const svgDir = new URL('../svg/', import.meta.url);

describe('the svg sources', () => {
  it('all keep to the set’s rules', () => {
    const files = readdirSync(svgDir).filter((f) => f.endsWith('.svg'));
    assert.ok(files.length > 0);
    assert.equal(Object.keys(readIcons()).length, files.length);
  });

  it('are the package’s icons, one for one', () => {
    const files = readdirSync(svgDir)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4))
      .sort();
    assert.deepEqual([...iconNames], files);
  });

  it('turn away what breaks the rules', () => {
    const icon = (body) => `${ROOT}\n  ${body}\n</svg>\n`;
    assert.throws(
      () => parseIcon('Bad_Name', icon('<path d="M1 1h2"/>')),
      /names are/,
    );
    assert.throws(
      () =>
        parseIcon('x', '<svg viewBox="0 0 16 16">\n<path d="M1 1"/>\n</svg>'),
      /root element/,
    );
    assert.throws(
      () => parseIcon('x', icon('<polygon points="1 1 2 2"/>')),
      /not used/,
    );
    assert.throws(
      () => parseIcon('x', icon('<path d="M1 1" stroke-width="3"/>')),
      /may not carry/,
    );
    assert.throws(
      () => parseIcon('x', icon('<path d="M1 1" fill="#f00"/>')),
      /currentColor or none/,
    );
    assert.throws(
      () => parseIcon('x', icon('<circle cx="30" cy="1" r="1"/>')),
      /grid/,
    );
    assert.throws(
      () => parseIcon('x', icon('<path d="M1 1" fill-rule="inherit"/>')),
      /evenodd or nonzero/,
    );
  });

  it('give every outline a solid version', () => {
    for (const name of iconNames.filter((n) => !n.endsWith('-fill'))) {
      assert.ok(icons[`${name}-fill`], `${name} has no solid version`);
    }
  });

  it('keep every solid icon beside its outline', () => {
    for (const name of iconNames.filter((n) => n.endsWith('-fill'))) {
      assert.ok(icons[name.slice(0, -5)], `${name} has no outline`);
    }
  });

  it('are byte-for-byte what a reader downloads', () => {
    const heart = readFileSync(new URL('heart.svg', svgDir), 'utf8');
    assert.ok(heart.startsWith(ROOT));
  });
});

describe('resolveName', () => {
  it('picks the solid version only when asked', () => {
    assert.equal(resolveName('heart'), 'heart');
    assert.equal(resolveName('heart', true), 'heart-fill');
    assert.equal(resolveName('heart-fill', true), 'heart-fill');
    assert.equal(resolveName('heart-fill'), 'heart-fill');
  });
});

describe('toSvg', () => {
  it('draws an icon in currentColor on the grid, hidden unless titled', () => {
    const svg = toSvg('heart', { size: 20 });
    assert.match(svg, /^<svg [^>]*width="20" height="20" viewBox="0 0 24 24"/);
    assert.match(svg, new RegExp(`stroke-width="${STROKE_WIDTH}"`));
    assert.match(svg, /aria-hidden="true"/);
    assert.match(
      toSvg('heart', { title: 'Give <now>' }),
      /role="img" aria-label="Give &lt;now>"><title>Give &lt;now><\/title>/,
    );
    assert.match(toSvg('heart', { filled: true }), /fill="currentColor"/);
    assert.match(toSvg('globe', { filled: true }), /fill-rule="evenodd"/);
  });

  it('says so for a name it does not know', () => {
    assert.throws(() => toSvg('nope'), /no icon named "nope"/);
  });
});

describe('the React icon', () => {
  it('draws every icon', () => {
    for (const name of iconNames) {
      const html = renderToStaticMarkup(createElement(Icon, { name }));
      assert.match(html, /^<svg/, name);
      assert.ok(html.includes('viewBox="0 0 24 24"'), name);
    }
  });

  it('takes a size, a line, a class and a solid version', () => {
    const html = renderToStaticMarkup(
      createElement(Icon, {
        name: 'heart',
        size: 18,
        strokeWidth: 2.2,
        className: 'h-5 w-5',
        filled: true,
      }),
    );
    assert.match(html, /width="18" height="18"/);
    assert.match(html, /stroke-width="2.2"/);
    assert.match(html, /class="h-5 w-5"/);
    assert.match(html, /fill="currentColor"/);
    assert.match(html, /aria-hidden="true"/);
  });

  it('names itself when titled', () => {
    const html = renderToStaticMarkup(
      createElement(Icon, { name: 'cross', title: 'Cross' }),
    );
    assert.match(html, /role="img" aria-label="Cross"><title>Cross<\/title>/);
  });
});
