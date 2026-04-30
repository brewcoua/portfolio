<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { getProjectStatusBadgeStyle, getProjectStatusLabel } from '$lib/content/presentation';
	import type { ProjectStatus } from '$lib/content/types';

	let { status, class: className = '' } = $props<{
		status: ProjectStatus;
		class?: string;
	}>();

	const style = $derived(getProjectStatusBadgeStyle(status));
</script>

<Badge variant="outline" class={cn('border font-medium capitalize', className)} style={style}>
	{getProjectStatusLabel(status)}
</Badge>
