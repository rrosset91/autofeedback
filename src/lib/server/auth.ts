// Authentication utilities for AutoFeedback
import bcrypt from 'bcryptjs';
import type { User } from '$lib/types';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
	// Generate a random session ID (UUID v4)
	return crypto.randomUUID();
}

/**
 * Calculate session expiration (7 days from now)
 */
export function getSessionExpiration(rememberMe: boolean = false): string {
	const now = new Date();
	const expirationDays = rememberMe ? 30 : 7; // 30 days if remember me, otherwise 7
	now.setDate(now.getDate() + expirationDays);
	return now.toISOString();
}

/**
 * Create a session in the database
 */
export async function createSession(
	db: D1Database,
	userId: number,
	rememberMe: boolean = false
): Promise<string> {
	const sessionId = generateSessionId();
	const expiresAt = getSessionExpiration(rememberMe);

	await db
		.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
		.bind(sessionId, userId, expiresAt)
		.run();

	return sessionId;
}

/**
 * Get user from session ID
 */
export async function getUserFromSession(
	db: D1Database,
	sessionId: string
): Promise<User | null> {
	const result = await db
		.prepare(
			`
			SELECT u.id, u.email, u.username, u.created_at
			FROM users u
			INNER JOIN sessions s ON s.user_id = u.id
			WHERE s.id = ? AND s.expires_at > datetime('now')
		`
		)
		.bind(sessionId)
		.first<User>();

	return result || null;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
	await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

/**
 * Clean up expired sessions (can be run periodically)
 */
export async function cleanupExpiredSessions(db: D1Database): Promise<void> {
	await db.prepare(`DELETE FROM sessions WHERE expires_at < datetime('now')`).run();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 characters
 */
export function isValidPassword(password: string): boolean {
	return password.length >= 8;
}

/**
 * Validate username
 * 3-20 characters, alphanumeric and underscores only
 */
export function isValidUsername(username: string): boolean {
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	return usernameRegex.test(username);
}
