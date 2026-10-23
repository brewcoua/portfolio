<script lang="ts">
	import { cn } from '$lib/utils';
	import { getProjectStatusLabel } from '$lib/content/presentation';
	import type { ProjectStatus } from '$lib/content/types';

	let { status, class: className = '' }: { status: ProjectStatus; class?: string } = $props();

	const GLYPHS: Record<ProjectStatus, string> = {
		active: '●',
		completed: '✓',
		paused: '‖',
		archived: '○'
	};
</script>

<span
	class={cn(
		'meta lowercase',
		status === 'active' && 'text-primary before:opacity-100',
		status === 'archived' && 'opacity-60',
		className
	)}
	data-sigil={GLYPHS[status]}>{getProjectStatusLabel(status)}</span
>
