<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">CV</h1>
	<p class="text-muted-foreground">Latest CV export from configured remote release.</p>
</section>

{#if data.hasValidCvUrl}
	<div class="mt-8 border border-border p-6">
		<p class="text-sm text-muted-foreground">
			Last verified: {data.cv.lastVerified ?? 'Not specified'}
		</p>
		<Button
			class="mt-4"
			href={data.cv.cvPdfUrl}
			variant="outline"
			target="_blank"
			rel="noreferrer"
		>
			{data.cv.label ?? 'Download CV'}
		</Button>
	</div>
{:else}
	<div class="mt-8">
		<Alert.Root variant="destructive">
			<Alert.Title>Invalid CV URL</Alert.Title>
			<Alert.Description>
				CV URL missing or invalid in site config. Set `cv.cvPdfUrl` with a valid https URL.
			</Alert.Description>
		</Alert.Root>
	</div>
{/if}
