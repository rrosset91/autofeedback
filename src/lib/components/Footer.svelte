<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import type { Translations } from '$lib/types';
	
	export let translations: Translations;
	export let lang: string;
</script>

<footer class="bg-gray-900 text-gray-300 mt-16">
	<div class="container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- About -->
			<div>
				<a href="/{lang}" class="text-white text-lg font-bold mb-4 flex items-center gap-3 hover:opacity-80 transition-opacity inline-block">
					<img src="/images/logo.png" alt="AutoFeedback" class="h-8 w-auto" />
					<span>AutoFeedback</span>
				</a>
				<p class="text-sm text-gray-400 mt-4">
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
						<a href="/{lang}/search" class="hover:text-white transition-colors">
							{t(translations, 'nav.search')}
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
				</ul>
			</div>
		</div>
		
		<!-- Copyright -->
		<div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
			<p>&copy; {new Date().getFullYear()} AutoFeedback. All rights reserved.</p>
		</div>
	</div>
</footer>
