<script lang="ts">
	import { onMount } from 'svelte';
	let { open = $bindable(false), children } = $props<{
		open: boolean;
		children: () => unknown;
	}>();

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

{#if isMounted && open}
	<div
		class="fixed flex items-center justify-center flex-col h-screen w-full overflow-y-auto top-0 left-0 right-0 bottom-0 bg-black/80"
	>
		<div class="modal-inner flex flex-col justify-between items-center p-10 rounded-lg">
			<div>
				{@render children()}
			</div>
			<div class="actions">
				<button
					class="button mt-4 bg-white/10 px-6 py-2 rounded-lg text-white hover:bg-white/20"
					on:click={() => (open = false)}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-inner {
		background-color: #00000080;
		backdrop-filter: blur(5px);
		border: 1px solid #ffffff20;
	}
</style>
