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
					interaction: {
						intersect: false,
						mode: 'index'
					},
					plugins: {
						legend: {
							display: false,
							labels: {
								color: '#fff'
							}
						},
						tooltip: {
							mode: 'index',
							intersect: false,
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
								color: 'rgba(156, 163, 175, 0.5)',
								callback: function (tickValue: number | string) {
									return `${Number(tickValue).toFixed(0)} XBG`;
								}
							},
							grid: {
								color: '#222'
							}
						},
						x: {
							ticks: {
								color: 'rgba(156, 163, 175, 0.5)'
							},
							grid: {
								display: false,
								color: '#222'
							}
						}
					}
				}
			});
		}
	});
</script>

<div class="multiplierSetting p-6 rounded-lg" style="height: 400px">
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.05);
		border: 1px solid rgba(91, 91, 94, 0.25);
	}
</style>
