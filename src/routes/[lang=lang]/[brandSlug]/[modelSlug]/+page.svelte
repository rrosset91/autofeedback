<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/utils/i18n';
	import VehicleImage from '$lib/components/VehicleImage.svelte';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: ({ translations, lang, brand, model, reviews, aggregate, totalReviews, currentPage, totalPages, user } = data);
</script>

<svelte:head>
	<title>{brand.name} {model.name} - {t(translations, 'review.reviewsCount').replace('{count}', String(totalReviews))} - AutoFeedback</title>
	<meta name="description" content="Read real owner reviews for the {brand.name} {model.name}. Find out about reliability, maintenance costs, comfort, performance, and fuel economy from actual drivers." />
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
				<a href="/{lang}/{brand.slug}" class="hover:text-primary">{brand.name}</a>
				<span class="mx-2">/</span>
				<span class="font-medium text-gray-900">{model.name}</span>
			</nav>
			
			<!-- Model Header -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
				<div>
					<h1 class="text-4xl font-bold text-gray-900 mb-2">
						{brand.name} {model.name}
					</h1>
					<p class="text-lg text-gray-600 mb-6">
						{totalReviews} {totalReviews === 1 
							? t(translations, 'review.reviewSingular') 
							: t(translations, 'review.reviewPlural')}
					</p>
					
					<!-- CTA Buttons -->
					<div class="flex flex-wrap gap-3">
						{#if user}
							<a href="/{lang}/{brand.slug}/{model.slug}/review" class="btn-primary">
								{t(translations, 'review.writeReview')}
							</a>
						{:else}
							<a href="/{lang}/auth/login" class="btn-primary">
								{t(translations, 'empty.loginRequired')}
							</a>
						{/if}
					</div>
				</div>
				
				<!-- Vehicle Image -->
				<div class="rounded-lg overflow-hidden shadow-lg">
					<VehicleImage 
						brand={brand.name} 
						model={model.name} 
						width="100%" 
						height="400px" 
					/>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Main Content -->
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Sidebar: Summary -->
			<div class="lg:col-span-1">
				{#if aggregate}
					<SummaryCard 
						{aggregate} 
						{translations} 
						brandName={brand.name} 
						modelName={model.name} 
					/>
				{:else}
					<div class="bg-white rounded-lg shadow-md p-6 text-center">
						<p class="text-gray-600">{t(translations, 'empty.noReviews')}</p>
						<p class="text-sm text-gray-500 mt-2">{t(translations, 'empty.beFirst')}</p>
					</div>
				{/if}
			</div>
			
			<!-- Main: Reviews List -->
			<div class="lg:col-span-2">
				<div class="mb-6">
					<h2 class="text-2xl font-bold text-gray-900">
						{t(translations, 'review.reviewPlural')}
					</h2>
				</div>
				
				{#if reviews.length === 0}
					<!-- Empty State -->
					<div class="bg-white rounded-lg shadow-md p-12 text-center">
						<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">
							{t(translations, 'empty.noReviews')}
						</h3>
						<p class="text-gray-600 mb-6">
							{t(translations, 'empty.beFirst')}
						</p>
						{#if user}
							<a href="/{lang}/{brand.slug}/{model.slug}/review" class="btn-primary inline-block">
								{t(translations, 'review.writeReview')}
							</a>
						{:else}
							<a href="/{lang}/auth/login" class="btn-primary inline-block">
								{t(translations, 'empty.loginRequired')}
							</a>
						{/if}
					</div>
				{:else}
					<!-- Reviews List -->
					<div class="space-y-6">
						{#each reviews as review (review.id)}
							<ReviewCard {review} {translations} showVehicleInfo={true} />
						{/each}
					</div>
					
					<!-- Pagination -->
					{#if totalPages > 1}
						<div class="mt-8 flex justify-center gap-2">
							{#if currentPage > 1}
								<a 
									href="?page={currentPage - 1}" 
									class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									{t(translations, 'common.back')}
								</a>
							{/if}
							
							{#each Array(totalPages) as _, i}
								{@const pageNum = i + 1}
								{#if pageNum === currentPage}
									<span class="px-4 py-2 bg-primary text-white rounded-md">
										{pageNum}
									</span>
								{:else if Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === totalPages}
									<a 
										href="?page={pageNum}" 
										class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
									>
										{pageNum}
									</a>
								{:else if Math.abs(pageNum - currentPage) === 3}
									<span class="px-4 py-2 text-gray-400">...</span>
								{/if}
							{/each}
							
							{#if currentPage < totalPages}
								<a 
									href="?page={currentPage + 1}" 
									class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									{t(translations, 'common.next')}
								</a>
							{/if}
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
