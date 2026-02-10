import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataClient } from '$lib/server/cardata';

export const load: PageServerLoad = async ({ platform, url }) => {
	const carDataApi = getCarDataClient(platform?.env);
	
	try {
		// Get all brands
		const brands = await carDataApi.getBrands();
		
		// Get search query
		const search = url.searchParams.get('search') || '';
		
		// Filter brands if search query exists
		const filteredBrands = search
			? brands.filter((brand) =>
					brand.name.toLowerCase().includes(search.toLowerCase())
			  )
			: brands;
		
		// Sort brands alphabetically
		const sortedBrands = filteredBrands.sort((a, b) => a.name.localeCompare(b.name));
		
		return {
			brands: sortedBrands,
			totalBrands: brands.length,
			search
		};
	} catch (err) {
		console.error('Error loading brands:', err);
		throw error(500, 'Failed to load brands');
	}
};
