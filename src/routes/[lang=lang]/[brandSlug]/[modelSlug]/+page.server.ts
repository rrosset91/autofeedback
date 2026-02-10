import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCarDataClient } from '$lib/server/cardata';
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
	
	// Get CarData API client
	const carDataApi = getCarDataClient(platform?.env);
	
	try {
		// Fetch brand
		const brand = await carDataApi.getBrand(brandSlug);
		if (!brand) {
			throw error(404, 'Brand not found');
		}
		
		// Fetch all models for the brand
		const models = await carDataApi.getBrandModels(brand.id);
		
		// Find the specific model by slug
		const model = models.find((m) => m.slug === modelSlug);
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
