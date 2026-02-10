<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	export let data: LayoutData;
	
	// Make translations available to all child routes
	$: ({ lang, translations, user } = data);
</script>

<svelte:head>
	<html lang={lang} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Header {translations} {lang} {user} />
	
	<main class="flex-grow">
		<slot />
	</main>
	
	<Footer {translations} {lang} />
</div>
