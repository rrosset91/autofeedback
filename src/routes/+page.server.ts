import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	// Detect browser language from Accept-Language header
	const acceptLanguage = request.headers.get('accept-language');
	const browserLang = acceptLanguage?.split(',')[0].split('-')[0];
	
	// Redirect to appropriate language
	// Supported: en, pt, fr, es
	const supportedLangs = ['pt', 'fr', 'es'];
	const lang = supportedLangs.includes(browserLang || '') ? browserLang : 'en';
	
	throw redirect(302, `/${lang}`);
};
