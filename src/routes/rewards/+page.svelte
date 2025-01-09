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
		static readonly DEFAULT_TOTAL_STAKED = 75_000_000; // 50M XBG tokens staked

		seasonNumber = 4;

		storage = new Storage();
		boostModalOpen = $state(false);
		cookieExpiry = 60 * 60 * 24 * 28; // 28 days

		// State variables
		xbgAmount = $state(+this.storage.getCookie('xbgAmount') || 100000);
		currentXBGPrice = $state(+this.storage.getCookie('currentXBGPrice') || 0.25);
		prometheusCount = $state(+this.storage.getCookie('prometheusCount') || 1);
		chestplateCount = $state(+this.storage.getCookie('chestplateCount') || 1);
		governanceVotes = $state(
			this.storage.getCookie('governanceVotes') !== null
				? this.storage.getCookie('governanceVotes') === 'true'
				: true
		);
		seasonStreaks = $state(+this.storage.getCookie('seasonStreaks') || this.seasonNumber);
		accumulateRewards = $state(true);
		totalStakedXBG = $state(RewardsCalculator.DEFAULT_TOTAL_STAKED);
		myBlueReward = $state(
			this.storage.getCookie('myBlueReward') !== null
				? this.storage.getCookie('myBlueReward') === 'true'
				: true
		);
		seasonBonusReward = $state(
			this.storage.getCookie('seasonBonus') !== null
				? this.storage.getCookie('seasonBonus') === 'true'
				: true
		);

		// Computed values using $derived
		prometheusBonus = $derived(this.prometheusCount * 0.2);
		chestplateBonus = $derived(this.chestplateCount * 0.025);
		governanceBonus = $derived(this.governanceVotes ? 0.1 : 0);
		myBlueRewardBonus = $derived(this.myBlueReward ? 0.25 : 0);
		seasonBonus = $derived(this.seasonBonusReward ? 0 : 0);
		streakBonus = $derived(Math.max(0, Math.min(this.seasonStreaks * 0.05 - 0.05, 1.0)));

		totalMultiplier = $derived(
			1 +
				this.prometheusBonus +
				this.chestplateBonus +
				this.governanceBonus +
				this.streakBonus +
				this.myBlueRewardBonus +
				this.seasonBonus
		);

		effectiveStakedAmount = $derived(this.xbgAmount * this.totalMultiplier * this.season5Special());
		poolShare = $derived(this.effectiveStakedAmount / RewardsCalculator.REWARDS_POOL_LIMIT / 100);
		adjustedMonthlyReward = $derived(RewardsCalculator.REWARDS_POOL_LIMIT * this.poolShare);
		effectiveAPY = $derived(((this.adjustedMonthlyReward * 12) / this.xbgAmount) * 100);
		poolUtilization = $derived((this.totalStakedXBG / RewardsCalculator.REWARDS_POOL_LIMIT) * 100);

		monthlyRewards = $derived(this.calculateMonthlyRewards());

		initialize() {
			this.setupStorageSync();
			this.clearIrrelevantCookies();
		}

		season5Special() {
			// no rewards for not myblue and not governance votes
			if (!this.seasonBonusReward || !this.governanceVotes) {
				return 0;
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
							RewardsCalculator.REWARDS_POOL_LIMIT *
							(cumulativeStaked / RewardsCalculator.REWARDS_POOL_LIMIT / 100);
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
				console.log('useeffect');

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
				this.storage.setCookie('myBlueReward', this.myBlueReward.toString(), this.cookieExpiry);
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
			{#if !calculator.season5Special()}
				<span class="text-red-500 text-sm">
					You are not eligible for rewards. Wearable Bonus and Governance Voter are required for
					Season 5.
				</span>
			{:else}
				Season 5 Rewards
			{/if}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<RewardInput
				className="flex flex-col gap-1 justify-center select-none"
				error={!calculator.season5Special()}
			>
				<label for="governanceVotes" class="flex items-center">
					<input
						type="checkbox"
						id="governanceVotes"
						bind:checked={calculator.governanceVotes}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">Governance Voter</span>
				</label>
				<label for="seasonBonusReward" class="flex items-center">
					<input
						type="checkbox"
						id="seasonBonusReward"
						bind:checked={calculator.seasonBonusReward}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">NIP Quest - Wearable</span>
				</label>
				<label for="myblueReward" class="flex items-center">
					<input
						type="checkbox"
						id="myblueReward"
						bind:checked={calculator.myBlueReward}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">NIP Quest - Mask</span>
				</label>
				<label for="accumulate-rewards" class="flex items-center">
					<input
						type="checkbox"
						id="accumulate-rewards"
						bind:checked={calculator.accumulateRewards}
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span class="ml-2 text-gray-400">Accumulate Rewards</span>
				</label>
			</RewardInput>
			<RewardInput
				id="xbg-amount"
				label="XBG Amount You Pledged"
				bind:value={calculator.xbgAmount}
				min={0}
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
				label="Season Streaks You Participated In"
				bind:value={calculator.seasonStreaks}
				min={0}
				max={20}
				step={1}
			/>
			<RewardInput
				id="total-staked-xbg"
				label="Total XBG Pledged (Current Season)"
				link="https://xbg.xborg.com/analytics"
				bind:value={calculator.totalStakedXBG}
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
				<RewardStats
					label="Seasonal Rewards Pool"
					value="{RewardsCalculator.REWARDS_POOL_LIMIT} XBG"
					suffix=""
				/>
				<RewardStats
					label="Additional Multipliers"
					value={calculator.myBlueRewardBonus * 100 + calculator.seasonBonus * 100}
				/>
				<RewardStats label="Total Multiplier" value={calculator.totalMultiplier} suffix="" />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-1 gap-4 border-t border-gray-600 pt-4">
				<div>
					<h3 class="text-sm text-gray-500 font-semibold mb-2">
						Your Total Pledge Amount Including Multipliers:
					</h3>
					<p class="text-2xl text-green-400">{calculator.effectiveStakedAmount.toFixed(2)} XBG</p>
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
