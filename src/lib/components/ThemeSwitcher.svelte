<script lang="ts">
	import { browser } from '$app/environment';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import {
		setThemePreference,
		theme,
		type ThemePreference
	} from '$lib/theme.svelte';

	let menuOpen = $state(false);
	let wrap = $state<HTMLDivElement | null>(null);

	function choose(pref: ThemePreference): void {
		setThemePreference(pref);
		menuOpen = false;
	}

	function toggleMenu(): void {
		menuOpen = !menuOpen;
	}

	$effect(() => {
		if (!browser || !menuOpen) return;
		function closeOnInteractOutside(ev: MouseEvent | PointerEvent): void {
			const el = wrap;
			const target = ev.target;
			if (!el || !(target instanceof Node) || !el.contains(target)) {
				menuOpen = false;
			}
		}
		function onKey(ev: KeyboardEvent): void {
			if (ev.key === 'Escape') menuOpen = false;
		}
		queueMicrotask(() => {
			document.addEventListener('pointerdown', closeOnInteractOutside, true);
		});
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', closeOnInteractOutside, true);
			document.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="relative shrink-0" bind:this={wrap}>
	<button
		type="button"
		class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-pointer')}
		onclick={(e) => {
			e.stopPropagation();
			toggleMenu();
		}}
		aria-expanded={menuOpen}
		aria-haspopup="menu"
		aria-label="Choose theme: light, dark, or system"
	>
		{#if theme.resolved === 'dark'}
			<MoonIcon class="size-4" aria-hidden="true" />
		{:else}
			<SunIcon class="size-4" aria-hidden="true" />
		{/if}
	</button>
	{#if menuOpen}
		<div
			class="absolute end-0 top-full z-50 mt-1.5 flex w-44 flex-col gap-0.5 border border-border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
			role="menu"
		>
			<button
				type="button"
				role="menuitemradio"
				aria-checked={theme.preference === 'light'}
				class={cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-full justify-start gap-2 px-2 font-normal')}
				onclick={() => choose('light')}
			>
				<SunIcon class="size-4 shrink-0 opacity-80" aria-hidden="true" />
				<span class="flex-1 text-left">Light</span>
				{#if theme.preference === 'light'}
					<CheckIcon class="size-4 shrink-0" aria-hidden="true" />
				{/if}
			</button>
			<button
				type="button"
				role="menuitemradio"
				aria-checked={theme.preference === 'dark'}
				class={cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-full justify-start gap-2 px-2 font-normal')}
				onclick={() => choose('dark')}
			>
				<MoonIcon class="size-4 shrink-0 opacity-80" aria-hidden="true" />
				<span class="flex-1 text-left">Dark</span>
				{#if theme.preference === 'dark'}
					<CheckIcon class="size-4 shrink-0" aria-hidden="true" />
				{/if}
			</button>
			<button
				type="button"
				role="menuitemradio"
				aria-checked={theme.preference === 'system'}
				class={cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-full justify-start gap-2 px-2 font-normal')}
				onclick={() => choose('system')}
			>
				<MonitorIcon class="size-4 shrink-0 opacity-80" aria-hidden="true" />
				<span class="flex-1 text-left">System</span>
				{#if theme.preference === 'system'}
					<CheckIcon class="size-4 shrink-0" aria-hidden="true" />
				{/if}
			</button>
		</div>
	{/if}
</div>
