<script lang="ts">
	import ContentLoader from '../ContentLoader.svelte';
	export let state = 'login'; // set login, 2fa or customer. By default it's login state or if any another value will be processed as login as well
	let width = '100%';

	$: {
		state = state?.toLowerCase();
	}
</script>

<div class="cLoad dt w100">
	<div class="d-flex flex-column ai-c">
		{#if state == '2fa'}
			<div class="_2fa d-flex flex-column ac-c ai-c w100 bg-white b-r shadow-normal">
				<h5 class="db p30 text-center mb-0">Two-Factor Authentication</h5>
				<hr class="w100 m0 p0" />
				<div class="w100 p30">
					<h6 class="AlignCenter">Enter Your Token</h6>
					<p class="db fs90 text-center">Enter the six-digit token that the app generated for you.</p>
					<div class="_2faTokenB AlignCenter dt">
						<ContentLoader {width} height="95" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
							<rect x="0" y="0" rx="4" width="100%" height="55" />
							<rect x="50%" y="67" rx="3" width="150" height="20" transform="translate(-75,0)" />
						</ContentLoader>
					</div>
				</div>
			</div>
		{:else if state == 'customer'}
			<div class="_company w100 bg-blur b-r shadow-normal">
				<div class="w100 p20 bg-blur d-flex flex-column ai-c b-r-t-l b-r-t-r ss z10">
					<h6 class="mb0">Choose a Customer</h6>
					<div class="d-flex gap-2 mt-3 w100">
						<ContentLoader {width} height="55" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
							<rect x="0" y="0" rx="4" width="100%" height="52" />
							<!-- <rect x="0" y="0" rx="4" width="158" height="52" />
							<rect x="165" y="0" rx="4" width="100%" height="52" /> -->
						</ContentLoader>
					</div>
				</div>
				<div class="w100 p20 shadow-normal">
					<ContentLoader {width} height="154" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
						<rect x="0" y="0" rx="4" width="100%" height="46" />
						<rect x="0" y="54" rx="4" width="100%" height="46" />
						<rect x="0" y="108" rx="4" width="100%" height="46" />
						<!-- <rect x="50%" y="184" rx="4" width="86" height="52" transform="translate(-43,0)" /> -->
					</ContentLoader>
				</div>
				<div class="w100 p20 shadow-normal">
					<ContentLoader {width} height="52" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
						<rect x="50%" y="0" rx="4" width="86" height="52" transform="translate(-43,0)" />
					</ContentLoader>
				</div>
			</div>
		{:else}
			<div class="_login d-flex flex-column ac-c ai-c w100">
				<ContentLoader {width} height="207" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
					<rect x="0" y="0" rx="4" width="400" height="55" />
					<rect x="0" y="57" rx="4" width="400" height="55" />
					<rect x="0" y="150" rx="4" width="400" height="55" />
				</ContentLoader>
			</div>
		{/if}
	</div>
</div>

<style>
	._login {
		max-width: 400px;
	}
	._company {
		max-width: 500px;
	}
	._2fa {
		max-width: 500px;
	}
    /*:root {
        --2fa-primary: var(--loader-primary);
    }
	:global([data-theme='dark']) {
		--2fa-primary: var(--input-bg);
	}*/
	:global([data-theme='dark'] .bg-white) {
		--loader-primary: var(--input-bg);
	}
</style>
