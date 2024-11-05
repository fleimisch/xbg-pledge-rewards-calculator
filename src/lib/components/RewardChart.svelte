<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let monthlyRewards: any[] = [];
	let Chart: any;
	let chartCanvas: HTMLCanvasElement;

	onMount(async () => {
		if (browser) {
			// Only import Chart.js on the client side
			const chartModule = await import('chart.js/auto');
			Chart = chartModule.default;

			renderChart();
		}
	});

	function renderChart() {
		if (!Chart || !chartCanvas) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: monthlyRewards.map((r) => `Month ${r.month}`),
				datasets: [
					{
						label: 'Monthly Rewards',
						data: monthlyRewards.map((r) => r.reward),
						borderColor: '#FCD34D',
						tension: 0.1
					},
					{
						label: 'Cumulative Rewards',
						data: monthlyRewards.map((r) => r.cumulative),
						borderColor: '#34D399',
						tension: 0.1
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: '#9CA3AF'
						}
					},
					x: {
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: '#9CA3AF'
						}
					}
				},
				plugins: {
					legend: {
						labels: {
							color: '#9CA3AF'
						}
					}
				}
			}
		});
	}
</script>

<div class="chart-container">
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
		position: relative;
	}
</style>
