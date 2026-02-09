// i18n utilities

import type { SupportedLanguage, Translations } from '$lib/types';
import en from '$lib/i18n/en.json';
import pt from '$lib/i18n/pt.json';
import fr from '$lib/i18n/fr.json';
import es from '$lib/i18n/es.json';

export const translations: Record<SupportedLanguage, Translations> = {
	en,
	pt,
	fr,
	es
};

export const defaultLanguage: SupportedLanguage = 'en';

export function getTranslations(lang: string): Translations {
	if (lang in translations) {
		return translations[lang as SupportedLanguage];
	}
	return translations[defaultLanguage];
}

// Helper function to get nested translation values
export function t(translations: Translations, key: string): string {
	const keys = key.split('.');
	let value: any = translations;
	
	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			return key; // Return key if not found
		}
	}
	
	return typeof value === 'string' ? value : key;
}

// Helper to replace placeholders like {count}
export function formatMessage(message: string, params: Record<string, string | number>): string {
	return message.replace(/\{(\w+)\}/g, (match, key) => {
		return key in params ? String(params[key]) : match;
	});
}
