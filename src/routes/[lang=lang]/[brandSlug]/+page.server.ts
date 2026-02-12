import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataDB } from '$lib/server/cardata-db';

export const load: PageServerLoad = async ({ params, platform, url }) => {
	const { brandSlug } = params;
	
	try {
		const carDataDB = getCarDataDB(platform);
		
		// Fetch brand
		const brand = await carDataDB.getBrand(brandSlug);
		if (!brand) {
			throw error(404, 'Brand not found');
		}
		
		// Fetch models for this brand
		const models = await carDataDB.getBrandModels(brand.id.toString());
		
		// Get search query
		const search = url.searchParams.get('search') || '';
		
		// Filter models if search query exists
		const filteredModels = search
			? models.filter((model) =>
					model.name.toLowerCase().includes(search.toLowerCase())
			  )
			: models;
		
		return {
			brand,
			models: filteredModels,
			totalModels: models.length,
			search
		};
	} catch (err) {
		console.error('Error loading brand models:', err);
		throw error(500, 'Failed to load models');
	}
};
