<script lang="ts">
  import { t } from "$lib/utils/i18n";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ translations, lang, user } = data);
</script>

<svelte:head>
  <title>{t(translations, "hero.title")} - AutoFeedback</title>
  <meta name="description" content={t(translations, "hero.subtitle")} />
</svelte:head>

<!-- Hero Section -->
<div class="bg-gradient-to-br from-primary to-primary-dark text-white">
  <div class="container mx-auto px-4 py-20 text-center">
    <h1 class="text-4xl md:text-6xl font-bold mb-6">
      {t(translations, "hero.title")}
    </h1>
    <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
      {t(translations, "hero.subtitle")}
    </p>

    <!-- User greeting -->
    {#if user}
      <div class="mb-8 p-4 bg-white/10 rounded-lg inline-block">
        <p class="text-lg">
          Welcome back, <strong>{user.username}</strong>! 👋
        </p>
      </div>
    {/if}

    <!-- CTAs -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/{lang}/search"
        class="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
      >
        {t(translations, "hero.cta")}
      </a>
      {#if !user}
        <a
          href="/{lang}/auth/register"
          class="bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          {t(translations, "hero.writeReview")}
        </a>
      {/if}
    </div>
  </div>
</div>

<!-- Features Section -->
<div class="bg-gray-50 py-16">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
      {t(translations, "features.title")}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1: Authentic Reviews -->
      <div
        class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow"
      >
        <div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img
            src="/images/features/reliability-icon.svg"
            alt="Authentic"
            class="w-full h-full"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {t(translations, "features.authentic.title")}
        </h3>
        <p class="text-gray-600">
          {t(translations, "features.authentic.description")}
        </p>
      </div>

      <!-- Feature 2: Detailed Insights -->
      <div
        class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow"
      >
        <div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img
            src="/images/features/performance-icon.svg"
            alt="Detailed"
            class="w-full h-full"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {t(translations, "features.detailed.title")}
        </h3>
        <p class="text-gray-600">
          {t(translations, "features.detailed.description")}
        </p>
      </div>

      <!-- Feature 3: European Focus -->
      <div
        class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow"
      >
        <div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img
            src="/images/features/europe.svg"
            alt="European"
            class="w-full h-full"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {t(translations, "features.european.title")}
        </h3>
        <p class="text-gray-600">
          {t(translations, "features.european.description")}
        </p>
      </div>
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="bg-white py-16">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">
      Ready to share your experience?
    </h2>
    <p class="text-xl text-gray-600 mb-8">
      Help other buyers make informed decisions
    </p>
    {#if user}
      <a
        href="/{lang}/brands"
        class="btn-primary text-lg px-8 py-4 inline-block"
      >
        Browse Car Models
      </a>
    {:else}
      <a
        href="/{lang}/auth/register"
        class="btn-primary text-lg px-8 py-4 inline-block"
      >
        Get Started - It's Free
      </a>
    {/if}
  </div>
</div>
