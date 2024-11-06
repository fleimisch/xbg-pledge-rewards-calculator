<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { device } from '$lib/stores/device';

	export let data: PageData;

	interface NFTInfo {
		tokenId: number;
		currentHolder: string;
		acquisitionTimestamp: number;
		diamonds?: number;
	}

	let nfts: NFTInfo[] = [];
	let searchTerm = '';
	let cutoffDate = '2024-11-11';

	const MAX_DIAMONDS = 10;

	// Instead, create a function to get the cutoff timestamp
	function getCutoffTimestamp(): number {
		return new Date(cutoffDate).getTime();
	}

	function calculateDiamonds(acquisitionTimestamp: number, address: string): number {
		const currentTime = Date.now();
		acquisitionTimestamp = acquisitionTimestamp * 1000;
		const cutoffTimestamp = getCutoffTimestamp();

		if (acquisitionTimestamp > cutoffTimestamp) {
			const holdingPeriodInMilliseconds = currentTime - acquisitionTimestamp;
			const formattedCurrentTime = new Date(currentTime);
			const formattedAcquisitionTime = new Date(acquisitionTimestamp);
			const holdingPeriodInDays = Math.floor(
				(formattedCurrentTime.getTime() - formattedAcquisitionTime.getTime()) /
					(24 * 60 * 60 * 1000)
			);
			console.log(formattedCurrentTime, formattedAcquisitionTime, holdingPeriodInDays);
			const diamonds = Math.floor(holdingPeriodInDays / 30);
			return Math.min(diamonds + 1, MAX_DIAMONDS);
		} else {
			return MAX_DIAMONDS;
		}
	}

	// Load and calculate diamonds once on mount
	onMount(() => {
		if (data.nfts) {
			nfts = data.nfts.map((nft: any) => ({
				...nft,
				diamonds: calculateDiamonds(nft.acquisitionTimestamp, nft.currentHolder)
			}));
		}
	});

	$: filteredNFTs = searchTerm
		? nfts.filter((nft) => {
				// If search term is a number and up to 4 digits, search by token ID
				if (/^\d{1,4}$/.test(searchTerm)) {
					return nft.tokenId.toString() === searchTerm;
				}
				// Otherwise, search by holder address
				return nft.currentHolder.toLowerCase().includes(searchTerm.toLowerCase());
			})
		: nfts;

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString();
	}

	function getDiamondEmojis(count: number): string {
		return '💎' + count;
	}

	// This reactive statement recalculates diamonds whenever cutoffDate changes
	$: if (cutoffDate && nfts.length > 0) {
		nfts = nfts.map((nft) => ({
			...nft,
			diamonds: calculateDiamonds(nft.acquisitionTimestamp, nft.currentHolder)
		}));
	}
</script>

<div id="frame" class="min-h-screen text-white p-8 relative" style="overflow-x: hidden;">
	<div class="beam">
		<div class="header__beam" style="filter: blur(100px);position: relative;">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 196 1122" fill="none">
				<ellipse cx="98" cy="561" rx="98" ry="561" fill="url(#paint0_linear_2401_533)"></ellipse>
				<defs>
					<linearGradient
						id="paint0_linear_2401_533"
						x1="98"
						y1="0"
						x2="98"
						y2="1122"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#D9D9D9"></stop>
						<stop offset="1" stop-opacity="0"></stop>
					</linearGradient>
				</defs>
			</svg>
		</div>
	</div>

	<div class="max-w-4xl mx-auto" style="z-index: 2;">
		<h1 class="page-title md:text-6xl lg:text-7xl text-5xl font-bold mb-7 mx-auto">
			<small>XBorg</small>Diamond Program
		</h1>
		<p class="text-gray-400 mb-4 mx-auto text-center">
			Prometheus NFT Diamond Status
			<a href="#diamond-rules" class="text-blue-400 hover:text-blue-300">(Diamond Program Rules)</a>
		</p>
		<p class="text-gray-700 mb-5 mx-auto text-center text-sm">* Data is refreshed every 12 hours</p>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<div class="mb-4 flex gap-4 flex-col md:flex-row">
				<input
					type="text"
					placeholder="Search by wallet address or token ID..."
					class="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
					bind:value={searchTerm}
				/>
				<div class="flex items-center gap-2">
					<label class="text-sm text-gray-400">Cutoff Test:</label>
					<input
						type="date"
						bind:value={cutoffDate}
						class="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
					/>
				</div>
			</div>

			{#if nfts.length === 0}
				<div class="text-center text-gray-400 py-8">Loading Prometheus data...</div>
			{:else if data.error}
				<div class="text-center text-red-400 py-8">{data.error}</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full" style={$device.isMobile ? 'zoom:0.8' : ''}>
						<thead>
							<tr class="text-left text-gray-400">
								<th class="p-2 whitespace-nowrap">Token ID</th>
								<th class="p-2 whitespace-nowrap">Current Holder</th>
								<th class="p-2 text-center whitespace-nowrap">Acquired</th>
								<th class="p-2 text-center whitespace-nowrap">Diamonds</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredNFTs as nft}
								<tr class="border-t border-gray-800">
									<td class="p-2 whitespace-nowrap">#{nft.tokenId}</td>
									<td class="p-2 whitespace-nowrap">
										<a
											href={`https://etherscan.io/address/${nft.currentHolder}`}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-400 hover:text-blue-300"
										>
											{nft.currentHolder}
										</a>
									</td>
									<td class="p-2 text-center whitespace-nowrap">
										{formatDate(nft.acquisitionTimestamp)}
									</td>
									<td class="p-2 text-center whitespace-nowrap">
										<div class="flex items-center gap-1 justify-center">
											{getDiamondEmojis(nft.diamonds ?? 0)}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="mt-4 text-sm text-gray-400">
					Total NFTs: {nfts.length}
				</div>
			{/if}
		</div>

		<div class="text-sm text-gray-400 mt-4" id="diamond-rules">
			<span>Diamond Rules:</span>
			<ul class="list-disc ml-6 mt-2">
				<li>Holders before Nov 11, 2024 receive 10 diamonds</li>
				<li>New holders earn +1 diamond per month of holding</li>
				<li>Maximum 10 diamonds per Prometheus NFT</li>
				<li>Selling/moving Prometheus NFT resets diamonds</li>
			</ul>
		</div>
	</div>
</div>

<style>
	#nebula-element {
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		pointer-events: none;
	}
	.page-title {
		display: block;
		width: 100%;
		text-align: center;
		text-transform: uppercase;
		font-family: var(--font-soehne-breit);
		font-weight: 800;
		letter-spacing: -0.848px;
		text-transform: uppercase;
		max-width: 480px;
		text-align: center;
		background: linear-gradient(92deg, #fff 45.37%, #696969);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.page-title small {
		display: block;
		font-size: 24px;
		line-height: 26px;
		margin-bottom: 1em;
	}

	h1 {
		text-transform: uppercase;
	}
	#frame {
		background-color: #050505;
	}

	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.05);
		border: 1px solid rgba(91, 91, 94, 0.25);
	}

	.beam {
		z-index: 1;
		position: fixed;
		inset: auto auto 10% 30%;
		transform: rotate(-45deg);
		top: -500px;
		left: 20%;
		pointer-events: none;
		opacity: 0.35;
	}
</style>
