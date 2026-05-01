import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		// @resvg/resvg-js ships native bindings — keep it external so Vite doesn't try to bundle it.
		external: ['@resvg/resvg-js']
	}
});
