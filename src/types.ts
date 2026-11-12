import type { AccentRole, Palette } from './derive.js';

/** One of the app looks: a palette (everything else is derived), fonts, a corner radius. */
export interface AppTheme {
    id: string;
    name: string;
    group: 'app';
    mode: 'light' | 'dark';
    palette: Palette;
    /** Plain CSS font stacks (load the fonts yourself). */
    font: { body: string; heading: string };
    /** Base corner radius in px. */
    radius: number;
    /** The theme's own version of each hue family, for hues picked in code (see remapAccent). */
    accents?: Partial<Record<AccentRole, string>>;
    /** Old ids that still resolve to this theme. */
    aliases?: string[];
    /** The next/font CSS variables ezinputs loads these fonts under, if any. */
    nextFont?: { body?: string; heading?: string };
}

/** One of the form looks: the token bag a public form is painted with. */
export interface FormTheme {
    id: string;
    name: string;
    group: 'form';
    category: string;
    mode: string;
    /** pageBg, pageBackground, surface, surfaceAlt, border, text, muted, accent, accentSoft, accentText, inputBg, danger, fontFamily… */
    tokens: Record<string, string | number | boolean | null | undefined>;
}

export type TokenPairs = Array<[string, string]>;

/** A theme written directly as Material 3 tokens, light and dark (Photo Studio's look). */
export interface StudioTheme {
    id: string;
    name: string;
    group: 'studio';
    mode: 'light';
    /** --md-ref-palette-* tones. */
    ref: TokenPairs;
    /** Type sizes, corners, motion, state layers, fonts: the same in light and dark. */
    base: TokenPairs;
    /** Colour roles and short names in light, and in dark. */
    light: TokenPairs;
    dark: TokenPairs;
}

export type Theme = AppTheme | FormTheme | StudioTheme;
