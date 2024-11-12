import type { PageServerLoad } from './$types';
import { Redis } from '@upstash/redis';
import {PRIVATE_UPSTASH_REDIS_REST_URL, PRIVATE_UPSTASH_REDIS_REST_TOKEN, PRIVATE_ETHERSCAN_API_KEY} from '$env/static/private';
const CONTRACT_ADDRESS = '0x5A3E7Fd48d9E88C22C391e0E4836C8e211DAeE66';
const ETHERSCAN_API = 'https://api.etherscan.io/api';
const CACHE_DURATION = 12 * 60 * 60; // 12 hours in seconds
const REDIS_KEY = 'prometheus_nfts_data';

// Initialize Upstash Redis with environment variables
const redis = new Redis({
    url: PRIVATE_UPSTASH_REDIS_REST_URL,
    token: PRIVATE_UPSTASH_REDIS_REST_TOKEN,
});

// In-memory fallback cache
let memoryCache: {
    data: any;
    timestamp: number;
} | null = null;

async function getCachedData() {
    try {
        // Try Redis first
        const cachedData = await redis.get(REDIS_KEY);
        if (cachedData) {
            return cachedData;
        }

        // Fallback to memory cache
        if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION * 1000) {
            return memoryCache.data;
        }

        return null;
    } catch (error) {
        console.error('Cache retrieval error:', error);
        // If Redis fails, try memory cache
        if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION * 1000) {
            return memoryCache.data;
        }
        return null;
    }
}

async function setCachedData(data: any) {
    try {
        // Set in Redis with expiration
        await redis.set(REDIS_KEY, data, {
            ex: CACHE_DURATION // Expire after 24 hours
        });

        // Also set in memory cache as fallback
        memoryCache = {
            data,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Cache setting error:', error);
        // If Redis fails, at least set memory cache
        memoryCache = {
            data,
            timestamp: Date.now()
        };
    }
}

export const load: PageServerLoad = async () => {
    // try {
    //     // Try to get cached data
    //     const cachedData = await getCachedData();
    //     if (cachedData) {
    //         console.log('Serving from cache');
    //         return { nfts: cachedData };
    //     }

    //     // If no cache, fetch new data
    //     console.log('Fetching fresh data');
    //     const response = await fetch(
    //         `${ETHERSCAN_API}?module=account&action=tokennfttx&contractaddress=${CONTRACT_ADDRESS}&page=1&offset=10000&sort=asc&apikey=${PRIVATE_ETHERSCAN_API_KEY}`
    //     );

    //     const data = await response.json();
        
    //     if (data.status !== '1') {
    //         throw new Error(`Etherscan API error: ${data.message}`);
    //     }

    //     // Process transfers to get current owners and timestamps
    //     const nftMap = new Map();
        
    //     data.result.forEach((tx: any) => {
    //         const tokenId = parseInt(tx.tokenID);
    //         nftMap.set(tokenId, {
    //             tokenId,
    //             currentHolder: tx.to,
    //             acquisitionTimestamp: parseInt(tx.timeStamp)
    //         });
    //     });

    //     // Convert map to array and sort
    //     const nfts = Array.from(nftMap.values())
    //         .sort((a, b) => a.tokenId - b.tokenId);

    //     // Cache the new data
    //     await setCachedData(nfts);

    //     return { nfts };
    // } catch (error) {
    //     console.error("Error fetching Prometheus data:", error);
    //     return {
    //         error: 'Failed to fetch NFT data'
    //     };
    // }
}; 