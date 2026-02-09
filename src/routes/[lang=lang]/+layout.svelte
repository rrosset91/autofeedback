<script lang="ts">
	import type { LayoutData } from './$types';
	
	export let data: LayoutData;
	
	// Make translations available to all child routes
	$: ({ lang, translations } = data);
</script>

<svelte:head>
	<html lang={lang} />
</svelte:head>

<slot />
