<script lang="ts">
	import RatingStars from './RatingStars.svelte';
	import type { AggregateRating } from '$lib/types';
	import type { Translations } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	
	export let aggregate: AggregateRating;
	export let translations: Translations;
	export let brandName: string = '';
	export let modelName: string = '';
</script>

<div class="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg shadow-xl p-6 mb-6">
	<!-- Header -->
	<div class="mb-6">
		{#if brandName && modelName}
			<h2 class="text-2xl font-bold mb-1">{brandName} {modelName}</h2>
		{/if}
		<p class="text-blue-100">
			{aggregate.review_count} {aggregate.review_count === 1
				? t(translations, 'review.reviewSingular')
				: t(translations, 'review.reviewPlural')}
		</p>
	</div>
	
	<!-- Overall Rating -->
	<div class="flex items-center justify-between mb-6 pb-6 border-b border-blue-300">
		<div>
			<p class="text-blue-100 text-sm mb-1">{t(translations, 'review.overallRating')}</p>
			<div class="flex items-baseline gap-2">
				<span class="text-5xl font-bold">{aggregate.avg_overall.toFixed(1)}</span>
				<span class="text-xl text-blue-100">/10</span>
			</div>
		</div>
		<div>
			<RatingStars rating={aggregate.avg_overall} size="lg" showValue={false} />
		</div>
	</div>
	
	<!-- Detailed Ratings -->
	<div class="space-y-4">
		<!-- Reliability -->
		<div>
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">{t(translations, 'review.reliability')}</span>
				<span class="text-lg font-bold">{aggregate.avg_reliability.toFixed(1)}/10</span>
			</div>
			<div class="w-full bg-blue-900 rounded-full h-2">
				<div
					class="bg-accent h-2 rounded-full transition-all duration-500"
					style="width: {(aggregate.avg_reliability / 10) * 100}%"
				></div>
			</div>
		</div>
		
		<!-- Maintenance -->
		<div>
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">{t(translations, 'review.maintenance')}</span>
				<span class="text-lg font-bold">{aggregate.avg_maintenance.toFixed(1)}/10</span>
			</div>
			<div class="w-full bg-blue-900 rounded-full h-2">
				<div
					class="bg-accent h-2 rounded-full transition-all duration-500"
					style="width: {(aggregate.avg_maintenance / 10) * 100}%"
				></div>
			</div>
		</div>
		
		<!-- Comfort -->
		<div>
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">{t(translations, 'review.comfort')}</span>
				<span class="text-lg font-bold">{aggregate.avg_comfort.toFixed(1)}/10</span>
			</div>
			<div class="w-full bg-blue-900 rounded-full h-2">
				<div
					class="bg-accent h-2 rounded-full transition-all duration-500"
					style="width: {(aggregate.avg_comfort / 10) * 100}%"
				></div>
			</div>
		</div>
		
		<!-- Performance -->
		<div>
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">{t(translations, 'review.performance')}</span>
				<span class="text-lg font-bold">{aggregate.avg_performance.toFixed(1)}/10</span>
			</div>
			<div class="w-full bg-blue-900 rounded-full h-2">
				<div
					class="bg-accent h-2 rounded-full transition-all duration-500"
					style="width: {(aggregate.avg_performance / 10) * 100}%"
				></div>
			</div>
		</div>
		
		<!-- Fuel Economy -->
		<div>
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">{t(translations, 'review.fuel')}</span>
				<span class="text-lg font-bold">{aggregate.avg_fuel.toFixed(1)}/10</span>
			</div>
			<div class="w-full bg-blue-900 rounded-full h-2">
				<div
					class="bg-accent h-2 rounded-full transition-all duration-500"
					style="width: {(aggregate.avg_fuel / 10) * 100}%"
				></div>
			</div>
		</div>
	</div>
	
	<!-- Last Updated -->
	{#if aggregate.updated_at}
		<p class="text-xs text-blue-200 mt-6">
			{t(translations, 'review.lastUpdated')}: {new Date(aggregate.updated_at).toLocaleDateString()}
		</p>
	{/if}
</div>
