<script lang="ts">
	import Xborg from '$lib/components/elements/Xborg.svelte';
	import RewardInput from '$lib/components/RewardInput.svelte';
	import RewardStats from '$lib/components/RewardStats.svelte';
	import RewardChart from '$lib/components/RewardChart.svelte';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Storage from '$lib/services/storage';

	class RewardsCalculator {
		static readonly REWARDS_POOL_LIMIT = 1_000_000; // 1M XBG tokens limit
		static readonly FALLBACK_TOTAL_STAKED = 75_000_000; // Fallback value if no data available
		DEFAULT_TOTAL_STAKED = RewardsCalculator.FALLBACK_TOTAL_STAKED;

		seasonNumber = 4;
		rewardsReducer = 0;
		totalPledgedWithMultipliersData:{entries:any[], total_entries:number} = $state({entries:[], total_entries:0});
		totalPledgedWithMultipliers = $state(0);
		totalPledgedWithoutMultipliers = $state(0);

		storage = new Storage();
		boostModalOpen = $state(false);
		cookieExpiry = 60 * 60 * 24 * 28; // 28 days

		// State variables
		xbgAmount = $state(+this.storage.getCookie('xbgAmount') || 100000);
		currentXBGPrice = $state(+this.storage.getCookie('currentXBGPrice') || 0.25);
		prometheusCount = $state(+this.storage.getCookie('prometheusCount') || 1);
		chestplateCount = $state(+this.storage.getCookie('chestplateCount') || 1);
		governanceVotes = $state(
			+this.storage.getCookie('governanceVotes') || 0
		);
		seasonStreaks = $state(+this.storage.getCookie('seasonStreaks') || this.seasonNumber);
		accumulateRewards = $state(true);
		totalStakedXBG = $state(
			this.DEFAULT_TOTAL_STAKED
		);
		communityAppTier = $state(this.storage.getCookie('communityAppTier') || 'remaining');
		seasonLeaderboardTier = $state(this.storage.getCookie('seasonLeaderboardTier') || 'remaining');

		// Computed values using $derived
		prometheusBonus = $derived(this.prometheusCount * 0.2);
		chestplateBonus = $derived(this.chestplateCount * 0.025);
		governanceBonus = $derived(
			this.governanceVotes >= 5 ? 0.20 : // 20% for 5+ votes
			this.governanceVotes >= 4 ? 0.15 : // 15% for 4-5 votes
			this.governanceVotes >= 2 ? 0.10 : // 10% for 2-3 votes
			this.governanceVotes >= 1 ? 0.05 : // 5% for 1 vote
			0
		);
		pledgeIncreaseBonus = $derived(
			this.xbgAmount >= 100_000 ? 0.30 : // 30% for 100k+ XBG
			this.xbgAmount >= 50_000 ? 0.20 : // 20% for 50k+ XBG
			this.xbgAmount >= 10_000 ? 0.05 : // 5% for 10k+ XBG
			0
		);
		communityAppBonus = $derived(
			this.communityAppTier === 'top1' ? 0.30 :
			this.communityAppTier === 'top2.5' ? 0.25 :
			this.communityAppTier === 'top5' ? 0.20 :
			this.communityAppTier === 'top10' ? 0.15 :
			this.communityAppTier === 'top25' ? 0.10 :
			this.communityAppTier === 'top50' ? 0.05 :
			0.025 // remaining
		);
		seasonLeaderboardBonus = $derived(
			this.seasonLeaderboardTier === 'top1' ? 0.30 :    // Top 1% (1-10)
			this.seasonLeaderboardTier === 'top2.5' ? 0.25 :  // Top 2.5% (11-25)
			this.seasonLeaderboardTier === 'top5' ? 0.20 :    // Top 5% (26-50)
			this.seasonLeaderboardTier === 'top10' ? 0.15 :   // Top 10% (51-100)
			this.seasonLeaderboardTier === 'top25' ? 0.10 :   // Top 25% (101-250)
			this.seasonLeaderboardTier === 'top50' ? 0.05 :   // Top 50% (251-500)
			0.025                                             // Remaining
		);
		streakBonus = $derived(Math.min(this.seasonStreaks * 0.05, 1.0)); // Cap at 100% (1.0)

		totalMultiplier = $derived(
			1 +
				this.prometheusBonus +
				this.chestplateBonus +
				this.governanceBonus +
				this.streakBonus +
				this.communityAppBonus +
				this.seasonLeaderboardBonus +
				this.pledgeIncreaseBonus
		);

		effectiveStakedAmount = $derived(this.xbgAmount * this.totalMultiplier * this.season5Special());
		poolShare = $derived(this.effectiveStakedAmount / (this.totalPledgedWithMultipliers || this.totalStakedXBG));
		adjustedMonthlyReward = $derived(RewardsCalculator.REWARDS_POOL_LIMIT * this.poolShare * (1 - this.rewardsReducer));
		effectiveAPY = $derived(((this.adjustedMonthlyReward * 12) / this.xbgAmount) * 100);
		poolUtilization = $derived((this.totalPledgedWithMultipliers / RewardsCalculator.REWARDS_POOL_LIMIT) * 100);
		holderScore = $derived(Math.sqrt(this.xbgAmount) * this.totalMultiplier);

		monthlyRewards = $derived(this.calculateMonthlyRewards());

		initialize() {
			this.setupStorageSync();
			this.clearIrrelevantCookies();
			this.fetchLeaderboardData();
			console.log(
				'%csrc\routes\rewards+page.svelte:75 this.xbgAmount * this.totalMultiplier * this.season5Special()',
				'color: #007acc;',
				this.monthlyRewards
			);
		}

		async fetchLeaderboardData() {
			try {
				const response = await fetch('/api/xborg?key=leaderboard');
				if (!response.ok) {
					throw new Error('Failed to fetch leaderboard data');
				}
				const { data } = await response.json();
				if (data && Array.isArray(data?.entries)) {
					this.totalPledgedWithMultipliersData = data;
					this.totalPledgedWithMultipliers = this.totalPledgedWithMultipliersData.entries.reduce((acc, entry) => acc + (entry.pledge_amount * entry.multiplier), 0);
					this.totalPledgedWithoutMultipliers = this.totalPledgedWithMultipliersData.entries.reduce((acc, entry) => acc + (entry.pledge_amount), 0);
					
					// Update DEFAULT_TOTAL_STAKED and totalStakedXBG based on the fetched data
					this.DEFAULT_TOTAL_STAKED = this.totalPledgedWithoutMultipliers || RewardsCalculator.FALLBACK_TOTAL_STAKED;
					this.totalStakedXBG = this.DEFAULT_TOTAL_STAKED;
				}
			} catch (error) {
				console.error('Error fetching leaderboard data:', error);
				// In case of error, ensure we use the fallback value
				this.DEFAULT_TOTAL_STAKED = RewardsCalculator.FALLBACK_TOTAL_STAKED;
				this.totalStakedXBG = this.DEFAULT_TOTAL_STAKED;
			}
		}

		season5Special() {
			// no rewards for not having governance votes
			if (this.governanceVotes < 1) {
				return 1;
			} else {
				return 1;
			}
		}

		private calculateMonthlyRewards() {
			return Array.from({ length: 12 }, (_, i) => {
				if (this.accumulateRewards) {
					let cumulativeStaked = this.effectiveStakedAmount;
					let cumulativeReward = 0;
					for (let j = 0; j <= i; j++) {
						let monthlyReward =
							RewardsCalculator.REWARDS_POOL_LIMIT * (cumulativeStaked / (this.totalPledgedWithMultipliers || this.totalStakedXBG)) * (1 - this.rewardsReducer);
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
						reward: this.adjustedMonthlyReward,
						cumulative: this.adjustedMonthlyReward * (i + 1)
					};
				}
			});
		}

		private setupStorageSync() {
			$effect(() => {
				this.storage.setCookie('xbgAmount', this.xbgAmount.toString(), this.cookieExpiry);
				this.storage.setCookie(
					'currentXBGPrice',
					this.currentXBGPrice.toString(),
					this.cookieExpiry
				);
				this.storage.setCookie(
					'prometheusCount',
					this.prometheusCount.toString(),
					this.cookieExpiry
				);
				this.storage.setCookie(
					'chestplateCount',
					this.chestplateCount.toString(),
					this.cookieExpiry
				);
				this.storage.setCookie('seasonStreaks', this.seasonStreaks.toString(), this.cookieExpiry);
				this.storage.setCookie(
					'governanceVotes',
					this.governanceVotes.toString(),
					this.cookieExpiry
				);
				this.storage.setCookie('communityAppTier', this.communityAppTier, this.cookieExpiry);
				this.storage.setCookie('seasonLeaderboardTier', this.seasonLeaderboardTier, this.cookieExpiry);
				this.storage.setCookie('totalStakedXBG', this.totalStakedXBG.toString(), this.cookieExpiry);
			});
		}

		private clearIrrelevantCookies() {
			this.storage.deleteCookie('partnerNFTBelow1000Count');
			this.storage.deleteCookie('partnerNFTAbove1000Count');
			// if (+this.storage.getCookie('seasonStreaks') === this.seasonNumber - 1) {
			// 	this.storage.deleteCookie('seasonStreaks');
			// 	this.seasonStreaks = this.seasonNumber;
			// 	this.storage.setCookie('seasonStreaks', this.seasonStreaks.toString(), this.cookieExpiry);
			// }
		}
	}

	const calculator = new RewardsCalculator();
	onMount(() => calculator.initialize());
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
			class="flex items-center gap-2 mx-auto mb-10 mt-2 align-self-center button bg-white/10 px-6 py-2 rounded-lg text-white hover:bg-white/20"
			on:click={() => (calculator.boostModalOpen = true)}
		>
			<Xborg size={19} /> Boost Overview
		</button>

		<!-- <div class="grid grid-cols-1 gap-6 mb-8">
			<RewardInputWallet label="Your Wallet Address" />
		</div> -->

		<div
			class="text-1xl font-bold mb-5 w-full text-center bg-white/10 p-2 rounded-lg flex items-center justify-center flex-col"
		>
			{#if !calculator.governanceVotes}
				<span class="text-red-500 text-sm">
					Season 6+ requires active participation in governance and in-app activities.
				</span>
			{:else}
				Season 6 Rewards Calculator
			{/if}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<RewardInput
				id="xbg-amount"
				label="XBG Amount You Pledged"
				bind:value={calculator.xbgAmount}
				min={0}
			/>
			<RewardInput
				className="flex flex-col gap-1 justify-center select-none"
				error={!calculator.season5Special()}
				label="Community App Leaderboard Position"
			>
				<select
					id="communityAppTier"
					bind:value={calculator.communityAppTier}
					class="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-[#252525] transition-colors select-with-arrow"
				>
					<option value="top1" class="bg-[#1a1a1a]">Top 1%</option>
					<option value="top2.5" class="bg-[#1a1a1a]">Top 2.5%</option>
					<option value="top5" class="bg-[#1a1a1a]">Top 5%</option>
					<option value="top10" class="bg-[#1a1a1a]">Top 10%</option>
					<option value="top25" class="bg-[#1a1a1a]">Top 25%</option>
					<option value="top50" class="bg-[#1a1a1a]">Top 50%</option>
					<option value="remaining" class="bg-[#1a1a1a]">Remaining</option>
				</select>
				
			</RewardInput>
			<RewardInput label="Season Leaderboard Position"
				className="flex flex-col gap-1 justify-center select-none"
			>
				<select
					id="seasonLeaderboardTier"
					bind:value={calculator.seasonLeaderboardTier}
					class="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-[#252525] transition-colors select-with-arrow"
				>
					<option value="top1" class="bg-[#1a1a1a]">Top 1% (1-10)</option>
					<option value="top2.5" class="bg-[#1a1a1a]">Top 2.5% (11-25)</option>
					<option value="top5" class="bg-[#1a1a1a]">Top 5% (26-50)</option>
					<option value="top10" class="bg-[#1a1a1a]">Top 10% (51-100)</option>
					<option value="top25" class="bg-[#1a1a1a]">Top 25% (101-250)</option>
					<option value="top50" class="bg-[#1a1a1a]">Top 50% (251-500)</option>
					<option value="remaining" class="bg-[#1a1a1a]">Remaining</option>
				</select>
			</RewardInput>
			
			<RewardInput
				id="governance-votes"
				label="Number of Governance Votes"
				bind:value={calculator.governanceVotes}
				min={0}
				max={10}
				step={1}
			/>
			
			<RewardInput
				id="prometheus-nfts"
				label="Number of Prometheuses You Own"
				bind:value={calculator.prometheusCount}
				min={0}
				step={1}
			/>
			<RewardInput
				id="chestplate-nfts"
				label="Number of Chestplates You Own"
				bind:value={calculator.chestplateCount}
				min={0}
				step={1}
			/>
			<!-- <RewardInput
				id="partner-nfts-below-1000"
				
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
			/> -->
			<!-- <RewardInput
				id="governance-votes"
				label="Governance Votes"
				bind:value={governanceVotes}
				min={0}
				max={1}
			/> -->
			<RewardInput
				id="season-streaks"
				label="Number of Consecutive Seasons"
				bind:value={calculator.seasonStreaks}
				min={0}
				max={20}
				step={1}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Total XBG Pledged (Current Season)"
				link="https://xbg.xborg.com/pledge"
				bind:value={calculator.totalStakedXBG}
				disabled={true}
				min={0}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Current XBG Price (in $)"
				bind:value={calculator.currentXBGPrice}
				min={0}
			/>
			<!-- <RewardInput
				id="rewards-pool-limit"
				label="XBG Season Rewards Pool"
				bind:value={REWARDS_POOL_LIMIT}
				min={0}
			/> -->
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
				<RewardStats label="Prometheus Bonus" value={calculator.prometheusBonus * 100} />
				<RewardStats label="Chestplate Bonus" value={calculator.chestplateBonus * 100} />
				<!-- <RewardStats
					label="Partner NFTs Bonus"
					value={(calculator.partnerNFTBelow1000 + calculator.partnerNFTAbove1000) * 100}
				/> -->
				<RewardStats label="Governance Bonus" value={calculator.governanceBonus * 100} />
				<RewardStats label="Streak Bonus" value={calculator.streakBonus * 100} />
				<RewardStats label="Pledge Increase Bonus" value={calculator.pledgeIncreaseBonus * 100} />
				<!-- <RewardStats
					label="Seasonal Rewards Pool"
					value="{RewardsCalculator.REWARDS_POOL_LIMIT} XBG"
					suffix=""
				/> -->
				<RewardStats
					label="Community App Bonus"
					value={calculator.communityAppBonus * 100}
				/>
				<RewardStats 
					label="Season Leaderboard"
					value={calculator.seasonLeaderboardBonus * 100}
				/>
				<RewardStats label="Total Multiplier" value={calculator.totalMultiplier} suffix="" />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-600 pt-4">
				<div>
					<h3 class="text-sm text-gray-500 font-semibold mb-2">
						Your Total Pledge Amount Including Multipliers:
					</h3>
					<p class="text-2xl text-green-400">{calculator.effectiveStakedAmount.toFixed(2)} XBG</p>
				</div>
				<div>
					<h3 class="text-sm text-gray-500 font-semibold mb-2">
						Your XBG Holder Score:
					</h3>
					<div class="flex items-center gap-3">
						<p class="text-2xl text-white">{calculator.holderScore.toFixed(2)}</p>
						<a href="https://xbg.xborg.com/leaderboard" target="_blank" class="px-3 py-1 text-sm bg-red-900/40 hover:bg-red-900/30 border border-red-900 rounded-lg text-white">View Leaderboard</a>
					</div>
					<p class="text-xs text-gray-400">sqrt(pledge amount) * multiplier</p>
				</div>
			</div>
		</div>

		<div class="multiplierSetting p-6 rounded-lg mb-8">
			<h3 class="text-xl font-semibold mb-2">Rewards Summary</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-gray-400">Seasonal Rewards (Monthly):</p>
					<p class="text-2xl text-yellow-400">
						{Math.round(calculator.adjustedMonthlyReward)} XBG
						<span class="text-lg"
							>(~${Math.round(
								calculator.currentXBGPrice * Number(calculator.adjustedMonthlyReward.toFixed(2))
							).toFixed(2)})</span
						>
					</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Annual Rewards:</p>
					<p class="text-2xl text-yellow-400">
						{Math.round(calculator.monthlyRewards[calculator.monthlyRewards.length - 1].cumulative)}
						XBG
						<span class="text-lg"
							>(~${Math.round(
								calculator.currentXBGPrice *
									Number(
										calculator.monthlyRewards[
											calculator.monthlyRewards.length - 1
										].cumulative.toFixed(2)
									)
							).toFixed(2)})</span
						>
					</p>
					<label for="accumulate-rewards" class="flex items-center mt-4">
					<input
						type="checkbox"
						id="accumulate-rewards"
						bind:checked={calculator.accumulateRewards}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">Accumulate Rewards</span>
				</label>
				</div>
			</div>
			<p class="text-sm text-gray-300 mt-2 font-bold">
				Effective APY: {calculator.effectiveAPY.toFixed(2)}%
				<!-- {#if (xbgAmount * totalMultiplier) / 12 > adjustedMonthlyReward}
					<span class="text-orange-400 ml-2">(Limited by rewards pool)</span>
				{/if} -->
				<!-- <RewardStats label="Pool Utilization" value={poolUtilization} /> -->
			</p>
			<p class="text-xs text-gray-300 mt-1">
				Pool Share: {(calculator.poolShare * 100).toFixed(4)}% | Pool Utilization: {calculator.poolUtilization}%
			</p>
			<p class="text-xs text-gray-300 mt-1">
				Total Pledged with Multipliers: {calculator.totalPledgedWithMultipliers.toLocaleString()} XBG
			</p>
		</div>

		{#key calculator.monthlyRewards}
			<RewardChart monthlyRewards={calculator.monthlyRewards} />
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

<Modal bind:open={calculator.boostModalOpen}>
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
		<p>Currently not available</p>
		<!-- <ul>
			<li><span class="text-white">&gt;$1,000 FP</span>: 10% boost per NFT (cap at 50%)</li>
			<li><span class="text-white">&lt;$1,000 FP</span>: 5% boost per NFT (cap at 20%)</li>
		</ul> -->
	</section>

	<section class="flex flex-wrap gap-2 text-sm text-gray-400">
		<!-- <a href="https://x.com/OverworldPlay" class="underline" target="_blank">@OverworldPlay</a>
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
		<a href="https://x.com/PirateNation" class="underline" target="_blank">@PirateNation</a> -->

		<div class="block w-full text-left mt-2 flex-break text-blue-500">
			<a href="https://x.com/XBorgHQ" class="" target="_blank">Check on X for latest partner NFTs</a
			>
		</div>
	</section>

	<section>
		<h2>Governance Boosts</h2>
		<ul>
			<li>1 vote: 5% boost</li>
			<li>2-3 votes: 10% boost</li>
			<li>4-5 votes: 15% boost</li>
			<li>5+ votes: 20% boost</li>
		</ul>
	</section>

	<section>
		<h2>Pledge Increase Boosts</h2>
		<ul>
			<li>100k+ XBG: 30% boost</li>
			<li>50k+ XBG: 20% boost</li>
			<li>10k+ XBG: 5% boost</li>
		</ul>
	</section>

	<section>
		<h2>In-App Activity</h2>
		<p>To be announced... 👀</p>
	</section>

	<section>
		<h2>Season Streak Boost</h2>
		<p>Earn +5% more points for each consecutive season you participate in.</p>
		<p class="text-sm text-gray-400 mt-2">
			5% per consecutive season = {calculator.seasonStreaks} seasons × 5% = {(calculator.streakBonus * 100).toFixed(1)}% {calculator.seasonStreaks > 20 ? '(capped at 100%)' : ''}
		</p>
	</section>

	<section>
		<h2>Community App Boosts</h2>
		<p>Grind the Community App leaderboard to earn more points.</p>
		<ul>
			<li>Top 1%: 30% boost</li>
			<li>Top 2.5%: 25% boost</li>
			<li>Top 5%: 20% boost</li>
			<li>Top 10%: 15% boost</li>
			<li>Top 25%: 10% boost</li>
			<li>Top 50%: 5% boost</li>
			<li>Base Tier: 2.5% boost</li>
		</ul>
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

	.select-with-arrow {
		background-image: url('data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="white"/></svg>');
		background-repeat: no-repeat;
		background-position: right 8px center;
		padding-right: 32px;
	}

	select option, select {font-size: 14px;}
</style>
