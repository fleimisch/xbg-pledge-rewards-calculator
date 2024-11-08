<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { device } from '$lib/stores/device';

	let { children } = $props();
	let isMounted = $state(false);

	onMount(async (): Promise<any> => {
		const cleanup = device.init();
		isMounted = true;
		inject();
		return cleanup;
	});
</script>

{#if isMounted}
	{@render children()}
{/if}

<style>
	:global(html, body) {
		overflow-x: hidden;
	}
</style>
