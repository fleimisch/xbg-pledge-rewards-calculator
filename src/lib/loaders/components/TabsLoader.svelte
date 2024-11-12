<script lang="ts">
	import ContentLoader from '../ContentLoader.svelte';
	export let full = false,
		className = '',
		tabsCount = 3;

	$: if (!tabsCount || tabsCount < 0) {
		tabsCount = 3;
	}
</script>

<div class="bbTabs d-flex w100 ns p-r {className}" class:full>
	{#each Array(tabsCount) as _, index (index)}
		<div class="bbTab p-r d-flex flex-row ai-c gap-2 {!index ? 'active' : ''}">
			<span class="lh-1">
				<ContentLoader width="100" height="16" primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
					<rect x="0" y="0" rx="4" width="100%" height="16" />
				</ContentLoader>
			</span>
		</div>
	{/each}
</div>
