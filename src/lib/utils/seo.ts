// SEO utilities for AutoFeedback

/**
 * Generate JSON-LD structured data for a review aggregate
 */
export function generateReviewAggregateSchema(data: {
	brandName: string;
	modelName: string;
	ratingValue: number;
	reviewCount: number;
	url: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `${data.brandName} ${data.modelName}`,
		category: 'Automobile',
		brand: {
			'@type': 'Brand',
			name: data.brandName
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: data.ratingValue.toFixed(1),
			bestRating: '10',
			worstRating: '1',
			reviewCount: data.reviewCount
		},
		url: data.url
	};
}

/**
 * Generate JSON-LD structured data for a single review
 */
export function generateReviewSchema(data: {
	brandName: string;
	modelName: string;
	reviewerName: string;
	ratingValue: number;
	reviewBody: string;
	datePublished: string;
	url: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Review',
		itemReviewed: {
			'@type': 'Product',
			name: `${data.brandName} ${data.modelName}`,
			category: 'Automobile',
			brand: {
				'@type': 'Brand',
				name: data.brandName
			}
		},
		author: {
			'@type': 'Person',
			name: data.reviewerName
		},
		reviewRating: {
			'@type': 'Rating',
			ratingValue: data.ratingValue.toFixed(1),
			bestRating: '10',
			worstRating: '1'
		},
		reviewBody: data.reviewBody,
		datePublished: data.datePublished,
		url: data.url
	};
}

/**
 * Generate JSON-LD breadcrumb list
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.url
		}))
	};
}

/**
 * Generate JSON-LD organization schema
 */
export function generateOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'AutoFeedback',
		url: 'https://auto-feedback.com',
		logo: 'https://auto-feedback.com/logo.png',
		description:
			'Real car reviews from real owners across Europe. Authentic feedback on vehicle reliability, maintenance costs, and owner experiences.',
		sameAs: [
			// Add social media links here when available
		]
	};
}
