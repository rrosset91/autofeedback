// Review management utilities for AutoFeedback
import type { Review, AggregateRating } from '$lib/types';

/**
 * Create a new review
 */
export async function createReview(
	db: D1Database,
	userId: number,
	reviewData: {
		brand_id: string;
		model_id: string;
		year: number;
		fuel_type: string;
		transmission: string;
		ownership_status: 'current' | 'former';
		ownership_from: string;
		ownership_to?: string;
		rating_reliability: number;
		rating_maintenance: number;
		rating_comfort: number;
		rating_performance: number;
		rating_fuel: number;
		recommendation: string;
		pros: string;
		cons: string;
		summary_line?: string;
	}
): Promise<Review> {
	const now = new Date().toISOString();
	
	const result = await db
		.prepare(
			`INSERT INTO reviews (
				user_id, brand_id, model_id, year, fuel_type, transmission,
				ownership_status, ownership_from, ownership_to,
				rating_reliability, rating_maintenance, rating_comfort,
				rating_performance, rating_fuel,
				recommendation, pros, cons, summary_line,
				created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			userId,
			reviewData.brand_id,
			reviewData.model_id,
			reviewData.year,
			reviewData.fuel_type,
			reviewData.transmission,
			reviewData.ownership_status,
			reviewData.ownership_from,
			reviewData.ownership_to || null,
			reviewData.rating_reliability,
			reviewData.rating_maintenance,
			reviewData.rating_comfort,
			reviewData.rating_performance,
			reviewData.rating_fuel,
			reviewData.recommendation,
			reviewData.pros,
			reviewData.cons,
			reviewData.summary_line || null,
			now,
			now
		)
		.run();
	
	const reviewId = result.meta.last_row_id as number;
	
	// Update aggregates cache
	await updateAggregates(db, reviewData.brand_id, reviewData.model_id);
	
	// Fetch and return the created review
	const review = await db
		.prepare('SELECT * FROM reviews WHERE id = ?')
		.bind(reviewId)
		.first<Review>();
	
	if (!review) {
		throw new Error('Failed to create review');
	}
	
	return review;
}

/**
 * Get reviews for a specific model with pagination
 */
export async function getModelReviews(
	db: D1Database,
	brandId: string,
	modelId: string,
	options: {
		limit?: number;
		offset?: number;
		orderBy?: 'created_at' | 'rating';
		orderDirection?: 'ASC' | 'DESC';
	} = {}
): Promise<{ reviews: (Review & { username: string })[]; total: number }> {
	const {
		limit = 10,
		offset = 0,
		orderBy = 'created_at',
		orderDirection = 'DESC'
	} = options;
	
	// Get total count
	const countResult = await db
		.prepare('SELECT COUNT(*) as count FROM reviews WHERE brand_id = ? AND model_id = ?')
		.bind(brandId, modelId)
		.first<{ count: number }>();
	
	const total = countResult?.count || 0;
	
	// Get reviews with username
	const orderColumn =
		orderBy === 'rating'
			? '(rating_reliability + rating_maintenance + rating_comfort + rating_performance + rating_fuel) / 5'
			: 'r.created_at';
	
	const reviews = await db
		.prepare(
			`SELECT r.*, u.username
			FROM reviews r
			INNER JOIN users u ON r.user_id = u.id
			WHERE r.brand_id = ? AND r.model_id = ?
			ORDER BY ${orderColumn} ${orderDirection}
			LIMIT ? OFFSET ?`
		)
		.bind(brandId, modelId, limit, offset)
		.all<Review & { username: string }>();
	
	return {
		reviews: reviews.results || [],
		total
	};
}

/**
 * Get a single review by ID
 */
export async function getReview(
	db: D1Database,
	reviewId: number
): Promise<(Review & { username: string }) | null> {
	const review = await db
		.prepare(
			`SELECT r.*, u.username
			FROM reviews r
			INNER JOIN users u ON r.user_id = u.id
			WHERE r.id = ?`
		)
		.bind(reviewId)
		.first<Review & { username: string }>();
	
	return review || null;
}

/**
 * Get reviews by user ID
 */
export async function getUserReviews(
	db: D1Database,
	userId: number
): Promise<(Review & { username: string })[]> {
	const reviews = await db
		.prepare(
			`SELECT r.*, u.username
			FROM reviews r
			INNER JOIN users u ON r.user_id = u.id
			WHERE r.user_id = ?
			ORDER BY r.created_at DESC`
		)
		.bind(userId)
		.all<Review & { username: string }>();
	
	return reviews.results || [];
}

/**
 * Update a review
 */
export async function updateReview(
	db: D1Database,
	reviewId: number,
	userId: number,
	updateData: Partial<{
		year: number;
		fuel_type: string;
		transmission: string;
		ownership_status: 'current' | 'former';
		ownership_from: string;
		ownership_to: string;
		rating_reliability: number;
		rating_maintenance: number;
		rating_comfort: number;
		rating_performance: number;
		rating_fuel: number;
		recommendation: string;
		pros: string;
		cons: string;
		summary_line: string;
	}>
): Promise<Review | null> {
	// Verify ownership
	const existing = await db
		.prepare('SELECT brand_id, model_id, user_id FROM reviews WHERE id = ?')
		.bind(reviewId)
		.first<{ brand_id: string; model_id: string; user_id: number }>();
	
	if (!existing || existing.user_id !== userId) {
		return null;
	}
	
	// Build update query dynamically
	const fields: string[] = [];
	const values: any[] = [];
	
	Object.entries(updateData).forEach(([key, value]) => {
		if (value !== undefined) {
			fields.push(`${key} = ?`);
			values.push(value);
		}
	});
	
	if (fields.length === 0) {
		return null;
	}
	
	fields.push('updated_at = ?');
	values.push(new Date().toISOString());
	values.push(reviewId);
	
	await db
		.prepare(`UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`)
		.bind(...values)
		.run();
	
	// Update aggregates if ratings changed
	if (
		updateData.rating_reliability !== undefined ||
		updateData.rating_maintenance !== undefined ||
		updateData.rating_comfort !== undefined ||
		updateData.rating_performance !== undefined ||
		updateData.rating_fuel !== undefined
	) {
		await updateAggregates(db, existing.brand_id, existing.model_id);
	}
	
	// Fetch and return updated review
	const updated = await db
		.prepare('SELECT * FROM reviews WHERE id = ?')
		.bind(reviewId)
		.first<Review>();
	
	return updated || null;
}

/**
 * Delete a review
 */
export async function deleteReview(
	db: D1Database,
	reviewId: number,
	userId: number
): Promise<boolean> {
	// Verify ownership
	const existing = await db
		.prepare('SELECT brand_id, model_id, user_id FROM reviews WHERE id = ?')
		.bind(reviewId)
		.first<{ brand_id: string; model_id: string; user_id: number }>();
	
	if (!existing || existing.user_id !== userId) {
		return false;
	}
	
	await db.prepare('DELETE FROM reviews WHERE id = ?').bind(reviewId).run();
	
	// Update aggregates
	await updateAggregates(db, existing.brand_id, existing.model_id);
	
	return true;
}

/**
 * Get aggregate ratings for a model
 */
export async function getAggregateRatings(
	db: D1Database,
	brandId: string,
	modelId: string
): Promise<AggregateRating | null> {
	const aggregate = await db
		.prepare(
			'SELECT * FROM aggregates_cache WHERE brand_id = ? AND model_id = ?'
		)
		.bind(brandId, modelId)
		.first<AggregateRating>();
	
	return aggregate || null;
}

/**
 * Update aggregate ratings for a model (called after review changes)
 */
export async function updateAggregates(
	db: D1Database,
	brandId: string,
	modelId: string
): Promise<void> {
	const stats = await db
		.prepare(
			`SELECT
				COUNT(*) as review_count,
				AVG(rating_reliability) as avg_reliability,
				AVG(rating_maintenance) as avg_maintenance,
				AVG(rating_comfort) as avg_comfort,
				AVG(rating_performance) as avg_performance,
				AVG(rating_fuel) as avg_fuel
			FROM reviews
			WHERE brand_id = ? AND model_id = ?`
		)
		.bind(brandId, modelId)
		.first<{
			review_count: number;
			avg_reliability: number;
			avg_maintenance: number;
			avg_comfort: number;
			avg_performance: number;
			avg_fuel: number;
		}>();
	
	if (!stats || stats.review_count === 0) {
		// Delete aggregate if no reviews
		await db
			.prepare('DELETE FROM aggregates_cache WHERE brand_id = ? AND model_id = ?')
			.bind(brandId, modelId)
			.run();
		return;
	}
	
	const avgOverall =
		(stats.avg_reliability +
			stats.avg_maintenance +
			stats.avg_comfort +
			stats.avg_performance +
			stats.avg_fuel) /
		5;
	
	const now = new Date().toISOString();
	
	// Upsert aggregate
	await db
		.prepare(
			`INSERT INTO aggregates_cache (
				brand_id, model_id, review_count,
				avg_reliability, avg_maintenance, avg_comfort,
				avg_performance, avg_fuel, avg_overall, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(brand_id, model_id) DO UPDATE SET
				review_count = excluded.review_count,
				avg_reliability = excluded.avg_reliability,
				avg_maintenance = excluded.avg_maintenance,
				avg_comfort = excluded.avg_comfort,
				avg_performance = excluded.avg_performance,
				avg_fuel = excluded.avg_fuel,
				avg_overall = excluded.avg_overall,
				updated_at = excluded.updated_at`
		)
		.bind(
			brandId,
			modelId,
			stats.review_count,
			stats.avg_reliability,
			stats.avg_maintenance,
			stats.avg_comfort,
			stats.avg_performance,
			stats.avg_fuel,
			avgOverall,
			now
		)
		.run();
}
