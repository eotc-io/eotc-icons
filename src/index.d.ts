import type { IconName } from './names.js';

export type { IconName };

/** An icon's names without the solid versions (`heart`, not `heart-fill`). */
export type OutlineIconName = Exclude<IconName, `${string}-fill`>;

/** One shape of an icon: its element and attributes, on the 24-point grid. */
export type IconNode = readonly [
  tag: 'path' | 'circle' | 'ellipse' | 'rect',
  attrs: Readonly<Record<string, string | number>>,
];

/** Every icon's shapes, by name. */
export declare const icons: Readonly<Record<IconName, readonly IconNode[]>>;

/** Every icon's name, outlines and solids alike, in name order. */
export declare const iconNames: readonly IconName[];

/** The set's line width on the 24-point grid (1.7). */
export declare const STROKE_WIDTH: number;

/** The icon to draw: `name-fill` when `filled` is asked and the set has it, else `name`. */
export declare function resolveName(name: IconName, filled?: boolean): IconName;

export interface SvgOptions {
  /** Width and height, in pixels. Default 24. */
  size?: number;
  /** Line width on the 24-point grid. Default 1.7. */
  strokeWidth?: number;
  /** Draw the solid version where the set has one. */
  filled?: boolean;
  /** An accessible name; without one the icon is hidden from assistive tech. */
  title?: string;
}

/** An icon as an SVG string, drawn in `currentColor`. */
export declare function toSvg(name: IconName, options?: SvgOptions): string;
