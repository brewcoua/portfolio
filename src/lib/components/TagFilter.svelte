<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Technology } from '$lib/content/types';

	let { technologies, selected = 'all', onSelect } = $props<{
		technologies: Technology[];
		selected?: string;
		onSelect: (value: string) => void;
	}>();
</script>

<div class="flex flex-wrap gap-2">
	<Button variant={selected === 'all' ? 'default' : 'outline'} size="sm" onclick={() => onSelect('all')}>
		All
	</Button>
	{#each technologies as technology}
		<Button
			variant={selected === technology.id ? 'default' : 'outline'}
			size="sm"
			onclick={() => onSelect(technology.id)}
		>
			{technology.label}
		</Button>
	{/each}
</div>
