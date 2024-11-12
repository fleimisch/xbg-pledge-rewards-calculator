<script lang="ts">
	import { onMount } from 'svelte';

	export let size = 32;
	export let className = '';
	export let delay = true;
	export let transparent = false;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
</script>

{#if isMounted}
	<div class="cLoad_spin {className}" style={`width:${size}px;height:${size}px`} class:transparent>
		<div class="inlineLoad p-r" class:instant={!delay} style={`width:${size}px;height:${size}px`} />
	</div>
{/if}

<style>
	.inlineLoad:before {
		left: 0 !important;
		right: auto !important;
		top: 0 !important;
		width: 100% !important;
		height: 100% !important;
	}
	.transparent .inlineLoad:before {
		background: none !important;
	}
	.inlineLoad:after {
		top: 0 !important;
		left: 0 !important;
		right: auto !important;
		width: 100% !important;
		height: 100% !important;
	}
	:global(.inlineLoad.instant::before, .inlineLoad.instant::after) {
		animation-delay: 0.01s !important;
		-webkit-animation-delay: 0.01s !important;
	}
</style>
