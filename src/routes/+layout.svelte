<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';

	let { children } = $props();
	onMount(async () => {
		inject();
	});
</script>

{@render children()}
