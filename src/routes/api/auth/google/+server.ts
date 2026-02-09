// Google OAuth initiation endpoint
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_REDIRECT_URI
} from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
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
