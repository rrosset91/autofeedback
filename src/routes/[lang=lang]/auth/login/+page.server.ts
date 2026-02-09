import { fail, redirect } from '@sveltejs/kit';
import { loginSchema, verifyTurnstile } from '$lib/utils/validation';
import { verifyPassword, createSession } from '$lib/server/auth';
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
			password: formData.get('password') as string,
			rememberMe: formData.get('rememberMe') === 'on',
			turnstileToken: formData.get('cf-turnstile-response') as string
		};

		// Validate with Zod
		const result = loginSchema.safeParse(data);
		
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				values: { email: data.email }
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
				values: { email: data.email }
			});
		}

		try {
			// Find user by email
			const user = await platform.env.DB
				.prepare('SELECT id, password_hash FROM users WHERE email = ?')
				.bind(data.email)
				.first<{ id: number; password_hash: string }>();

			if (!user) {
				return fail(400, {
					error: 'Invalid email or password',
					values: { email: data.email }
				});
			}

			// Verify password
			const passwordValid = await verifyPassword(data.password, user.password_hash);

			if (!passwordValid) {
				return fail(400, {
					error: 'Invalid email or password',
					values: { email: data.email }
				});
			}

			// Create session
			const sessionId = await createSession(platform.env.DB, user.id, data.rememberMe);

			// Set session cookie
			const maxAge = data.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days
			
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge
			});

			// Redirect to homepage
			throw redirect(303, `/${params.lang}`);
		} catch (error) {
			if (error instanceof Response) throw error; // Rethrow redirect
			
			console.error('Login error:', error);
			return fail(500, { error: 'An error occurred during login' });
		}
	}
};
