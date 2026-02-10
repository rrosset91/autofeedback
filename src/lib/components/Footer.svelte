<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { Translations } from '$lib/types';
	
	export let translations: Translations;
	export let lang: string;
</script>

<footer class="bg-gray-900 text-gray-300 mt-16">
	<div class="container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- About -->
			<div>
				<h3 class="text-white text-lg font-bold mb-4 flex items-center gap-2">
					<span>🚗</span>
					<span>AutoFeedback</span>
				</h3>
				<p class="text-sm text-gray-400">
					Real car reviews from real owners across Europe. Make informed decisions with authentic feedback.
				</p>
			</div>
			
			<!-- Navigation -->
			<div>
				<h4 class="text-white font-semibold mb-4">Navigation</h4>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/{lang}" class="hover:text-white transition-colors">
							{t(translations, 'nav.home')}
						</a>
					</li>
					<li>
						<a href="/{lang}/brands" class="hover:text-white transition-colors">
							{t(translations, 'nav.brands')}
						</a>
					</li>
				</ul>
			</div>
			
			<!-- Languages -->
			<div>
				<h4 class="text-white font-semibold mb-4">Languages</h4>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/en" class="flex items-center gap-2 hover:text-white transition-colors">
							<img src="/images/icons/english.png" alt="English" class="w-5 h-5" />
							English
						</a>
					</li>
					<li>
						<a href="/pt" class="flex items-center gap-2 hover:text-white transition-colors">
							<img src="/images/icons/portuguese.png" alt="Português" class="w-5 h-5" />
							Português
						</a>
					</li>
					<li>
						<a href="/fr" class="flex items-center gap-2 hover:text-white transition-colors">
							<img src="/images/icons/french.png" alt="Français" class="w-5 h-5" />
							Français
						</a>
					</li>
					<li>
						<a href="/es" class="flex items-center gap-2 hover:text-white transition-colors">
							<img src="/images/icons/spanish.png" alt="Español" class="w-5 h-5" />
							Español
						</a>
					</li>
				</ul>
			</div>
			
			<!-- Legal -->
			<div>
				<h4 class="text-white font-semibold mb-4">Legal</h4>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/{lang}/privacy" class="hover:text-white transition-colors">
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="/{lang}/terms" class="hover:text-white transition-colors">
							Terms of Service
						</a>
					</li>
					<li>
						<a href="/{lang}/contact" class="hover:text-white transition-colors">
							Contact
						</a>
					</li>
				</ul>
			</div>
		</div>
		
		<!-- Copyright -->
		<div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
			<p>&copy; {new Date().getFullYear()} AutoFeedback. All rights reserved.</p>
		</div>
	</div>
</footer>
