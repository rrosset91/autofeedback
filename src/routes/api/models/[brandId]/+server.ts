import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCarDataDB } from '$lib/server/cardata-db';

export const GET: RequestHandler = async ({ params, platform }) => {
	const { brandId } = params;
	
	if (!brandId) {
		throw error(400, 'Brand ID required');
	}
	
	try {
		const carDataDB = getCarDataDB(platform);
		const models = await carDataDB.getBrandModels(brandId);
		
		return json({
			success: true,
			models
		});
	} catch (err) {
		console.error('Error loading models:', err);
		throw error(500, 'Failed to load models');
	}
};
