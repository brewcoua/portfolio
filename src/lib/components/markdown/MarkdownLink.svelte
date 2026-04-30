<script lang="ts">
	let {
		href,
		external = false,
		label
	}: { href: string; external?: boolean; label: string } = $props();
</script>

<a
	{href}
	class="mention-link"
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer noopener' : undefined}
>
	{label}
</a>
