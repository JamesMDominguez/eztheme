/**
 * Form themes: lookup, the inks a form reads, and the contrast contract every
 * form theme has to meet (which token is read on which surface, and how well).
 * Ported from ezinputs' form-core (themeRegistry, formThemeContract).
 */

import { DEFAULT_FORM_THEME, FORM_THEMES } from './themes/form.js';
import type { FormTheme } from './types.js';

type Bag = FormTheme['tokens'];
const byId = new Map(FORM_THEMES.map((t) => [t.id, t]));

export { FORM_THEMES, DEFAULT_FORM_THEME };
export const FORM_THEME_ORDER = FORM_THEMES.map((t) => t.id);

/** A form theme by id; unknown ids fall back to Plain Dark (dark) or Default. */
export function getFormTheme(id: string | null | undefined, fallbackMode: 'light' | 'dark' | string = 'light'): FormTheme {
    if (id && byId.has(id)) return byId.get(id)!;
    return byId.get(fallbackMode === 'dark' ? 'plain-dark' : DEFAULT_FORM_THEME)!;
}

/** A form theme by id, or null. */
export const findFormTheme = (id: string | null | undefined): FormTheme | null => (id && byId.get(id)) || null;

export const SYSTEM_FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** The font stack a form theme asks for, behind an app-wide `--ui-font-family` override. */
export function resolveFormFontStack(tokens: Bag | null | undefined): string {
    const family = typeof tokens?.fontFamily === 'string' ? tokens.fontFamily.trim() : '';
    if (!family) return `var(--ui-font-family, ${SYSTEM_FONT_STACK})`;
    const css = family.startsWith('var(') ? family : `"${family}"`;
    return tokens?.fontFamilyCurated
        ? `var(--ui-font-family, ${css}, ${SYSTEM_FONT_STACK})`
        : `${css}, var(--ui-font-family, ${SYSTEM_FONT_STACK})`;
}

/** The ink for text inside a surface (a card, a tile): a vibrant theme's page ink would vanish there. */
export const inkOnSurface = (tokens: Bag | null | undefined): string => {
    const t = (tokens || {}) as Record<string, string>;
    return t.textSecondary || t.text || '#0f172a';
};
export const mutedInkOnSurface = (tokens: Bag | null | undefined): string => {
    const t = (tokens || {}) as Record<string, string>;
    return t.mutedOnSurface || t.textSecondary || t.textMuted || t.muted || '#475569';
};

/** The page a theme paints as one CSS `background` value: its overlay (if any) over its colour or gradient. */
export function composeThemePageBackground(tokens: Bag | null | undefined, overlay?: string | null): string | undefined {
    const t = (tokens || {}) as Record<string, string>;
    const base = t.pageBackground || t.pageBg || undefined;
    const image = overlay || t.pageBackgroundImage || undefined;
    if (!image) return base;
    return `${image} ${t.pageBackgroundRepeat || 'no-repeat'} ${t.pageBackgroundPosition || 'center'} / ${t.pageBackgroundSize || 'cover'}${base ? `, ${base}` : ''}`;
}

// ── The contract ────────────────────────────────────────────────────────────

const parse = (value: unknown): number[] | null => {
    if (!value || typeof value !== 'string') return null;
    const s = value.trim();
    let m = s.match(/^#([0-9a-f]{3})$/i);
    if (m) return [...Array.from(m[1]).map((h) => parseInt(h + h, 16)), 1];
    m = s.match(/^#([0-9a-f]{8})$/i);
    if (m) return [0, 2, 4].map((i) => parseInt(m![1].slice(i, i + 2), 16)).concat(parseInt(m[1].slice(6, 8), 16) / 255);
    m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map((i) => parseInt(m![1].slice(i, i + 2), 16)).concat(1);
    m = s.match(/^rgba?\(([^)]+)\)/i);
    if (m) { const p = m[1].split(',').map((v) => parseFloat(v)); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    return null;
};
const over = (top: number[], base: number[]) => { const a = top[3] ?? 1; return a >= 1 ? top.slice(0, 3) : [0, 1, 2].map((i) => top[i] * a + base[i] * (1 - a)); };
const lum = ([r, g, b]: number[]) => { const f = (v: number) => { const n = v / 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number[], b: number[]) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

/** A colour readable on an accent fill: white if it reaches 2.5:1, otherwise near-black. */
export function readableTextOnAccent(accent: unknown): string {
    const rgb = parse(accent);
    if (!rgb) return '#ffffff';
    return ratio([255, 255, 255], rgb) >= 2.5 ? '#ffffff' : '#101828';
}

export interface TokenPairing {
    ink: string; inkFallbacks?: string[];
    on: string; onFallbacks?: string[];
    min: number;
    role: string;
    /** A shape rather than words: reported, not failed. */
    advisory?: boolean;
}

/** Where each token is read, and the contrast it needs there. */
export const FORM_THEME_PAIRINGS: TokenPairing[] = [
    { ink: 'text', on: 'pageBg', min: 4.5, role: 'Field labels: above the input, on the page.' },
    { ink: 'muted', on: 'pageBg', min: 4.5, role: 'Helper text beside those labels.' },
    { ink: 'textSecondary', inkFallbacks: ['muted'], on: 'surface', min: 4.5, role: 'Text inside a surface card, where a vibrant theme’s contrast inverts.' },
    { ink: 'mutedOnSurface', inkFallbacks: ['textSecondary', 'muted'], on: 'surface', min: 4.5, role: 'The quiet text in that card.' },
    { ink: 'inputText', inkFallbacks: ['text'], on: 'inputBg', min: 4.5, role: 'What a person types.' },
    { ink: 'dangerOnPage', inkFallbacks: ['danger'], on: 'pageBg', min: 4.5, role: 'Validation messages under a field, on the page.' },
    { ink: 'danger', on: 'surface', min: 4.5, role: 'A validation message inside a card.' },
    { ink: 'danger', on: 'inputBg', min: 3, advisory: true, role: 'The error border around an input.' },
    { ink: 'accentText', on: 'accent', min: 2.5, role: 'The label on a filled button.' },
    { ink: 'accent', on: 'pageBg', min: 3, role: 'The accent as a shape: a button, a progress bar, a focus ring.' },
    { ink: 'border', on: 'surface', min: 3, advisory: true, role: 'The hairline around an input or a card.' },
];

export interface PairingResult { pairing: TokenPairing; ink: string | null; on: string | null; ratio: number | null; passes: boolean; missing: boolean }

const pick = (tokens: Record<string, unknown>, name: string, fallbacks: string[] = []): string | null => {
    for (const key of [name, ...fallbacks]) { const v = tokens?.[key]; if (typeof v === 'string' && v.trim()) return v; }
    return null;
};

/** Check a form theme against the contract. Translucent colours are laid over what they sit on first. */
export function auditFormTheme(theme: { tokens?: Record<string, unknown> } | null | undefined): PairingResult[] {
    const tokens = theme?.tokens || {};
    const page = over(parse(pick(tokens, 'pageBg', ['pageBackground'])) || [255, 255, 255, 1], [255, 255, 255]);
    return FORM_THEME_PAIRINGS.map((pairing) => {
        const inkValue = pick(tokens, pairing.ink, pairing.inkFallbacks);
        const onValue = pick(tokens, pairing.on, pairing.onFallbacks);
        const ink = parse(inkValue), on = parse(onValue);
        if (!ink || !on) return { pairing, ink: inkValue, on: onValue, ratio: null, passes: false, missing: true };
        const onSolid = pairing.on === 'pageBg' ? page : over(on, page);
        const r = Number(ratio(over(ink, onSolid), onSolid).toFixed(2));
        return { pairing, ink: inkValue, on: onValue, ratio: r, passes: r >= pairing.min, missing: false };
    });
}
