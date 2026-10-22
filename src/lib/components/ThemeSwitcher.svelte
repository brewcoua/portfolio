<script lang="ts">
	import { ToggleGroup } from 'bits-ui';
	import {
		PALETTES,
		palette,
		setPalette,
		setThemePreference,
		theme,
		type Palette,
		type ThemePreference
	} from '$lib/theme.svelte';

	const THEMES: { value: ThemePreference; label: string }[] = [
		{ value: 'light', label: 'light' },
		{ value: 'dark', label: 'dark' },
		{ value: 'system', label: 'auto' }
	];

	const item =
		'cursor-pointer px-1 text-muted-foreground hover:text-foreground data-[state=on]:text-primary data-[state=on]:underline data-[state=on]:underline-offset-4';
</script>

<div class="flex flex-wrap gap-x-6 gap-y-1 text-xs">
	<ToggleGroup.Root
		type="single"
		value={theme.preference}
		onValueChange={(v) => v && setThemePreference(v as ThemePreference)}
		class="flex items-center gap-1"
		aria-label="Theme"
	>
		<span class="mr-1">theme:</span>
		{#each THEMES as t (t.value)}
			<ToggleGroup.Item value={t.value} class={item}>{t.label}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
	<ToggleGroup.Root
		type="single"
		value={palette.current}
		onValueChange={(v) => v && setPalette(v as Palette)}
		class="flex items-center gap-1"
		aria-label="Palette"
	>
		<span class="mr-1">palette:</span>
		{#each PALETTES as p (p)}
			<ToggleGroup.Item value={p} class={item}>{p}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
