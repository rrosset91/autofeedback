import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return ['en', 'pt', 'fr', 'es'].includes(param);
};
