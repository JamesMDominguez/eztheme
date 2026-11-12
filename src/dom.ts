/**
 * Apply a theme to a page, no framework. Writes the theme's custom properties
 * on an element (the root by default) and marks it with `data-eztheme`.
 * For the Studio theme, light and dark come from `data-theme` and the OS
 * setting, as in Photo Studio.
 */

import { getTheme } from './index.js';
import { studioEzTokens, studioTokens, themeTokens, type Names, type Tokens } from './tokens.js';
import type { Theme } from './types.js';

export interface ApplyOptions {
    /** Element to theme. Default `document.documentElement`. */
    target?: HTMLElement;
    /** Which names to write. Default 'both'. */
    names?: Names;
    /** For Studio: 'light', 'dark', or 'auto' (follow `data-theme`, else the OS). Default 'auto'. */
    scheme?: 'light' | 'dark' | 'auto';
}

const written = new WeakMap<HTMLElement, string[]>();
const media = () => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null);

function studioScheme(target: HTMLElement, scheme: ApplyOptions['scheme']): 'light' | 'dark' {
    if (scheme === 'light' || scheme === 'dark') return scheme;
    const attr = target.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return media()?.matches ? 'dark' : 'light';
}

/**
 * Apply `theme` (or a theme id) to the page. Returns the tokens written.
 * Applying another theme first removes the previous one's properties.
 */
export function applyTheme(theme: Theme | string, { target, names = 'both', scheme = 'auto' }: ApplyOptions = {}): Tokens {
    const el = target ?? document.documentElement;
    const t = typeof theme === 'string' ? getTheme(theme) : theme;
    if (!t) throw new Error(`eztheme: no theme "${String(theme)}"`);
    for (const k of written.get(el) || []) el.style.removeProperty(k);
    let tokens: Tokens;
    if (t.group === 'studio') {
        const sets = studioTokens(t);
        const s = studioScheme(el, scheme);
        tokens = { ...sets[s], ...(names !== 'md' ? studioEzTokens() : {}) };
        delete tokens['color-scheme'];
        el.style.colorScheme = s;
    } else {
        tokens = themeTokens(t, names);
        el.style.colorScheme = t.mode === 'dark' ? 'dark' : 'light';
    }
    for (const [k, v] of Object.entries(tokens)) el.style.setProperty(k, v);
    written.set(el, Object.keys(tokens));
    el.setAttribute('data-eztheme', t.group === 'form' ? `form:${t.id}` : t.id);
    return tokens;
}

/**
 * Keep the Studio theme in step with the OS's light/dark setting (when the
 * page hasn't chosen one with `data-theme`). Returns a function that stops it.
 */
export function followScheme(theme: Theme | string = 'studio', options: ApplyOptions = {}): () => void {
    const m = media();
    const apply = () => applyTheme(theme, options);
    apply();
    if (!m) return () => {};
    m.addEventListener('change', apply);
    return () => m.removeEventListener('change', apply);
}

/** Remove a theme applied with applyTheme. */
export function clearTheme(target: HTMLElement = document.documentElement): void {
    for (const k of written.get(target) || []) target.style.removeProperty(k);
    written.delete(target);
    target.style.colorScheme = '';
    target.removeAttribute('data-eztheme');
}
