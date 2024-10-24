<script lang="ts">
	import RewardInput from '$lib/components/RewardInput.svelte';
	import RewardStats from '$lib/components/RewardStats.svelte';
	import RewardChart from '$lib/components/RewardChart.svelte';
	import { writable } from 'svelte/store';

	let REWARDS_POOL_LIMIT = 1_000_000; // 1M XBG tokens limit
	let totalStakedXBG = 94_000_000; // 50M XBG tokens staked by all users
	let currentXBGPrice = 0.25;
	let xbgAmount = 283000;
	let prometheusCount = 2;
	let chestplateCount = 1;
	let governanceVotes = 1;
	let seasonStreaks = 2;
	$: accumulateRewards = writable(true);

	// NFT bonuses
	$: prometheusBonus = prometheusCount * 0.2; // 20% per Prometheus
	$: chestplateBonus = chestplateCount * 0.025; // 2.5% per Chestplate
	// Governance and streak bonuses
	$: governanceBonus = governanceVotes > 0 ? 0.1 : 0; // 10% for voters
	$: streakBonus = Math.min(seasonStreaks * 0.05, 1.0); // 5% per season, capped at 100%

	// Calculate total multiplier (all bonuses are additive)
	$: totalMultiplier = 1 + prometheusBonus + chestplateBonus + governanceBonus + streakBonus;

	// Calculate total staked amount including multiplier
	$: effectiveStakedAmount = xbgAmount * totalMultiplier;

	// Calculate rewards with pool limit consideration
	$: poolShare = effectiveStakedAmount / totalStakedXBG;
	$: adjustedMonthlyReward = Math.min(
		effectiveStakedAmount,
		REWARDS_POOL_LIMIT * poolShare
	) as number;

	$: monthlyRewards = Array.from({ length: 12 }, (_, i) => {
		if ($accumulateRewards) {
			let cumulativeStaked = effectiveStakedAmount;
			let cumulativeReward = 0;
			for (let j = 0; j <= i; j++) {
				let monthlyReward = Math.min(
					cumulativeStaked,
					REWARDS_POOL_LIMIT * (cumulativeStaked / totalStakedXBG)
				);
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
		<h1 class="text-3xl font-bold mb-2" style="">XBorg Pledging Rewards Calculator</h1>
		<p class="text-gray-400 mb-8">Boost Your Rewards with NFTs and Voting</p>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<RewardInput id="xbg-amount" label="XBG Amount You Pledged" bind:value={xbgAmount} min={0} />
			<RewardInput
				id="prometheus-nfts"
				label="Number of Prometheus You Own"
				bind:value={prometheusCount}
				min={0}
			/>
			<RewardInput
				id="chestplate-nfts"
				label="Number of Chestplates You Own"
				bind:value={chestplateCount}
				min={0}
			/>
			<RewardInput
				id="governance-votes"
				label="Governance Votes"
				bind:value={governanceVotes}
				min={0}
				max={1}
			/>
			<RewardInput
				id="season-streaks"
				label="Season Streaks You Participated In"
				bind:value={seasonStreaks}
				min={0}
				max={20}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Total XBG Pledged (All Users)"
				bind:value={totalStakedXBG}
				min={0}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Current XBG Price"
				bind:value={currentXBGPrice}
				min={0}
			/>
			<RewardInput
				id="rewards-pool-limit"
				label="XBG Season Rewards Pool"
				bind:value={REWARDS_POOL_LIMIT}
				min={0}
			/>
			<label for="accumulate-rewards" class="flex items-center mt-4">
				<input
					type="checkbox"
					id="accumulate-rewards"
					bind:checked={$accumulateRewards}
					class="form-checkbox h-5 w-5 text-blue-600"
				/>
				<span class="ml-2 text-gray-400">Accumulate Monthly Rewards</span>
			</label>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				<RewardStats label="Prometheus Bonus" value={prometheusBonus * 100} />
				<RewardStats label="Chestplate Bonus" value={chestplateBonus * 100} />
				<RewardStats label="Governance Bonus" value={governanceBonus * 100} />
				<RewardStats label="Streak Bonus" value={streakBonus * 100} />
				<RewardStats label="Pool Utilization" value={poolUtilization} />
				<RewardStats label="Total Multiplier" value={totalMultiplier} suffix="" />
			</div>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<h3 class="font-semibold mb-2 text-sm text-gray-500">Summary</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 class="text-xl font-semibold mb-2">Total Pledged with Multipliers:</h3>
					<p class="text-2xl text-green-400">{effectiveStakedAmount.toFixed(2)} XBG</p>
				</div>
			</div>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<h3 class="text-xl font-semibold mb-2">Rewards Summary</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-gray-400">Monthly Rewards:</p>
					<p class="text-2xl text-yellow-400">
						~{Math.round(adjustedMonthlyReward)} XBG (~${Math.round(
							currentXBGPrice * Number(adjustedMonthlyReward.toFixed(2))
						).toFixed(2)})
					</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Annual Rewards:</p>
					<p class="text-2xl text-yellow-400">
						~{Math.round(monthlyRewards[monthlyRewards.length - 1].cumulative)} XBG (~${Math.round(
							currentXBGPrice * Number((adjustedMonthlyReward * 12).toFixed(2))
						).toFixed(2)})
					</p>
				</div>
			</div>
			<p class="text-sm text-gray-400 mt-2">
				Effective APY: {effectiveAPY.toFixed(2)}%
				{#if (xbgAmount * totalMultiplier) / 12 > adjustedMonthlyReward}
					<span class="text-orange-400 ml-2">(Limited by rewards pool)</span>
				{/if}
			</p>
			<p class="text-xs text-gray-500 mt-1">Pool Share: {(poolShare * 100).toFixed(4)}%</p>
		</div>

		{#key monthlyRewards}
			<RewardChart {monthlyRewards} />
		{/key}

		<p class="text-sm text-gray-400 mt-2">
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

<style>
	h1 {
		text-transform: uppercase;
	}
	#frame {
		background-color: #050505;
	}

	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.15);
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
