/**
 * Colour helpers: parse, format, mix, lighten, darken, contrast. No
 * dependencies. The derivation rules in this library were written against
 * MUI's colour manipulator, so these follow the same conventions where it
 * matters for the result: channels are truncated after lighten/darken,
 * luminance is rounded to three places for `contrastRatio`, and colours come
 * back as `rgb(r, g, b)` / `rgba(r, g, b, a)` strings unless converted.
 */

export interface ParsedColor {
    type: 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'color';
    values: number[];
}

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`. Throws on anything else. */
export function parseColor(color: string): ParsedColor {
    const s = String(color).trim();
    if (s.startsWith('#')) {
        const hex = s.slice(1);
        const size = hex.length >= 6 ? 2 : 1;
        const parts = hex.match(new RegExp(`.{1,${size}}`, 'g')) || [];
        const full = parts.map((p) => (p.length === 1 ? p + p : p));
        if (!full.length || full.some((p) => !/^[0-9a-f]{2}$/i.test(p))) throw new Error(`eztheme: can't read colour ${color}`);
        const values = full.map((p, i) => (i < 3 ? parseInt(p, 16) : Math.round((parseInt(p, 16) / 255) * 1000) / 1000));
        return { type: values.length === 4 ? 'rgba' : 'rgb', values };
    }
    const m = /^(rgba?|hsla?|color)\((.*)\)$/i.exec(s);
    if (!m) throw new Error(`eztheme: can't read colour ${color}`);
    const type = m[1].toLowerCase() as ParsedColor['type'];
    let body = m[2];
    if (type === 'color') body = body.replace(/^\s*[a-z0-9-]+\s+/i, '');
    const values = body.split(/[\s,/]+/).filter(Boolean).map((v) => parseFloat(v));
    return { type, values };
}

/** Back to a CSS string. rgb channels are truncated to integers. */
export function formatColor({ type, values }: ParsedColor): string {
    let v = values;
    if (type.startsWith('rgb')) v = values.map((n, i) => (i < 3 ? Math.trunc(n) : n));
    else if (type.startsWith('hsl')) v = values.map((n, i) => (i === 1 || i === 2 ? (`${n}%` as unknown as number) : n));
    return `${type}(${v.join(', ')})`;
}

function hslToRgb({ values }: ParsedColor): ParsedColor {
    const [h, s0, l0] = values;
    const s = s0 / 100, l = l0 / 100, a = s * Math.min(l, 1 - l);
    const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const rgb = [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
    return values.length > 3 ? { type: 'rgba', values: [...rgb, values[3]] } : { type: 'rgb', values: rgb };
}

const rgbOf = (color: string): number[] => {
    const c = parseColor(color);
    return (c.type.startsWith('hsl') ? hslToRgb(c) : c).values;
};

const hex2 = (n: number) => { const h = n.toString(16); return h.length === 1 ? `0${h}` : h; };

/** `#rrggbb` (or `#rrggbbaa` with alpha). A hex input comes back as it was. */
export function toHex(color: string): string {
    if (color.startsWith('#')) return color;
    const c = parseColor(color);
    const v = c.type.startsWith('hsl') ? hslToRgb(c).values : c.values;
    return `#${v.map((n, i) => hex2(i === 3 ? Math.round(255 * n) : Math.trunc(n))).join('')}`;
}

/** The colour at `opacity`, as `rgba(…)`. */
export function alpha(color: string, opacity: number): string {
    const c = parseColor(color);
    const rgb = c.type.startsWith('hsl') ? hslToRgb(c) : c;
    const v = [...rgb.values.slice(0, 3), Math.max(0, Math.min(1, opacity))];
    return formatColor({ type: 'rgba', values: v });
}

/** Move toward white by `amount` (0–1). */
export function lighten(color: string, amount: number): string {
    const c = parseColor(color);
    const rgb = c.type.startsWith('hsl') ? hslToRgb(c) : c;
    return formatColor({ type: rgb.type, values: rgb.values.map((n, i) => (i < 3 ? n + (255 - n) * amount : n)) });
}

/** Move toward black by `amount` (0–1). */
export function darken(color: string, amount: number): string {
    const c = parseColor(color);
    const rgb = c.type.startsWith('hsl') ? hslToRgb(c) : c;
    return formatColor({ type: rgb.type, values: rgb.values.map((n, i) => (i < 3 ? n * (1 - amount) : n)) });
}

/** `amount` of the way from `from` to `to`, as `#rrggbb` (rounded). */
export function mix(from: string, to: string, amount: number): string {
    const a = rgbOf(from), b = rgbOf(to);
    return `#${[0, 1, 2].map((k) => hex2(Math.round(a[k] + (b[k] - a[k]) * amount))).join('')}`;
}

/** A translucent colour laid over an opaque one, as the solid it shows (`rgb(…)`, rounded). */
export function flatten(over: string, base: string): string {
    const o = parseColor(over), b = rgbOf(base);
    const a = o.values[3] ?? 1;
    if (a >= 1) return formatColor(o);
    const ov = o.type.startsWith('hsl') ? hslToRgb(o).values : o.values;
    return formatColor({ type: 'rgb', values: [0, 1, 2].map((i) => Math.round(ov[i] * a + b[i] * (1 - a))) });
}

/** Whether a colour is fully opaque and readable as plain RGB (false for `color(…)` and anything unparseable). */
export function isOpaque(color: string | null | undefined): color is string {
    if (!color) return false;
    try {
        const c = parseColor(color);
        return c.type !== 'color' && (c.values[3] === undefined || c.values[3] >= 1);
    } catch { return false; }
}

const channel = (v: number) => { const n = v / 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; };

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(color: string): number {
    const [r, g, b] = rgbOf(color);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio between two opaque colours, 1 to 21. Luminance is
 * rounded to three places first (the convention the derivation rules were
 * tuned with); pass `exact: true` for the unrounded ratio.
 */
export function contrastRatio(a: string, b: string, { exact = false } = {}): number {
    const r = (x: number) => (exact ? x : Number(x.toFixed(3)));
    const la = r(luminance(a)), lb = r(luminance(b));
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Lowercase, no spaces, `rgb(…)` form: for comparing two ways of writing a colour. */
export function normalizeColor(color: string): string {
    try { return formatColor(parseColor(color)).replace(/\s/g, '').toLowerCase(); } catch { return color; }
}
