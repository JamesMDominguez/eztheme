// Every form theme meets the contrast contract, or is on the list of known
// shortfalls with a floor it must not drop below (the same list ezinputs
// keeps). When a theme is fixed, its entry comes off the list.
import { describe, expect, it } from 'vitest';
import { APP_THEMES, FORM_THEMES, auditFormTheme, contrastRatio, flatten, themeTokens } from '../src/index';

const KNOWN_SHORTFALLS: Record<string, Record<string, number>> = {
    sky: { 'mutedOnSurface on surface': 3.59, 'accent on pageBg': 2.59 },
    sunset: { 'muted on pageBg': 2.99, 'textSecondary on surface': 3.94, 'mutedOnSurface on surface': 3.94 },
    orange: { 'accent on pageBg': 2.82 },
    aurora: { 'mutedOnSurface on surface': 3.58 },
    bloom: { 'accent on pageBg': 2.76 },
    terrazzo: { 'muted on pageBg': 3.74, 'textSecondary on surface': 4.15, 'mutedOnSurface on surface': 4.15 },
    balloons: { 'muted on pageBg': 3.15 },
    'mountain-ridge': { 'muted on pageBg': 3.42, 'textSecondary on surface': 4.46, 'mutedOnSurface on surface': 4.46 },
    spring: { 'muted on pageBg': 3.49, 'textSecondary on surface': 3.94, 'mutedOnSurface on surface': 3.94 },
    autumn: { 'muted on pageBg': 3.84 },
    winter: { 'muted on pageBg': 3.49 },
};
const name = (r: ReturnType<typeof auditFormTheme>[number]) => `${r.pairing.ink} on ${r.pairing.on}`;

describe('form themes: the contrast contract', () => {
    it.each(FORM_THEMES.map((t) => [t.id, t] as const))('%s: every pairing passes or holds its recorded floor', (id, t) => {
        const recorded = KNOWN_SHORTFALLS[id] || {};
        for (const r of auditFormTheme(t)) {
            if (r.pairing.advisory) continue;
            expect([id, name(r), r.missing]).toEqual([id, name(r), false]);
            const floor = recorded[name(r)];
            if (floor === undefined) expect([id, name(r), r.passes, r.ratio]).toEqual([id, name(r), true, r.ratio]);
            else expect([id, name(r), (r.ratio as number) >= floor - 0.02]).toEqual([id, name(r), true]);
        }
    });
    it('the list has no stale entries (a fixed theme comes off it)', () => {
        const stale: string[] = [];
        for (const [id, entries] of Object.entries(KNOWN_SHORTFALLS)) {
            const results = auditFormTheme(FORM_THEMES.find((t) => t.id === id)!);
            for (const pair of Object.keys(entries)) if (results.find((r) => name(r) === pair)?.passes) stale.push(`${id}: ${pair}`);
        }
        expect(stale).toEqual([]);
    });
});

describe('app themes: readable text', () => {
    it.each(APP_THEMES.map((t) => [t.id, t] as const))('%s: text 4.5:1 on its surfaces, status inks on their washes', (_, t) => {
        const k = themeTokens(t, 'ez');
        const on = (ink: string, ground: string) => contrastRatio(flatten(ink, k['--ez-surface']), flatten(ground, k['--ez-surface']), { exact: true });
        for (const ground of ['--ez-surface', '--ez-surface-low', '--ez-surface-container']) {
            expect(on(k['--ez-text'], k[ground])).toBeGreaterThanOrEqual(4.5);
            expect(on(k['--ez-text-muted'], k[ground])).toBeGreaterThanOrEqual(4.5);
        }
        for (const s of ['danger', 'warning', 'success', 'info']) expect(on(k[`--ez-${s}-ink`], k[`--ez-${s}-soft`])).toBeGreaterThanOrEqual(4.5);
    });
});
