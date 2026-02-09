<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: ({ translations, lang, user } = data);
</script>

<svelte:head>
	<title>{t(translations, 'hero.title')} - AutoFeedback</title>
	<meta name="description" content={t(translations, 'hero.subtitle')} />
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light to-white p-4">
	<div class="text-center max-w-2xl">
		<!-- Logo/Title -->
		<h1 class="text-5xl md:text-6xl font-bold text-primary mb-6">
			🚗 AutoFeedback
		</h1>
		
		<!-- Hero Text -->
		<p class="text-xl md:text-2xl text-gray-700 mb-4">
			{t(translations, 'hero.title')}
		</p>
		<p class="text-gray-600 mb-8">
			{t(translations, 'hero.subtitle')}
		</p>
		
		<!-- User greeting or CTAs -->
		{#if user}
			<div class="mb-6 p-4 bg-primary-light rounded-lg">
				<p class="text-lg text-gray-700">
					Welcome back, <strong>{user.username}</strong>! 👋
				</p>
			</div>
		{/if}

		<!-- CTAs -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/{lang}/brands" class="btn-primary text-lg px-8 py-3">
				{t(translations, 'hero.cta')}
			</a>
			{#if user}
				<a href="/{lang}/auth/logout" class="btn-secondary text-lg px-8 py-3">
					{t(translations, 'nav.logout')}
				</a>
			{:else}
				<a href="/{lang}/auth/register" class="btn-secondary text-lg px-8 py-3">
					{t(translations, 'hero.writeReview')}
				</a>
			{/if}
		</div>
		
		<!-- Language Selector -->
		<div class="mt-8 flex gap-2 justify-center flex-wrap">
			<a href="/en" class="px-3 py-1 rounded {lang === 'en' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition">
				🇬🇧 English
			</a>
			<a href="/pt" class="px-3 py-1 rounded {lang === 'pt' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition">
				🇵🇹 Português
			</a>
			<a href="/fr" class="px-3 py-1 rounded {lang === 'fr' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition">
				🇫🇷 Français
			</a>
			<a href="/es" class="px-3 py-1 rounded {lang === 'es' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition">
				🇪🇸 Español
			</a>
		</div>
		
		<!-- Development Status -->
		<div class="mt-12 p-6 bg-white rounded-lg shadow-lg text-left">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">
				🚀 Phase 2 In Progress!
			</h2>
			<ul class="space-y-2 text-gray-600">
				<li>✅ SvelteKit + TypeScript configured</li>
				<li>✅ TailwindCSS with responsive design</li>
				<li>✅ Cloudflare D1 database created</li>
				<li>✅ CarData API client integrated</li>
				<li>✅ Multi-language support (en, pt, fr, es)</li>
				<li>✅ User authentication (register, login, logout)</li>
				<li>✅ Session management with cookies</li>
				<li>✅ Turnstile bot protection</li>
				<li>⏳ Google OAuth (UI ready, backend pending)</li>
			</ul>
			<p class="mt-4 text-sm text-gray-500">
				Current language: <strong>{lang}</strong>
				{#if user}
					<br />Logged in as: <strong>{user.username}</strong>
				{/if}
			</p>
		</div>
	</div>
</div>
