
interface Env {
  BOT_TOKEN: string;
  CHAT_ID: string;
}

export const onRequest = async (context: any) => {
  // Handle CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { message, category, userEmail } = await context.request.json();
    
    // Format the message for Telegram
    const telegramMessage = `🆕 New Feedback\n\n` +
      `📝 Category: ${category}\n` +
      `✉️ Email: ${userEmail || 'Not provided'}\n\n` +
      `💬 Message:\n${message}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${context.env.BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: context.env.CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send to Telegram');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to process feedback' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
