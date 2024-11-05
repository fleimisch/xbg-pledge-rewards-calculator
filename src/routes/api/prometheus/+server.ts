import { ETHERSCAN_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const CONTRACT_ADDRESS = '0x5A3E7Fd48d9E88C22C391e0E4836C8e211DAeE66';
const ETHERSCAN_API = 'https://api.etherscan.io/api';

export const GET: RequestHandler = async () => {
    try {
        if (!ETHERSCAN_API_KEY) {
            throw new Error('ETHERSCAN_API_KEY is not set');
        }

        const response = await fetch(
            `${ETHERSCAN_API}?module=account&action=tokennfttx&contractaddress=${CONTRACT_ADDRESS}&page=1&offset=10000&sort=asc&apikey=${ETHERSCAN_API_KEY}`
        );

        const data = await response.json();
        
        if (data.status !== '1') {
            throw new Error(`Etherscan API error: ${data.message}`);
        }

        // Process transfers to get current owners and timestamps
        const nftMap = new Map();
        
        data.result.forEach((tx: any) => {
            const tokenId = parseInt(tx.tokenID);
            nftMap.set(tokenId, {
                tokenId,
                currentHolder: tx.to,
                acquisitionTimestamp: parseInt(tx.timeStamp)
            });
        });

        // Convert map to array and sort
        const nfts = Array.from(nftMap.values())
            .sort((a, b) => a.tokenId - b.tokenId);

        return json(nfts);
    } catch (error) {
        console.error("Error fetching Prometheus data:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch NFT data' }), {
            status: 500
        });
    }
}; 