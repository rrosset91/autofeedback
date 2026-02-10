<script lang="ts">
	import { onMount } from 'svelte';
	
	export let slot: string = ''; // AdSense slot ID
	export let format: string = 'auto'; // 'auto', 'rectangle', 'horizontal', 'vertical'
	export let responsive: boolean = true;
	export let className: string = '';
	
	let adLoaded = false;
	
	onMount(() => {
		try {
			// @ts-ignore
			const adsbygoogle = window.adsbygoogle || [];
			adsbygoogle.push({});
			// @ts-ignore
			window.adsbygoogle = adsbygoogle;
			adLoaded = true;
		} catch (err) {
			console.error('AdSense error:', err);
		}
	});
</script>

<div class="ad-container {className}">
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-2683103629918727"
		data-ad-slot={slot}
		data-ad-format={format}
		data-full-width-responsive={responsive ? 'true' : 'false'}
	></ins>
</div>

<style>
	.ad-container {
		margin: 2rem 0;
		min-height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
