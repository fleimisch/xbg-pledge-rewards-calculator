import { readdirSync } from 'fs';
import { join } from 'path';

export function load() {
    const iconsPath = join(process.cwd(), 'src', 'assets', 'content', 'icons');
    try {
        const iconFiles = readdirSync(iconsPath)
            .filter(file => file.endsWith('.svg'))
            .map(file => `src/assets/content/icons/${file}`);
        
        return {
            iconFiles
        };
    } catch (error) {
        console.error('Error loading icon files:', error);
        return {
            iconFiles: []
        };
    }
} 