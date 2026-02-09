// Google OAuth callback endpoint
import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI
} from '$env/static/private';
import { createSession } from '$lib/server/auth';

interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token: string;
}

interface GoogleUserInfo {
	sub: string; // Google user ID
	email: string;
	email_verified: boolean;
	name: string;
	picture?: string;
	given_name?: string;
	family_name?: string;
}

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const code = url.searchParams.get('code');
	const stateParam = url.searchParams.get('state');
	
	if (!code) {
		throw error(400, 'Missing authorization code');
	}
	
	// Parse the state to get the language
	let lang = 'en';
	try {
		if (stateParam) {
			const state = JSON.parse(stateParam);
			lang = state.lang || 'en';
		}
	} catch (e) {
		// If state parsing fails, default to 'en'
		console.error('Failed to parse state:', e);
	}
	
	const db = platform?.env?.DB;
	if (!db) {
		throw error(500, 'Database not available');
	}
	
	try {
		// Exchange code for access token
		const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: GOOGLE_REDIRECT_URI,
				grant_type: 'authorization_code'
			})
		});
		
		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text();
			console.error('Token exchange failed:', errorText);
			throw error(500, 'Failed to exchange authorization code');
		}
		
		const tokenData: GoogleTokenResponse = await tokenResponse.json();
		
		// Get user info from Google
		const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});
		
		if (!userInfoResponse.ok) {
			throw error(500, 'Failed to fetch user info from Google');
		}
		
		const userInfo: GoogleUserInfo = await userInfoResponse.json();
		
		// Check if email is verified
		if (!userInfo.email_verified) {
			throw error(400, 'Email not verified by Google');
		}
		
		// Check if user already exists by google_id
		let user = await db
			.prepare('SELECT id, email, username FROM users WHERE google_id = ?')
			.bind(userInfo.sub)
			.first<{ id: number; email: string; username: string }>();
		
		if (!user) {
			// Check if user exists with the same email
			user = await db
				.prepare('SELECT id, email, username FROM users WHERE email = ?')
				.bind(userInfo.email)
				.first<{ id: number; email: string; username: string }>();
			
			if (user) {
				// Link the Google account to existing user
				await db
					.prepare('UPDATE users SET google_id = ? WHERE id = ?')
					.bind(userInfo.sub, user.id)
					.run();
			} else {
				// Create new user
				// Generate username from email or name
				let username = userInfo.email.split('@')[0];
				username = username.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 20);
				
				// Ensure username is unique
				let uniqueUsername = username;
				let counter = 1;
				while (true) {
					const existing = await db
						.prepare('SELECT id FROM users WHERE username = ?')
						.bind(uniqueUsername)
						.first();
					
					if (!existing) break;
					
					uniqueUsername = `${username}${counter}`;
					counter++;
				}
				
				const result = await db
					.prepare(
						'INSERT INTO users (email, username, google_id, password_hash) VALUES (?, ?, ?, ?)'
					)
					.bind(userInfo.email, uniqueUsername, userInfo.sub, '')
					.run();
				
				// Get the newly created user
				user = {
					id: result.meta.last_row_id as number,
					email: userInfo.email,
					username: uniqueUsername
				};
			}
		}
		
		// Create session
		const sessionId = await createSession(db, user.id, true); // Remember user for 30 days
		
		// Set session cookie
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
		
		// Redirect to home page with language
		throw redirect(302, `/${lang}`);
	} catch (err) {
		console.error('OAuth callback error:', err);
		
		// Redirect to login page with error
		throw redirect(302, `/${lang}/auth/login?error=oauth_failed`);
	}
};
