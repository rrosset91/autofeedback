<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { Translations, User } from '$lib/types';
	
	export let translations: Translations;
	export let lang: string;
	export let user: User | undefined = undefined;
	
	let mobileMenuOpen = false;
</script>

<header class="bg-white shadow-sm sticky top-0 z-50">
	<nav class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/{lang}" class="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
				<span>🚗</span>
				<span>AutoFeedback</span>
			</a>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-6">
				<a href="/{lang}" class="text-gray-700 hover:text-primary transition-colors">
					{t(translations, 'nav.home')}
				</a>
				<a href="/{lang}/brands" class="text-gray-700 hover:text-primary transition-colors">
					{t(translations, 'nav.brands')}
				</a>
				
				{#if user}
					<a href="/{lang}/profile/reviews" class="text-gray-700 hover:text-primary transition-colors">
						{t(translations, 'nav.myReviews')}
					</a>
					
					<!-- User Dropdown -->
					<div class="relative group">
						<button class="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
							<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
								{user.username.charAt(0).toUpperCase()}
							</div>
							<span>{user.username}</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
							</svg>
						</button>
						
						<!-- Dropdown Menu -->
						<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
							<a href="/{lang}/profile/reviews" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg">
								{t(translations, 'nav.myReviews')}
							</a>
							<form method="POST" action="/{lang}/auth/logout">
								<button type="submit" class="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-b-lg">
									{t(translations, 'nav.logout')}
								</button>
							</form>
						</div>
					</div>
				{:else}
					<a href="/{lang}/auth/login" class="text-gray-700 hover:text-primary transition-colors">
						{t(translations, 'nav.login')}
					</a>
					<a href="/{lang}/auth/register" class="btn-primary">
						{t(translations, 'nav.register')}
					</a>
				{/if}
			</div>
			
			<!-- Mobile Menu Button -->
			<button
				class="md:hidden p-2 text-gray-700"
				on:click={() => mobileMenuOpen = !mobileMenuOpen}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					{/if}
				</svg>
			</button>
		</div>
		
		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t">
				<div class="flex flex-col gap-4">
					<a href="/{lang}" class="text-gray-700 hover:text-primary transition-colors">
						{t(translations, 'nav.home')}
					</a>
					<a href="/{lang}/brands" class="text-gray-700 hover:text-primary transition-colors">
						{t(translations, 'nav.brands')}
					</a>
					
					{#if user}
						<a href="/{lang}/profile/reviews" class="text-gray-700 hover:text-primary transition-colors">
							{t(translations, 'nav.myReviews')}
						</a>
						<div class="pt-4 border-t">
							<p class="text-sm text-gray-600 mb-2">Logged in as {user.username}</p>
							<form method="POST" action="/{lang}/auth/logout">
								<button type="submit" class="text-red-600 hover:text-red-700">
									{t(translations, 'nav.logout')}
								</button>
							</form>
						</div>
					{:else}
						<a href="/{lang}/auth/login" class="text-gray-700 hover:text-primary transition-colors">
							{t(translations, 'nav.login')}
						</a>
						<a href="/{lang}/auth/register" class="btn-primary inline-block text-center">
							{t(translations, 'nav.register')}
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>
