/// <reference types="node" />
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

let production = process.env.NODE_ENV === 'production';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify('development'), // for tippy.js
		'process.env.DEVICE': JSON.stringify('desktop'),
		'process.env.PRODUCTION': production,
	}
});
