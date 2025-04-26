
const BOT_TOKEN = "6184053476:AAGTb4xDA1C-Ru0bOvG1VmLwrZFN429OG1w";
const CHAT_ID = "5350055035";

export interface FeedbackPayload {
  message: string;
  userEmail?: string;
  category: 'bug' | 'feature' | 'other';
  screenshot?: string;
}

export const sendFeedback = async (feedback: FeedbackPayload): Promise<boolean> => {
  try {
    const telegramMessage = `🆕 New Feedback\n\n` +
      `📝 Category: ${feedback.category}\n` +
      `✉️ Email: ${feedback.userEmail || 'Not provided'}\n\n` +
      `💬 Message:\n${feedback.message}`;

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }

    return true;
  } catch (error) {
    console.error('Error sending feedback:', error);
    return false;
  }
};
