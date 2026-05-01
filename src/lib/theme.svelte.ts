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
