import type { PageServerLoad } from './$types';
import { getCarDataClient } from '$lib/server/cardata';

export const load: PageServerLoad = async ({ platform }) => {
	const carDataApi = getCarDataClient(platform?.env);
	
	try {
		// Get all European brands
		const brands = await carDataApi.getBrands('europe');
		
		// Sort alphabetically
		const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name));
		
		return {
			brands: sortedBrands
		};
	} catch (err) {
		console.error('Error loading brands for search:', err);
		// Return empty array on error to avoid breaking the page
		return {
			brands: []
		};
	}
};
