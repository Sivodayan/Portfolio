export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const accessKey =
      process.env.VITE_WEB3FORMS_ACCESS_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      '603b1bde-ad42-4b56-91c0-3f8d5f1d2b00';

    const subjectLine = subject?.trim() || `Portfolio Contact from ${String(name).trim()}`;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Vercel-Serverless/1.0',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        replyto: email,
        subject: subjectLine,
        message,
        from_name: `${name} (via Sivodayan Portfolio)`,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Internal Server Error',
    });
  }
}
