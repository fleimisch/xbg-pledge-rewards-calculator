<script lang="ts">
	import Xborg from '../lib/components/elements/Xborg.svelte';
	import RewardInput from '$lib/components/RewardInput.svelte';
	// import RewardInputWallet from '$lib/components/RewardInputWallet.svelte';
	import RewardStats from '$lib/components/RewardStats.svelte';
	import RewardChart from '$lib/components/RewardChart.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Storage from '$lib/services/storage';

	const storage = new Storage();

	let boostModalOpen = false;

	let REWARDS_POOL_LIMIT = 1_000_000; // 1M XBG tokens limit
	let totalStakedXBG = 75_000_000; // 50M XBG tokens staked by all users
	let currentXBGPrice = storage.getCookie('currentXBGPrice') ?? 0.25;
	let xbgAmount = storage.getCookie('xbgAmount') ?? 100000;
	let prometheusCount = storage.getCookie('prometheusCount') ?? 1;
	let chestplateCount = storage.getCookie('chestplateCount') ?? 1;
	let partnerNFTBelow1000Count = storage.getCookie('partnerNFTBelow1000Count') ?? 0;
	let partnerNFTAbove1000Count = storage.getCookie('partnerNFTAbove1000Count') ?? 0;
	let governanceVotes =
		storage.getCookie('governanceVotes') !== null
			? storage.getCookie('governanceVotes') === 'true'
				? true
				: false
			: true;
	let seasonStreaks = storage.getCookie('seasonStreaks') ?? 3;
	$: accumulateRewards = true;

	let myBlueReward = storage.getCookie('myBlueReward') ?? false;

	// NFT bonuses
	$: prometheusBonus = prometheusCount * 0.2; // 20% per Prometheus
	$: chestplateBonus = chestplateCount * 0.025; // 2.5% per Chestplate
	$: partnerNFTBelow1000 = partnerNFTBelow1000Count * 0.05; // 5% per Chestplate cappted at 20%
	$: if (partnerNFTBelow1000 > 0.2) partnerNFTBelow1000 = 0.2;
	$: partnerNFTAbove1000 = partnerNFTAbove1000Count * 0.1; // 10% per Chestplate cappted at 50%
	$: if (partnerNFTAbove1000 > 0.5) partnerNFTAbove1000 = 0.5;
	// Governance and streak bonuses
	$: governanceBonus = governanceVotes ? 0.1 : 0; // 10% for voters
	$: streakBonus = Math.min(seasonStreaks * 0.05 - 0.05, 1.0); // 5% per season, capped at 100%
	$: if (streakBonus < 0) streakBonus = 0;

	$: myBlueRewardBonus = myBlueReward ? 0.25 : 0; // 25% for myBlueReward

	$: {
		storage.setCookie('xbgAmount', xbgAmount.toString(), 60 * 60 * 24 * 30);
		storage.setCookie('currentXBGPrice', currentXBGPrice.toString(), 60 * 60 * 24 * 30);
		storage.setCookie('prometheusCount', prometheusCount.toString(), 60 * 60 * 24 * 30);
		storage.setCookie('chestplateCount', chestplateCount.toString(), 60 * 60 * 24 * 30);
		storage.setCookie(
			'partnerNFTBelow1000Count',
			partnerNFTBelow1000Count.toString(),
			60 * 60 * 24 * 30
		);
		storage.setCookie(
			'partnerNFTAbove1000Count',
			partnerNFTAbove1000Count.toString(),
			60 * 60 * 24 * 30
		);
		storage.setCookie('seasonStreaks', seasonStreaks.toString(), 60 * 60 * 24 * 30);
		storage.setCookie('governanceVotes', governanceVotes.toString(), 60 * 60 * 24 * 30);
		storage.setCookie('myBlueReward', myBlueReward.toString(), 60 * 60 * 24 * 30);
	}

	// Calculate total multiplier (all bonuses are additive)
	$: totalMultiplier =
		1 +
		prometheusBonus +
		chestplateBonus +
		governanceBonus +
		streakBonus +
		partnerNFTBelow1000 +
		partnerNFTAbove1000 +
		myBlueRewardBonus;
	// Calculate total staked amount including multiplier
	$: effectiveStakedAmount = xbgAmount * totalMultiplier;

	// Calculate rewards with pool limit consideration
	$: poolShare = effectiveStakedAmount / REWARDS_POOL_LIMIT / 100;
	$: adjustedMonthlyReward = REWARDS_POOL_LIMIT * poolShare;
	// $: console.log(poolShare, effectiveStakedAmount, REWARDS_POOL_LIMIT);

	$: monthlyRewards = Array.from({ length: 12 }, (_, i) => {
		if (accumulateRewards) {
			let cumulativeStaked = effectiveStakedAmount;
			let cumulativeReward = 0;
			for (let j = 0; j <= i; j++) {
				let monthlyReward = REWARDS_POOL_LIMIT * (cumulativeStaked / REWARDS_POOL_LIMIT / 100);
				cumulativeReward += monthlyReward;
				cumulativeStaked += monthlyReward;
			}
			return {
				month: i + 1,
				reward: cumulativeReward / (i + 1),
				cumulative: cumulativeReward
			};
		} else {
			return {
				month: i + 1,
				reward: adjustedMonthlyReward,
				cumulative: adjustedMonthlyReward * (i + 1)
			};
		}
	});

	$: effectiveAPY = ((adjustedMonthlyReward * 12) / xbgAmount) * 100;
	$: poolUtilization = (totalStakedXBG / REWARDS_POOL_LIMIT) * 100;

	onMount(async () => {});

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	});
</script>

<div id="frame" class="min-h-screen text-white p-8 relative" style="overflow-x: hidden;">
	<div class="beam">
		<div class="header__beam" style="filter: blur(100px);position: relative;">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 196 1122" fill="none"
				><ellipse cx="98" cy="561" rx="98" ry="561" fill="url(#paint0_linear_2401_533)"
				></ellipse><defs
					><linearGradient
						id="paint0_linear_2401_533"
						x1="98"
						y1="0"
						x2="98"
						y2="1122"
						gradientUnits="userSpaceOnUse"
						><stop stop-color="#D9D9D9"></stop><stop offset="1" stop-opacity="0"
						></stop></linearGradient
					></defs
				></svg
			>
		</div>
	</div>
	<div class="max-w-4xl mx-auto" style="z-index: 2;">
		<h1 class="page-title md:text-6xl lg:text-7xl text-5xl font-bold mb-7 mx-auto" style="">
			<small>XBorg Pledge</small>Rewards Calculator
		</h1>
		<p class="text-gray-400 mb-4 mx-auto text-center">Boost Your Rewards with NFTs and Voting</p>
		<button
			class="flex items-center gap-2 mx-auto mb-9 mt-2 align-self-center button bg-white/10 px-6 py-2 rounded-lg text-white hover:bg-white/20"
			on:click={() => (boostModalOpen = true)}
		>
			<Xborg size={19} /> Boost Overview
		</button>

		<!-- <div class="grid grid-cols-1 gap-6 mb-8">
			<RewardInputWallet label="Your Wallet Address" />
		</div> -->

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<RewardInput id="xbg-amount" label="XBG Amount You Pledged" bind:value={xbgAmount} min={0} />
			<RewardInput
				id="prometheus-nfts"
				label="Number of Prometheuses You Own"
				bind:value={prometheusCount}
				min={0}
				step={1}
			/>
			<RewardInput
				id="chestplate-nfts"
				label="Number of Chestplates You Own"
				bind:value={chestplateCount}
				min={0}
				step={1}
			/>
			<RewardInput
				id="partner-nfts-below-1000"
				label="Number of Partner NFTs <$1000 FP"
				sublabel="Worth less than $1000 each"
				bind:value={partnerNFTBelow1000Count}
				min={0}
				step={1}
			/>
			<RewardInput
				id="partner-nfts-above-1000"
				label="Number of Partner NFTs >$1000 FP"
				sublabel="Worth more than $1000 each"
				bind:value={partnerNFTAbove1000Count}
				min={0}
				step={1}
			/>
			<!-- <RewardInput
				id="governance-votes"
				label="Governance Votes"
				bind:value={governanceVotes}
				min={0}
				max={1}
			/> -->
			<RewardInput
				id="season-streaks"
				label="Season Streaks You Participated In"
				bind:value={seasonStreaks}
				min={0}
				max={20}
				step={1}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Total XBG Pledged (Current Season)"
				link="https://xbg.xborg.com/analytics"
				bind:value={totalStakedXBG}
				min={0}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Current XBG Price (in $)"
				bind:value={currentXBGPrice}
				min={0}
			/>
			<!-- <RewardInput
				id="rewards-pool-limit"
				label="XBG Season Rewards Pool"
				bind:value={REWARDS_POOL_LIMIT}
				min={0}
			/> -->

			<RewardInput className="flex flex-col gap-1 justify-center select-none">
				<label for="governanceVotes" class="flex items-center">
					<input
						type="checkbox"
						id="governanceVotes"
						bind:checked={governanceVotes}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">Governance Voter</span>
				</label>
				<label for="myblueReward" class="flex items-center">
					<input
						type="checkbox"
						id="myblueReward"
						bind:checked={myBlueReward}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">MyBlue Bonus</span>
				</label>
				<label for="accumulate-rewards" class="flex items-center">
					<input
						type="checkbox"
						id="accumulate-rewards"
						bind:checked={accumulateRewards}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">Accumulate Rewards</span>
				</label>
			</RewardInput>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
				<RewardStats label="Prometheus Bonus" value={prometheusBonus * 100} />
				<RewardStats label="Chestplate Bonus" value={chestplateBonus * 100} />
				<RewardStats
					label="Partner NFTs Bonus"
					value={(partnerNFTBelow1000 + partnerNFTAbove1000) * 100}
				/>
				<RewardStats label="Governance Bonus" value={governanceBonus * 100} />
				<RewardStats label="Streak Bonus" value={streakBonus * 100} />
				<RewardStats label="Seasonal Rewards Pool" value="{REWARDS_POOL_LIMIT} XBG" suffix="" />
				<RewardStats label="Additional Multipliers" value={myBlueRewardBonus * 100} />
				<RewardStats label="Total Multiplier" value={totalMultiplier} suffix="" />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-1 gap-4 border-t border-gray-600 pt-4">
				<div>
					<h3 class="text-sm text-gray-500 font-semibold mb-2">
						Your Total Pledge Amount Including Multipliers:
					</h3>
					<p class="text-2xl text-green-400">{effectiveStakedAmount.toFixed(2)} XBG</p>
				</div>
			</div>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<h3 class="text-xl font-semibold mb-2">Rewards Summary</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-gray-400">Seasonal Rewards (Monthly):</p>
					<p class="text-2xl text-yellow-400">
						{Math.round(adjustedMonthlyReward)} XBG
						<span class="text-lg"
							>(~${Math.round(currentXBGPrice * Number(adjustedMonthlyReward.toFixed(2))).toFixed(
								2
							)})</span
						>
					</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Annual Rewards:</p>
					<p class="text-2xl text-yellow-400">
						{Math.round(monthlyRewards[monthlyRewards.length - 1].cumulative)} XBG
						<span class="text-lg"
							>(~${Math.round(
								currentXBGPrice *
									Number(monthlyRewards[monthlyRewards.length - 1].cumulative.toFixed(2))
							).toFixed(2)})</span
						>
					</p>
				</div>
			</div>
			<p class="text-sm text-gray-300 mt-2 font-bold">
				Effective APY: {effectiveAPY.toFixed(2)}%
				<!-- {#if (xbgAmount * totalMultiplier) / 12 > adjustedMonthlyReward}
					<span class="text-orange-400 ml-2">(Limited by rewards pool)</span>
				{/if} -->
				<!-- <RewardStats label="Pool Utilization" value={poolUtilization} /> -->
			</p>
			<p class="text-xs text-gray-300 mt-1">
				Pool Share: {(poolShare * 100).toFixed(4)}% | Pool Utilization: {poolUtilization}%
			</p>
		</div>

		{#key monthlyRewards}
			<RewardChart {monthlyRewards} />
		{/key}

		<p class="text-sm text-gray-400 mt-4">
			Disclaimer: The numbers and calculations provided by the XBG Pledge Rewards Calculator are for
			informational purposes only. While we strive to ensure the accuracy of the data, the results
			generated by this tool may vary from the actual rewards during the current or upcoming
			seasons. Actual rewards may be influenced by a variety of factors that are beyond our control.
			Please consult official sources for the most up-to-date information regarding rewards. We
			cannot guarantee the accuracy or completeness of the calculations provided by this tool.
		</p>

		<p class="text-sm text-gray-400 mt-2">
			Developed by <a class="text-blue-200" href="https://x.com/apeinzoo" target="_blank"
				>Apeinzoo</a
			>
			&
			<a class="text-blue-200" href="https://x.com/April_Zoe_AZ" target="_blank">April Zoe</a>
		</p>
	</div>
</div>

<Modal bind:open={boostModalOpen}>
	<h1>Boost Overview</h1>

	<section>
		<h2>XBorg NFT Boosts</h2>
		<ul>
			<li>Boosts stack per NFT and are not capped</li>
			<li>The Prometheus NFT grants a 20% boost</li>
			<li>The Prometheus Chestplate grants a 2.5% boost</li>
		</ul>
	</section>

	<section>
		<h2>Partner NFTs</h2>
		<ul>
			<li><span class="text-white">&gt;$1,000 FP</span>: 10% boost per NFT (cap at 50%)</li>
			<li><span class="text-white">&lt;$1,000 FP</span>: 5% boost per NFT (cap at 20%)</li>
		</ul>
	</section>

	<section class="flex flex-wrap gap-2 text-sm text-gray-400">
		<a href="https://x.com/OverworldPlay" class="underline" target="_blank">@OverworldPlay</a>
		<a href="https://x.com/GAM3Sgg_" class="underline" target="_blank">@GAM3Sgg_</a>
		<a href="https://x.com/Overlord_xyz" class="underline" target="_blank">@Overlord_xyz</a>
		<a href="https://x.com/aiarena_" class="underline" target="_blank">@aiarena_</a>
		<a href="https://x.com/LizLabsio" class="underline" target="_blank">@LizLabsio</a>
		<a href="https://x.com/L3E7_Official" class="underline" target="_blank">@L3E7_Official</a>
		<a href="https://x.com/todaythegame" class="underline" target="_blank">@todaythegame</a>
		<a href="https://x.com/NeoTokyoCode" class="underline" target="_blank">@NeoTokyoCode</a>
		<a href="https://x.com/Revolving_Games" class="underline" target="_blank">@Revolving_Games</a>
		<a href="https://x.com/JirasanOfficial" class="underline" target="_blank">@JirasanOfficial</a>
		<a href="https://x.com/Azuki" class="underline" target="_blank">@Azuki</a>
		<a href="https://x.com/pudgypenguins" class="underline" target="_blank">@pudgypenguins</a>
		<a href="https://x.com/PirateNation" class="underline" target="_blank">@PirateNation</a>

		<div class="block w-full text-left mt-2 flex-break text-blue-500">
			<a href="https://x.com/XBorgHQ" class="" target="_blank">Check on X for latest partner NFTs</a
			>
		</div>
	</section>

	<section>
		<h2>Governance Voter</h2>
		<ul>
			<li>10% boost for being an active voter</li>
		</ul>
	</section>

	<section>
		<h2>Season Streaks</h2>
		<ul>
			<li>5% per consecutive season (capped at 100%)</li>
		</ul>
	</section>

	<section>
		<h2>In-App Activity</h2>
		<p>To be announced... 👀</p>
	</section>
</Modal>

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
		/* font-size: 72px;
		line-height: 65px; */
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
		position: absolute;
		inset: auto auto 10% 30%;
		transform: rotate(-45deg);
		top: -500px;
		left: 60%;
		pointer-events: none;
		opacity: 0.35;
	}
</style>
