<script lang="ts">
	function uid() {
		return Math.random().toString(36).substring(2);
	}
	let randomN = Math.floor(Math.random() * 10000);
	export let preserveAspectRatio = 'xMidYMid meet',
		secondaryColor = 'var(--loader-primary)',
		primaryColor = 'var(--loader-secondary)',
		secondaryOpacity = 1,
		primaryOpacity = 1,
		animate = true,
		baseUrl = '',
		height = '150',
		width = '100%',
		speed = 2,
		uniqueKey = randomN;

	$: idClip = uniqueKey ? `${uniqueKey}-idClip` : uid();
	$: idGradient = uniqueKey ? `${uniqueKey}-idGradient` : uid();
</script>

<svg {width} {height} version="1.1" {preserveAspectRatio} class="ContentLoaderRaw">
	<!-- yangqs -->
	<!-- ria-labelledby="loading-aria" -->
	<title id="loading-aria">Loading...</title>
	<rect style="fill: url({baseUrl}#{idGradient})" clip-path="url({baseUrl}#{idClip})" {width} {height} x="0" y="0" />
	<defs>
		<clipPath id={idClip}>
			<slot>
				<rect {width} {height} x="0" y="0" rx="5" ry="5" />
			</slot>
		</clipPath>
		<linearGradient id={idGradient}>
			<stop stop-color={primaryColor} stop-opacity={primaryOpacity} offset="0%">
				{#if animate}
					<animate dur="{speed}s" values="-2; 1" attributeName="offset" repeatCount="indefinite" />
				{/if}
			</stop>
			<stop stop-color={secondaryColor} stop-opacity={secondaryOpacity} offset="50%">
				{#if animate}
					<animate dur="{speed}s" values="-1.5; 1.5" attributeName="offset" repeatCount="indefinite" />
				{/if}
			</stop>
			<stop stop-color={primaryColor} stop-opacity={primaryOpacity} offset="100%">
				{#if animate}
					<animate dur="{speed}s" values="-1; 2" attributeName="offset" repeatCount="indefinite" />
				{/if}
			</stop>
		</linearGradient>
	</defs>
</svg>

<style>
	.ContentLoaderRaw {
		opacity: 0;
		transform: translateZ(0);
		animation: fadeIn 0.1s;
		animation-delay: 0.1s;
		animation-fill-mode: forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
