// Layout tokens: ezinputs' numbers exactly, Studio's equal to the Studio theme's,
// and the layout modes behaving as ezinputs' layoutMode.ts does.
// The fixture was exported from ezinputs (listRowMetrics, chipMetrics, m3NavRail,
// typeScale, layoutMode).
// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    DENSITIES, EZINPUTS_LAYOUT, LAYOUT_MODES, STUDIO, STUDIO_LAYOUT, THEME_LAYOUTS, effectiveLayoutMode, getLayout, getTheme,
    layoutCSS, layoutForTheme, layoutModesOffered, layoutSurfaces, layoutTokens, rowHeight, rowTitleLine, studioTokens, withLayout,
} from '../src/index';
import { applyLayout, applyTheme, clearLayout, clearTheme } from '../src/dom';

const key = JSON.parse(readFileSync(join(__dirname, 'fixtures/ezinputs-layout.json'), 'utf8'));
const L = EZINPUTS_LAYOUT;
const newId = (id: string) => (id === 'retro-nintendo' ? 'retro-game' : id);

describe('ezinputs layout: the numbers', () => {
    it.each(DENSITIES)('%s list row', (d) => {
        const r = key.rows[d];
        const m = L.density[d];
        expect(m.rowPadY).toBeCloseTo(r.py * 8, 10);
        expect(m.titleSize).toBeCloseTo(parseFloat(r.titleFs) * 16, 10);
        expect(m.titleLineHeight).toBe(r.titleLh);
        expect(m.rowGap).toBeCloseTo(r.gap * 8, 10);
        expect(m.metaLineHeight).toBe(r.metaLh);
        expect(rowHeight(L, d)).toBeCloseTo(r.height, 6);
        expect(rowTitleLine(L, d)).toBeCloseTo(r.titleLine, 6);
    });
    it.each(DENSITIES)('%s chips (comfortable takes the default chip)', (d) => {
        const c = d === 'compact' ? 'compact' : 'default';
        expect([L.density[d].chipHeight, L.density[d].chipPadX, L.density[d].chipIcon]).toEqual([key.chips.height[c], key.chips.padX[c], key.chips.icon[c]]);
    });
    it('rail', () => {
        expect([L.rail.width, L.rail.indicatorWidth, L.rail.indicatorHeight]).toEqual([key.rail.width, key.rail.indicatorWidth, key.rail.indicatorHeight]);
    });
    it('type scale and the size floor', () => {
        expect(L.type).toEqual(key.type);
        expect(L.minFontSize).toBe(key.minFontSize);
        for (const t of Object.values(L.type)) expect(t.fontSize).toBeGreaterThanOrEqual(L.minFontSize);
    });
});

describe('ezinputs layout modes', () => {
    it('the same ten, the same default', () => {
        expect([...LAYOUT_MODES]).toEqual(key.modes);
        expect(Object.fromEntries(Object.entries(THEME_LAYOUTS).map(([m, t]) => [m, t]))).toEqual(
            Object.fromEntries(Object.entries(key.themeLayouts as Record<string, string>).map(([m, t]) => [m, newId(t)])),
        );
    });
    it.each(key.modes as string[])('%s draws on the same surfaces', (m) => expect(layoutSurfaces(m as never)).toEqual(key.surfaces[m]));
    it('a theme layout only under its theme (old and new ids)', () => {
        for (const [k, want] of Object.entries(key.effective as Record<string, string>)) {
            const [m, t] = k.split('|');
            expect(effectiveLayoutMode(m as never, t)).toBe(want);
            expect(effectiveLayoutMode(m as never, newId(t))).toBe(want);
        }
        expect(layoutForTheme('retro-nintendo')).toBe('arcade');
        expect(layoutForTheme('retro-game')).toBe('arcade');
        expect(layoutForTheme('light')).toBeNull();
    });
    it('what is offered', () => {
        for (const [k, want] of Object.entries(key.offered as Record<string, string[]>)) {
            const [c, p, t] = k.split('|');
            expect(layoutModesOffered(c === 'undefined' ? undefined : c, p === 'true', t)).toEqual(want);
        }
    });
});

describe('Studio layout', () => {
    const { light } = studioTokens(STUDIO);
    it('its corners and type sizes are the Studio theme\'s', () => {
        const t = layoutTokens(STUDIO_LAYOUT, { names: 'md' });
        for (const [k, v] of Object.entries(t)) {
            if (k.startsWith('--md-sys-') && light[k] !== undefined) expect(v, k).toBe(light[k]);
        }
        const sizes = Object.keys(light).filter((k) => /^--md-sys-typescale-[a-z]+-[a-z]+$/.test(k));
        expect(sizes.length).toBeGreaterThan(5);
        for (const k of sizes) expect(t[k], k).toBe(light[k]);
    });
    it('writes no line heights or weights Photo Studio never chose', () => {
        expect(Object.keys(layoutTokens(STUDIO_LAYOUT)).some((k) => /-(line-height|weight)$/.test(k) && k.includes('typescale'))).toBe(false);
    });
});

describe('layoutTokens', () => {
    it('vocabularies: corners and type in both, the rest always --ez-*', () => {
        const ez = layoutTokens(L, { names: 'ez' });
        const md = layoutTokens(L, { names: 'md' });
        expect(Object.keys(ez).every((k) => k.startsWith('--ez-'))).toBe(true);
        expect(md['--md-sys-shape-corner-large']).toBe('16px');
        expect(md['--md-sys-typescale-title-large']).toBe('16px');
        expect(md['--ez-corner-large']).toBeUndefined();
        expect(md['--ez-row-height']).toBe('71.2px');
    });
    it('density changes the rows', () => {
        expect(layoutTokens(L, { density: 'compact' })['--ez-row-height']).toBe('53.28px');
        expect(layoutTokens(L, { density: 'compact' })['--ez-chip-height']).toBe('20px');
    });
    it('radiusScale scales corners, not full', () => {
        const t = layoutTokens(L, { radiusScale: 1.5 });
        expect(t['--ez-corner-large']).toBe('24px');
        expect(t['--ez-card-radius']).toBe('24px');
        expect(t['--ez-corner-full']).toBe('999px');
    });
    it('a theme keeps its own corner', () => {
        const retro = getTheme('retro')!;
        expect(layoutTokens(L, { theme: retro })['--md-sys-shape-corner-small']).toBe('14px');
        expect(layoutTokens(L, { theme: getTheme('retro-game')! })['--ez-card-radius']).toBe('2px');
    });
    it('spacing is multiples of the unit', () => {
        const t = layoutTokens(L);
        expect([t['--ez-space-0_5'], t['--ez-space-1'], t['--ez-space-3']]).toEqual(['4px', '8px', '24px']);
    });
    it('layoutCSS writes a rule; withLayout changes some numbers', () => {
        expect(layoutCSS(L, { selector: '.x' })).toMatch(/^\.x \{\n {2}--ez-space-0_5: 4px;/);
        const chess = withLayout(STUDIO_LAYOUT, { id: 'chess', page: { padY: 30, padX: 36 } });
        expect(chess.page).toEqual({ ...STUDIO_LAYOUT.page, padY: 30, padX: 36 });
        expect(STUDIO_LAYOUT.page.padY).toBe(34);
        expect(getLayout('studio')).toBe(STUDIO_LAYOUT);
    });
});

describe('applyLayout', () => {
    const root = () => document.documentElement;
    it('writes tokens and ezinputs\' layout attributes', () => {
        applyLayout('ezinputs', { mode: 'open' });
        expect(root().style.getPropertyValue('--ez-row-height')).toBe('71.2px');
        expect(root().getAttribute('data-ez-layout')).toBe('open');
        expect(root().getAttribute('data-ez-nav-surface')).toBe('island');
        expect(root().getAttribute('data-ez-main-surface')).toBe('immersive');
        clearLayout();
        expect(root().style.getPropertyValue('--ez-row-height')).toBe('');
        expect(root().hasAttribute('data-ez-layout')).toBe(false);
    });
    it('the theme keeps its corner whichever comes first, and after either is cleared', () => {
        applyTheme('retro', { names: 'md' });
        applyLayout('ezinputs');
        expect(root().style.getPropertyValue('--md-sys-shape-corner-small')).toBe('14px');
        applyTheme('light', { names: 'md' });
        expect(root().style.getPropertyValue('--md-sys-shape-corner-small')).toBe('4px');
        clearLayout();
        expect(root().style.getPropertyValue('--md-sys-shape-corner-small')).toBe('4px');
        expect(root().style.getPropertyValue('--ez-accent')).toBe('');
        clearTheme();
        expect(root().getAttribute('style') ?? '').toBe('');
    });
});
