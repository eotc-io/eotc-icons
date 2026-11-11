import type { ReactElement } from 'react';
import type { SvgProps } from 'react-native-svg';

import type { IconName } from './index.js';

export type { IconName };

export interface IconProps extends Omit<SvgProps, 'color' | 'children'> {
  name: IconName;
  /** Width and height, in points. Default 24. */
  size?: number;
  /** The icon's colour. Default black. */
  color?: string;
  /** Line width on the 24-point grid. Default 1.7. */
  strokeWidth?: number;
  /** Draw the solid version where the set has one (e.g. a chosen tab). */
  filled?: boolean;
}

/** An icon for React Native, drawn with react-native-svg. */
export declare function Icon(props: IconProps): ReactElement;
