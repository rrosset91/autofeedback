import { fail, redirect } from '@sveltejs/kit';
import { registerSchema, verifyTurnstile } from '$lib/utils/validation';
import { hashPassword, createSession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	return {
		turnstileSiteKey: platform?.env?.PUBLIC_TURNSTILE_SITE_KEY || ''
	};
};

export const actions: Actions = {
	default: async ({ request, platform, cookies, params, getClientAddress }) => {
		if (!platform?.env) {
			return fail(500, { error: 'Server configuration error' });
		}

		const formData = await request.formData();
		const data = {
			email: formData.get('email') as string,
			username: formData.get('username') as string,
			password: formData.get('password') as string,
			confirmPassword: formData.get('confirmPassword') as string,
			turnstileToken: formData.get('cf-turnstile-response') as string
		};

		// Validate with Zod
		const result = registerSchema.safeParse(data);
		
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				values: { email: data.email, username: data.username }
			});
		}

		// Verify Turnstile
		const turnstileValid = await verifyTurnstile(
			data.turnstileToken,
			platform.env.TURNSTILE_SECRET_KEY,
			getClientAddress()
		);

		if (!turnstileValid) {
			return fail(400, {
				error: 'Captcha verification failed. Please try again.',
				values: { email: data.email, username: data.username }
			});
		}

		try {
			// Check if email already exists
			const existingUser = await platform.env.DB
				.prepare('SELECT id FROM users WHERE email = ?')
				.bind(data.email)
				.first();

			if (existingUser) {
				return fail(400, {
					error: 'Email already registered',
					values: { email: data.email, username: data.username }
				});
			}

			// Check if username already exists
			const existingUsername = await platform.env.DB
				.prepare('SELECT id FROM users WHERE username = ?')
				.bind(data.username)
				.first();

			if (existingUsername) {
				return fail(400, {
					error: 'Username already taken',
					values: { email: data.email, username: data.username }
				});
			}

			// Hash password
			const passwordHash = await hashPassword(data.password);

			// Create user
			const insertResult = await platform.env.DB
				.prepare(
					'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?) RETURNING id'
				)
				.bind(data.email, data.username, passwordHash)
				.first<{ id: number }>();

			if (!insertResult?.id) {
				return fail(500, { error: 'Failed to create user' });
			}

			// Create session
			const sessionId = await createSession(platform.env.DB, insertResult.id);

			// Set session cookie
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Redirect to homepage
			throw redirect(303, `/${params.lang}`);
		} catch (error) {
			if (error instanceof Response) throw error; // Rethrow redirect
			
			console.error('Registration error:', error);
			return fail(500, { error: 'An error occurred during registration' });
		}
	}
};
