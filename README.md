# eztheme

Themes as data. It has 15 app looks, 28 form looks and a Material 3 "Studio" theme. It also has the colour rules that work out everything else from a few colours, contrast checks, and output as CSS custom properties in either of two name sets. There are no runtime dependencies.

<img src="docs/app-themes.svg" alt="The 15 app themes as small mock screens: Light, Dark, Retro, Retro Game, Neo-Brutalism, Neo-Brutalism Pop, 90s Retro-Tech, Synthwave Noir, Cyberpunk Rain, File Cabinet, Blueprint, Corkboard, Green, Blue and Lavender Earthy" width="100%">

- **A theme is a few colours.** You give a palette (accent, page, surface, text, status colours). eztheme works out the surface ladder (four steps back from the card), an outline that clears 3:1, and status ink/wash pairs that read at chip sizes. Themes can also remap hues picked in code: "when the app asks for green, use my jade".
- **Two vocabularies.** It writes ezinputs names (`--ez-accent`, `--ez-surface-high`, `--ez-danger-ink`, …) or Material 3 names (`--md-sys-color-primary`, `--md-sys-color-surface-container`, …), or both. An app keeps its own CSS and still takes every theme.
- **Contrast is checked.** Every form theme is tested against a contract that says which token is read on which surface and how readable it must be. App themes must keep text at 4.5:1 on all their surfaces.
- **No framework.** It's plain data and functions. `eztheme/dom` applies a theme to a page. `eztheme/mui` turns one into MUI theme options, without importing MUI.

## Install

```sh
npm install eztheme
```

No build step? Use the stylesheets directly, or copy `dist/eztheme.min.js` into your project:

```html
<link rel="stylesheet" href="vendor/themes.css">   <!-- every theme -->
<html data-eztheme="corkboard">                    <!-- pick one -->
```

### Smaller imports

`eztheme` loads every theme. To load one piece, import its entry instead: `eztheme/color`, `eztheme/derive` (the surface ladder, status pairs and accent remaps), `eztheme/tokens`, `eztheme/layout`, `eztheme/forms` (the form themes and their contrast contract) or `eztheme/app-themes`. Only `eztheme/forms` includes the form themes.

## Use it

```js
import { applyTheme } from 'eztheme/dom';

applyTheme('synthwave-noir');           // writes the theme's custom properties on <html>
applyTheme('form:sky', { names: 'ez' }); // a form look, ezinputs names only
applyTheme('studio');                   // light/dark follows data-theme="dark" or the OS
```

```css
.card   { background: var(--ez-surface); border: 1px solid var(--ez-border); color: var(--ez-text); }
.button { background: var(--ez-accent); color: var(--ez-on-accent); border-radius: var(--ez-radius); }
.chip.error { background: var(--ez-danger-soft); color: var(--ez-danger-ink); }
```

```js
import { getTheme, themeTokens, toCSS, auditFormTheme, contrastRatio } from 'eztheme';

themeTokens(getTheme('corkboard'), 'md');   // { '--md-sys-color-primary': '#b3261e', … }
toCSS(getTheme('blueprint'), { selector: '.preview' });
auditFormTheme(getTheme('form:sky'));       // each pairing, its ratio, pass or not
```

## Form themes

The colours a public form is painted with. Each one is a token bag (page, surface, text, muted, accent, input, danger, font), with helpers for the inks a form reads.

<img src="docs/form-themes.svg" alt="The 28 form themes as small mock screens, from Default and Sky through the seasons to Hardwood and Construction" width="100%">

## Studio

Photo Studio's look: amber on warm neutrals, in light and dark, written directly as Material 3 tokens (a reference palette, colour roles, type sizes, corners, motion). `dist/studio.css` is a drop-in for an app on Material names. Light is the default; dark comes from the OS, or from `data-theme="dark"` on the root.

<img src="docs/studio.svg" alt="The Studio theme in light and dark" width="380">

## Layout

A layout is the sizes a theme's screens are built from: spacing, corners, a type scale, list-row and chip sizes at three densities, the navigation rail, the top bar, and where the page sits in the window. It's tokens, not markup.

- **`ezinputs`**: ezinputs' own numbers. These are its list rows (71.2px default, 61.04 comfortable, 53.28 compact), 24/20px chips, the 80px rail with its 56×32 indicator, and its type scale.
- **`studio`**: Photo Studio's shell. It has a 72px bar, a 104px rail column and a sheet with 28px corners, plus the Studio theme's type sizes.

```js
import { applyLayout } from 'eztheme/dom';
applyLayout('ezinputs', { density: 'compact' });   // --ez-row-height: 53.28px, --ez-chip-height: 20px, …
```

```html
<link rel="stylesheet" href="vendor/layouts.css">  <!-- before themes.css -->
<html data-ezlayout="ezinputs" data-ezdensity="compact">
```

```css
.row  { min-height: var(--ez-row-height); padding: var(--ez-row-pad-y) 16px; border-radius: var(--ez-card-radius); }
.rail { width: var(--ez-rail-column); }
h2    { font-size: var(--md-sys-typescale-title-large); }
```

Corners and type sizes are written under Material 3 names as well (`--md-sys-shape-corner-large`, `--md-sys-typescale-title-large`). Everything else is `--ez-*`. A theme's own corner wins over the layout's: Retro keeps its 14px, and Retro Game keeps its square cards. `radiusScale` makes every corner rounder or squarer. Use `withLayout(STUDIO_LAYOUT, { page: { padY: 30 } })` to change a few numbers.

The layout modes are there as data too. They are Studio, Cards, Flat and Open, plus six that belong to one theme (Desktop for 90s Retro-Tech, Board for Corkboard, …). For each mode, eztheme says which surface the nav and the page draw on, and which modes to offer under which theme. Drawing those surfaces stays the app's job.

## What's not in it

- **Fonts.** Themes name font stacks but don't load fonts. Load them yourself (Google Fonts, `next/font`, …).
- **Component styling and page layouts.** A theme gives colours, fonts and corners, and a layout gives sizes. Corkboard's pins and File Cabinet's tabs are styling in the app that uses them.
- **Animated form scenes.** These are not included yet.

## Demo and pictures

`npm run demo` serves a page with a picker for every theme. The pictures in this README are drawn from the themes themselves: `npm run build && npm run readme-images`.

## Credits

The token names follow Material 3's published design tokens (Google). This project is independent and not affiliated with or endorsed by Google. The themes come from [ezinputs](https://ezinputs.com).

## License

MIT © James Dominguez
