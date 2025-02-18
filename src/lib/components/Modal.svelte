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
		id="modal-overlay"
		class="fixed flex items-center justify-start md:justify-center flex-col h-screen w-full overflow-y-auto top-0 left-0 right-0 bottom-0 bg-black/80"
		on:click={(e: MouseEvent) => {
			if (e.target.id === 'modal-overlay') {
				open = false;
			}
		}}
	>
		<div
			class="modal-inner flex flex-col justify-between items-center p-10 rounded-lg md:max-w-screen-md mx-auto"
		>
			<div>
				{@render children()}
			</div>
			<div class="actions">
				<button
					class="button px-3 py-2 text-sm bg-red-900/40 hover:bg-red-900/30 border border-red-900 rounded-lg text-white"
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
