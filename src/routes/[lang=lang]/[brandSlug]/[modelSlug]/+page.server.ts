import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataDB } from '$lib/server/cardata-db';
import { getModelReviews, getAggregateRatings } from '$lib/server/reviews';

export const load: PageServerLoad = async ({ params, platform, locals, url }) => {
	const db = platform?.env?.DB;
	if (!db) {
		throw error(500, 'Database not available');
	}

	const { brandSlug, modelSlug } = params;
	
	// Pagination
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;
	const offset = (page - 1) * limit;
	
	try {
		const carDataDB = getCarDataDB(platform);
		
		// Fetch brand
		const brand = await carDataDB.getBrand(brandSlug);
		if (!brand) {
			throw error(404, 'Brand not found');
		}
		
		// Fetch specific model
		const model = await carDataDB.getModel(brand.id.toString(), modelSlug);
		if (!model) {
			throw error(404, 'Model not found');
		}
		
		// Fetch reviews and aggregate ratings
		const [reviewsData, aggregate] = await Promise.all([
			getModelReviews(db, brand.id, model.id, {
				limit,
				offset,
				orderBy: 'created_at',
				orderDirection: 'DESC'
			}),
			getAggregateRatings(db, brand.id, model.id)
		]);
		
		return {
			brand,
			model,
			reviews: reviewsData.reviews,
			totalReviews: reviewsData.total,
			aggregate,
			currentPage: page,
			totalPages: Math.ceil(reviewsData.total / limit),
			user: locals.user
		};
	} catch (err) {
		console.error('Error loading model page:', err);
		throw error(500, 'Failed to load model data');
	}
};
