import type { RequestHandler } from './$types';
import { getCarDataClient } from '$lib/server/cardata';

export const GET: RequestHandler = async ({ platform }) => {
	const carDataApi = getCarDataClient(platform?.env);
	const baseUrl = 'https://auto-feedback.com';
	const languages = ['en', 'pt', 'fr', 'es'];
	
	try {
		// Get all brands
		const brands = await carDataApi.getBrands();
		
		// Get all models for all brands (this could be expensive, consider caching)
		const allModels: Array<{ brand: string; brandSlug: string; modelSlug: string }> = [];
		
		for (const brand of brands) {
			const models = await carDataApi.getBrandModels(brand.id);
			models.forEach((model) => {
				allModels.push({
					brand: brand.name,
					brandSlug: brand.slug,
					modelSlug: model.slug
				});
			});
		}
		
		// Build sitemap XML
		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	${languages.map(lang => `
	<!-- Homepage -->
	<url>
		<loc>${baseUrl}/${lang}</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
		${languages.filter(l => l !== lang).map(altLang => `
		<xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}"/>`).join('')}
	</url>
	
	<!-- Brands Page -->
	<url>
		<loc>${baseUrl}/${lang}/brands</loc>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
	</url>
	
	<!-- Brand Pages -->
	${brands.map(brand => `
	<url>
		<loc>${baseUrl}/${lang}/${brand.slug}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>`).join('')}
	
	<!-- Model Pages -->
	${allModels.map(model => `
	<url>
		<loc>${baseUrl}/${lang}/${model.brandSlug}/${model.modelSlug}</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>`).join('')}
	`).join('')}
</urlset>`;
		
		return new Response(sitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (err) {
		console.error('Error generating sitemap:', err);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
