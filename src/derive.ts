/**
 * The colour rules: given a theme's palette, work out everything else.
 *
 *  - the surface ladder (M3's tone-based containers): how far back a surface
 *    sits, mixed from the paper toward the ink, with an outline that clears 3:1;
 *  - status pairs (danger, warning, success, info, neutral): an ink and the wash
 *    it is meant to sit on, chosen together so a chip reads at chip sizes;
 *  - per-theme accent remaps: a theme can say "when the app asks for a green,
 *    use my jade", so hues picked in code follow the theme.
 *
 * Ported from ezinputs (app/lib/theme: surfaceRoles, statusColors,
 * accentPalette, themeTokens), where these rules were tuned against real
 * screens; the outputs match it exactly (see test/ezinputs-match.test.ts).
 */

import { alpha, contrastRatio, darken, flatten, isOpaque, lighten, mix, normalizeColor, toHex } from './color.js';

/** The palette a theme is defined by. Everything else is derived. */
export interface Palette {
    mode: 'light' | 'dark';
    primary: { main: string; contrastText: string; ink?: string };
    secondary?: { main: string; contrastText?: string };
    error: { main: string; contrastText?: string };
    warning: { main: string; contrastText?: string };
    success: { main: string; contrastText?: string };
    info: { main: string; contrastText?: string };
    background: { default: string; paper: string };
    text: { primary: string; secondary: string };
    divider: string;
}

// ── Surfaces ────────────────────────────────────────────────────────────────

export interface Surfaces {
    containerLow: string;
    container: string;
    containerHigh: string;
    fill: string;
    fillHover: string;
    outline: string;
    outlineVariant: string;
}

/** Hand-tuned ladders for the plain white and slate papers (contrast noted against paper / page / fill). */
const BAKED_SURFACES: Record<'light' | 'dark', Surfaces> = {
    light: { containerLow: '#f9f9fa', container: '#f6f7f8', containerHigh: '#f0f1f3', fill: '#eceef1', fillHover: '#e0e3e8', outline: '#7d8a9e', outlineVariant: '#d4d8df' },
    dark: { containerLow: '#161e31', container: '#1a2235', containerHigh: '#20293c', fill: '#242d41', fillHover: '#323b4f', outline: '#77849a', outlineVariant: '#3c475a' },
};
const BAKED_PAPER: Record<'light' | 'dark', string> = { light: '#ffffff', dark: '#0f172a' };
const STEPS = {
    light: { containerLow: 0.03, container: 0.045, containerHigh: 0.07, fill: 0.09, fillHover: 0.15, outlineVariant: 0.18 },
    dark: { containerLow: 0.05, container: 0.07, containerHigh: 0.1, fill: 0.12, fillHover: 0.19, outlineVariant: 0.22 },
};

function ladder(paper: string, ink: string, mode: 'light' | 'dark'): Surfaces {
    const s = STEPS[mode];
    const rungs = {
        containerLow: mix(paper, ink, s.containerLow),
        container: mix(paper, ink, s.container),
        containerHigh: mix(paper, ink, s.containerHigh),
        fill: mix(paper, ink, s.fill),
        fillHover: mix(paper, ink, s.fillHover),
    };
    // The outline is the first mix that clears 3:1 against both the paper and the fill.
    let amount = 0.4, outline = mix(paper, ink, amount);
    while (amount < 0.95 && (contrastRatio(outline, rungs.fill) < 3 || contrastRatio(outline, paper) < 3)) {
        amount += 0.02;
        outline = mix(paper, ink, amount);
    }
    return { ...rungs, outline, outlineVariant: mix(paper, ink, s.outlineVariant) };
}

const surfaceCache = new Map<string, Surfaces>();

/** The surface ladder for a palette: baked for the plain papers, mixed from paper and ink otherwise. */
export function surfaces(p: Pick<Palette, 'mode' | 'background' | 'text'>): Surfaces {
    const mode = p.mode === 'dark' ? 'dark' : 'light';
    const paper = p.background?.paper, ink = p.text?.primary;
    if (!isOpaque(paper) || !isOpaque(ink) || normalizeColor(paper) === normalizeColor(BAKED_PAPER[mode])) return BAKED_SURFACES[mode];
    const key = `${mode}|${paper}|${ink}`;
    let hit = surfaceCache.get(key);
    if (!hit) { hit = ladder(paper, ink, mode); surfaceCache.set(key, hit); }
    return hit;
}

// ── Accent remaps ───────────────────────────────────────────────────────────

export type AccentRole = 'red' | 'orange' | 'amber' | 'green' | 'jade' | 'teal' | 'blue' | 'violet' | 'pink' | 'neutral';

/** Which family a hue belongs to (by HSL hue; low-saturation or very dark colours are neutral). */
export function classifyAccent(hex: string): AccentRole {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) return 'neutral';
    const n = parseInt(m[1], 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
    if (delta < 0.12 || max < 0.12) return 'neutral';
    let h: number;
    if (max === r) h = 60 * (((g - b) / delta + 6) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
    if (h < 15 || h >= 345) return 'red';
    if (h < 35) return 'orange';
    if (h < 65) return 'amber';
    if (h < 140) return 'green';
    if (h < 165) return 'jade';
    if (h < 195) return 'teal';
    if (h < 255) return 'blue';
    if (h < 290) return 'violet';
    return 'pink';
}

/** A hue picked in code, in the theme's own version of that family (unchanged if the theme has none). */
export function remapAccent(hex: string, accents: Partial<Record<AccentRole, string>> | undefined): string {
    if (!accents) return hex;
    return accents[classifyAccent(hex)] || hex;
}

// ── Status pairs ────────────────────────────────────────────────────────────

export interface StatusPair { fg: string; bg: string; bgHover: string }
export type StatusTone = 'warning' | 'success' | 'danger' | 'info' | 'neutral';
export type StatusPalette = Record<StatusTone, StatusPair>;

/** Hand-tuned pairs (ink contrast on bg / on bgHover noted beside each). */
const BAKED_STATUS: Record<'light' | 'dark', StatusPalette> = {
    light: {
        warning: { fg: '#92400e', bg: '#fdefd8', bgHover: '#fce6c0' }, // 6.25 / 7.09
        success: { fg: '#166534', bg: '#dcf6e5', bgHover: '#c6f0d5' }, // 6.23 / 7.13
        danger: { fg: '#b91c1c', bg: '#fde5e5', bgHover: '#fbd2d2' },  // 5.40 / 6.47
        info: { fg: '#1e40af', bg: '#e4eefe', bgHover: '#d0e1fd' },    // 7.46 / 8.72
        neutral: { fg: '#475569', bg: '#e9ecef', bgHover: '#dadee3' }, // 6.39 / 7.58
    },
    dark: {
        warning: { fg: '#fcd34d', bg: '#423523', bgHover: '#594220' }, // 8.25 / 12.38
        success: { fg: '#86efac', bg: '#133d35', bgHover: '#154f3b' }, // 8.56 / 12.71
        danger: { fg: '#fca5a5', bg: '#402130', bgHover: '#572532' },  // 7.48 / 9.41
        info: { fg: '#93c5fd', bg: '#192f57', bgHover: '#1d396b' },    // 7.34 / 9.90
        neutral: { fg: '#cbd5e1', bg: '#2a3346', bgHover: '#374155' }, // 8.52 / 12.02
    },
};

/**
 * An accent made readable as text on its own wash: stepped toward white (on
 * a dark wash) or black (on a light one) until it reaches `target`.
 */
export function readableOnTint(accent: string, surface: string, tintOpacity = 0.1, target = 3): string {
    const washed = flatten(alpha(accent, tintOpacity), surface);
    const towardWhite = contrastRatio(washed, '#ffffff') > contrastRatio(washed, '#000000');
    let candidate = accent;
    for (let step = 0; step < 48; step += 1) {
        if (contrastRatio(candidate, washed) >= target) return candidate;
        const next = toHex(towardWhite ? lighten(candidate, 0.12) : darken(candidate, 0.12));
        if (next === candidate) break;
        candidate = next;
    }
    return candidate;
}

const statusCache = new Map<string, StatusPalette>();

/**
 * Status pairs for a palette. A light theme that remaps accents gets pairs made
 * from its own hues on its own paper; everything else gets the baked pairs.
 */
export function statusColors(p: Pick<Palette, 'mode' | 'background' | 'text'>, accents?: Partial<Record<AccentRole, string>>): StatusPalette {
    const paper = p.background?.paper;
    if (p.mode !== 'dark' && accents && typeof paper === 'string' && /^#[0-9a-f]{6}$/i.test(paper)) {
        const muted = p.text.secondary;
        const key = `${JSON.stringify(accents)}|${paper}|${muted}`;
        const hit = statusCache.get(key);
        if (hit) return hit;
        const pair = (hue: string): StatusPair => ({
            fg: readableOnTint(hue, paper, 0.12, 4.5),
            bg: flatten(alpha(hue, 0.12), paper),
            bgHover: flatten(alpha(hue, 0.18), paper),
        });
        const out: StatusPalette = {
            warning: pair(remapAccent('#d97706', accents)),
            success: pair(remapAccent(BAKED_STATUS.light.success.fg, accents)),
            danger: pair(remapAccent(BAKED_STATUS.light.danger.fg, accents)),
            info: pair(remapAccent(BAKED_STATUS.light.info.fg, accents)),
            neutral: pair(muted),
        };
        statusCache.set(key, out);
        return out;
    }
    return p.mode === 'dark' ? BAKED_STATUS.dark : BAKED_STATUS.light;
}

/** The colour readable on an accent fill: white if it reaches 3:1, otherwise near-black. */
export function contrastTextFor(fill: string, threshold = 3): string {
    return contrastRatio(fill, '#fff') >= threshold ? '#fff' : 'rgba(0, 0, 0, 0.87)';
}
