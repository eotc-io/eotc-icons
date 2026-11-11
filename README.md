# eotc-icons

The eotc-io collection of icons for web and mobile.

One hand-drawn set on a 24-point grid: a 1.7 line, round ends and joins,
drawn in the text colour. Every icon comes in outline and solid. Made for [eotc.io](https://eotc.io) and its apps,
free for anyone to use in any project under the MIT license.

Browse, search, copy and download them at **[icons.eotc.io](https://icons.eotc.io)**.

## Install

```sh
npm install eotc-icons
```

## Use

### React (web)

```tsx
import { Icon } from 'eotc-icons/react';

<Icon name="heart" />                       // 24 px, decorative
<Icon name="heart" className="h-5 w-5" />   // sized by CSS
<Icon name="heart" filled title="Give" />   // the solid version, named for screen readers
```

The icon draws in `currentColor`, so it takes the text colour around it. It
has no hooks or state and renders in React Server Components.

### React Native

Needs [`react-native-svg`](https://github.com/software-mansion/react-native-svg).

```tsx
import { Icon } from 'eotc-icons/native';

<Icon name="church" size={26} color="#0A0F0D" />
<Icon name="church" filled color="#FFFFFF" />
```

### Plain SVG

```js
import { toSvg, iconNames } from 'eotc-icons';

element.innerHTML = toSvg('cross', { size: 20 });
```

Every icon is also a file: `eotc-icons/svg/cross.svg`.

### Props

| Prop          | Default         | What it does                                                            |
| ------------- | --------------- | ----------------------------------------------------------------------- |
| `name`        | (required)      | The icon, e.g. `"chevron-right"`. Typed: an unknown name won't build.   |
| `size`        | `24`            | Width and height.                                                       |
| `strokeWidth` | `1.7`           | The line, on the 24-point grid.                                         |
| `filled`      | `false`         | Draw the solid version (`heart` → `heart-fill`).                        |
| `title`       | none (web)      | An accessible name. Without one the icon is hidden from screen readers. |
| `color`       | `#000` (native) | The icon's colour on React Native. On the web, set the text colour.     |

## The rules of the set

Every icon in `svg/` is checked by the build:

- The root element is the same for every icon: a `0 0 24 24` grid,
  `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and
  joins.
- Shapes are `path`, `circle`, `ellipse` and `rect` only, one per line, and
  stay on the grid.
- Paint is only ever `currentColor` or `none`, so an icon takes any colour.
  A solid shape may use `fill-rule="evenodd"` for its holes.
- Names are lower-case words joined by `-`. Every icon has a solid version:
  the same name with `-fill`, drawn as filled shapes (so it looks the same
  at any line width).
- Keep about 2 points of space inside the grid's edges, close shapes, and
  draw with the line rather than with fills where you can.

## Adding or changing an icon

1. Draw it on the 24-point grid and save it as `svg/<name>.svg`, with its
   solid version as `svg/<name>-fill.svg`, keeping to the rules above.
2. `pnpm test` builds the package and checks every icon.
3. `pnpm site` builds icons.eotc.io into `site/dist` to look it over.

## Publishing

- **npm:** bump `version`, then `pnpm publish` (the build and tests run first).
- **icons.eotc.io:** a static site. Build with `pnpm site` and serve
  `site/dist` (on Cloudflare Pages: build command `pnpm site`, output
  directory `site/dist`).

## License

[MIT](LICENSE): use the icons in any project, commercial or not, free of charge. Keep the copyright and license notice with copies of the package or the SVG files.
