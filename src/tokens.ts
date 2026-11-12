/**
 * Themes as CSS custom properties, in two vocabularies:
 *
 *  - `ez`: ezinputs' semantic tokens (`--ez-accent`, `--ez-surface-high`,
 *    `--ez-danger-ink` …), about 30 of them;
 *  - `md`: Material 3 system tokens (`--md-sys-color-primary`,
 *    `--md-sys-color-surface-container` …), what Photo Studio and Chess Coach read.
 *
 * Any theme can be written in either, so an app keeps its own names and still
 * takes every theme.
 */

import { surfaces, statusColors, type Palette } from './derive.js';
import type { AppTheme, FormTheme, StudioTheme, Theme, TokenPairs } from './types.js';

export type Tokens = Record<string, string>;

const softenHex = (hex: string, alphaHex = '1f') => (/^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alphaHex}` : hex);

/** The `--ez-*` tokens for a palette (exactly what ezinputs' buildThemeTokens returns). */
export function ezTokensFromPalette(p: Palette, accents?: AppTheme['accents']): Tokens {
    const s = surfaces(p);
    const st = statusColors(p, accents);
    return {
        '--ez-accent': p.primary.main,
        '--ez-accent-soft': softenHex(p.primary.main),
        '--ez-on-accent': p.primary.contrastText || '#ffffff',
        '--ez-danger': p.error.main,
        '--ez-warning': p.warning.main,
        '--ez-success': p.success.main,
        '--ez-surface': p.background.paper,
        '--ez-surface-muted': p.background.default,
        '--ez-border': p.divider,
        '--ez-text': p.text.primary,
        '--ez-text-muted': p.text.secondary,
        '--ez-surface-low': s.containerLow,
        '--ez-surface-container': s.container,
        '--ez-surface-high': s.containerHigh,
        '--ez-fill': s.fill,
        '--ez-fill-hover': s.fillHover,
        '--ez-outline': s.outline,
        '--ez-outline-variant': s.outlineVariant,
        '--ez-danger-ink': st.danger.fg,
        '--ez-warning-ink': st.warning.fg,
        '--ez-success-ink': st.success.fg,
        '--ez-info-ink': st.info.fg,
        '--ez-danger-soft': st.danger.bg,
        '--ez-warning-soft': st.warning.bg,
        '--ez-success-soft': st.success.bg,
        '--ez-info-soft': st.info.bg,
    };
}

/** Material 3 colour roles for a palette, from the same derivations. */
export function mdTokensFromPalette(p: Palette, accents?: AppTheme['accents']): Tokens {
    const s = surfaces(p);
    const st = statusColors(p, accents);
    const r = (name: string) => `--md-sys-color-${name}`;
    return {
        [r('primary')]: p.primary.main,
        [r('on-primary')]: p.primary.contrastText,
        [r('primary-container')]: softenHex(p.primary.main, '2e'),
        [r('on-primary-container')]: p.primary.ink || p.primary.main,
        [r('secondary-container')]: softenHex(p.primary.main),
        [r('on-secondary-container')]: p.primary.ink || p.primary.main,
        [r('surface')]: p.background.default,
        [r('surface-container-lowest')]: p.background.paper,
        [r('surface-container-low')]: s.containerLow,
        [r('surface-container')]: s.container,
        [r('surface-container-high')]: s.containerHigh,
        [r('surface-container-highest')]: s.fill,
        [r('on-surface')]: p.text.primary,
        [r('on-surface-variant')]: p.text.secondary,
        [r('outline')]: s.outline,
        [r('outline-variant')]: s.outlineVariant,
        [r('inverse-surface')]: p.text.primary,
        [r('inverse-on-surface')]: p.background.paper,
        [r('error')]: p.error.main,
        [r('on-error')]: p.error.contrastText || '#ffffff',
        [r('error-container')]: st.danger.bg,
        [r('on-error-container')]: st.danger.fg,
        [r('success')]: p.success.main,
        [r('success-container')]: st.success.bg,
        [r('on-success-container')]: st.success.fg,
        [r('warning')]: p.warning.main,
        [r('warning-container')]: st.warning.bg,
        [r('on-warning-container')]: st.warning.fg,
        [r('info')]: p.info.main,
        [r('info-container')]: st.info.bg,
        [r('on-info-container')]: st.info.fg,
    };
}

/** A form theme as a palette, so it can be written in either vocabulary. */
export function formPalette(t: FormTheme): Palette {
    const k = t.tokens as Record<string, string>;
    const dark = t.mode === 'dark';
    const page = k.pageBg || (dark ? '#121212' : '#ffffff');
    const paper = k.surface || page;
    return {
        mode: dark ? 'dark' : 'light',
        primary: { main: k.accent, contrastText: k.accentText || '#ffffff', ink: k.accent },
        error: { main: k.danger || (dark ? '#f87171' : '#b42318') },
        warning: { main: dark ? '#fbbf24' : '#d97706' },
        success: { main: dark ? '#4ade80' : '#247a46' },
        info: { main: dark ? '#60a5fa' : '#2563eb' },
        background: { default: page, paper },
        text: { primary: k.textSecondary || k.text, secondary: k.mutedOnSurface || k.muted },
        divider: k.border,
    };
}

const studioVarMap: Array<[string, string]> = [
    ['--ez-accent', 'primary'], ['--ez-accent-soft', 'secondary-container'], ['--ez-on-accent', 'on-primary'],
    ['--ez-danger', 'error'], ['--ez-warning', 'star'], ['--ez-success', 'success'],
    ['--ez-surface', 'surface-container-lowest'], ['--ez-surface-muted', 'surface'], ['--ez-border', 'outline-variant'],
    ['--ez-text', 'on-surface'], ['--ez-text-muted', 'on-surface-variant'],
    ['--ez-surface-low', 'surface-container-low'], ['--ez-surface-container', 'surface-container'], ['--ez-surface-high', 'surface-container-high'],
    ['--ez-fill', 'surface-container-highest'], ['--ez-fill-hover', 'outline-variant'],
    ['--ez-outline', 'outline'], ['--ez-outline-variant', 'outline-variant'],
    ['--ez-danger-ink', 'on-error-container'], ['--ez-success-ink', 'on-success-container'], ['--ez-info-ink', 'info'], ['--ez-warning-ink', 'on-primary-container'],
    ['--ez-danger-soft', 'error-container'], ['--ez-success-soft', 'success-container'], ['--ez-info-soft', 'info-container'], ['--ez-warning-soft', 'primary-container'],
];

/** The `--ez-*` names for the Studio theme, pointing at its Material roles so they follow light and dark. */
export const studioEzTokens = (): Tokens => Object.fromEntries(studioVarMap.map(([ez, md]) => [ez, `var(--md-sys-color-${md})`]));

export type Names = 'ez' | 'md' | 'both';

/** One theme's tokens in a vocabulary. Studio returns its light set; use `studioTokens` for both schemes. */
export function themeTokens(theme: AppTheme | FormTheme, names: Names = 'both'): Tokens {
    const p = theme.group === 'app' ? theme.palette : formPalette(theme);
    const accents = theme.group === 'app' ? theme.accents : undefined;
    const out: Tokens = {};
    if (names !== 'md') Object.assign(out, ezTokensFromPalette(p, accents));
    if (names !== 'ez') Object.assign(out, mdTokensFromPalette(p, accents));
    if (theme.group === 'app') {
        out['--ez-font-body'] = out['--md-ref-typeface-plain'] = theme.font.body;
        out['--ez-font-heading'] = out['--md-ref-typeface-brand'] = theme.font.heading;
        out['--ez-radius'] = `${theme.radius}px`;
        if (names === 'ez') { delete out['--md-ref-typeface-plain']; delete out['--md-ref-typeface-brand']; }
        if (names === 'md') { delete out['--ez-font-body']; delete out['--ez-font-heading']; }
    } else if (typeof theme.tokens.fontFamily === 'string') {
        out[names === 'md' ? '--md-ref-typeface-plain' : '--ez-font-body'] = theme.tokens.fontFamily;
        if (names === 'both') out['--md-ref-typeface-plain'] = theme.tokens.fontFamily;
    }
    return out;
}

const block = (selector: string, pairs: TokenPairs | Tokens, extra: string[] = [], indent = '') => {
    const list = Array.isArray(pairs) ? pairs : Object.entries(pairs);
    return `${indent}${selector} {\n${[...list.map(([k, v]) => `${indent}  ${k}: ${v};`), ...extra.map((e) => `${indent}  ${e}`)].join('\n')}\n${indent}}`;
};

export interface CSSOptions {
    /** Which names to write. Default 'both'. */
    names?: Names;
    /** The selector the theme applies to. Default `:root`. */
    selector?: string;
}

export interface StudioCSSOptions extends CSSOptions {
    /**
     * How dark is chosen. 'auto' (default): dark when the OS is dark unless the
     * root says `data-theme="light"`, and always when it says `data-theme="dark"`
     * (Photo Studio's Appearance setting). 'attribute': only by `data-theme="dark"`.
     */
    dark?: 'auto' | 'attribute';
    /** Attribute that picks light or dark. Default `data-theme`. */
    schemeAttribute?: string;
}

function studioCSS(t: StudioTheme, { names = 'both', selector = ':root', dark = 'auto', schemeAttribute = 'data-theme' }: StudioCSSOptions): string {
    // The Material roles are always written: the ez names point at them.
    const ez = names !== 'md' ? Object.entries(studioEzTokens()) as TokenPairs : [];
    const parts = [block(selector, [...t.ref, ...t.base]), block(selector, [...t.light, ...ez])];
    if (dark === 'auto') parts.push(`@media (prefers-color-scheme: dark) {\n${block(`${selector}:not([${schemeAttribute}="light"])`, t.dark, [], '  ')}\n}`);
    parts.push(block(`${selector}[${schemeAttribute}="dark"]`, t.dark));
    return parts.join('\n') + '\n';
}

/** A theme as a stylesheet. */
export function toCSS(theme: Theme, options: StudioCSSOptions = {}): string {
    if (theme.group === 'studio') return studioCSS(theme, options);
    const { names = 'both', selector = ':root' } = options;
    return block(selector, themeTokens(theme, names), [`color-scheme: ${theme.mode === 'dark' ? 'dark' : 'light'};`]);
}

/** The Studio theme's tokens as name → value maps, for light and for dark (references kept as `var(…)`). */
export function studioTokens(t: StudioTheme): { light: Tokens; dark: Tokens } {
    const shared = Object.fromEntries([...t.ref, ...t.base]);
    return {
        light: { ...shared, ...Object.fromEntries(t.light) },
        dark: { ...shared, ...Object.fromEntries(t.dark) },
    };
}
