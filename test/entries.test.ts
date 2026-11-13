// The smaller entry points: each loads on its own, from ESM and CommonJS, and
// the ones an app shell reads on every page don't bring the form themes along.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as all from '../src/index';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const require = createRequire(import.meta.url);
const entries: Record<string, string[]> = {
    color: ['parseColor', 'contrastRatio', 'flatten', 'luminance'],
    derive: ['surfaces', 'statusColors', 'classifyAccent', 'remapAccent', 'readableOnTint'],
    forms: ['FORM_THEMES', 'getFormTheme', 'auditFormTheme', 'readableTextOnAccent'],
    layout: ['EZINPUTS_LAYOUT', 'LAYOUT_MODES', 'layoutModesOffered'],
    tokens: ['ezTokensFromPalette', 'toCSS'],
    'app-themes': ['APP_THEMES'],
};

describe('entry points', () => {
    it.each(Object.entries(entries))('eztheme/%s: ESM and CommonJS give the same functions as the main entry', async (name, names) => {
        const spec = pkg.exports[`./${name}`];
        const esm = await import(`../${spec.import}`);
        const cjs = require(`../${spec.require}`);
        for (const n of names) {
            expect(typeof esm[n], `${name}.${n} (esm)`).not.toBe('undefined');
            expect(typeof cjs[n], `${name}.${n} (cjs)`).toBe(typeof (all as Record<string, unknown>)[n]);
        }
    });
    it.each(['color', 'derive', 'layout', 'app-themes'])('eztheme/%s does not carry the form themes', (name) => {
        const cjs = readFileSync(new URL(`../${pkg.exports[`./${name}`].require}`, import.meta.url), 'utf8');
        expect(cjs).not.toContain('default-light');
        expect(cjs).not.toContain('mountain-ridge');
    });
});
