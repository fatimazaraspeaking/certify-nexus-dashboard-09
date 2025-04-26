
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export interface FeedbackPayload {
  message: string;
  userEmail?: string;
  category: 'bug' | 'feature' | 'other';
  screenshot?: string;
}

export const sendFeedback = async (feedback: FeedbackPayload): Promise<boolean> => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
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
