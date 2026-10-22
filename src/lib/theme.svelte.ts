import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'portfolio-theme';

function readStored(): ThemePreference {
	if (!browser) return 'system';
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
	} catch {
		/* private / blocked storage */
	}
	return 'system';
}

export function computeResolved(pref: ThemePreference, sysDark: boolean): 'light' | 'dark' {
	if (pref === 'dark') return 'dark';
	if (pref === 'light') return 'light';
	return sysDark ? 'dark' : 'light';
}

const initialPref = readStored();
const initialSys =
	browser && typeof window !== 'undefined'
		? window.matchMedia('(prefers-color-scheme: dark)').matches
		: false;

/** Reactive bag: `preference` (stored) and `resolved` (effective light/dark). */
export const theme = $state({
	preference: initialPref,
	resolved: computeResolved(initialPref, initialSys)
});

/** No `$effect` here — runs outside component context and throws `effect_orphan`. */
export function setThemePreference(pref: ThemePreference): void {
	theme.preference = pref;
	try {
		localStorage.setItem(STORAGE_KEY, pref);
	} catch {
		/* ignore */
	}
}

export const PALETTES = ['paper', 'riso', 'amber', 'moss'] as const;
export type Palette = (typeof PALETTES)[number];

const PALETTE_KEY = 'portfolio-palette';

function readStoredPalette(): Palette {
	if (!browser) return 'paper';
	try {
		const raw = localStorage.getItem(PALETTE_KEY);
		if ((PALETTES as readonly string[]).includes(raw ?? '')) return raw as Palette;
	} catch {
		/* private / blocked storage */
	}
	return 'paper';
}

export const palette = $state({ current: readStoredPalette() });

export function setPalette(value: Palette): void {
	palette.current = value;
	try {
		localStorage.setItem(PALETTE_KEY, value);
	} catch {
		/* ignore */
	}
}
