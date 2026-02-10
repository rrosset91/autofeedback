<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: ({ translations, lang, brand, models, totalModels, search } = data);
</script>

<svelte:head>
	<title>{brand.name} Models - AutoFeedback</title>
	<meta name="description" content="Browse all {brand.name} models. Read real owner reviews and ratings." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<div class="bg-white shadow-sm">
		<div class="container mx-auto px-4 py-8">
			<!-- Breadcrumbs -->
			<nav class="text-sm text-gray-600 mb-4">
				<a href="/{lang}" class="hover:text-primary">{t(translations, 'nav.home')}</a>
				<span class="mx-2">/</span>
				<a href="/{lang}/brands" class="hover:text-primary">{t(translations, 'nav.brands')}</a>
				<span class="mx-2">/</span>
				<span class="font-medium text-gray-900">{brand.name}</span>
			</nav>
			
			<div class="flex items-center gap-4 mb-4">
				<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
					<span class="text-3xl font-bold text-white">
						{brand.name.charAt(0)}
					</span>
				</div>
				<div>
					<h1 class="text-4xl font-bold text-gray-900">
						{brand.name}
					</h1>
					<p class="text-lg text-gray-600">
						{totalModels} models available
					</p>
				</div>
			</div>
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
						placeholder="Search {brand.name} models..."
						class="w-full px-6 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
					<button
						type="submit"
						aria-label="Search models"
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
	
	<!-- Models Grid -->
	<div class="container mx-auto px-4 py-8">
		{#if models.length === 0}
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
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{#each models as model (model.id)}
					<a
						href="/{lang}/{brand.slug}/{model.slug}"
						class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group"
					>
						<div class="aspect-video bg-gray-100 flex items-center justify-center">
							<svg class="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
								<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
							</svg>
						</div>
						<div class="p-4">
							<h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
								{model.name}
							</h3>
							<p class="text-sm text-gray-600">
								View reviews
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
