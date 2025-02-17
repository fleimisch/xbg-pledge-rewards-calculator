import type { RequestHandler } from './$types';
import { Redis } from '@upstash/redis';
import { PRIVATE_UPSTASH_REDIS_REST_URL, PRIVATE_UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

const CACHE_DURATION = 6 * 60 * 60; // 6 hours in seconds
const XBORG_API = 'https://xbg.xborg.com/api/v2/leaderboard';

// Initialize Upstash Redis with environment variables
const redis = new Redis({
    url: PRIVATE_UPSTASH_REDIS_REST_URL,
    token: PRIVATE_UPSTASH_REDIS_REST_TOKEN,
});

// In-memory fallback cache
const memoryCache: Map<string, { data: any; timestamp: number }> = new Map();

async function getCachedData(key: string) {
    try {
        // Try Redis first
        const cachedData = await redis.get(key);
        if (cachedData) {
            return cachedData;
        }

        // Fallback to memory cache
        const memoryCacheEntry = memoryCache.get(key);
        if (memoryCacheEntry && Date.now() - memoryCacheEntry.timestamp < CACHE_DURATION * 1000) {
            return memoryCacheEntry.data;
        }

        return null;
    } catch (error) {
        console.error('Cache retrieval error:', error);
        // If Redis fails, try memory cache
        const memoryCacheEntry = memoryCache.get(key);
        if (memoryCacheEntry && Date.now() - memoryCacheEntry.timestamp < CACHE_DURATION * 1000) {
            return memoryCacheEntry.data;
        }
        return null;
    }
}

async function setCachedData(key: string, data: any) {
    try {
        // Set in Redis with expiration
        await redis.set(key, data, {
            ex: CACHE_DURATION
        });

        // Also set in memory cache as fallback
        memoryCache.set(key, {
            data,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Cache setting error:', error);
        // If Redis fails, at least set memory cache
        memoryCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Get the cache key from URL parameter, default to 'xborg_leaderboard'
        const cacheKey = url.searchParams.get('key') || 'xborg_leaderboard';

        // Try to get cached data
        const cachedData = await getCachedData(cacheKey);
        if (cachedData) {
            console.log('Serving from cache');
            return new Response(JSON.stringify({ data: cachedData }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // If no cache, fetch new data
        console.log('Fetching fresh data from XBorg API');
        const response = await fetch(
            `${XBORG_API}?index=6&page=1&pageSize=10000`
        );

        if (!response.ok) {
            throw new Error(`XBorg API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the new data
        await setCachedData(cacheKey, data);

        return new Response(JSON.stringify({ data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching XBorg data:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch XBorg data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 