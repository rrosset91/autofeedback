// CarData API Client
// Integrates with your existing CarDataAPI Workers

import type { CarDataBrand, CarDataModel } from '$lib/types';

interface CarDataResponse<T> {
	success: boolean;
	data: T;
	meta?: {
		region: string;
		version: string;
		total: number;
	};
}

class CarDataAPIClient {
	private baseUrl: string;
	private apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	private async fetch<T>(endpoint: string): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		
		try {
			const response = await fetch(url, {
				headers: {
					'X-API-Key': this.apiKey,
				},
			});

			if (!response.ok) {
				throw new Error(`CarData API error: ${response.status} ${response.statusText}`);
			}

			const json: CarDataResponse<T> = await response.json();
			
			if (!json.success) {
				throw new Error('CarData API returned unsuccessful response');
			}
			
			return json.data;
		} catch (error) {
			console.error('CarData API fetch error:', error);
			throw error;
		}
	}

	/**
	 * Get all brands for a specific region
	 * @param region - europe, us, brazil, or all
	 */
	async getBrands(region: string = 'europe'): Promise<CarDataBrand[]> {
		return this.fetch<CarDataBrand[]>(`/api/v1/brands?region=${region}`);
	}

	/**
	 * Get a single brand by ID
	 * @param brandId - Brand ID or slug
	 * @param region - Optional region filter
	 */
	async getBrand(brandId: string, region: string = 'europe'): Promise<CarDataBrand> {
		return this.fetch<CarDataBrand>(`/api/v1/brands/${brandId}?region=${region}`);
	}

	/**
	 * Get all models for a specific brand
	 * @param brandId - Brand ID or slug
	 * @param region - Optional region filter
	 */
	async getBrandModels(brandId: string, region: string = 'europe'): Promise<CarDataModel[]> {
		return this.fetch<CarDataModel[]>(`/api/v1/brands/${brandId}/models?region=${region}`);
	}

	/**
	 * Search for brands and models
	 * @param query - Search query
	 * @param region - Optional region filter
	 */
	async search(query: string, region: string = 'europe'): Promise<{
		brands: CarDataBrand[];
		models: CarDataModel[];
	}> {
		return this.fetch(`/api/v1/search?q=${encodeURIComponent(query)}&region=${region}`);
	}

	/**
	 * Health check
	 */
	async health(): Promise<{ status: string; timestamp: number }> {
		return this.fetch('/api/v1/health');
	}
}

// Export singleton instance factory
export function createCarDataAPI(baseUrl: string, apiKey: string): CarDataAPIClient {
	return new CarDataAPIClient(baseUrl, apiKey);
}

// Helper to get API instance from platform env
export function getCarDataAPI(platform?: App.Platform): CarDataAPIClient {
	if (!platform?.env?.CARDATA_API_URL || !platform?.env?.CARDATA_API_KEY) {
		throw new Error('CarData API credentials not configured');
	}
	
	return createCarDataAPI(
		platform.env.CARDATA_API_URL,
		platform.env.CARDATA_API_KEY
	);
}

// Alias for backwards compatibility  
export const getCarDataClient = getCarDataAPI;
