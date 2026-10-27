import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
	output: 'static',
	adapter: cloudflare({ imageService: 'compile' }),
	session: false,
	vite: {
		plugins: [tailwindcss()],
	},
});
