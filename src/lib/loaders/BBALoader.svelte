<script context="module" lang="ts">
	import { writable, get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { storeUpdate, fetchPendingCount } from '$lib/services/utilities/stores';

	let loaderCount = 0;

	type tLoaderConfig = {
		open: boolean;
		message?: string;
		showMessage?: boolean;
		showReload?: boolean;
		timeout?: number;
	};

	let loaderTimer: NodeJS.Timeout;

	export const bbaLoaderComponent = async (config: tLoaderConfig) => {
		config = await handleOpen(config);
		storeUpdate(bbaLoader, { config });
	};

	let messageTmr: NodeJS.Timeout;
	let reloadTmr: NodeJS.Timeout;
	const handleOpen = async (config: tLoaderConfig) => {
		config.showMessage = false;
		config.showReload = false;
		clearTimeout(messageTmr);
		if (config.open) {
			loaderCount += 1;
		} else {
			loaderCount -= 1;
			clearTimeout(reloadTmr);
		}
		if (loaderCount < 0) loaderCount = 0;
		if (loaderCount > 0) {
			config.open = true;
			messageTmr = setTimeout(async () => {
				config.showMessage = true;
				await storeUpdate(bbaLoader, { config });
			}, 3000);

			reloadTmr = setTimeout(async () => {
				config.showReload = true;
				await storeUpdate(bbaLoader, { config });
			}, 15000);
		} else {
			await new Promise((resolve) => setTimeout(resolve, 100));
			clearTimeout(messageTmr);
			clearTimeout(reloadTmr);
			config.open = false;
		}

		return config;
	};

	export class BBALoader {
		config: tLoaderConfig = {
			open: false,
			message: '',
			timeout: 6000
		};

		// tmr: NodeJS.Timeout | undefined;
		// preventResetRequested = false;

		open = async (config: tLoaderConfig) => {
			config.open = true;
			config = await handleOpen(config);
			// if (!config.timeout) config.timeout = 6000;
			await storeUpdate(bbaLoader, { config });
			// if (!this.preventResetRequested) {
			// 	await this.reset(config.timeout);
			// }
		};

		// preventReset = async () => {
		// 	clearTimeout(loaderTimer);
		// 	this.preventResetRequested = true;
		// };

		// reset = async (timeout: number) => {
		// 	clearTimeout(loaderTimer);
		// 	loaderTimer = setTimeout(async () => {
		// 		console.log(timeout);
		// 		storeUpdate(bbaLoader, new BBALoader());
		// 		this.preventResetRequested = false;
		// 	}, timeout);
		// };
	}
	export const bbaLoader = writable(new BBALoader());
</script>

<script lang="ts">
	import _ from '$lib/services/utilities/languages';
	import SvgIcon from '../elements/SvgIcon.svelte';
	import { device } from '$lib/services/utilities/general';

	const dictHelp: any = window['dictHelp'] ?? "Don't worry, this may take a minute.";
</script>

{#if $bbaLoader.config.open && $fetchPendingCount > 0}
	<div in:fade|global={{ delay: 80, duration: 500 }} out:fade|global={{ delay: 80, duration: 300 }} class="loadingAnimation">
		{#if $bbaLoader.config.showMessage}
			<span class="message" in:fade|global={{ delay: 80, duration: 300 }}>
				{dictHelp.hdontworryminute}
			</span>
		{/if}

		{#if $bbaLoader.config.showReload && !$device.desktop}
			<span class="p-f transform-x--50" style="left:50%; bottom:20%"
				><button class="btn btn-sm btn-default" on:click={() => window.location.reload()}>
					<SvgIcon icon="refresh" size={12} />
					Reload
				</button></span
			>
		{/if}
	</div>
{/if}

<style>
	.loadingAnimation {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background-color: var(--loader-bg);
		background-position: center center;
	}

	.loadingAnimation::before {
		content: '';
		font-size: 10px;
		position: fixed;
		top: 50%;
		left: 50%;
		margin: -40px 0 0 -40px;
		text-indent: -9999em;
		width: 80px;
		height: 80px;
		display: block;
		border-top: 2px solid var(--loaderSpinnerC2);
		border-right: 2px solid var(--loaderSpinnerC2);
		border-bottom: 2px solid var(--loaderSpinnerC2);
		border-left: 2px solid var(--loaderSpinnerC1);
		border-radius: 100%;
		backface-visibility: hidden;
		perspective: 1000;
		-webkit-animation: load8 1.1s infinite linear;
		animation: load8 1.1s infinite linear;
	}
	.message {
		content: attr(data-text);
		font-size: 15px;
		line-height: 20px;
		color: #0000007d;
		position: fixed;
		top: calc(50% + 52px);
		left: calc(50% - 75px);
		width: 150px;
		text-align: center;
		display: block;
		font-weight: 600;
		text-shadow: 0px 3px 23px rgba(12, 25, 68, 0.4);
	}
</style>
