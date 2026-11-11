import { createElement } from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { icons, resolveName, STROKE_WIDTH } from './index.js';

const SHAPES = { path: Path, circle: Circle, ellipse: Ellipse, rect: Rect };

// An icon for React Native (react-native-svg), drawn in `color`. Solid parts
// of an icon paint in currentColor, which react-native-svg takes from
// `color`. Hidden from assistive tech: the control around it is labelled.
export function Icon({
  name,
  size = 24,
  color = '#000000',
  strokeWidth = STROKE_WIDTH,
  filled = false,
  ...svg
}) {
  const nodes = icons[resolveName(name, filled)] ?? [];
  return createElement(
    Svg,
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
      ...svg,
    },
    nodes.map(([tag, attrs], i) =>
      createElement(SHAPES[tag], { key: i, ...attrs }),
    ),
  );
}
