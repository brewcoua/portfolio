<script lang="ts">
	import { cn } from '$lib/utils';
	import { getProjectStatusLabel } from '$lib/content/presentation';
	import type { ProjectStatus } from '$lib/content/types';

	let { status, class: className = '' } = $props<{
		status: ProjectStatus;
		class?: string;
	}>();
</script>

<span class={cn('tag lowercase', className)}>{getProjectStatusLabel(status)}</span>
