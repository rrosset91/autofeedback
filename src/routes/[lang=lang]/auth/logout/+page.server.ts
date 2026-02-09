import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, platform, params }) => {
	const sessionId = cookies.get('session');

	if (sessionId && platform?.env?.DB) {
		// Delete session from database
		await deleteSession(platform.env.DB, sessionId);
	}

	// Clear session cookie
	cookies.delete('session', { path: '/' });

	// Redirect to homepage
	throw redirect(303, `/${params.lang}`);
};
