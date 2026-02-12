import type { PageServerLoad } from './$types';
import { getCarDataDB } from '$lib/server/cardata-db';

export const load: PageServerLoad = async ({ platform }) => {
	try {
		const carDataDB = getCarDataDB(platform);
		
		// Get all brands (already Europe-only from DB)
		const brands = await carDataDB.getBrands();
		
		return {
			brands
		};
	} catch (err) {
		console.error('Error loading brands for search:', err);
		// Return empty array on error to avoid breaking the page
		return {
			brands: []
		};
	}
};
