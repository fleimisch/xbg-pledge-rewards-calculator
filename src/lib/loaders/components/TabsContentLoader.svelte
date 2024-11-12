<script lang="ts">
	import ContentLoader from '../ContentLoader.svelte';
	export let width = '100%';
	export let height = '220';
	export let contentR = 3;
</script>

<div class="cLoad dt w100">
	<ContentLoader {width} {height} primaryColor="var(--loader-primary)" secondaryColor="var(--loader-secondary)">
		<rect x="0" y="15" rx={contentR} ry={contentR} width="25%" height="10" />
		<rect x="52%" y="15" rx={contentR} ry={contentR} width="18%" height="10" />
		<rect x="0" y="35" rx={contentR} ry={contentR} width="48%" height="40" />
		<rect x="52%" y="35" rx={contentR} ry={contentR} width="48%" height="40" />
		<rect x="0" y="85" rx={contentR} ry={contentR} width="15%" height="10" />
		<rect x="52%" y="85" rx={contentR} ry={contentR} width="30%" height="10" />
		<rect x="0" y="105" rx={contentR} ry={contentR} width="48%" height="40" />
		<rect x="52%" y="105" rx={contentR} ry={contentR} width="48%" height="40" />
		<rect x="0" y="155" rx={contentR} ry={contentR} width="30%" height="10" />
		<rect x="52%" y="155" rx={contentR} ry={contentR} width="10%" height="10" />
		<rect x="0" y="175" rx={contentR} ry={contentR} width="48%" height="40" />
		<rect x="52%" y="175" rx={contentR} ry={contentR} width="48%" height="40" />
	</ContentLoader>
</div>