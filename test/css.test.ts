import { describe, expect, it } from 'vitest';
import { APP_THEMES, FORM_THEMES, STUDIO, getAppTheme, getTheme, themeOptions, themeTokens, toCSS, contrastRatio, mix, flatten, alpha, lighten, darken, toHex } from '../src/index';

describe('colour helpers', () => {
    it('contrast: black on white is 21, a colour on itself is 1', () => {
        expect(contrastRatio('#000', '#fff')).toBe(21);
        expect(contrastRatio('#7c5cd6', '#7c5cd6')).toBe(1);
    });
    it('mix, flatten, alpha, lighten, darken', () => {
        expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
        expect(flatten('rgba(255, 0, 0, 0.5)', '#ffffff')).toBe('rgb(255, 128, 128)');
        expect(alpha('#336699', 0.2)).toBe('rgba(51, 102, 153, 0.2)');
        expect(toHex(lighten('#000000', 0.5))).toBe('#7f7f7f');
        expect(toHex(darken('#ffffff', 0.5))).toBe('#7f7f7f');
    });
});

describe('tokens in either vocabulary', () => {
    it.each(APP_THEMES.map((t) => [t.id, t] as const))('%s: ez and md names, fonts and radius', (_, t) => {
        const both = themeTokens(t, 'both');
        expect(both['--ez-accent']).toBe(t.palette.primary.main);
        expect(both['--md-sys-color-primary']).toBe(t.palette.primary.main);
        expect(both['--md-sys-color-surface-container']).toBe(both['--ez-surface-container']);
        expect(both['--ez-font-heading']).toBe(t.font.heading);
        expect(both['--ez-radius']).toBe(`${t.radius}px`);
        expect(both['--md-sys-shape-corner-small']).toBe(`${t.radius}px`);
        expect(Object.keys(themeTokens(t, 'ez')).some((k) => k.startsWith('--md-'))).toBe(false);
        expect(Object.keys(themeTokens(t, 'md')).some((k) => k.startsWith('--ez-'))).toBe(false);
    });
    it('no font stack leans on an undefined next/font variable', () => {
        for (const t of APP_THEMES) expect(t.font.body + t.font.heading).not.toMatch(/var\(--font-/);
    });
    it.each(FORM_THEMES.map((t) => [t.id, t] as const))('form %s: a stylesheet with its accent and page', (_, t) => {
        const css = toCSS(t);
        expect(css).toContain(`--ez-accent: ${t.tokens.accent};`);
        expect(css).toMatch(/color-scheme: (light|dark);/);
    });
});

describe('Studio', () => {
    it('ez names point at its Material roles, so they follow light and dark', () => {
        const css = toCSS(STUDIO);
        expect(css).toContain('--ez-accent: var(--md-sys-color-primary);');
        expect(css).toContain('@media (prefers-color-scheme: dark)');
        expect(css).toContain(':root[data-theme="dark"] {');
    });
    it('a different selector and scheme attribute', () => {
        const css = toCSS(STUDIO, { selector: '.studio', schemeAttribute: 'data-scheme', dark: 'attribute' });
        expect(css).toContain('.studio[data-scheme="dark"] {');
        expect(css).not.toContain('@media');
    });
});

describe('lookup', () => {
    it('by id, alias and group', () => {
        expect(getTheme('corkboard')?.group).toBe('app');
        expect(getTheme('form:sky')?.group).toBe('form');
        expect(getTheme('studio')?.group).toBe('studio');
        expect(getAppTheme('retro-nintendo').id).toBe('retro-game');
        expect(getAppTheme('nope').id).toBe('light');
    });
    it('picker options for every theme', () => {
        expect(themeOptions('app')).toHaveLength(15);
        expect(themeOptions('form')).toHaveLength(28);
        expect(themeOptions()).toHaveLength(44);
    });
});
