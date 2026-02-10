import { getTranslations } from '$lib/utils/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const lang = params.lang;
	const translations = getTranslations(lang);
	
	return {
		lang,
		translations,
		user: locals.user
	};
};
