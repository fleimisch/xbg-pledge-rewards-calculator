export const ssr = false; 
export const csr = true;

import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    throw redirect(307, '/rewards');
};