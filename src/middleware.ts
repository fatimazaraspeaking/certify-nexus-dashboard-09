
import { Request, Response } from 'express';

const BOT_TOKEN = "6184053476:AAGTb4xDA1C-Ru0bOvG1VmLwrZFN429OG1w";
const CHAT_ID = "5350055035";

export const feedbackMiddleware = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, category, userEmail } = req.body;
    
    // Format the message for Telegram
    const telegramMessage = `🆕 New Feedback\n\n` +
      `📝 Category: ${category}\n` +
      `✉️ Email: ${userEmail || 'Not provided'}\n\n` +
      `💬 Message:\n${message}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send to Telegram');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process feedback' 
    });
  }
};
