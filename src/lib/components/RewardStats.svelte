<script lang="ts">
	export let label: string;
	export let value: number;
	export let color: string = 'text-white-400';
	export let suffix: string = '%';
</script>

<div>
	<h3 class="text-sm text-gray-500 font-semibold mb-2">{label}</h3>
	<p class="text-2xl {color}">{value ? value.toFixed(2) : '0.00'}{suffix}</p>
</div>
