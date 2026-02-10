<script lang="ts">
	export let rating: number; // Rating value (0-10)
	export let max: number = 10; // Maximum rating value
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let showValue: boolean = true;
	export let className: string = '';
	
	// Calculate star rating (0-5 stars)
	$: starRating = (rating / max) * 5;
	$: fullStars = Math.floor(starRating);
	$: hasHalfStar = starRating % 1 >= 0.5;
	$: emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
	
	// Size classes
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	};
	
	const textSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};
</script>

<div class="flex items-center gap-1 {className}">
	<!-- Full Stars -->
	{#each Array(fullStars) as _}
		<svg
			class="{sizeClasses[size]} text-accent fill-current"
			viewBox="0 0 20 20"
		>
			<path
				d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
			/>
		</svg>
	{/each}
	
	<!-- Half Star -->
	{#if hasHalfStar}
		<svg
			class="{sizeClasses[size]} text-accent"
			viewBox="0 0 20 20"
		>
			<defs>
				<linearGradient id="half-fill">
					<stop offset="50%" stop-color="currentColor" />
					<stop offset="50%" stop-color="transparent" />
				</linearGradient>
			</defs>
			<path
				fill="url(#half-fill)"
				d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
			/>
			<path
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
			/>
		</svg>
	{/if}
	
	<!-- Empty Stars -->
	{#each Array(emptyStars) as _}
		<svg
			class="{sizeClasses[size]} text-gray-300"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		>
			<path
				d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
			/>
		</svg>
	{/each}
	
	<!-- Rating Value -->
	{#if showValue}
		<span class="ml-1 font-medium text-gray-700 {textSizeClasses[size]}">
			{rating.toFixed(1)}/{max}
		</span>
	{/if}
</div>
