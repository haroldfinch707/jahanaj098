// api/send-telegram-message.js
const { VERCEL_URL } = process.env;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // IMPORTANT: Get these from Vercel Environment Variables, NOT hardcoded here!
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram bot token or chat ID is not set in environment variables.");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const text = `
*New Contact Form Submission*
*Name:* ${name}
*Email:* ${email}
*Message:*
${message}
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
