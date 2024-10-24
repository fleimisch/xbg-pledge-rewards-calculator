<script lang="ts">
	export let label: string;
	export let value: number;
	export let min: number = 0;
	export let max: number | undefined = undefined;
</script>

<div class="bg-gray-800 p-6 rounded-lg">
	<label class="block mb-2">{label}</label>
	<input
		type="number"
		bind:value
		{min}
		{max}
		{...$$restProps}
		class="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
	/>
</div>
