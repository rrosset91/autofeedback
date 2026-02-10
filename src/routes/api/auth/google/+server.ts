// Google OAuth initiation endpoint
import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform }) => {
	// Get environment variables from platform
	const GOOGLE_CLIENT_ID = platform?.env?.GOOGLE_CLIENT_ID;
	const GOOGLE_REDIRECT_URI = platform?.env?.GOOGLE_REDIRECT_URI;
	
	if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
		throw error(500, 'Google OAuth not configured');
	}
	
	// Get the language from the referer or query parameter
	const lang = url.searchParams.get('lang') || 'en';
	
	// Store the language in the state parameter to retrieve after callback
	const state = JSON.stringify({ lang });
	
	// Build Google OAuth URL
	const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
	googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
	googleAuthUrl.searchParams.set('response_type', 'code');
	googleAuthUrl.searchParams.set('scope', 'openid email profile');
	googleAuthUrl.searchParams.set('state', state);
	googleAuthUrl.searchParams.set('access_type', 'online');
	googleAuthUrl.searchParams.set('prompt', 'select_account');
	
	throw redirect(302, googleAuthUrl.toString());
};
