// api/send-telegram-message.js
// VERCEL_URL is an environment variable provided by Vercel during deployment,
// not used directly here but often available for serverless functions.
const { VERCEL_URL } = process.env; 

export default async function handler(req, res) {
    // Only allow POST requests for the contact form
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // Basic validation for required fields
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // IMPORTANT: Get these from Vercel Environment Variables, NOT hardcoded here!
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram bot token or chat ID is not set in environment variables.");
        return res.status(500).json({ message: 'Server configuration error: Telegram API credentials missing.' });
    }

    // --- Extract ALL Possible Request Data from Headers ---
    // IP Address: x-forwarded-for is reliable for client IP behind proxies like Vercel
    const userIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : (req.connection?.remoteAddress || 'N/A');
    // User-Agent: Browser and OS info
    const userAgent = req.headers['user-agent'] || 'N/A';
    // Referer: URL of the page that linked to this request
    const referer = req.headers['referer'] || 'N/A';
    // Origin: Scheme, host, and port of the resource that initiated the request
    const userOrigin = req.headers['origin'] || 'N/A';
    // Host: The domain name of the server being requested
    const host = req.headers['host'] || 'N/A';
    // Accept-Language: User's preferred language settings
    const acceptLanguage = req.headers['accept-language'] || 'N/A';
    // Accept-Encoding: Content encoding (e.g., gzip, deflate)
    const acceptEncoding = req.headers['accept-encoding'] || 'N/A';
    // Connection: Connection type (e.g., keep-alive)
    const connection = req.headers['connection'] || 'N/A';
    // Content-Type: Type of content being sent in the request body (should be application/json for this form)
    const contentType = req.headers['content-type'] || 'N/A';
    // Do Not Track: User's DNT preference
    const dnt = req.headers['dnt'] || 'N/A';
    // Upgrade-Insecure-Requests: Browser's request to upgrade to HTTPS
    const upgradeInsecureRequests = req.headers['upgrade-insecure-requests'] || 'N/A';

    // Newer Client Hints headers (may not be present in all browsers/requests)
    const secChUa = req.headers['sec-ch-ua'] || 'N/A';           // Browser brand and version
    const secChUaMobile = req.headers['sec-ch-ua-mobile'] || 'N/A'; // Is mobile device
    const secChUaPlatform = req.headers['sec-ch-ua-platform'] || 'N/A'; // OS platform

    // Fetch Metadata headers (provide context about how the request was made)
    const secFetchSite = req.headers['sec-fetch-site'] || 'N/A';     // Was it same-origin, cross-site etc.
    const secFetchMode = req.headers['sec-fetch-mode'] || 'N/A';     // e.g., cors, navigate
    const secFetchDest = req.headers['sec-fetch-dest'] || 'N/A';     // e.g., document, empty, image

    // Optional: Log all headers for deeper debugging if needed (remove in production)
    // console.log("All Request Headers:", req.headers);
    // --- END Extraction ---

    const text = `
*--- New Contact Form Submission ---*

*Name:* ${name}
*Email:* ${email}
*Message:*
\`\`\`
${message}
\`\`\`

*--- Technical Details ---*
*IP Address:* ${userIp}
*User-Agent:* ${userAgent}
*Referer:* ${referer}
*Origin:* ${userOrigin}
*Host:* ${host}
*Preferred Language:* ${acceptLanguage}
*Encoding:* ${acceptEncoding}
*Connection:* ${connection}
*Content-Type:* ${contentType}
*Do Not Track (DNT):* ${dnt}
*Upgrade Insecure Requests:* ${upgradeInsecureRequests}

*--- Client Hints (Browser Info) ---*
*Browser Brand/Version:* ${secChUa}
*Mobile Device:* ${secChUaMobile}
*OS Platform:* ${secChUaPlatform}

*--- Fetch Metadata ---*
*Fetch Site:* ${secFetchSite}
*Fetch Mode:* ${secFetchMode}
*Fetch Destination:* ${secFetchDest}
`.trim(); // .trim() removes leading/trailing whitespace

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown', // Use Markdown for bold text etc.
            }),
        });

        const telegramData = await telegramResponse.json();

        if (telegramResponse.ok && telegramData.ok) {
            return res.status(200).json({ message: 'Message sent successfully!' });
        } else {
            console.error('Telegram API error:', telegramData);
            return res.status(500).json({ message: 'Failed to send message via Telegram.', telegramError: telegramData.description });
        }
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
