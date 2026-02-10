import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserReviews, deleteReview } from '$lib/server/reviews';

export const load: PageServerLoad = async ({ locals, platform, params }) => {
	// Require authentication
	if (!locals.user) {
		throw redirect(302, `/${params.lang}/auth/login`);
	}

	const db = platform?.env?.DB;
	if (!db) {
		throw new Error('Database not available');
	}

	// Fetch user's reviews
	const reviews = await getUserReviews(db, locals.user.id);

	return {
		reviews
	};
};

export const actions: Actions = {
	delete: async ({ request, locals, platform, params }) => {
		const db = platform?.env?.DB;
		if (!db) {
			return fail(500, { error: 'Database not available' });
		}

		// Require authentication
		if (!locals.user) {
			return fail(401, { error: 'Authentication required' });
		}

		const formData = await request.formData();
		const reviewId = parseInt(formData.get('reviewId') as string);

		if (!reviewId) {
			return fail(400, { error: 'Invalid review ID' });
		}

		try {
			const success = await deleteReview(db, reviewId, locals.user.id);

			if (!success) {
				return fail(403, { error: 'Not authorized to delete this review' });
			}

			return { success: true };
		} catch (err) {
			console.error('Error deleting review:', err);
			return fail(500, { error: 'Failed to delete review' });
		}
	}
};
