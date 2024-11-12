import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export async function GET({ params }) {
    try {
        const filePath = path.join(process.cwd(), 'src', 'assets', 'content', 'icons', params.file);
        const file = await fs.readFile(filePath);
        
        return new Response(file, {
            headers: {
                'Content-Type': 'image/svg+xml'
            }
        });
    } catch (e) {
        throw error(404, 'Icon not found');
    }
} 