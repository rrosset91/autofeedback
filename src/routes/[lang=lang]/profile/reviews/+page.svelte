<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/utils/i18n';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import type { PageData, ActionData } from './$types';
	
	export let data: PageData;
	export let form: ActionData;
	
	$: ({ translations, lang, reviews, user } = data);
	
	let deletingId: number | null = null;
</script>

<svelte:head>
	<title>{t(translations, 'nav.myReviews')} - AutoFeedback</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{t(translations, 'nav.myReviews')}
			</h1>
			<p class="text-gray-600">
				{reviews.length} {reviews.length === 1 
					? t(translations, 'review.reviewSingular') 
					: t(translations, 'review.reviewPlural')}
			</p>
		</div>
		
		{#if form?.success}
			<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
				Review deleted successfully
			</div>
		{/if}
		
		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
				{form.error}
			</div>
		{/if}
		
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
					You haven't written any reviews yet. Share your car ownership experience!
				</p>
				<a href="/{lang}/brands" class="btn-primary inline-block">
					Browse Brands
				</a>
			</div>
		{:else}
			<!-- Reviews List -->
			<div class="space-y-6">
				{#each reviews as review (review.id)}
					<div class="relative">
						<ReviewCard {review} {translations} showVehicleInfo={true} />
						
						<!-- Action Buttons -->
						<div class="absolute top-4 right-4 flex gap-2">
							<form method="POST" action="?/delete" use:enhance={() => {
								deletingId = review.id;
								return async ({ update }) => {
									await update();
									deletingId = null;
								};
							}}>
								<input type="hidden" name="reviewId" value={review.id} />
								<button
									type="submit"
									disabled={deletingId === review.id}
									class="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50"
									onclick="return confirm('Are you sure you want to delete this review?')"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
