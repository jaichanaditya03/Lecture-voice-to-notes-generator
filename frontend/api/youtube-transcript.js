import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req, res) {
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log(`[YT-Transcript] Fetching transcript for: ${url}`);

        // Extract video ID from URL
        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Fetch transcript using youtube-transcript library
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcriptItems || transcriptItems.length === 0) {
            return res.status(404).json({ error: 'No transcript found for this video. Please upload the audio file directly.' });
        }

        // Combine all segments into full text
        const fullTranscript = transcriptItems.map(item => item.text).join(' ');

        console.log(`[YT-Transcript] Success! Got ${fullTranscript.length} characters`);

        return res.status(200).json({ transcript: fullTranscript });

    } catch (error) {
        console.error(`[YT-Transcript] Error: ${error.message}`);

        const errMsg = error.message?.toLowerCase() || '';
        if (errMsg.includes('disabled') || errMsg.includes('no captions')) {
            return res.status(500).json({ error: 'This video has no captions/subtitles. Please upload the audio file directly.' });
        } else if (errMsg.includes('unavailable') || errMsg.includes('not available')) {
            return res.status(500).json({ error: 'This video is unavailable or restricted. Please try a different video or upload the audio file directly.' });
        } else {
            return res.status(500).json({ error: `Could not extract YouTube transcript. Please try uploading the audio file directly.` });
        }
    }
}

function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}
