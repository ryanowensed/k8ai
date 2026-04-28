export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, list } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  const isChecklist = list === 'checklist';

  const emailPayload = {
    from: 'Ryan David <ryan@k-8ai.com>',
    to: [email],
    subject: isChecklist
      ? 'Your K-8 AI Policy Checklist'
      : 'Welcome to K-8 AI — First issue arriving this week',
    html: isChecklist
      ? `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;"><div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">K-8<span style="color:#0081f2;">/</span>AI</div><h1 style="font-size:1.5rem;margin-bottom:1rem;">Your AI Policy Checklist is here, ${name}.</h1><p style="color:#5c5a55;line-height:1.65;margin-bottom:1.5rem;">Here are the five things your K-8 school needs to get right before implementing AI.</p><p style="font-size:0.8rem;color:#9a9890;border-top:1px solid #dddbd6;padding-top:1rem;">K-8 AI - Written by Ryan David - k8ai.com</p></div>`
      : `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;"><h1 style="font-size:1.5rem;margin-bottom:1rem;">Welcome, ${name}. First issue arriving this week.</h1><p style="color:#5c5a55;line-height:1.65;">No consultants. No theory. What actually works on Monday.</p></div>`
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });
    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to send email. Please try again.' });
    }
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
}
