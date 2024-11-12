<script lang="ts">
	import ContentLoader from '../ContentLoader.svelte';
	import { device } from '$lib/services/utilities/general';

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

<div id="bbHeader" class={$device.mobile ? 'bbH_dash' : ''}>
	{#if $device.desktop}
		<header class="bg-blur">
			<div class="flex-1" />
			<div class="container">
				<ContentLoader width="100%" height="65" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
					<rect x="0" y="25" rx="3" ry="3" width="16" height="16" />
					<rect x="30" y="25" rx="3" ry="3" width="75" height="14" />
					<rect x="130" y="25" rx="3" ry="3" width="50" height="14" />
					<rect x="205" y="25" rx="3" ry="3" width="25" height="14" />
					<rect x="255" y="25" rx="3" ry="3" width="55" height="14" />
					<rect x="335" y="25" rx="3" ry="3" width="100" height="14" />
					<rect x="100%" y="11" rx="22" ry="22" width="150" height="41" transform="translate(-158,0)" />
				</ContentLoader>
			</div>
			<div class="flex-1" />
		</header>
	{:else}
		<ContentLoader width="100%" height="65" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
			<rect x="25" y="25" rx="3" ry="3" width="16" height="16" />
		</ContentLoader>
	{/if}
</div>

<style>
	/* ==========================================================================
	MOBILE ONLY
	========================================================================== */
	@media (max-width: 767px), only screen and (max-width: 991px) and (orientation: landscape) {
	}

	/* ==========================================================================
	MOBILE  AND TABLET ONLY
	========================================================================== */
	@media only screen and (max-width: 991px) {
		#bbHeader.bbH_dash {
			background: var(--bg-panels);
		}
		#bbHeader {
			min-height: 4rem;
		}

		#bbHeader header {
			min-height: 0;
		}

		:global(body.sheetOpen #bbHeader header) {
			z-index: 4 !important;
		}
	}
</style>
