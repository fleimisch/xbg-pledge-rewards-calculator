<script lang="ts">
	import ContentLoader from './ContentLoader.svelte';
	export let width = '100%';
	export let height = '150';

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

<div class="cLoad dt w100">
	<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
		<rect x="0" y="15" rx="3" ry="3" width="10%" height="10" />
		<rect x="0" y="35" rx="3" ry="3" width="20%" height="10" />

		<rect x="250" y="15" rx="3" ry="3" width="10%" height="10" />
		<rect x="250" y="35" rx="3" ry="3" width="20%" height="10" />

		<rect x="500" y="15" rx="3" ry="3" width="10%" height="10" />
		<rect x="500" y="35" rx="3" ry="3" width="20%" height="10" />

		<circle cx="850" cy="25" r="20" />

		<rect x="50" y="85" rx="3" ry="3" width="300" height="10" />
		<circle cx="15" cy="90" r="15" />
	</ContentLoader>
</div>
