<script lang="ts">
	import RatingStars from './RatingStars.svelte';
	import type { Review } from '$lib/types';
	import type { Translations } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	
	export let review: Review & { username?: string };
	export let translations: Translations;
	export let showVehicleInfo: boolean = true;
	
	// Calculate overall rating (average of all 5 categories)
	$: overallRating = (
		review.rating_reliability +
		review.rating_maintenance +
		review.rating_comfort +
		review.rating_performance +
		review.rating_fuel
	) / 5;
	
	// Format date
	$: reviewDate = new Date(review.created_at).toLocaleDateString();
	
	// Ownership duration text
	$: ownershipText = review.ownership_status === 'current'
		? `${t(translations, 'review.ownerSince')} ${review.ownership_from}`
		: `${review.ownership_from} - ${review.ownership_to || ''}`;
</script>

<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
	<!-- Header: User & Date -->
	<div class="flex items-start justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
				{review.username ? review.username.charAt(0).toUpperCase() : 'U'}
			</div>
			<div>
				<p class="font-semibold text-gray-900">{review.username || 'Anonymous'}</p>
				<p class="text-sm text-gray-500">{reviewDate}</p>
			</div>
		</div>
		<div class="text-right">
			<RatingStars rating={overallRating} size="md" />
		</div>
	</div>
	
	<!-- Vehicle Info (if enabled) -->
	{#if showVehicleInfo}
		<div class="mb-4 p-3 bg-gray-50 rounded-lg">
			<p class="text-sm text-gray-600">
				<span class="font-medium">{review.year}</span> •
				<span class="font-medium">{review.fuel_type}</span> •
				<span class="font-medium">{review.transmission}</span>
			</p>
			<p class="text-xs text-gray-500 mt-1">{ownershipText}</p>
		</div>
	{/if}
	
	<!-- Summary Line (if exists) -->
	{#if review.summary_line}
		<p class="text-lg font-medium text-gray-900 mb-3">"{review.summary_line}"</p>
	{/if}
	
	<!-- Detailed Ratings -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
		<div class="text-center">
			<p class="text-xs text-gray-600 mb-1">{t(translations, 'review.reliability')}</p>
			<p class="text-lg font-bold text-primary">{review.rating_reliability}/10</p>
		</div>
		<div class="text-center">
			<p class="text-xs text-gray-600 mb-1">{t(translations, 'review.maintenance')}</p>
			<p class="text-lg font-bold text-primary">{review.rating_maintenance}/10</p>
		</div>
		<div class="text-center">
			<p class="text-xs text-gray-600 mb-1">{t(translations, 'review.comfort')}</p>
			<p class="text-lg font-bold text-primary">{review.rating_comfort}/10</p>
		</div>
		<div class="text-center">
			<p class="text-xs text-gray-600 mb-1">{t(translations, 'review.performance')}</p>
			<p class="text-lg font-bold text-primary">{review.rating_performance}/10</p>
		</div>
		<div class="text-center">
			<p class="text-xs text-gray-600 mb-1">{t(translations, 'review.fuel')}</p>
			<p class="text-lg font-bold text-primary">{review.rating_fuel}/10</p>
		</div>
	</div>
	
	<!-- Recommendation -->
	<div class="mb-4">
		<h4 class="text-sm font-semibold text-gray-700 mb-2">
			{t(translations, 'review.recommendation')}
		</h4>
		<p class="text-gray-800 leading-relaxed">{review.recommendation}</p>
	</div>
	
	<!-- Pros -->
	{#if review.pros}
		<div class="mb-4">
			<h4 class="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
				</svg>
				{t(translations, 'review.pros')}
			</h4>
			<p class="text-gray-800 leading-relaxed">{review.pros}</p>
		</div>
	{/if}
	
	<!-- Cons -->
	{#if review.cons}
		<div>
			<h4 class="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
				</svg>
				{t(translations, 'review.cons')}
			</h4>
			<p class="text-gray-800 leading-relaxed">{review.cons}</p>
		</div>
	{/if}
</div>
