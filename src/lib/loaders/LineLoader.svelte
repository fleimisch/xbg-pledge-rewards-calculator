<script lang="ts">
	import ContentLoader from './ContentLoader.svelte';
	export let width = '100%';
	export let height = '23';
	export let contentR = 3;

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

<div class="cLoad dt AlignCenter" style="width:{width}">
	<ContentLoader width="100%" {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
		<rect x="0" y="0" rx="{contentR}" ry="{contentR}" width="100%" height="100%" />
	</ContentLoader>
</div>
