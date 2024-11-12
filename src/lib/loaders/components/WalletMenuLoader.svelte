<script lang="ts">
	import { ContentLoader, Lineloader } from '$lib/services/loaders';
	import { device } from '$lib/services/utilities/general';
	export let width = '100%';
	export let desktop = $device.desktop;
	export let height = '70';

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

{#if desktop}
	<div class="cLoad dt w100">
		<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
			<rect x="20" y="15" rx="3" ry="3" width="15%" height="18" />
			<rect x="100%" y="5" rx="20" ry="20" width="230" height="40" transform="translate(-390,0)" />
			<rect x="100%" y="5" rx="20" ry="20" width="80" height="40" transform="translate(-150,0)" />
			<circle cx="100%" cy="25" r="20" transform="translate(-40,0)" />
		</ContentLoader>
	</div>
{:else}
	<!-- <div class="dash_m_balance d-flex flex-column jc-c ai-c bg-panels pb-4 pt-3"> -->
	<div class="jc-c ai-c bg-panels" style="border-bottom-left-radius: 25px;border-bottom-right-radius: 25px;">
		<span class="db fs120 mfs160 t-bold lh-1 mb-1 bg-panels-text mb-3 pt-3"><Lineloader width="40%" /></span>
		<span class="db text-muted fs70 w100 lh-1 nowrap text-center text-lg-start bg-panels-text mt-2">Total Available Balance</span>
		<div class="px-3 py-2" style="margin-top:108px;">
			<div class="w100">
				<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
					<circle cx="20" cy="40" r="20" />
					<!-- <rect x="100%" y="20" rx="20" ry="20" width="80" height="40" transform="translate(-80,0)" /> -->
				</ContentLoader>
			</div>
		</div>
	</div>
{/if}
