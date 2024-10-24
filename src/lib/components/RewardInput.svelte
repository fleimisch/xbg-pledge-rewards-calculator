<script lang="ts">
	export let label: string;
	export let value: number;
	export let min: number = 0;
	export let max: number | undefined = undefined;
</script>

<div class="multiplierSetting p-6 rounded-lg">
	<label class="block mb-2">{label}</label>
	<input
		type="number"
		bind:value
		{min}
		{max}
		{...$$restProps}
		class="w-full multiplierInput text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
	/>
</div>

<style>
	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.15);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}

	.multiplierInput {
		background: hsla(240, 8%, 3%, 0.285);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}
</style>
