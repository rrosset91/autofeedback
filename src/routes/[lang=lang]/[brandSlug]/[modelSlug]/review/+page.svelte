<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import VehicleImage from '$lib/components/VehicleImage.svelte';
	import type { PageData, ActionData } from './$types';
	
	export let data: PageData;
	export let form: ActionData;
	
	$: ({ translations, lang, brand, model, turnstileSiteKey } = data);
</script>

<svelte:head>
	<title>{t(translations, 'review.writeReview')} - {brand.name} {model.name} - AutoFeedback</title>
	<meta name="description" content="Share your experience with the {brand.name} {model.name}. Help other buyers make informed decisions." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto px-4">
		<!-- Breadcrumbs -->
		<nav class="text-sm text-gray-600 mb-6">
			<a href="/{lang}" class="hover:text-primary">{t(translations, 'nav.home')}</a>
			<span class="mx-2">/</span>
			<a href="/{lang}/brands" class="hover:text-primary">{t(translations, 'nav.brands')}</a>
			<span class="mx-2">/</span>
			<a href="/{lang}/{brand.slug}" class="hover:text-primary">{brand.name}</a>
			<span class="mx-2">/</span>
			<a href="/{lang}/{brand.slug}/{model.slug}" class="hover:text-primary">{model.name}</a>
			<span class="mx-2">/</span>
			<span class="font-medium text-gray-900">{t(translations, 'review.writeReview')}</span>
		</nav>
		
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Sidebar: Vehicle Info -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
					<h2 class="text-xl font-bold text-gray-900 mb-4">
						{brand.name} {model.name}
					</h2>
					
					<div class="rounded-lg overflow-hidden mb-4">
						<VehicleImage 
							brand={brand.name} 
							model={model.name} 
							width="100%" 
							height="200px" 
						/>
					</div>
					
					<p class="text-sm text-gray-600 mb-4">
						{t(translations, 'review.writeReview')}
					</p>
					
					<div class="border-t border-gray-200 pt-4">
						<h3 class="text-sm font-semibold text-gray-700 mb-2">
							Tips for a great review:
						</h3>
						<ul class="text-sm text-gray-600 space-y-2">
							<li class="flex items-start gap-2">
								<svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
								<span>Be honest and specific</span>
							</li>
							<li class="flex items-start gap-2">
								<svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
								<span>Focus on your experience</span>
							</li>
							<li class="flex items-start gap-2">
								<svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
								<span>Mention real-world details</span>
							</li>
							<li class="flex items-start gap-2">
								<svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
								<span>Keep it constructive</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			
			<!-- Main: Review Form -->
			<div class="lg:col-span-2">
				<ReviewForm 
					{translations} 
					brandId={brand.id} 
					modelId={model.id} 
					{form} 
					{turnstileSiteKey} 
				/>
			</div>
		</div>
	</div>
</div>
