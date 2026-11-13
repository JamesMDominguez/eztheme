// After tsc has written dist/*.js (ESM) and the .d.ts files: the CommonJS
// builds, the single-file bundle, themes.css and studio.css.
import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';

for (const entry of ['index', 'dom', 'mui']) {
    await build({ entryPoints: [`src/${entry}.ts`], outfile: `dist/cjs/${entry}.cjs`, bundle: true, format: 'cjs', platform: 'neutral', target: 'es2020' });
}
await build({
    entryPoints: ['src/bundle.ts'], outfile: 'dist/eztheme.min.js', bundle: true, format: 'esm', target: 'es2020', minify: true, legalComments: 'none',
    banner: { js: `/*! eztheme ${process.env.npm_package_version ?? ''} | MIT License | github.com/JamesMDominguez/eztheme */` },
});
const { THEMES, STUDIO, toCSS, LAYOUTS, layoutCSS, layoutTokens } = await import('../dist/index.js');

// Every theme, chosen with data-eztheme on the root (form themes as form:<id>).
// Studio's light/dark follows data-theme and the OS, as in Photo Studio.
const sheet = THEMES.map((t) => {
    const sel = `:root[data-eztheme="${t.group === 'form' ? `form:${t.id}` : t.id}"]`;
    return `/* ${t.name} (${t.group}) */\n${toCSS(t, { selector: sel })}`;
}).join('\n');
writeFileSync('dist/themes.css', `/* eztheme: every theme as custom properties in ezinputs (--ez-*) and Material 3 (--md-sys-*) names.\n   Pick one with <html data-eztheme="corkboard">, or data-eztheme="form:sky" for a form look. */\n${sheet}\n`);

// The Studio theme alone, applied to :root: drop-in for Photo Studio and Chess Coach.
writeFileSync('dist/studio.css', `/* eztheme ${process.env.npm_package_version ?? ''}: the Studio theme (Material 3, amber). Light by default; dark by the OS or data-theme="dark" on the root. github.com/JamesMDominguez/eztheme */\n${toCSS(STUDIO)}`);
// Every layout, chosen with data-ezlayout on the root; data-ezdensity="comfortable" or "compact" changes the rows.
const rowKeys = (t) => Object.fromEntries(Object.entries(t).filter(([k]) => /^--ez-(row|chip)-/.test(k)));
const rule = (sel, tokens) => `${sel} {\n${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
const layoutSheet = LAYOUTS.map((l) => [
    `/* ${l.name} */`,
    layoutCSS(l, { selector: `:root[data-ezlayout="${l.id}"]` }).trimEnd(),
    ...['comfortable', 'compact'].map((d) => rule(`:root[data-ezlayout="${l.id}"][data-ezdensity="${d}"]`, rowKeys(layoutTokens(l, { density: d }))).trimEnd()),
].join('\n')).join('\n\n');
writeFileSync('dist/layouts.css', `/* eztheme: layout tokens (spacing, corners, type, list rows, chips, rail, bar, page) in ezinputs (--ez-*) and, for corners and type, Material 3 names.\n   Pick one with <html data-ezlayout="ezinputs">; add data-ezdensity="compact" for tighter rows. Load it before themes.css, so a theme's own corner wins. */\n${layoutSheet}\n`);
console.log('built dist/');
