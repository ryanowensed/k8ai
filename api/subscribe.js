export const config = { runtime: 'nodejs' };

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
  const PDF_URL = 'https://drive.google.com/uc?export=download&id=110YYAFl4hhGRve1gePxOvZuRsYnaoKgG';

  const emailPayload = {
    from: 'Ryan David <ryan@k-8ai.com>',
    to: [email],
    subject: isChecklist
      ? 'Your K-8 AI Policy Checklist'
      : 'Welcome to K-8 AI — First issue arriving this week',
    html: isChecklist
      ? `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;">
          <div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">K-8<span style="color:#0081f2;">/</span>AI</div>
          <div style="font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:#9a9890;margin-bottom:2rem;">Practical AI for School Leaders</div>

          <h1 style="font-size:1.5rem;line-height:1.2;margin-bottom:0.75rem;color:#34322d;">Your AI Policy Checklist is here, ${name}.</h1>
          <p style="color:#5c5a55;line-height:1.65;margin-bottom:1.5rem;">Five things to get right before your school goes any further with AI. Written by a practitioner. Ready to use this week.</p>

          <div style="margin-bottom:1.75rem;">
            <a href="${PDF_URL}" style="display:inline-block;background:#0081f2;color:#ffffff;font-family:'DM Sans',system-ui,sans-serif;font-size:0.9rem;font-weight:500;letter-spacing:0.04em;padding:0.75em 1.75em;text-decoration:none;border-radius:2px;">Download the Checklist (PDF)</a>
          </div>

          <div style="border-left:3px solid #0081f2;padding:1rem 1.25rem;background:#ffffff;margin-bottom:1.5rem;">
            <div style="font-size:0.6rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#0081f2;margin-bottom:0.75rem;">What's inside</div>
            <ol style="padding-left:1.25rem;color:#5c5a55;line-height:1.65;font-size:0.875rem;margin:0;">
              <li style="margin-bottom:0.5rem;">The one question every K-8 school must answer before adopting any AI tool</li>
              <li style="margin-bottom:0.5rem;">A 5-step framework for drafting a student AI acceptable use policy this week</li>
              <li style="margin-bottom:0.5rem;">The FERPA/COPPA red flags to check on any vendor before approving classroom use</li>
              <li style="margin-bottom:0.5rem;">The three documents every K-8 school needs before the next board meeting</li>
              <li>A 90-day implementation timeline that works without a dedicated IT department</li>
            </ol>
          </div>

          <p style="font-size:0.8rem;color:#5c5a55;line-height:1.6;margin-bottom:1.5rem;">If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${PDF_URL}" style="color:#0081f2;word-break:break-all;">${PDF_URL}</a></p>

          <p style="font-size:0.8rem;color:#9a9890;border-top:1px solid #dddbd6;padding-top:1rem;margin-top:1rem;">
            K-8 AI &mdash; Written by Ryan David &mdash; <a href="https://k-8ai.com" style="color:#0081f2;">k-8ai.com</a><br>
            You're receiving this because you requested the free AI Policy Checklist.
          </p>
        </div>`
      : `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;">
          <div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">K-8<span style="color:#0081f2;">/</span>AI</div>
          <div style="font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:#9a9890;margin-bottom:2rem;">Practical AI for School Leaders</div>

          <h1 style="font-size:1.5rem;line-height:1.2;margin-bottom:0.75rem;color:#34322d;">Welcome, ${name}. First issue arriving this week.</h1>
          <p style="color:#5c5a55;line-height:1.65;margin-bottom:1rem;">Every week you'll get one implementation insight, one policy note, and one real school story.</p>
          <p style="color:#5c5a55;line-height:1.65;margin-bottom:1.5rem;">No consultants. No theory. What actually works on Monday.</p>

          <div style="border-left:3px solid #0081f2;padding:1rem 1.25rem;background:#ffffff;margin-bottom:1.5rem;">
            <div style="font-size:0.6rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#0081f2;margin-bottom:0.6rem;">While you wait — get the free checklist</div>
            <p style="font-size:0.875rem;color:#5c5a55;line-height:1.6;margin:0 0 0.75rem 0;">Five things your K-8 school needs to get right before implementing AI.</p>
            <a href="${PDF_URL}" style="display:inline-block;background:#0081f2;color:#ffffff;font-family:'DM Sans',system-ui,sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.04em;padding:0.6em 1.4em;text-decoration:none;border-radius:2px;">Download the AI Policy Checklist</a>
          </div>

          <p style="font-size:0.8rem;color:#9a9890;border-top:1px solid #dddbd6;padding-top:1rem;margin-top:1rem;">
            K-8 AI &mdash; Written by Ryan David &mdash; <a href="https://k-8ai.com" style="color:#0081f2;">k-8ai.com</a><br>
            You're receiving this because you subscribed to the K-8 AI weekly read.
          </p>
        </div>`
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
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
