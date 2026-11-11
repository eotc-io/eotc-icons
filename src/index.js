import { icons } from './icons.js';

export { icons };

// Every icon's name, outlines and solids alike, in name order.
export const iconNames = Object.freeze(Object.keys(icons));

// The set's line, in points on the 24-point grid.
export const STROKE_WIDTH = 1.7;

// The name to draw: an icon's solid version when one is asked for and the
// set has it, else the icon itself.
export function resolveName(name, filled = false) {
  if (filled && !name.endsWith('-fill') && icons[`${name}-fill`])
    return `${name}-fill`;
  return name;
}

const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');

// An icon as an SVG string, for a page without React or a file to save.
export function toSvg(
  name,
  { size = 24, strokeWidth = STROKE_WIDTH, filled = false, title } = {},
) {
  const nodes = icons[resolveName(name, filled)];
  if (!nodes) throw new Error(`eotc-icons: no icon named "${name}"`);
  const body = nodes
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .map(([k, v]) => `${kebab(k)}="${escape(v)}"`)
          .join(' ')}/>`,
    )
    .join('');
  const label = title
    ? ` role="img" aria-label="${escape(title)}"`
    : ' aria-hidden="true"';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${label}>` +
    (title ? `<title>${escape(title)}</title>` : '') +
    `${body}</svg>`
  );
}
