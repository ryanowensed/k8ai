module.exports = async function handler(req, res) {
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
      ? `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;"><div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">K-8<span style="color:#0081f2;">/</span>AI</div><div style="font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:#9a9890;margin-bottom:2rem;">Practical AI for School Leaders</div><h1 style="font-size:1.5rem;line-height:1.2;margin-bottom:1rem;color:#34322d;">Your AI Policy Checklist is here, ${name}.</h1><p style="color:#5c5a55;line-height:1.65;margin-bottom:1.5rem;">Here are the five things your K-8 school needs to get right before implementing AI.</p><div style="border-left:3px solid #0081f2;padding:1rem 1.25rem;background:#fff;margin-bottom:1.5rem;"><div style="font-size:0.6rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#0081f2;margin-bottom:0.75rem;">The K-8 AI Policy Checklist</div><ol style="padding-left:1.25rem;color:#5c5a55;line-height:1.65;font-size:0.9rem;"><li style="margin-bottom:0.75rem;"><strong style="color:#34322d;">The one question every K-8 school must answer first.</strong><br>Before any tool, any policy, any rollout: Does your school have a clear position on what problem AI is solving? Schools that cannot answer this in one sentence are not ready to implement.</li><li style="margin-bottom:0.75rem;"><strong style="color:#34322d;">Draft your student AI acceptable use policy this week.</strong><br>Step 1: Define permitted uses. Step 2: Define prohibited uses. Step 3: State consequences. Step 4: Define enforcement. Step 5: Set a review date.</li><li style="margin-bottom:0.75rem;"><strong style="color:#34322d;">FERPA/COPPA red flags to check on any vendor.</strong><br>Ask: Does the tool store student data? Where? For how long? Is it used to train AI models? Do you have a signed Data Processing Agreement?</li><li style="margin-bottom:0.75rem;"><strong style="color:#34322d;">Three documents for your next board meeting.</strong><br>(1) A one-page AI position statement. (2) A student AI acceptable use policy. (3) A summary of which tools are approved and in use.</li><li><strong style="color:#34322d;">The 90-day implementation timeline.</strong><br>Month 1: Policy and governance. Month 2: Staff orientation and tool vetting. Month 3: Pilot with willing teachers, gather feedback, adjust.</li></ol></div><p style="font-size:0.8rem;color:#9a9890;border-top:1px solid #dddbd6;padding-top:1rem;margin-top:1rem;">K-8 AI - Written by Ryan David - k 8ai.com</p></div>`
      : `<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#34322d;background:#f8f8f7;padding:2rem;"><div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">K-8<span style="color:#0081f2;">/</span>AI</div><h1 style="font-size:1.5rem;line-height:1.2;margin-bottom:1rem;color:#34322d;">Welcome, ${name}. First issue arriving this week.</h1><p style="color:#5c5a55;line-height:1.65;margin-bottom:1rem;">Every week you will get one implementation insight, one policy note, and one real school story.</p><p style="color:#5c5a55;line-height:1.65;margin-bottom:1.5rem;">No consultants. No theory. What actually works on Monday.</p><p style="font-size:0.8rem;color:#9a9890;border-top:1px solid #dddbd6;padding-top:1rem;margin-top:1rem;">K-8 AI - Written by Ryan David - k 8ai.com</p></div>`
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
