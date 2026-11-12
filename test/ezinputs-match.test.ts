// The library must give exactly what the apps it came from give, so they can
// switch to it with nothing changing on screen.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APP_THEMES, STUDIO, ezTokensFromPalette, getFormTheme, getTheme, studioTokens, toCSS } from '../src/index';

const key = JSON.parse(readFileSync(new URL('./fixtures/ezinputs.json', import.meta.url), 'utf8'));
const oldId = (id: string) => (id === 'retro-game' ? 'retro-nintendo' : id);

describe('ezinputs: app themes', () => {
    it('has all 15', () => expect(APP_THEMES.map((t) => oldId(t.id)).sort()).toEqual(Object.keys(key.ez).sort()));
    it.each(APP_THEMES.map((t) => [t.id, t] as const))('%s: --ez-* tokens match exactly', (id, t) => {
        expect(ezTokensFromPalette(t.palette, t.accents)).toEqual(key.ez[oldId(id)]);
    });
    it('the old retro-nintendo id still resolves', () => expect(getTheme('retro-nintendo')?.id).toBe('retro-game'));
});

describe('ezinputs: form themes', () => {
    it.each(Object.keys(key.form))('%s: tokens match exactly', (id) => {
        expect(getFormTheme(id).tokens).toEqual(key.form[id]);
    });
});

// Parse a stylesheet's custom properties per scheme, the way a browser resolves them on :root.
function declared(css: string) {
    const body = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), decls: m[2] }));
    const props = (d: string) => Object.fromEntries(d.split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf(':'); return [s.slice(0, i).trim(), s.slice(i + 1).trim()]; }));
    const light: Record<string, string> = {}, dark: Record<string, string> = {}, auto: Record<string, string> = {};
    for (const b of blocks) {
        const p = props(b.decls);
        if (b.sel === ':root') { Object.assign(light, p); Object.assign(dark, p); Object.assign(auto, p); }
        else if (b.sel === ':root[data-theme="dark"]') Object.assign(dark, p);
        else if (b.sel === ':root:not([data-theme="light"])') Object.assign(auto, p);
    }
    return { light, dark, auto };
}

describe('Photo Studio: the Studio theme', () => {
    const original = declared(readFileSync(new URL('./fixtures/photo-studio-tokens.css', import.meta.url), 'utf8'));
    const ours = declared(toCSS(STUDIO, { names: 'md' }));
    it('declares every token Photo Studio does, with the same value, in light', () => expect(ours.light).toEqual(original.light));
    it('…in dark by setting (data-theme="dark")', () => expect(ours.dark).toEqual(original.dark));
    it('…and in dark by the Mac’s setting', () => expect(ours.auto).toEqual(original.auto));
    it('studioTokens agrees with the CSS', () => {
        const t = studioTokens(STUDIO);
        expect(t.light).toEqual(original.light);
        expect(t.dark).toEqual(original.dark);
    });
});
