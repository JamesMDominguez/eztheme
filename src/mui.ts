/**
 * A theme as MUI theme options: palette, typography and shape only. Pass the
 * result to MUI's `createTheme`. Component styling stays in your app.
 *
 *   import { createTheme } from '@mui/material/styles';
 *   const muiTheme = createTheme(toMuiThemeOptions('corkboard'));
 *
 * No MUI import here, so the library keeps no dependency on it.
 */

import { getAppTheme, getTheme } from './index.js';
import { formPalette } from './tokens.js';
import type { Palette } from './derive.js';
import type { Theme } from './types.js';

export interface MuiThemeOptionsLike {
    palette: Palette & { mode: 'light' | 'dark' };
    typography: { fontFamily: string; h1?: { fontFamily: string }; h2?: { fontFamily: string }; h3?: { fontFamily: string }; h4?: { fontFamily: string }; h5?: { fontFamily: string }; h6?: { fontFamily: string } };
    shape: { borderRadius: number };
}

/** MUI palette, typography and shape for an app or form theme (Studio has no MUI form). */
export function toMuiThemeOptions(theme: Theme | string): MuiThemeOptionsLike {
    const t = typeof theme === 'string' ? (getTheme(theme) ?? getAppTheme(theme)) : theme;
    if (t.group === 'studio') throw new Error('eztheme: the Studio theme is Material tokens, not an MUI palette');
    if (t.group === 'form') {
        const font = typeof t.tokens.fontFamily === 'string' ? t.tokens.fontFamily : 'system-ui, sans-serif';
        return { palette: formPalette(t), typography: { fontFamily: font }, shape: { borderRadius: 8 } };
    }
    const heading = { fontFamily: t.font.heading };
    return {
        palette: t.palette,
        typography: { fontFamily: t.font.body, h1: heading, h2: heading, h3: heading, h4: heading, h5: heading, h6: heading },
        shape: { borderRadius: t.radius },
    };
}
