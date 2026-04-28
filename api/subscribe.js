export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { name, email, list } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error.' });
  }
  const isChecklist = list === 'checklist';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Ryan David <ryan@k-8ai.com>',
        to: [email],
        subject: isChecklist ? 'Your K-8 AI Policy Checklist' : 'Welcome to K-8 AI',
        html: `<p>Hi ${name}, your checklist is on its way.</p>`
      })
    });
    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ message: 'Failed to send email.' });
    }
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}
