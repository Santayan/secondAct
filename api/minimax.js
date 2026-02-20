/**
 * Vercel Serverless Function — MiniMax API Proxy
 *
 * Proxies requests from the React frontend to the MiniMax API.
 * The API key lives ONLY here, as a server-side environment variable
 * (MINIMAX_API_KEY — no VITE_ prefix), so it is never exposed to the browser.
 *
 * Set in Vercel Dashboard → Settings → Environment Variables:
 *   MINIMAX_API_KEY  = <your real key>
 *   MINIMAX_API_BASE = https://api.minimax.io/v1          (optional, has default)
 *   MINIMAX_MODEL    = MiniMax-M2.5                       (optional, has default)
 */

const MINIMAX_API_BASE = process.env.MINIMAX_API_BASE || 'https://api.minimax.io/v1';
const MINIMAX_API_URL  = `${MINIMAX_API_BASE}/text/chatcompletion_v2`;
const MINIMAX_API_KEY  = process.env.MINIMAX_API_KEY;

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Guard: missing server-side key
    if (!MINIMAX_API_KEY) {
        console.error('[minimax proxy] MINIMAX_API_KEY is not set in Vercel environment variables.');
        return res.status(500).json({
            error: 'AI service is not configured. Please contact support.'
        });
    }

    try {
        const upstreamResponse = await fetch(MINIMAX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await upstreamResponse.json();

        // Forward the upstream status so the client can handle errors properly
        return res.status(upstreamResponse.status).json(data);

    } catch (err) {
        console.error('[minimax proxy] Upstream fetch failed:', err);
        return res.status(502).json({ error: 'Failed to reach AI service. Please try again.' });
    }
}
