<!-- <script lang="ts">
	import { ethers } from 'ethers';
	import { Alchemy, Network } from 'alchemy-sdk';
	import { api } from '$lib/services/api';

	export let label: string = '';
	export let walletAddress: string = '';

	interface TokenData {
		tokenBalance: string;
		tokenName: string;
		tokenSymbol: string;
		tokenAddress: string;
		contractAddress: string;
	}

	let debounceTimeout: NodeJS.Timeout;

	const fetchAlchemyData = async (
		alchemy: Alchemy,
		method: string,
		params: any[],
		cacheKey: string
	): Promise<TokenBalancesResponseErc20 | OwnedNftsResponse> => {
		// Make the Alchemy call
		let result;
		if (method === 'getTokenBalances') {
			result = await alchemy.core.getTokenBalances(...(params as [string]));
		} else if (method === 'getNftsForOwner') {
			result = await alchemy.nft.getNftsForOwner(...(params as [string]));
		}

		// Cache the result using api.fetch's native cache handling
		await api.fetch(
			`api/alchemy/${method}/${cacheKey}`,
			{
				method: 'POST',
				body: JSON.stringify(result)
			},
			{
				enabled: true,
				duration: 5 * 60 * 1000, // 5 minutes cache
				storeLocal: true
			}
		);

		return result;
	};

	const runEthers = async (walletAddress: string) => {
		let error = '';
		let tokens: any[] = [];
		let nfts: any[] = [];
		let balance = '0';

		try {
			if (!ethers.isAddress(walletAddress)) {
				error = 'Invalid wallet address';
				return;
			}

			const arbConfig = {
				apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
				network: Network.ARB_MAINNET
			};
			const ethConfig = {
				apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
				network: Network.ETH_MAINNET
			};

			const arbAlchemy = new Alchemy(arbConfig);
			const ethAlchemy = new Alchemy(ethConfig);

			const [tokenBalancesResponse, nftData] = await Promise.all([
				fetchAlchemyData(
					arbAlchemy,
					'getTokenBalances',
					[walletAddress],
					`arbitrum/${walletAddress}`
				) as Promise<TokenBalancesResponseErc20>,
				fetchAlchemyData(
					ethAlchemy,
					'getNftsForOwner',
					[walletAddress],
					`ethereum/${walletAddress}`
				) as Promise<OwnedNftsResponse>
			]);

			const tokenBalances = tokenBalancesResponse.tokenBalances || [];

			const xbgToken = tokenBalances.find(
				(token: TokenBalanceSuccess) =>
					token.contractAddress.toLowerCase() === '0x93fa0b88c0c78e45980fa74cdd87469311b7b3e4'
			) ?? { tokenBalance: '0' };

			const XBG_balance = Number(ethers.formatUnits(xbgToken.tokenBalance ?? '0', 18));

			console.log('XBG Balance (Arbitrum):', XBG_balance);
			console.log('NFTs (Ethereum):', nftData?.ownedNfts?.length || 0);

			tokens = tokenBalances || [];
			nfts = nftData?.ownedNfts || [];

			console.log('Wallet data:', { balance, tokens, nfts });
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unknown error occurred';
			}
		}
	};

	const handleInput = () => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			runEthers(walletAddress);
		}, 1000);
	};
</script>

<div class="multiplierSetting p-6 rounded-lg">
	<label class="block mb-2 text-sm">{label}</label>
	{#if !$$slots.default}
		<div class="flex">
			<input
				type="text"
				bind:value={walletAddress}
				class="w-full multiplierInput text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
				on:input={handleInput}
			/>
		</div>
	{:else}
		<slot />
	{/if}
</div>

<style>
	label {
		min-height: 40px;
	}
	.multiplierSetting {
		background: hsla(240, 2%, 76%, 0.15);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}

	.multiplierInput {
		background: hsla(240, 8%, 3%, 0.285);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		font-size: 0.8rem;
		line-height: 1;
		background: hsla(240, 8%, 3%, 0.285);
		border: 1px solid rgba(91, 91, 94, 0.55);
	}
	.button:hover {
		background: rgba(91, 91, 94, 0.55);
	}
</style> -->
