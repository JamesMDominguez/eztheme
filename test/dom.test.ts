// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { applyTheme, clearTheme } from '../src/dom';

const root = () => document.documentElement;
afterEach(() => { clearTheme(); root().removeAttribute('data-theme'); });

describe('applyTheme', () => {
    it('writes the tokens and marks the root', () => {
        applyTheme('corkboard');
        expect(root().style.getPropertyValue('--ez-accent')).toBe('#b3261e');
        expect(root().getAttribute('data-eztheme')).toBe('corkboard');
    });
    it('switching removes the previous theme’s properties', () => {
        applyTheme('corkboard', { names: 'both' });
        applyTheme('form:sky', { names: 'ez' });
        expect(root().style.getPropertyValue('--md-sys-color-primary')).toBe('');
        expect(root().getAttribute('data-eztheme')).toBe('form:sky');
    });
    it('Studio follows data-theme for light and dark', () => {
        root().setAttribute('data-theme', 'dark');
        applyTheme('studio');
        expect(root().style.getPropertyValue('--md-sys-color-primary')).toBe('var(--md-ref-palette-primary80)');
        expect(root().style.colorScheme).toBe('dark');
    });
    it('clearTheme takes it all off', () => {
        applyTheme('dark');
        clearTheme();
        expect(root().style.getPropertyValue('--ez-accent')).toBe('');
        expect(root().hasAttribute('data-eztheme')).toBe(false);
    });
});
