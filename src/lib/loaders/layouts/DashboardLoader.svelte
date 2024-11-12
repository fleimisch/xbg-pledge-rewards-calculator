<script lang="ts">
	import { HeaderLoader, WalletGroupLoader, WalletMenuLoader, ActivityAndGasLoader } from '$lib/services/loaders';
	import { page } from '$app/stores';
	import { device } from '$lib/services/utilities/general';
</script>

<HeaderLoader />
<main class="{$page.data.wide ? 'mt-0 mb-0' : 'my-0 my-lg-4'} flex-1 d-flex flex-column">
	<div class="{$page.data.wide ? 'container-fluid p-0' : 'container'} mainContainer d-flex flex-column flex-1">
		<div class="row g-0 gy-sm-3 g-lg-4 g-xl-5 pb-5">
			<div class="dash_accounts p-r col col-12 col-sm-12 col-lg-12 col-lg-7 col-xl-7 col-xxl-7">
				<WalletMenuLoader desktop={$device.desktop} />
				<WalletGroupLoader />
			</div>
			<div class="dash_activity col col-12 col-sm-12 col-lg-12 col-lg-5 col-xl-5 col-xxl-5">
				<ActivityAndGasLoader />
			</div>
		</div>
	</div>
</main>
