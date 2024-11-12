/// <reference types="node" />
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { compilerIcons } from 'vite-plugin-svg-icons';
import fs from 'fs/promises';
import path from 'path';

const SPRITES_VERSION = '1014';
const isDev = process.env.NODE_ENV === 'development';

async function generateSprites() {
	const cache = new Map();
	
	try {
		// Generate sprite content
		const response = await compilerIcons(cache, {}, {
			iconDirs: [path.resolve(process.cwd(), 'src/assets/content/icons')],
			symbolId: '[name]'
		});

		const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg">${response.insertHtml}</svg>`;

		// Write directly to static directory
		const staticDir = path.resolve(process.cwd(), 'static');
		
		// Ensure static directory exists
		await fs.mkdir(staticDir, { recursive: true });

		// Write new sprite file
		const fileName = `sprites-${SPRITES_VERSION}.svg`;
		await fs.writeFile(
			path.join(staticDir, fileName),
			spriteContent
		);

		console.log(`✓ Generated sprite file: /${fileName}`);
	} catch (error) {
		console.error('Error generating sprites:', error);
		throw error;
	}
}

function spritePlugin() {
	return {
		name: 'sprite-generator',
		async configureServer(server: any) {
			// Check if sprite exists in dev mode
			const staticDir = path.resolve(process.cwd(), 'static');
			const spritePath = path.join(staticDir, `sprites-${SPRITES_VERSION}.svg`);
			
			try {
				await fs.access(spritePath);
				console.log('Sprite file exists, skipping generation');
			} catch {
				console.log('Sprite file not found, generating...');
				await generateSprites();
			}
		},
		async writeBundle(options: any) {
			const staticDir = path.resolve(process.cwd(), 'static');
			
			// Clean up old sprite files only in production build
			const files = await fs.readdir(staticDir);
			await Promise.all(
				files
					.filter(file => file.startsWith('sprites-') && file.endsWith('.svg'))
					.map(file => fs.unlink(path.join(staticDir, file)))
			);

			// Generate new sprites
			await generateSprites();
		}
	};
}

export default defineConfig({
	plugins: [
		sveltekit(),
		spritePlugin()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		'process.env.__ICONSVERSION__': SPRITES_VERSION
	},
	server: isDev ? {
		fs: {
				// Allow serving files from one level up to the project root only in dev
				allow: ['..']
		}
	} : undefined
});
