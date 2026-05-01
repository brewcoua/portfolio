<script lang="ts">
	import { browser } from '$app/environment';
	import { computeResolved, theme } from '$lib/theme.svelte';

	/**
	 * Subscribes to `prefers-color-scheme`, recomputes `theme.resolved`,
	 * and mirrors it to `<html>` (class + color-scheme).
	 * Must live in a component so `$effect` is not orphaned.
	 */

	let systemPrefersDark = $state(
		browser && typeof window !== 'undefined'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: false
	);

	$effect(() => {
		if (!browser) return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		systemPrefersDark = mq.matches;
		const onChange = () => {
			systemPrefersDark = mq.matches;
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	$effect(() => {
		theme.resolved = computeResolved(theme.preference, systemPrefersDark);
	});

	$effect(() => {
		if (!browser) return;
		const dark = theme.resolved === 'dark';
		document.documentElement.classList.toggle('dark', dark);
		document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
	});
</script>
