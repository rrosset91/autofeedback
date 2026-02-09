// Type definitions for AutoFeedback

export interface User {
	id: number;
	email: string;
	username: string;
	created_at: string;
}

export interface Review {
	id: number;
	user_id: number;
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
	created_at: string;
	updated_at: string;
}

export interface AggregateRating {
	brand_id: string;
	model_id: string;
	review_count: number;
	avg_reliability: number;
	avg_maintenance: number;
	avg_comfort: number;
	avg_performance: number;
	avg_fuel: number;
	avg_overall: number;
	updated_at: string;
}

export interface CarDataBrand {
	id: string;
	name: string;
	slug: string;
	region: string;
}

export interface CarDataModel {
	id: string;
	brand_id: string;
	name: string;
	slug: string;
	region: string;
}

export type SupportedLanguage = 'en' | 'pt' | 'fr' | 'es';

export interface Translations {
	[key: string]: string | Translations;
}
