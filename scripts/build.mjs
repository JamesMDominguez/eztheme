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
const { THEMES, STUDIO, toCSS } = await import('../dist/index.js');

// Every theme, chosen with data-eztheme on the root (form themes as form:<id>).
// Studio's light/dark follows data-theme and the OS, as in Photo Studio.
const sheet = THEMES.map((t) => {
    const sel = `:root[data-eztheme="${t.group === 'form' ? `form:${t.id}` : t.id}"]`;
    return `/* ${t.name} (${t.group}) */\n${toCSS(t, { selector: sel })}`;
}).join('\n');
writeFileSync('dist/themes.css', `/* eztheme: every theme as custom properties in ezinputs (--ez-*) and Material 3 (--md-sys-*) names.\n   Pick one with <html data-eztheme="corkboard">, or data-eztheme="form:sky" for a form look. */\n${sheet}\n`);

// The Studio theme alone, applied to :root: drop-in for Photo Studio and Chess Coach.
writeFileSync('dist/studio.css', `/* eztheme ${process.env.npm_package_version ?? ''}: the Studio theme (Material 3, amber). Light by default; dark by the OS or data-theme="dark" on the root. github.com/JamesMDominguez/eztheme */\n${toCSS(STUDIO)}`);
console.log('built dist/');
