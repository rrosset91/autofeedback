import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: false,
		rollupOptions: {
			onwarn(warning, warn) {
				// Log all warnings
				console.warn('Rollup warning:', warning.message);
				warn(warning);
			}
		}
	}
});
