import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getCarDataClient } from '$lib/server/cardata';
import { createReview } from '$lib/server/reviews';
import { reviewSchema, verifyTurnstile } from '$lib/utils/validation';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	// Require authentication
	if (!locals.user) {
		throw redirect(302, `/${params.lang}/auth/login`);
	}

	const { brandSlug, modelSlug } = params;
	
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
		
		return {
			brand,
			model,
			turnstileSiteKey: platform?.env?.PUBLIC_TURNSTILE_SITE_KEY || ''
		};
	} catch (err) {
		console.error('Error loading review form:', err);
		throw error(500, 'Failed to load form');
	}
};

export const actions: Actions = {
	default: async ({ request, params, platform, locals }) => {
		const db = platform?.env?.DB;
		if (!db) {
			return fail(500, { error: 'Database not available' });
		}

		// Require authentication
		if (!locals.user) {
			return fail(401, { error: 'Authentication required' });
		}

		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// Verify Turnstile
		const turnstileToken = data['cf-turnstile-response'] as string;
		const turnstileValid = await verifyTurnstile(
			turnstileToken,
			platform?.env?.TURNSTILE_SECRET_KEY
		);

		if (!turnstileValid) {
			return fail(400, {
				error: 'Please complete the CAPTCHA verification',
				values: data
			});
		}

		// Validate review data
		const parseResult = reviewSchema.safeParse({
			brand_id: data.brand_id,
			model_id: data.model_id,
			year: parseInt(data.year as string),
			fuel_type: data.fuel_type,
			transmission: data.transmission,
			ownership_status: data.ownership_status,
			ownership_from: data.ownership_from,
			ownership_to: data.ownership_to || undefined,
			rating_reliability: parseInt(data.rating_reliability as string),
			rating_maintenance: parseInt(data.rating_maintenance as string),
			rating_comfort: parseInt(data.rating_comfort as string),
			rating_performance: parseInt(data.rating_performance as string),
			rating_fuel: parseInt(data.rating_fuel as string),
			recommendation: data.recommendation,
			pros: data.pros,
			cons: data.cons,
			summary_line: data.summary_line || undefined
		});

		if (!parseResult.success) {
			return fail(400, {
				error: 'Please check your inputs and try again',
				errors: parseResult.error.flatten().fieldErrors,
				values: data
			});
		}

		try {
			// Create review
			await createReview(db, locals.user.id, parseResult.data);

			// Redirect to model page
			throw redirect(
				303,
				`/${params.lang}/${params.brandSlug}/${params.modelSlug}?success=review_created`
			);
		} catch (err) {
			console.error('Error creating review:', err);
			return fail(500, {
				error: 'Failed to submit review. Please try again.',
				values: data
			});
		}
	}
};
