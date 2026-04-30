<script lang="ts">
	let {
		value,
		inline = false,
		language
	}: {
		value: string;
		inline?: boolean;
		language?: string;
	} = $props();
</script>

{#if inline}
	<code>{value}</code>
{:else}
	<pre><code class={language ? `language-${language}` : undefined}>{value}</code></pre>
{/if}
