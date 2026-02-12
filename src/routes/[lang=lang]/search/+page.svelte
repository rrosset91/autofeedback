<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	
	export let data: PageData;
	
	$: ({ translations, lang, brands } = data);
	
	let selectedBrandId = '';
	let selectedModelSlug = '';
	let models: any[] = [];
	let loadingModels = false;
	
	// Load models when brand changes
	async function onBrandChange() {
		if (!selectedBrandId) {
			models = [];
			selectedModelSlug = '';
			return;
		}
		
		loadingModels = true;
		
		try {
			const response = await fetch(`/api/models/${selectedBrandId}?lang=${lang}`);
			if (response.ok) {
				const data = await response.json();
				models = data.models || [];
			} else {
				models = [];
			}
		} catch (err) {
			console.error('Error loading models:', err);
			models = [];
		} finally {
			loadingModels = false;
		}
	}
	
	// Handle form submission
	function handleSubmit() {
		if (!selectedBrandId || !selectedModelSlug) return;
		
		const brand = brands.find(b => b.id === parseInt(selectedBrandId));
		if (brand) {
			goto(`/${lang}/${brand.slug}/${selectedModelSlug}`);
		}
	}
</script>

<svelte:head>
	<title>{t(translations, 'nav.search')} - AutoFeedback</title>
	<meta name="description" content="Search for car reviews by brand and model" />
</svelte:head>

<!-- Hero Section -->
<div class="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
	<div class="container mx-auto px-4 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">
			Find Your Car Reviews
		</h1>
		<p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
			Select a brand and model to discover authentic reviews from real owners
		</p>
	</div>
</div>

<!-- Search Form -->
<div class="container mx-auto px-4 py-12 max-w-4xl">
	<div class="bg-white rounded-xl shadow-lg p-8">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Brand Selector -->
			<div>
				<label for="brand" class="block text-sm font-semibold text-gray-700 mb-2">
					Select Brand
				</label>
				<select
					id="brand"
					bind:value={selectedBrandId}
					on:change={onBrandChange}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
					required
				>
					<option value="">Choose a brand...</option>
					{#each brands as brand}
						<option value={brand.id}>{brand.name}</option>
					{/each}
				</select>
				{#if brands.length === 0}
					<p class="mt-2 text-sm text-red-600">
						Unable to load brands. Please try again later.
					</p>
				{:else}
					<p class="mt-2 text-sm text-gray-600">
						{brands.length} European brands available
					</p>
				{/if}
			</div>
			
			<!-- Model Selector -->
			<div>
				<label for="model" class="block text-sm font-semibold text-gray-700 mb-2">
					Select Model
				</label>
				<select
					id="model"
					bind:value={selectedModelSlug}
					disabled={!selectedBrandId || loadingModels}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
					required
				>
					<option value="">
						{#if !selectedBrandId}
							Select a brand first...
						{:else if loadingModels}
							Loading models...
						{:else}
							Choose a model...
						{/if}
					</option>
					{#each models as model}
						<option value={model.slug}>{model.name}</option>
					{/each}
				</select>
				{#if selectedBrandId && models.length === 0 && !loadingModels}
					<p class="mt-2 text-sm text-gray-600">
						No models found for this brand
					</p>
				{:else if models.length > 0}
					<p class="mt-2 text-sm text-gray-600">
						{models.length} models available
					</p>
				{/if}
			</div>
			
			<!-- Submit Button -->
			<button
				type="submit"
				disabled={!selectedBrandId || !selectedModelSlug}
				class="w-full bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				View Reviews
			</button>
		</form>
	</div>
	
	<!-- Popular Brands (Optional) -->
	{#if brands.length > 0}
		<div class="mt-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
				Popular European Brands
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each brands.slice(0, 12) as brand}
					<button
						on:click={() => {
							selectedBrandId = brand.id.toString();
							onBrandChange();
						}}
						class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
					>
						<div class="font-semibold text-gray-900">{brand.name}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
