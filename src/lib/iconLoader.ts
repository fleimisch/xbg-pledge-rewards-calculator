import { readdirSync } from 'fs';
import { join } from 'path';

export function loadIconFiles() {
    const iconsPath = join(process.cwd(), 'src', 'assets', 'content', 'icons');
    try {
        return readdirSync(iconsPath)
            .filter(file => file.endsWith('.svg'))
            .map(file => `src/assets/content/icons/${file}`);
    } catch (error) {
        console.error('Error loading icon files:', error);
        return [];
    }
} 