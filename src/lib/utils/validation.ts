// Validation schemas using Zod
import { z } from 'zod';

/**
 * Registration form schema
 */
export const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username must be at most 20 characters')
		.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string(),
	turnstileToken: z.string().min(1, 'Please complete the captcha')
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword']
});

/**
 * Login form schema
 */
export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional(),
	turnstileToken: z.string().min(1, 'Please complete the captcha')
});

/**
 * Review form schema
 */
export const reviewSchema = z.object({
	brand_id: z.string().min(1, 'Brand is required'),
	model_id: z.string().min(1, 'Model is required'),
	year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
	fuel_type: z.string().min(1, 'Fuel type is required'),
	transmission: z.string().min(1, 'Transmission is required'),
	ownership_status: z.enum(['current', 'former']),
	ownership_from: z.string().min(1, 'Ownership start date is required'),
	ownership_to: z.string().optional(),
	
	// Ratings (1-10 scale)
	rating_reliability: z.number().int().min(1).max(10),
	rating_maintenance: z.number().int().min(1).max(10),
	rating_comfort: z.number().int().min(1).max(10),
	rating_performance: z.number().int().min(1).max(10),
	rating_fuel: z.number().int().min(1).max(10),
	
	// Text fields with limits
	recommendation: z.string().min(10, 'Please write at least 10 characters').max(500, 'Maximum 500 characters'),
	pros: z.string().min(5, 'Please write at least 5 characters').max(200, 'Maximum 200 characters'),
	cons: z.string().min(5, 'Please write at least 5 characters').max(200, 'Maximum 200 characters'),
	summary_line: z.string().max(100, 'Maximum 100 characters').optional(),
	
	turnstileToken: z.string().min(1, 'Please complete the captcha')
}).refine((data) => {
	// If former owner, ownership_to is required
	if (data.ownership_status === 'former' && !data.ownership_to) {
		return false;
	}
	return true;
}, {
	message: 'End date is required for former owners',
	path: ['ownership_to']
});

/**
 * Verify Cloudflare Turnstile token
 */
export async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
	const formData = new FormData();
	formData.append('secret', secret);
	formData.append('response', token);
	if (ip) {
		formData.append('remoteip', ip);
	}

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();
		return data.success === true;
	} catch (error) {
		console.error('Turnstile verification error:', error);
		return false;
	}
}
