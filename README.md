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

Both run from GitHub Actions once set up.

### npm (`.github/workflows/release.yml`)

Pushing a version tag publishes the package, with
[provenance](https://docs.npmjs.com/generating-provenance-statements).

1. Bump `version` in `package.json` and commit.
2. `git tag v0.1.0 && git push origin v0.1.0` (the tag must match the
   version).

One-time setup: on npmjs.com create a granular access token that can publish
`eotc-icons` (for the very first release, one that can publish new packages),
and add it to the repo as the Actions secret `NPM_TOKEN`.

### icons.eotc.io (`.github/workflows/site.yml`)

Every push to `main` builds the site (`pnpm site`) and deploys `site/dist`
to Cloudflare Pages.

One-time setup:

1. In Cloudflare, create a Pages project named `eotc-icons` (Workers & Pages
   → Create → Pages → Direct Upload).
2. Create an API token with the **Cloudflare Pages: Edit** permission, and
   add it to the repo as the Actions secret `CLOUDFLARE_API_TOKEN`; add your
   account ID as `CLOUDFLARE_ACCOUNT_ID`.
3. In the Pages project, add the custom domain `icons.eotc.io`.

To look at the site locally: `pnpm site`, then open `site/dist/index.html`.

## License

[MIT](LICENSE): use the icons in any project, commercial or not, free of charge. Keep the copyright and license notice with copies of the package or the SVG files.
