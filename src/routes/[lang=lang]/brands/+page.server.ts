import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataDB } from '$lib/server/cardata-db';

export const load: PageServerLoad = async ({ platform, url }) => {
	try {
		const carDataDB = getCarDataDB(platform);
		
		// Get all brands
		const brands = await carDataDB.getBrands();
		
		// Get search query
		const search = url.searchParams.get('search') || '';
		
		// Filter brands if search query exists
		const filteredBrands = search
			? brands.filter((brand) =>
					brand.name.toLowerCase().includes(search.toLowerCase())
			  )
			: brands;
		
		return {
			brands: filteredBrands,
			totalBrands: brands.length,
			search
		};
	} catch (err) {
		console.error('Error loading brands:', err);
		throw error(500, 'Failed to load brands');
	}
};
