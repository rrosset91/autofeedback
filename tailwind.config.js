/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#2563EB',
					dark: '#1E40AF',
					light: '#DBEAFE'
				},
				accent: {
					DEFAULT: '#F97316',
					orange: '#F97316',
					green: '#10B981',
					red: '#EF4444'
				}
			}
		},
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		}
	},
	plugins: []
}
