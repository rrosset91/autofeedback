<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let showBanner = false;
	let consentGiven = false;
	
	onMount(() => {
		if (browser) {
			const consent = localStorage.getItem('cookieConsent');
			if (!consent) {
				showBanner = true;
			} else {
				consentGiven = consent === 'accepted';
			}
		}
	});
	
	function acceptCookies() {
		if (browser) {
			localStorage.setItem('cookieConsent', 'accepted');
			showBanner = false;
			consentGiven = true;
			
			// Reload to activate Google Analytics/AdSense if needed
			window.location.reload();
		}
	}
	
	function rejectCookies() {
		if (browser) {
			localStorage.setItem('cookieConsent', 'rejected');
			showBanner = false;
			consentGiven = false;
		}
	}
</script>

{#if showBanner}
	<div class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50 animate-slide-up">
		<div class="container mx-auto max-w-7xl">
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<div class="flex-1">
					<h3 class="text-lg font-semibold mb-2">🍪 We use cookies</h3>
					<p class="text-sm text-gray-300">
						We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
						By clicking "Accept All", you consent to our use of cookies.
						<a href="/en/privacy" class="text-accent hover:underline ml-1">Learn more</a>
					</p>
				</div>
				
				<div class="flex gap-3 flex-shrink-0">
					<button
						on:click={rejectCookies}
						class="px-6 py-2 border border-gray-500 hover:border-gray-400 rounded-lg transition-colors"
					>
						Reject
					</button>
					<button
						on:click={acceptCookies}
						class="px-6 py-2 bg-accent hover:bg-accent-dark rounded-lg font-semibold transition-colors"
					>
						Accept All
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	
	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
