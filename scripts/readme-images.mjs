// Draws the README's pictures from the themes themselves, so they can't drift:
//   npm run build && npm run readme-images
// docs/app-themes.svg, docs/form-themes.svg, docs/studio.svg: one small mock
// screen per theme (page, card, a button, text, status chips), in its colours.
import { writeFileSync } from 'node:fs';
import { APP_THEMES, FORM_THEMES, STUDIO, themeTokens, studioTokens, studioEzTokens } from '../dist/index.js';

const LABEL = '#8b8b95';
const FONT = `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const solid = (v) => (/^(#|rgb)/.test(String(v)) ? v : '#888');

// Resolve var(--x) references against a token map (for Studio's chains).
const resolve = (map, v, depth = 0) => {
    const m = /^var\((--[a-z0-9_-]+)\)$/.exec(String(v).trim());
    return m && depth < 6 ? resolve(map, map[m[1]], depth + 1) : v;
};

function card(k, name, x, y, w = 168, h = 118) {
    const c = (n) => solid(k[n]);
    return `<g transform="translate(${x} ${y})">
  <rect width="${w}" height="${h}" rx="12" fill="${c('--ez-surface-muted')}" stroke="${LABEL}" stroke-opacity=".25"/>
  <rect x="12" y="12" width="${w - 24}" height="${h - 40}" rx="8" fill="${c('--ez-surface')}" stroke="${c('--ez-border')}"/>
  <rect x="22" y="22" width="70" height="7" rx="3.5" fill="${c('--ez-text')}"/>
  <rect x="22" y="35" width="104" height="5" rx="2.5" fill="${c('--ez-text-muted')}"/>
  <rect x="22" y="52" width="44" height="18" rx="9" fill="${c('--ez-accent')}"/>
  <rect x="31" y="59" width="26" height="4" rx="2" fill="${c('--ez-on-accent')}"/>
  <rect x="72" y="52" width="38" height="18" rx="9" fill="${c('--ez-success-soft')}"/>
  <rect x="80" y="59" width="22" height="4" rx="2" fill="${c('--ez-success-ink')}"/>
  <rect x="116" y="52" width="36" height="18" rx="9" fill="${c('--ez-danger-soft')}"/>
  <rect x="124" y="59" width="20" height="4" rx="2" fill="${c('--ez-danger-ink')}"/>
  <text x="${w / 2}" y="${h + 18}" text-anchor="middle" font-size="12" fill="${LABEL}" ${FONT}>${esc(name)}</text>
</g>`;
}

function sheet(themes, cols, tokensOf) {
    const cw = 184, ch = 146;
    const rows = Math.ceil(themes.length / cols);
    const body = themes.map((t, i) => card(tokensOf(t), t.name, (i % cols) * cw + 8, Math.floor(i / cols) * ch + 8)).join('\n');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * cw + 8} ${rows * ch + 8}" width="${cols * cw + 8}" height="${rows * ch + 8}">\n${body}\n</svg>\n`;
}

writeFileSync('docs/app-themes.svg', sheet(APP_THEMES, 5, (t) => themeTokens(t, 'ez')));
writeFileSync('docs/form-themes.svg', sheet(FORM_THEMES, 7, (t) => themeTokens(t, 'ez')));
const s = studioTokens(STUDIO), ez = studioEzTokens();
const studioOf = (scheme) => { const map = { ...s[scheme], ...ez }; return Object.fromEntries(Object.keys(ez).map((k) => [k, resolve(map, map[k])])); };
writeFileSync('docs/studio.svg', sheet([{ name: 'Studio (light)', scheme: 'light' }, { name: 'Studio (dark)', scheme: 'dark' }], 2, (t) => studioOf(t.scheme)));
console.log('wrote docs/app-themes.svg, docs/form-themes.svg, docs/studio.svg');
