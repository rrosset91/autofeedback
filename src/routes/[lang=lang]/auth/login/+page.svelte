<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	
	export let data: PageData;
	export let form;
	
	$: ({ translations, lang } = data);
	
	let loading = false;
</script>

<svelte:head>
	<title>{t(translations, 'nav.login')} - AutoFeedback</title>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<a href="/{lang}" class="flex justify-center">
			<h1 class="text-4xl font-bold text-primary">🚗 AutoFeedback</h1>
		</a>
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
			{t(translations, 'nav.login')}
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			{t(translations, 'auth.dontHaveAccount')}
			<a href="/{lang}/auth/register" class="font-medium text-primary hover:text-primary-dark">
				{t(translations, 'auth.registerHere')}
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<!-- Google OAuth Button -->
			<a
				href="/api/auth/google?redirect=/{lang}"
				class="w-full flex justify-center items-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
			>
				<svg class="w-5 h-5" viewBox="0 0 24 24">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				{t(translations, 'auth.signInWithGoogle')}
			</a>

			<div class="mt-6 relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-white text-gray-500">{t(translations, 'auth.orContinueWith')}</span>
				</div>
			</div>

			<!-- Login Form -->
			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}} class="mt-6 space-y-6">
				{#if form?.error}
					<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{form.error}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						{t(translations, 'form.email')}
					</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						autocomplete="email"
						value={form?.values?.email || ''}
						class="input-field mt-1"
					/>
					{#if form?.errors?.email}
						<p class="mt-1 text-sm text-red-600">{form.errors.email[0]}</p>
					{/if}
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						{t(translations, 'form.password')}
					</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						autocomplete="current-password"
						class="input-field mt-1"
					/>
					{#if form?.errors?.password}
						<p class="mt-1 text-sm text-red-600">{form.errors.password[0]}</p>
					{/if}
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="rememberMe"
							name="rememberMe"
							type="checkbox"
							class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
						/>
						<label for="rememberMe" class="ml-2 block text-sm text-gray-900">
							Remember me
						</label>
					</div>
				</div>

				<!-- Turnstile -->
				<div>
					<div class="cf-turnstile" data-sitekey={data.turnstileSiteKey}></div>
					{#if form?.errors?.turnstileToken}
						<p class="mt-1 text-sm text-red-600">{form.errors.turnstileToken[0]}</p>
					{/if}
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? t(translations, 'common.loading') : t(translations, 'nav.login')}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
