// Server hooks - runs on every request
import { getUserFromSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get session ID from cookie
	const sessionId = event.cookies.get('session');

	if (sessionId && event.platform?.env?.DB) {
		try {
			// Load user from session
			const user = await getUserFromSession(event.platform.env.DB, sessionId);
			
			if (user) {
				// Attach user to locals (available in all routes)
				event.locals.user = {
					id: user.id,
					email: user.email,
					username: user.username
				};
			} else {
				// Session invalid or expired, clear cookie
				event.cookies.delete('session', { path: '/' });
			}
		} catch (error) {
			console.error('Error loading user from session:', error);
			// On error, clear session cookie
			event.cookies.delete('session', { path: '/' });
		}
	}

	// Continue with request
	return resolve(event);
};
