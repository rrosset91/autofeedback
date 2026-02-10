<script lang="ts">
	import { onMount } from 'svelte';
	
	export let brand: string;
	export let model: string;
	export let year: number | null = null;
	export let width: string = '100%';
	export let height: string = 'auto';
	export let className: string = '';
	export let alt: string = '';
	
	let imageUrl: string | null = null;
	let loading: boolean = true;
	let error: boolean = false;
	
	// Build search query for Wikimedia
	$: searchQuery = year ? `${brand} ${model} ${year}` : `${brand} ${model}`;
	
	async function loadImage() {
		loading = true;
		error = false;
		
		try {
			const url =
				'https://commons.wikimedia.org/w/api.php' +
				'?action=query' +
				'&generator=search' +
				'&gsrsearch=' +
				encodeURIComponent(searchQuery) +
				'&gsrnamespace=6' +
				'&prop=imageinfo' +
				'&iiprop=url' +
				'&format=json' +
				'&origin=*';
			
			const response = await fetch(url);
			const data = await response.json();
			
			const pages = data.query?.pages;
			if (pages) {
				const firstPage = Object.values(pages)[0] as any;
				if (firstPage?.imageinfo?.[0]?.url) {
					imageUrl = firstPage.imageinfo[0].url;
				} else {
					error = true;
				}
			} else {
				error = true;
			}
		} catch (e) {
			console.error('Failed to load vehicle image:', e);
			error = true;
		} finally {
			loading = false;
		}
	}
	
	onMount(() => {
		loadImage();
	});
	
	// Reload image when search query changes
	$: if (searchQuery) {
		loadImage();
	}
</script>

{#if loading}
	<div
		class="flex items-center justify-center bg-gray-100 rounded {className}"
		style="width: {width}; height: {height === 'auto' ? '200px' : height};"
	>
		<svg
			class="animate-spin h-8 w-8 text-primary"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	</div>
{:else if error || !imageUrl}
	<div
		class="flex flex-col items-center justify-center bg-gray-100 rounded {className}"
		style="width: {width}; height: {height === 'auto' ? '200px' : height};"
	>
		<svg
			class="h-12 w-12 text-gray-400 mb-2"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
			></path>
		</svg>
		<span class="text-sm text-gray-500">🚗 {brand} {model}</span>
	</div>
{:else}
	<img
		src={imageUrl}
		alt={alt || `${brand} ${model} ${year || ''}`}
		class="rounded object-cover {className}"
		style="width: {width}; height: {height};"
	/>
{/if}
