<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: ({ translations, lang, brands, totalBrands, search } = data);
</script>

<svelte:head>
	<title>{t(translations, 'nav.brands')} - AutoFeedback</title>
	<meta name="description" content="Browse all car brands. Read real owner reviews for thousands of car models." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<div class="bg-white shadow-sm">
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">
				{t(translations, 'nav.brands')}
			</h1>
			<p class="text-lg text-gray-600">
				{totalBrands} brands available
			</p>
		</div>
	</div>
	
	<!-- Search Section -->
	<div class="bg-white border-b">
		<div class="container mx-auto px-4 py-6">
			<form method="GET" class="max-w-2xl mx-auto">
				<div class="relative">
					<input
						type="text"
						name="search"
						value={search}
						placeholder="Search brands..."
						class="w-full px-6 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
					<button
						type="submit"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</button>
				</div>
			</form>
		</div>
	</div>
	
	<!-- Brands Grid -->
	<div class="container mx-auto px-4 py-8">
		{#if brands.length === 0}
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					{t(translations, 'empty.noResults')}
				</h3>
				<p class="text-gray-600">
					Try a different search term
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
				{#each brands as brand (brand.id)}
					<a
						href="/{lang}/{brand.slug}"
						class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center justify-center text-center group"
					>
						<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-dark transition-colors">
							<span class="text-2xl font-bold text-white">
								{brand.name.charAt(0)}
							</span>
						</div>
						<h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">
							{brand.name}
						</h3>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
