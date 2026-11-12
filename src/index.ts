import { APP_THEMES } from './themes/app.js';
import { FORM_THEMES } from './themes/form.js';
import { STUDIO } from './themes/studio.js';
import type { AppTheme, FormTheme, StudioTheme, Theme } from './types.js';

export * from './color.js';
export * from './derive.js';
export * from './tokens.js';
export * from './forms.js';
export type { AppTheme, FormTheme, StudioTheme, Theme, TokenPairs } from './types.js';
export { APP_THEMES, STUDIO };

/** Every theme: the app looks, Studio, then the form looks. */
export const THEMES: Theme[] = [...APP_THEMES, STUDIO, ...FORM_THEMES];

const lookup = new Map<string, Theme>();
for (const t of THEMES) {
    // An id used by both an app and a form theme (synthwave…) resolves to the app one; ask for `form:<id>` for the other.
    if (!lookup.has(t.id)) lookup.set(t.id, t);
    lookup.set(`${t.group}:${t.id}`, t);
    for (const a of (t as AppTheme).aliases || []) lookup.set(a, t);
}

/** A theme by id (`corkboard`), alias (`retro-nintendo`) or group-qualified id (`form:sky`). */
export function getTheme(id: string): Theme | undefined {
    return lookup.get(id);
}

/** An app theme by id or alias; unknown ids give Light. */
export function getAppTheme(id: string | null | undefined): AppTheme {
    const t = id ? lookup.get(`app:${id}`) || lookup.get(id) : undefined;
    return t && t.group === 'app' ? t : APP_THEMES[0];
}

/** The `{ value, label }` list for a theme picker. */
export const themeOptions = (group: Theme['group'] | 'all' = 'all') =>
    THEMES.filter((t) => group === 'all' || t.group === group).map((t) => ({ value: t.group === 'form' ? `form:${t.id}` : t.id, label: t.name, group: t.group, mode: t.mode }));

export const isAppTheme = (t: Theme): t is AppTheme => t.group === 'app';
export const isFormTheme = (t: Theme): t is FormTheme => t.group === 'form';
export const isStudioTheme = (t: Theme): t is StudioTheme => t.group === 'studio';
