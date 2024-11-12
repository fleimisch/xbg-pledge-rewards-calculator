<script lang="ts">
	import { TabsLoader, TabsContentLoader, Lineloader } from '$lib/services/loaders';
</script>

<div class="layout_scs bg-white shadow-ticket">
	<div class="p-4" style="width: 200px;"><Lineloader width="130" height="24" contentR={4} /></div>

	<!-- <TabsLoader /> -->

	<div class="p-4" style="width: 170px;"><Lineloader width="130" height="20" contentR={4} /></div>

	<div class="px-2 px-lg-4 pb-4">
		<div class="bg-white">
			<TabsContentLoader />
		</div>
	</div>
</div>

<style>
	@media (min-width: 992px) {
		.layout_scs {
			min-height: 400px;
		}
	}
</style>
