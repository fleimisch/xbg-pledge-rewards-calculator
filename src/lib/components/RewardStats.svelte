<script lang="ts">
	export let label: string;
	export let value: number;
	export let color: string = 'text-green-400';
	export let suffix: string = '%';
</script>

<div>
	<h3 class="text-lg font-semibold mb-2">{label}</h3>
	<p class="text-2xl {color}">{value ? value.toFixed(2) : '0.00'}{suffix}</p>
</div>
