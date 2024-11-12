<script lang="ts">
	import ContentLoader from '../ContentLoader.svelte';
	export let width = '100%';
	export let height = '150';

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

<div class="cLoad dt w100">
	<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
		<!-- <circle cx="35" cy="30" r="25" />
		<rect x="80" y="15" rx="3" ry="3" width="20%" height="10" />
		<rect x="80" y="35" rx="3" ry="3" width="50%" height="10" /> -->

		<!-- <circle cx="100%" cy="33" r="20" transform="translate(-35,0)" />
		<rect x="100%" y="25" rx="3" ry="3" width="35" height="15" transform="translate(-105,0)"  /> -->

		<rect x="0" y="0" rx="3" ry="3" width="25%" height="35" />
		<rect x="160" y="0" rx="3" ry="3" width="25%" height="35" />

		<rect x="0" y="60" rx="3" ry="3" width="100%" height="10" />
		<rect x="0" y="80" rx="3" ry="3" width="80%" height="10" />

		<rect x="0" y="110" rx="3" ry="3" width="100%" height="10" />
		<rect x="0" y="130" rx="3" ry="3" width="60%" height="10" />
	</ContentLoader>
</div>
