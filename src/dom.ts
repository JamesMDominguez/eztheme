/**
 * Apply a theme to a page, no framework. Writes the theme's custom properties
 * on an element (the root by default) and marks it with `data-eztheme`.
 * For the Studio theme, light and dark come from `data-theme` and the OS
 * setting, as in Photo Studio.
 */

import { getTheme } from './index.js';
import { studioEzTokens, studioTokens, themeTokens, type Names, type Tokens } from './tokens.js';
import type { Theme } from './types.js';
import { getLayout, layoutSurfaces, layoutTokens, type Layout, type LayoutMode, type LayoutTokenOptions } from './layout.js';

export interface ApplyOptions {
    /** Element to theme. Default `document.documentElement`. */
    target?: HTMLElement;
    /** Which names to write. Default 'both'. */
    names?: Names;
    /** For Studio: 'light', 'dark', or 'auto' (follow `data-theme`, else the OS). Default 'auto'. */
    scheme?: 'light' | 'dark' | 'auto';
}

const written = new WeakMap<HTMLElement, string[]>();
const themeOptions = new WeakMap<HTMLElement, Omit<ApplyOptions, 'target'>>();
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
    themeOptions.set(el, { names, scheme });
    el.setAttribute('data-eztheme', t.group === 'form' ? `form:${t.id}` : t.id);
    const l = layouts.get(el);
    if (l) applyLayout(l.layout, { ...l.options, target: el });
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
    themeOptions.delete(target);
    target.style.colorScheme = '';
    target.removeAttribute('data-eztheme');
    const l = layouts.get(target);
    if (l) applyLayout(l.layout, { ...l.options, target });
}

export interface ApplyLayoutOptions extends Omit<LayoutTokenOptions, 'theme'> {
    target?: HTMLElement;
    /** Also mark the element with ezinputs' layout attributes: data-ez-layout, data-ez-nav-surface, data-ez-main-surface. */
    mode?: LayoutMode;
}

const layouts = new WeakMap<HTMLElement, { layout: Layout; options: Omit<ApplyLayoutOptions, 'target'>; keys: string[] }>();

/**
 * Apply a layout's tokens (sizes, corners, type, rows, rail, page) to the page.
 * The element's current theme, if applyTheme set one, keeps its own corners,
 * and changing theme later re-applies the layout so that stays true.
 * Returns the tokens written.
 */
export function applyLayout(layout: Layout | string, { target, mode, ...options }: ApplyLayoutOptions = {}): Tokens {
    const el = target ?? document.documentElement;
    const l = typeof layout === 'string' ? getLayout(layout) : layout;
    if (!l) throw new Error(`eztheme: no layout "${String(layout)}"`);
    for (const k of layouts.get(el)?.keys || []) el.style.removeProperty(k);
    const current = el.getAttribute('data-eztheme');
    const theme = current ? getTheme(current) : undefined;
    const tokens = layoutTokens(l, { ...options, theme });
    for (const [k, v] of Object.entries(tokens)) el.style.setProperty(k, v);
    layouts.set(el, { layout: l, options: { ...options, mode }, keys: Object.keys(tokens) });
    el.setAttribute('data-ezlayout', l.id);
    if (mode) {
        const s = layoutSurfaces(mode);
        el.setAttribute('data-ez-layout', mode);
        el.setAttribute('data-ez-nav-surface', s.nav);
        el.setAttribute('data-ez-main-surface', s.main);
    }
    return tokens;
}

/** Remove a layout applied with applyLayout. */
export function clearLayout(target: HTMLElement = document.documentElement): void {
    const l = layouts.get(target);
    if (!l) return;
    for (const k of l.keys) target.style.removeProperty(k);
    layouts.delete(target);
    for (const a of ['data-ezlayout', 'data-ez-layout', 'data-ez-nav-surface', 'data-ez-main-surface']) target.removeAttribute(a);
    // A theme's own corner may have been under the layout's; put the theme back whole.
    const current = target.getAttribute('data-eztheme');
    if (current) applyTheme(current, { ...themeOptions.get(target), target });
}
