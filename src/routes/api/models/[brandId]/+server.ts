import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCarDataClient } from '$lib/server/cardata';

export const GET: RequestHandler = async ({ params, platform }) => {
	const { brandId } = params;
	
	if (!brandId) {
		throw error(400, 'Brand ID required');
	}
	
	try {
		const carDataApi = getCarDataClient(platform?.env);
		const models = await carDataApi.getBrandModels(brandId, 'europe');
		
		// Sort models alphabetically
		const sortedModels = models.sort((a, b) => a.name.localeCompare(b.name));
		
		return json({
			success: true,
			models: sortedModels
		});
	} catch (err) {
		console.error('Error loading models:', err);
		throw error(500, 'Failed to load models');
	}
};
