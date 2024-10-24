<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';

	let { children } = $props();
</script>

{@render children()}
