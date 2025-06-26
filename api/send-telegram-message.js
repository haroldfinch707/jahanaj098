// api/send-telegram-message.js
const { VERCEL_URL } = process.env; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    const {
        screenResolution,
        viewportDimensions,
        currentPageURL,
        timeZone,
        browserLanguage,
        deviceMemory,
        hardwareConcurrency,
        platform,
        languages,
        colorDepth,
        pixelDepth,
        cookieEnabled,
        javaEnabled,
        onlineStatus,
        screenOrientation,
        batteryLevel,
        localStorageSupport,
        sessionStorageSupport,
        indexedDbSupport,
        plugins,
        canvasFingerprint,
        webglFingerprint,
        timezoneOffset,
        performanceTiming
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram bot token or chat ID is not set in environment variables.");
        return res.status(500).json({ message: 'Server configuration error: Telegram API credentials missing.' });
    }

    const userIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : (req.connection?.remoteAddress || 'N/A');
    const userAgent = req.headers['user-agent'] || 'N/A';
    const referer = req.headers['referer'] || 'N/A';
    const userOrigin = req.headers['origin'] || 'N/A';
    const host = req.headers['host'] || 'N/A';
    const acceptLanguage = req.headers['accept-language'] || 'N/A';
    const acceptEncoding = req.headers['accept-encoding'] || 'N/A';
    const connection = req.headers['connection'] || 'N/A';
    const contentType = req.headers['content-type'] || 'N/A';
    const dnt = req.headers['dnt'] || 'N/A';
    const upgradeInsecureRequests = req.headers['upgrade-insecure-requests'] || 'N/A';

    const secChUa = req.headers['sec-ch-ua'] || 'N/A';
    const secChUaMobile = req.headers['sec-ch-ua-mobile'] || 'N/A';
    const secChUaPlatform = req.headers['sec-ch-ua-platform'] || 'N/A';

    const secFetchSite = req.headers['sec-fetch-site'] || 'N/A';
    const secFetchMode = req.headers['sec-fetch-mode'] || 'N/A';
    const secFetchDest = req.headers['sec-fetch-dest'] || 'N/A';

    const text = `
*--- New Contact Form Submission ---*

*Name:* ${name}
*Email:* ${email}
*Message:*
\
\\`\`\`
${message}
\\`\`\`

*--- Client-Side Browser Details ---*
*Screen Resolution:* ${screenResolution}
*Viewport Dimensions:* ${viewportDimensions}
*Current Page URL:* ${currentPageURL}
*Time Zone:* ${timeZone}
*Browser Language:* ${browserLanguage}
*Platform:* ${platform}
*Languages:* ${languages}
*Device Memory:* ${deviceMemory} GB
*CPU Cores:* ${hardwareConcurrency}
*Color Depth:* ${colorDepth}
*Pixel Depth:* ${pixelDepth}
*Cookies Enabled:* ${cookieEnabled}
*Java Enabled:* ${javaEnabled}
*Online:* ${onlineStatus}
*Screen Orientation:* ${screenOrientation}
*Battery Level:* ${batteryLevel}
*LocalStorage Supported:* ${localStorageSupport}
*SessionStorage Supported:* ${sessionStorageSupport}
*IndexedDB Supported:* ${indexedDbSupport}
*Plugins:* ${plugins}
*Canvas Fingerprint:* ${canvasFingerprint}
*WebGL Fingerprint:* ${webglFingerprint}
*Timezone Offset:* ${timezoneOffset}
*Performance Timing:* ${JSON.stringify(performanceTiming)}

*--- Technical Details (HTTP Headers) ---*
*IP Address:* ${userIp}
*User-Agent:* ${userAgent}
*Referer:* ${referer}
*Origin:* ${userOrigin}
*Host:* ${host}
*Preferred Language (Header):* ${acceptLanguage}
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
`.trim();

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
                parse_mode: 'Markdown'
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
