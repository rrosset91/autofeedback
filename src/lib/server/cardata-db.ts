// Car Data Database Client
// Uses local D1 database instead of external API

import type { CarDataBrand, CarDataModel } from '$lib/types';

class CarDataDBClient {
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	/**
	 * Get all brands (Europe only - already filtered in DB)
	 */
	async getBrands(): Promise<CarDataBrand[]> {
		const result = await this.db
			.prepare('SELECT id, name, slug, country, logo_url FROM brands ORDER BY name ASC')
			.all<CarDataBrand>();
		
		return result.results || [];
	}

	/**
	 * Get a single brand by ID or slug
	 */
	async getBrand(brandIdOrSlug: string): Promise<CarDataBrand | null> {
		// Try by ID first
		const isNumeric = /^\d+$/.test(brandIdOrSlug);
		
		const result = isNumeric
			? await this.db
					.prepare('SELECT id, name, slug, country, logo_url FROM brands WHERE id = ?')
					.bind(parseInt(brandIdOrSlug))
					.first<CarDataBrand>()
			: await this.db
					.prepare('SELECT id, name, slug, country, logo_url FROM brands WHERE slug = ?')
					.bind(brandIdOrSlug)
					.first<CarDataBrand>();
		
		return result || null;
	}

	/**
	 * Get all models for a specific brand
	 */
	async getBrandModels(brandIdOrSlug: string): Promise<CarDataModel[]> {
		// First get the brand to ensure we have the ID
		const brand = await this.getBrand(brandIdOrSlug);
		
		if (!brand) {
			return [];
		}
		
		const result = await this.db
			.prepare(`
				SELECT 
					m.id, 
					m.brand_id, 
					m.name, 
					m.slug,
					m.body_type,
					m.fuel_types,
					m.production_start,
					m.production_end
				FROM models m
				WHERE m.brand_id = ?
				ORDER BY m.name ASC
			`)
			.bind(brand.id)
			.all<CarDataModel>();
		
		return result.results || [];
	}

	/**
	 * Get a specific model
	 */
	async getModel(brandIdOrSlug: string, modelSlug: string): Promise<CarDataModel | null> {
		const brand = await this.getBrand(brandIdOrSlug);
		
		if (!brand) {
			return null;
		}
		
		const result = await this.db
			.prepare(`
				SELECT 
					m.id, 
					m.brand_id, 
					m.name, 
					m.slug,
					m.body_type,
					m.fuel_types,
					m.production_start,
					m.production_end
				FROM models m
				WHERE m.brand_id = ? AND m.slug = ?
			`)
			.bind(brand.id, modelSlug)
			.first<CarDataModel>();
		
		return result || null;
	}

	/**
	 * Search for brands and models
	 */
	async search(query: string): Promise<{
		brands: CarDataBrand[];
		models: CarDataModel[];
	}> {
		const searchTerm = `%${query.toLowerCase()}%`;
		
		const brandsResult = await this.db
			.prepare('SELECT id, name, slug, country, logo_url FROM brands WHERE LOWER(name) LIKE ? ORDER BY name ASC LIMIT 10')
			.bind(searchTerm)
			.all<CarDataBrand>();
		
		const modelsResult = await this.db
			.prepare(`
				SELECT 
					m.id, 
					m.brand_id, 
					m.name, 
					m.slug,
					m.body_type,
					m.fuel_types,
					m.production_start,
					m.production_end
				FROM models m
				WHERE LOWER(m.name) LIKE ?
				ORDER BY m.name ASC
				LIMIT 20
			`)
			.bind(searchTerm)
			.all<CarDataModel>();
		
		return {
			brands: brandsResult.results || [],
			models: modelsResult.results || []
		};
	}

	/**
	 * Get total counts
	 */
	async getCounts(): Promise<{ brands: number; models: number }> {
		const brandCount = await this.db
			.prepare('SELECT COUNT(*) as count FROM brands')
			.first<{ count: number }>();
		
		const modelCount = await this.db
			.prepare('SELECT COUNT(*) as count FROM models')
			.first<{ count: number }>();
		
		return {
			brands: brandCount?.count || 0,
			models: modelCount?.count || 0
		};
	}
}

// Export factory function
export function createCarDataDB(db: D1Database): CarDataDBClient {
	return new CarDataDBClient(db);
}

// Helper to get DB instance from platform
export function getCarDataDB(platform?: App.Platform): CarDataDBClient {
	if (!platform?.env?.DB) {
		throw new Error('Database not available');
	}
	
	return createCarDataDB(platform.env.DB);
}
