import type { ReactElement, SVGProps } from 'react';

import type { IconName } from './index.js';

export type { IconName };

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  'name' | 'ref' | 'children'
> {
  name: IconName;
  /** Width and height (CSS sizing via className wins). Default 24. */
  size?: number | string;
  /** Line width on the 24-point grid. Default 1.7. */
  strokeWidth?: number;
  /** Draw the solid version where the set has one (e.g. a chosen tab). */
  filled?: boolean;
  /** An accessible name; without one the icon is hidden from assistive tech. */
  title?: string;
}

/** An icon for the web, drawn in the text colour (currentColor). */
export declare function Icon(props: IconProps): ReactElement;
