<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';
	import type { Experience } from '$lib/content/types';

	let { experience } = $props<{ experience: Experience }>();
</script>

<Card.Root>
	<Card.Header class="space-y-2">
		<div class="flex flex-wrap items-start justify-between gap-2">
			<div>
				<Card.Title class="text-xl">
					<a class="hover:text-primary" href={`/experience/${experience.slug}`}>{experience.title}</a>
				</Card.Title>
				<Card.Description>{experience.organization}</Card.Description>
			</div>
			<p class="text-sm text-muted-foreground">{formatEntityDate(experience)}</p>
		</div>
		<Badge variant="outline" class="w-fit">{experience.employmentType}</Badge>
	</Card.Header>
	<Card.Content>
		<p class="text-sm">{experience.summary}</p>
	</Card.Content>
</Card.Root>
