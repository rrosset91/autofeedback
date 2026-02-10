<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Translations } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	
	export let translations: Translations;
	export let brandId: string;
	export let modelId: string;
	export let form: any = null;
	export let turnstileSiteKey: string;
	
	let loading = false;
	
	// Rating state (1-10 for each category)
	let ratings = {
		reliability: form?.values?.rating_reliability || 5,
		maintenance: form?.values?.rating_maintenance || 5,
		comfort: form?.values?.rating_comfort || 5,
		performance: form?.values?.rating_performance || 5,
		fuel: form?.values?.rating_fuel || 5
	};
	
	// Function to render rating slider
	function renderRatingLabel(value: number): string {
		if (value <= 3) return t(translations, 'review.ratingPoor');
		if (value <= 5) return t(translations, 'review.ratingFair');
		if (value <= 7) return t(translations, 'review.ratingGood');
		if (value <= 9) return t(translations, 'review.ratingVeryGood');
		return t(translations, 'review.ratingExcellent');
	}
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div class="bg-white rounded-lg shadow-md p-6">
	<h2 class="text-2xl font-bold text-gray-900 mb-6">
		{t(translations, 'review.writeReview')}
	</h2>
	
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="space-y-6"
	>
		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				{form.error}
			</div>
		{/if}
		
		{#if form?.success}
			<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
				{t(translations, 'review.submitSuccess')}
			</div>
		{/if}
		
		<!-- Hidden fields -->
		<input type="hidden" name="brand_id" value={brandId} />
		<input type="hidden" name="model_id" value={modelId} />
		
		<!-- Vehicle Details -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label for="year" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.year')} *
				</label>
				<input
					type="number"
					name="year"
					id="year"
					required
					min="1900"
					max={new Date().getFullYear() + 1}
					value={form?.values?.year || new Date().getFullYear()}
					class="input-field"
				/>
				{#if form?.errors?.year}
					<p class="mt-1 text-sm text-red-600">{form.errors.year[0]}</p>
				{/if}
			</div>
			
			<div>
				<label for="fuel_type" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.fuelType')} *
				</label>
				<select name="fuel_type" id="fuel_type" required class="input-field">
					<option value="Gasoline">Gasoline</option>
					<option value="Diesel">Diesel</option>
					<option value="Electric">Electric</option>
					<option value="Hybrid">Hybrid</option>
					<option value="Plug-in Hybrid">Plug-in Hybrid</option>
					<option value="Other">Other</option>
				</select>
				{#if form?.errors?.fuel_type}
					<p class="mt-1 text-sm text-red-600">{form.errors.fuel_type[0]}</p>
				{/if}
			</div>
			
			<div>
				<label for="transmission" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.transmission')} *
				</label>
				<select name="transmission" id="transmission" required class="input-field">
					<option value="Manual">Manual</option>
					<option value="Automatic">Automatic</option>
					<option value="Semi-Automatic">Semi-Automatic</option>
					<option value="CVT">CVT</option>
				</select>
				{#if form?.errors?.transmission}
					<p class="mt-1 text-sm text-red-600">{form.errors.transmission[0]}</p>
				{/if}
			</div>
		</div>
		
		<!-- Ownership Details -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label for="ownership_status" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.ownershipStatus')} *
				</label>
				<select name="ownership_status" id="ownership_status" required class="input-field">
					<option value="current">{t(translations, 'form.currentOwner')}</option>
					<option value="former">{t(translations, 'form.formerOwner')}</option>
				</select>
				{#if form?.errors?.ownership_status}
					<p class="mt-1 text-sm text-red-600">{form.errors.ownership_status[0]}</p>
				{/if}
			</div>
			
			<div>
				<label for="ownership_from" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.ownershipFrom')} *
				</label>
				<input
					type="text"
					name="ownership_from"
					id="ownership_from"
					required
					placeholder="e.g., 2020"
					value={form?.values?.ownership_from || ''}
					class="input-field"
				/>
				{#if form?.errors?.ownership_from}
					<p class="mt-1 text-sm text-red-600">{form.errors.ownership_from[0]}</p>
				{/if}
			</div>
			
			<div>
				<label for="ownership_to" class="block text-sm font-medium text-gray-700 mb-1">
					{t(translations, 'form.ownershipTo')}
					<span class="text-gray-500 text-xs">(if former owner)</span>
				</label>
				<input
					type="text"
					name="ownership_to"
					id="ownership_to"
					placeholder="e.g., 2024"
					value={form?.values?.ownership_to || ''}
					class="input-field"
				/>
				{#if form?.errors?.ownership_to}
					<p class="mt-1 text-sm text-red-600">{form.errors.ownership_to[0]}</p>
				{/if}
			</div>
		</div>
		
		<!-- Rating Sliders -->
		<div class="space-y-6 p-4 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold text-gray-900">
				{t(translations, 'review.ratings')} (1-10)
			</h3>
			
			<!-- Reliability Rating -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="rating_reliability" class="text-sm font-medium text-gray-700">
						{t(translations, 'review.reliability')}
					</label>
					<span class="text-lg font-bold text-primary">
						{ratings.reliability}/10 - {renderRatingLabel(ratings.reliability)}
					</span>
				</div>
				<input
					type="range"
					name="rating_reliability"
					id="rating_reliability"
					min="1"
					max="10"
					bind:value={ratings.reliability}
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
				/>
				{#if form?.errors?.rating_reliability}
					<p class="mt-1 text-sm text-red-600">{form.errors.rating_reliability[0]}</p>
				{/if}
			</div>
			
			<!-- Maintenance Rating -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="rating_maintenance" class="text-sm font-medium text-gray-700">
						{t(translations, 'review.maintenance')}
					</label>
					<span class="text-lg font-bold text-primary">
						{ratings.maintenance}/10 - {renderRatingLabel(ratings.maintenance)}
					</span>
				</div>
				<input
					type="range"
					name="rating_maintenance"
					id="rating_maintenance"
					min="1"
					max="10"
					bind:value={ratings.maintenance}
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
				/>
				{#if form?.errors?.rating_maintenance}
					<p class="mt-1 text-sm text-red-600">{form.errors.rating_maintenance[0]}</p>
				{/if}
			</div>
			
			<!-- Comfort Rating -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="rating_comfort" class="text-sm font-medium text-gray-700">
						{t(translations, 'review.comfort')}
					</label>
					<span class="text-lg font-bold text-primary">
						{ratings.comfort}/10 - {renderRatingLabel(ratings.comfort)}
					</span>
				</div>
				<input
					type="range"
					name="rating_comfort"
					id="rating_comfort"
					min="1"
					max="10"
					bind:value={ratings.comfort}
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
				/>
				{#if form?.errors?.rating_comfort}
					<p class="mt-1 text-sm text-red-600">{form.errors.rating_comfort[0]}</p>
				{/if}
			</div>
			
			<!-- Performance Rating -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="rating_performance" class="text-sm font-medium text-gray-700">
						{t(translations, 'review.performance')}
					</label>
					<span class="text-lg font-bold text-primary">
						{ratings.performance}/10 - {renderRatingLabel(ratings.performance)}
					</span>
				</div>
				<input
					type="range"
					name="rating_performance"
					id="rating_performance"
					min="1"
					max="10"
					bind:value={ratings.performance}
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
				/>
				{#if form?.errors?.rating_performance}
					<p class="mt-1 text-sm text-red-600">{form.errors.rating_performance[0]}</p>
				{/if}
			</div>
			
			<!-- Fuel Economy Rating -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<label for="rating_fuel" class="text-sm font-medium text-gray-700">
						{t(translations, 'review.fuel')}
					</label>
					<span class="text-lg font-bold text-primary">
						{ratings.fuel}/10 - {renderRatingLabel(ratings.fuel)}
					</span>
				</div>
				<input
					type="range"
					name="rating_fuel"
					id="rating_fuel"
					min="1"
					max="10"
					bind:value={ratings.fuel}
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
				/>
				{#if form?.errors?.rating_fuel}
					<p class="mt-1 text-sm text-red-600">{form.errors.rating_fuel[0]}</p>
				{/if}
			</div>
		</div>
		
		<!-- Text Fields -->
		<div>
			<label for="recommendation" class="block text-sm font-medium text-gray-700 mb-1">
				{t(translations, 'review.recommendation')} *
			</label>
			<textarea
				name="recommendation"
				id="recommendation"
				required
				rows="4"
				placeholder={t(translations, 'review.recommendationPlaceholder')}
				value={form?.values?.recommendation || ''}
				class="input-field"
			></textarea>
			{#if form?.errors?.recommendation}
				<p class="mt-1 text-sm text-red-600">{form.errors.recommendation[0]}</p>
			{/if}
		</div>
		
		<div>
			<label for="pros" class="block text-sm font-medium text-gray-700 mb-1">
				{t(translations, 'review.pros')} *
			</label>
			<textarea
				name="pros"
				id="pros"
				required
				rows="3"
				placeholder={t(translations, 'review.prosPlaceholder')}
				value={form?.values?.pros || ''}
				class="input-field"
			></textarea>
			{#if form?.errors?.pros}
				<p class="mt-1 text-sm text-red-600">{form.errors.pros[0]}</p>
			{/if}
		</div>
		
		<div>
			<label for="cons" class="block text-sm font-medium text-gray-700 mb-1">
				{t(translations, 'review.cons')} *
			</label>
			<textarea
				name="cons"
				id="cons"
				required
				rows="3"
				placeholder={t(translations, 'review.consPlaceholder')}
				value={form?.values?.cons || ''}
				class="input-field"
			></textarea>
			{#if form?.errors?.cons}
				<p class="mt-1 text-sm text-red-600">{form.errors.cons[0]}</p>
			{/if}
		</div>
		
		<div>
			<label for="summary_line" class="block text-sm font-medium text-gray-700 mb-1">
				{t(translations, 'review.summaryLine')}
				<span class="text-gray-500 text-xs">(optional)</span>
			</label>
			<input
				type="text"
				name="summary_line"
				id="summary_line"
				maxlength="100"
				placeholder={t(translations, 'review.summaryLinePlaceholder')}
				value={form?.values?.summary_line || ''}
				class="input-field"
			/>
			{#if form?.errors?.summary_line}
				<p class="mt-1 text-sm text-red-600">{form.errors.summary_line[0]}</p>
			{/if}
		</div>
		
		<!-- Turnstile -->
		<div>
			<div class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>
			{#if form?.errors?.turnstileToken}
				<p class="mt-1 text-sm text-red-600">{form.errors.turnstileToken[0]}</p>
			{/if}
		</div>
		
		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				disabled={loading}
				class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? t(translations, 'common.loading') : t(translations, 'review.submitReview')}
			</button>
		</div>
	</form>
</div>
