<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let monthlyRewards: { month: number; reward: number; cumulative: number }[];

	let chartCanvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			new Chart(ctx, {
				type: 'line',
				data: {
					labels: monthlyRewards.map((r) => `Month ${r.month}`),
					datasets: [
						{
							label: 'Monthly Rewards',
							data: monthlyRewards.map((r) => r.cumulative),
							borderColor: 'rgb(255, 159, 64)',
							backgroundColor: 'rgba(255, 159, 64, 0.5)',
							tension: 0.1
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								color: '#fff'
							}
						},
						tooltip: {
							callbacks: {
								label: function (context) {
									return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} XBG`;
								}
							}
						}
					},
					scales: {
						y: {
							ticks: {
								color: '#fff',
								callback: function (tickValue: number | string) {
									return `${Number(tickValue).toFixed(0)} XBG`;
								}
							},
							grid: {
								color: '#444'
							}
						},
						x: {
							ticks: {
								color: '#fff'
							},
							grid: {
								color: '#444'
							}
						}
					}
				}
			});
		}
	});
</script>

<div class="bg-gray-800 p-6 rounded-lg" style="height: 400px">
	<canvas bind:this={chartCanvas}></canvas>
</div>
