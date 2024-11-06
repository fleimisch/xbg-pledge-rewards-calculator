<script lang="ts">
	export let label: string = '';
	export let sublabel: string = '';
	export let value: number = 0;
	export let min: number = 0;
	export let max: number | undefined = undefined;
	export let link: string | undefined = undefined;
</script>

<div class="multiplierSetting p-4 pb-6 rounded-lg relative">
	<label class="block mb-2 text-sm">{label}</label>
	{#if !$$slots.default}
		<div class="flex">
			<input
				type="number"
				bind:value
				{min}
				{max}
				{...$$restProps}
				class="w-full multiplierInput text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			{#if link}
				<a href={link} target="_blank" class="button" title="See XBG Pledged Chart">Check</a>
			{/if}
		</div>
		{#if sublabel}
			<span
				class="block mb-1 text-xs text-gray-400 absolute bottom-0 left-0 right-0 text-center w-full line-height-1"
				>{sublabel}</span
			>
		{/if}
	{:else}
		<slot />
	{/if}
</div>

<style>
	label {
		min-height: 40px;
	}
	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.15);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}

	.multiplierInput {
		background: hsla(240, 8%, 3%, 0.285);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		font-size: 0.8rem;
		line-height: 1;
		background: hsla(240, 8%, 3%, 0.285);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}
	.button:hover {
		background: rgba(91, 91, 94, 0.55);
	}
</style>
