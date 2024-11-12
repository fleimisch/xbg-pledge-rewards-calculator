<script lang="ts">
	import ContentLoader from './ContentLoader.svelte';
	export let width = '100%';
	export let height = '400';
	export let contentR = 3;

	/* if new component, YOU MUST SET A NEW UNIQUEKEY !!! */
</script>

<div class="cLoad dt w100">
	<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
		<rect x="0" y="15" rx="3" ry="3" width="30%" height="10" />
		<rect x="0" y="35" rx={contentR} ry={contentR} width="100%" height="50" />
		<rect x="0" y="95" rx={contentR} ry={contentR} width="100%" height="50" />

		<rect x="0" y="175" rx={contentR} ry={contentR} width="30%" height="10" />
		<rect x="0" y="195" rx={contentR} ry={contentR} width="100%" height="40" />
		<rect x="0" y="245" rx={contentR} ry={contentR} width="100%" height="40" />
		<rect x="0" y="295" rx={contentR} ry={contentR} width="100%" height="40" />
	</ContentLoader>
</div>
