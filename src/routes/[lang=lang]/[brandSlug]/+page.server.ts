import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataClient } from '$lib/server/cardata';

export const load: PageServerLoad = async ({ params, platform, url }) => {
	const { brandSlug } = params;
	
	const carDataApi = getCarDataClient(platform?.env);
	
	try {
		// Fetch brand
		const brand = await carDataApi.getBrand(brandSlug);
		if (!brand) {
			throw error(404, 'Brand not found');
		}
		
		// Fetch models for this brand
		const models = await carDataApi.getBrandModels(brand.id);
		
		// Get search query
		const search = url.searchParams.get('search') || '';
		
		// Filter models if search query exists
		const filteredModels = search
			? models.filter((model) =>
					model.name.toLowerCase().includes(search.toLowerCase())
			  )
			: models;
		
		// Sort models alphabetically
		const sortedModels = filteredModels.sort((a, b) => a.name.localeCompare(b.name));
		
		return {
			brand,
			models: sortedModels,
			totalModels: models.length,
			search
		};
	} catch (err) {
		console.error('Error loading brand models:', err);
		throw error(500, 'Failed to load models');
	}
};
