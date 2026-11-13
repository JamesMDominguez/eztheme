/**
 * Layout as tokens: the sizes a theme's screens are built from, not the markup.
 *
 * A layout holds spacing, corners, a type scale, list-row and chip sizes at
 * three densities, the navigation rail, the top bar, and where the page sits
 * in the window. `layoutTokens()` turns one into CSS custom properties, the
 * same way `themeTokens()` does for colour, so an app's stylesheet reads
 * `var(--ez-row-height)` instead of writing 71.2px in three places.
 *
 * Two layouts ship:
 *  - `ezinputs`: ezinputs' own numbers (listRowMetrics, chipMetrics,
 *    m3NavRail, the type scale, the Studio shell's insets), unchanged;
 *  - `studio`: Photo Studio's shell (72px bar, 104px rail column, a sheet with
 *    28px corners) and its larger type scale, the same values as the Studio
 *    theme's own tokens.
 *
 * The layout modes (Studio, Cards, Flat, Open and the six that belong to one
 * theme) are here as data too: which surface the nav and the page each draw
 * on, and which theme owns which layout. Drawing those surfaces stays the
 * app's job.
 */

import type { Theme } from './types.js';
import type { Tokens } from './tokens.js';

export type Density = 'default' | 'comfortable' | 'compact';
export const DENSITIES: readonly Density[] = ['default', 'comfortable', 'compact'];

/** One type role: size and line height together, so a call site picks a name, not four numbers. */
export interface TypeStyle {
    fontSize: number;
    /** Optional: Studio's scale is sizes only, and each place sets its own line height. */
    lineHeight?: number;
    fontWeight?: number;
    letterSpacing?: string;
}

/** A list row and the chips on it, at one density. All px. */
export interface DensityMetrics {
    /** Vertical padding on the row's body. */
    rowPadY: number;
    titleSize: number;
    titleLineHeight: number;
    /** Gap between the title line and the meta line. */
    rowGap: number;
    metaLineHeight: number;
    chipHeight: number;
    chipPadX: number;
    chipIcon: number;
}

/** Material 3's corner names. */
export type Corner = 'extra-small' | 'small' | 'medium' | 'large' | 'large-increased' | 'extra-large' | 'full';

export interface Layout {
    id: string;
    name: string;
    /** The spacing unit, px. Spacing tokens are multiples of it. */
    space: number;
    /** Corner sizes, px. */
    corner: Record<Corner, number>;
    /** The one corner every card on a screen shares, px. */
    cardRadius: number;
    /** Type roles, keyed by M3 role name in camelCase (titleLarge, bodyMedium…). */
    type: Record<string, TypeStyle>;
    /** Nothing is set smaller than this, px. */
    minFontSize: number;
    density: Record<Density, DensityMetrics>;
    /** The collapsed navigation rail. `column` is the width it takes in the shell, gutters included. */
    rail: { width: number; column: number; columnOpen: number; indicatorWidth: number; indicatorHeight: number; labelSize: number };
    /** The top bar. */
    bar: { height: number };
    /** Where the page sits in the window, beside the rail and under the bar, and its own padding. px. */
    page: { inset: [number, number, number, number]; padY: number; padX: number };
}

const M3_CORNERS: Record<Corner, number> = {
    'extra-small': 4, small: 8, medium: 12, large: 16, 'large-increased': 20, 'extra-large': 28, full: 999,
};

/** ezinputs' numbers. */
export const EZINPUTS_LAYOUT: Layout = {
    id: 'ezinputs',
    name: 'ezinputs',
    space: 8,
    corner: M3_CORNERS,
    cardRadius: 16,
    type: {
        displayMedium: { fontSize: 32, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em' },
        displaySmall: { fontSize: 24, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.02em' },
        headlineSmall: { fontSize: 20, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.015em' },
        titleLarge: { fontSize: 16, lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.01em' },
        titleMedium: { fontSize: 15, lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.01em' },
        titleSmall: { fontSize: 14, lineHeight: 1.3, fontWeight: 700 },
        bodyMedium: { fontSize: 13, lineHeight: 1.5, fontWeight: 500 },
        bodySmall: { fontSize: 12, lineHeight: 1.5, fontWeight: 500 },
        labelLarge: { fontSize: 13, lineHeight: 1.4, fontWeight: 600 },
        labelMedium: { fontSize: 12, lineHeight: 1.35, fontWeight: 600 },
        labelSmall: { fontSize: 11, lineHeight: 1.35, fontWeight: 600 },
        overline: { fontSize: 11, lineHeight: 1.3, fontWeight: 600, letterSpacing: '0.08em' },
    },
    minFontSize: 11,
    density: {
        default: { rowPadY: 12, titleSize: 16, titleLineHeight: 1.2, rowGap: 8, metaLineHeight: 18, chipHeight: 24, chipPadX: 10, chipIcon: 13 },
        comfortable: { rowPadY: 8.4, titleSize: 15.2, titleLineHeight: 1.2, rowGap: 6, metaLineHeight: 18, chipHeight: 24, chipPadX: 10, chipIcon: 13 },
        compact: { rowPadY: 6, titleSize: 14.4, titleLineHeight: 1.2, rowGap: 4, metaLineHeight: 18, chipHeight: 20, chipPadX: 8, chipIcon: 12 },
    },
    rail: { width: 80, column: 96, columnOpen: 250, indicatorWidth: 56, indicatorHeight: 32, labelSize: 11 },
    bar: { height: 64 },
    page: { inset: [64, 12, 12, 96], padY: 33, padX: 32 },
};

/**
 * Photo Studio's shell and type sizes (Chess Coach shares the shell, with 30/36
 * page padding). The rail's 56x32 indicator is its 22px icon with 17px and 5px
 * of padding; the rail is the 104px column less its 12px inset.
 */
export const STUDIO_LAYOUT: Layout = {
    id: 'studio',
    name: 'Studio',
    space: 8,
    corner: M3_CORNERS,
    cardRadius: 16,
    type: {
        displayMedium: { fontSize: 48 },
        headlineLarge: { fontSize: 34 },
        headlineMedium: { fontSize: 28 },
        headlineSmall: { fontSize: 24 },
        titleLarge: { fontSize: 22 },
        titleMedium: { fontSize: 19 },
        bodyLarge: { fontSize: 15 },
        bodyMedium: { fontSize: 14 },
        bodySmall: { fontSize: 13 },
        labelMedium: { fontSize: 12 },
        labelSmall: { fontSize: 11 },
    },
    minFontSize: 11,
    density: EZINPUTS_LAYOUT.density,
    rail: { width: 92, column: 104, columnOpen: 104, indicatorWidth: 56, indicatorHeight: 32, labelSize: 13 },
    bar: { height: 72 },
    page: { inset: [72, 18, 18, 104], padY: 34, padX: 40 },
};

export const LAYOUTS: Layout[] = [EZINPUTS_LAYOUT, STUDIO_LAYOUT];

export function getLayout(id: string): Layout | undefined {
    return LAYOUTS.find((l) => l.id === id);
}

/** A layout with some numbers changed (one level deep: `{ page: { padY: 30 } }` keeps the rest of `page`). */
export function withLayout(base: Layout, changes: { [K in keyof Layout]?: Layout[K] extends object ? Partial<Layout[K]> : Layout[K] }): Layout {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(changes)) {
        const cur = (base as unknown as Record<string, unknown>)[k];
        out[k] = v && typeof v === 'object' && !Array.isArray(v) && cur && typeof cur === 'object' && !Array.isArray(cur) ? { ...cur, ...v } : v;
    }
    return out as unknown as Layout;
}

/** What a two-line list row comes out to, px, with its 1px top and bottom borders. */
export function rowHeight(layout: Layout, density: Density = 'default'): number {
    const d = layout.density[density];
    return round(2 + d.rowPadY * 2 + d.titleSize * d.titleLineHeight + d.rowGap + d.metaLineHeight);
}

/** The title's line box, px: what the first line of a list row measures. */
export function rowTitleLine(layout: Layout, density: Density = 'default'): number {
    const d = layout.density[density];
    return round(d.titleSize * d.titleLineHeight);
}

/** Theme corners that differ from the layout's: Retro Game is square everywhere. */
const THEME_CARD_RADIUS: Record<string, number> = { 'retro-game': 2 };

export interface LayoutTokenOptions {
    /** Which vocabulary to write: ezinputs (`--ez-*`), Material 3 (`--md-sys-*`) where M3 has a name, or both. */
    names?: 'ez' | 'md' | 'both';
    density?: Density;
    /** Multiplies every corner except `full` (ezinputs' roundness preference). */
    radiusScale?: number;
    /**
     * The theme in use. Its own corner wins over the layout's: an app theme's
     * radius becomes the `small` corner (as themeTokens writes it), and a theme
     * that squares its cards squares the card radius.
     */
    theme?: Theme;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const round = (n: number) => Math.round(n * 1000) / 1000;
const px = (n: number) => `${round(n)}px`;

/**
 * A layout as custom properties.
 *
 * Corners and type have Material 3 names (`--md-sys-shape-corner-large`,
 * `--md-sys-typescale-title-large`, which is the size, as the Studio theme
 * writes it, plus `-line-height`, `-weight` and `-tracking`). Everything M3
 * has no system token for (spacing, rows, chips, the rail, bar and page) is
 * written as `--ez-*` whichever names you pick.
 */
export function layoutTokens(layout: Layout, options: LayoutTokenOptions = {}): Tokens {
    const { names = 'both', density = 'default', radiusScale = 1, theme } = options;
    const ez = names !== 'md';
    const md = names !== 'ez';
    const scale = Number.isFinite(radiusScale) && radiusScale >= 0 ? radiusScale : 1;
    const out: Tokens = {};

    for (const n of [0.5, 1, 1.5, 2, 3, 4, 5, 6]) out[`--ez-space-${String(n).replace('.', '_')}`] = px(layout.space * n);

    const corner = { ...layout.corner };
    if (theme?.group === 'app') corner.small = theme.radius;
    for (const [name, v] of Object.entries(corner) as [Corner, number][]) {
        const value = name === 'full' ? px(v) : px(v * scale);
        if (ez) out[`--ez-corner-${name}`] = value;
        if (md) out[`--md-sys-shape-corner-${name}`] = value;
    }
    const card = theme && THEME_CARD_RADIUS[theme.id] !== undefined ? THEME_CARD_RADIUS[theme.id] : layout.cardRadius;
    out['--ez-card-radius'] = px(card * scale);

    for (const [role, t] of Object.entries(layout.type)) {
        const r = kebab(role);
        const set = (prefix: string) => {
            out[`${prefix}-${r}`] = px(t.fontSize);
            if (t.lineHeight !== undefined) out[`${prefix}-${r}-line-height`] = String(t.lineHeight);
            if (t.fontWeight !== undefined) out[`${prefix}-${r}-weight`] = String(t.fontWeight);
            if (t.letterSpacing) out[`${prefix}-${r}-tracking`] = t.letterSpacing;
        };
        if (ez) set('--ez-type');
        if (md) set('--md-sys-typescale');
    }
    out['--ez-min-font-size'] = px(layout.minFontSize);

    const d = layout.density[density];
    Object.assign(out, {
        '--ez-row-pad-y': px(d.rowPadY),
        '--ez-row-title-size': px(d.titleSize),
        '--ez-row-title-line-height': String(d.titleLineHeight),
        '--ez-row-gap': px(d.rowGap),
        '--ez-row-meta-line-height': px(d.metaLineHeight),
        '--ez-row-height': px(rowHeight(layout, density)),
        '--ez-chip-height': px(d.chipHeight),
        '--ez-chip-pad-x': px(d.chipPadX),
        '--ez-chip-icon': px(d.chipIcon),
        '--ez-rail-width': px(layout.rail.width),
        '--ez-rail-column': px(layout.rail.column),
        '--ez-rail-column-open': px(layout.rail.columnOpen),
        '--ez-rail-indicator-width': px(layout.rail.indicatorWidth),
        '--ez-rail-indicator-height': px(layout.rail.indicatorHeight),
        '--ez-rail-label-size': px(layout.rail.labelSize),
        '--ez-bar-height': px(layout.bar.height),
        '--ez-page-inset': layout.page.inset.map(px).join(' '),
        '--ez-page-pad-y': px(layout.page.padY),
        '--ez-page-pad-x': px(layout.page.padX),
    });
    return out;
}

/** A layout as a CSS rule. */
export function layoutCSS(layout: Layout, options: LayoutTokenOptions & { selector?: string } = {}): string {
    const { selector = ':root', ...rest } = options;
    const tokens = layoutTokens(layout, rest);
    return `${selector} {\n${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
}

// ---------------------------------------------------------------------------
// Layout modes: which surface the nav and the page draw on.

/** ezinputs' layouts. The last six belong to one theme each. */
export const LAYOUT_MODES = ['studio', 'cards', 'flat', 'open', 'desktop', 'arcade', 'terminal', 'cabinet', 'drafting', 'board'] as const;
export type LayoutMode = (typeof LAYOUT_MODES)[number];
export const DEFAULT_LAYOUT_MODE: LayoutMode = 'studio';

export const LAYOUT_MODE_NAMES: Record<LayoutMode, string> = {
    studio: 'Studio', cards: 'Cards', flat: 'Flat', open: 'Open',
    desktop: 'Desktop', arcade: 'Arcade', terminal: 'Terminal', cabinet: 'Cabinet', drafting: 'Drafting', board: 'Board',
};

/**
 * Layouts that draw a place their theme imitates: a 1995 desktop, a console's
 * pause menu, a command line, a drawer of folders, a drawing sheet, a bulletin
 * board. Each is offered only under its theme. (ezinputs keys Arcade to its
 * old `retro-nintendo` id; both resolve.)
 */
export const THEME_LAYOUTS: Partial<Record<LayoutMode, string>> = {
    desktop: 'retro-tech-90s',
    arcade: 'retro-game',
    terminal: 'cyberpunk-rain',
    cabinet: 'file-cabinet',
    drafting: 'blueprint',
    board: 'corkboard',
};

const OLD_THEME_IDS: Record<string, string> = { 'retro-nintendo': 'retro-game' };
const themeId = (t: string | null | undefined) => (t ? OLD_THEME_IDS[t] ?? t : t);

export function isLayoutMode(value: unknown): value is LayoutMode {
    return (LAYOUT_MODES as readonly unknown[]).includes(value);
}

/** The layout a theme brings with it, or null for themes that use the everyday ones. */
export function layoutForTheme(theme: string | null | undefined): LayoutMode | null {
    const id = themeId(theme);
    const entry = (Object.entries(THEME_LAYOUTS) as [LayoutMode, string][]).find(([, owner]) => owner === id);
    return entry ? entry[0] : null;
}

export function isThemeLayout(mode: string | null | undefined): boolean {
    return Boolean(mode && THEME_LAYOUTS[mode as LayoutMode]);
}

/** The saved layout, unless it belongs to another theme: then the default (the choice can stay saved). */
export function effectiveLayoutMode(mode: LayoutMode, theme: string | null | undefined): LayoutMode {
    const owner = THEME_LAYOUTS[mode];
    return owner && owner !== themeId(theme) ? DEFAULT_LAYOUT_MODE : mode;
}

/** Which surface the nav and the page draw on. Theme layouts draw on Flat's; their chrome is the app's. */
export function layoutSurfaces(mode: LayoutMode): { nav: string; main: string } {
    if (mode === 'cards') return { nav: 'island', main: 'island' };
    if (THEME_LAYOUTS[mode]) return { nav: 'flat', main: 'flat' };
    if (mode === 'open') return { nav: 'island', main: 'immersive' };
    return { nav: mode, main: mode };
}

/** The layouts to offer: Open only over a photo, a theme's own layout only under that theme. */
export function layoutModesOffered(current: string | undefined, hasPhoto: boolean, theme?: string | null): LayoutMode[] {
    const id = themeId(theme);
    return LAYOUT_MODES.filter((mode) => {
        if (mode === 'open') return hasPhoto || current === 'open';
        const owner = THEME_LAYOUTS[mode];
        if (owner) return id === owner;
        return true;
    });
}
