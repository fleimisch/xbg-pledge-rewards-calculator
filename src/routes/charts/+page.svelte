<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	// import { api } from '$lib/services/api';

	type CategoryData = {
		name: string;
		marketCap: number;
	};

	let chartCanvas: HTMLCanvasElement;
	let categories: CategoryData[] = [];
	let loading = true;
	let error = '';

	async function fetchCategoryData() {
		try {
			const data = await api.fetch<any>(
				'https://api.coingecko.com/api/v3/coins/categories',
				undefined,
				{
					enabled: true,
					duration: 60 * 60 * 1000, // 1 hour cache
					forceRefresh: false
				}
			);

			// Sort categories by market cap and take top 10
			categories = data
				.map((category: any) => ({
					name: category.name,
					marketCap: category.market_cap
				}))
				.sort((a: CategoryData, b: CategoryData) => b.marketCap - a.marketCap)
				.slice(0, 150);
		} catch (e) {
			error = 'Failed to fetch data. Please try again later.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function createChart(categories: CategoryData[]) {
		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels: categories.map((c) => c.name),
					datasets: [
						{
							label: 'Market Cap (USD)',
							data: categories.map((c) => c.marketCap),
							backgroundColor: 'rgba(75, 192, 192, 0.6)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1
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
						title: {
							display: true,
							text: 'Top 10 Crypto Categories by Market Cap',
							color: '#fff',
							font: {
								size: 16
							}
						},
						legend: {
							labels: {
								color: '#fff'
							}
						}
					},
					scales: {
						y: {
							ticks: {
								color: '#fff',
								callback: (value) => {
									return (
										'$' +
										value.toLocaleString('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 0
										})
									);
								}
							},
							grid: {
								color: 'rgba(255, 255, 255, 0.1)'
							}
						},
						x: {
							ticks: {
								color: '#fff'
							},
							grid: {
								color: 'rgba(255, 255, 255, 0.1)'
							}
						}
					}
				}
			});
		}
	}

	onMount(async () => {
		await fetchCategoryData();
		// Only create chart after data is fetched and component is mounted
		if (!loading && !error && categories.length > 0) {
			createChart(categories);
		}
	});
</script>

<div class="container mx-auto p-8">
	<h1 class="text-4xl font-bold mb-8 text-center text-white">Crypto Categories Market Cap</h1>

	{#if loading}
		<div class="text-center text-white">Loading...</div>
	{:else if error}
		<div class="text-center text-red-500">{error}</div>
	{:else}
		<div class="multiplierSetting p-6 rounded-lg" style="height: 400px">
			<canvas bind:this={chartCanvas}></canvas>
		</div>
	{/if}
</div> -->
