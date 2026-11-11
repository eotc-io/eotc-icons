import { createElement } from 'react';

import { icons, resolveName, STROKE_WIDTH } from './index.js';

// An icon for the web, drawn in the text colour (currentColor). Decorative
// unless given a title. No hooks or state, so it renders on the server too.
export function Icon({
  name,
  size = 24,
  strokeWidth = STROKE_WIDTH,
  filled = false,
  title,
  ...svg
}) {
  const nodes = icons[resolveName(name, filled)] ?? [];
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...(title
        ? { role: 'img', 'aria-label': title }
        : { 'aria-hidden': true }),
      ...svg,
    },
    title ? createElement('title', null, title) : null,
    ...nodes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
  );
}
