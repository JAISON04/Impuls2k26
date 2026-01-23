export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.CLIENT_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const { to, name, event, pdfBase64 } = req.body;

  if (!to || !name || !event || !pdfBase64) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    console.log(`📨 Sending OD email to ${to}`);
    const brevoUrl = 'https://api.brevo.com/v3/smtp/email';
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) throw new Error('BREVO_API_KEY missing');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #ff00ff); padding: 15px 30px; border-radius: 50px;">
              <h1 style="margin: 0; color: #0a0a0f; font-size: 28px; font-weight: bold;">⚡ IMPULSE 2026</h1>
            </div>
            <p style="color: #888; margin-top: 15px; font-size: 14px;">EEE Department Symposium</p>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 0, 255, 0.1)); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #00d4ff; margin: 0 0 15px 0; font-size: 24px;">📜 On-Duty Letter</h2>
            <p style="color: #e0e0e0; margin: 0; line-height: 1.6;">
              Dear <strong style="color: #00d4ff;">${name}</strong>,<br><br>
              Your On-Duty letter for participating in <strong style="color: #ff00ff;">${event}</strong> at IMPULSE 2026 is attached to this email.
            </p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 18px;">📋 Instructions</h3>
            <ul style="color: #e0e0e0; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Download and print the attached PDF</li>
              <li>Submit it to your institution's administration</li>
              <li>Keep a copy for your records</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 212, 255, 0.1)); border: 1px solid rgba(255, 0, 255, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #ff00ff; margin: 0 0 10px 0;">📅 February 5, 2026</h3>
            <p style="color: #e0e0e0; margin: 0;">Chennai Institute of Technology</p>
            <p style="color: #888; margin: 5px 0 0 0; font-size: 14px;">Department of Electrical and Electronics Engineering</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #666; font-size: 12px; margin: 0;">
              For any queries, contact us at jaisonbinufrank@gmail.com<br><br>
              © 2026 IMPULSE - EEE Department Symposium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailData = {
      sender: { name: "IMPULSE 2026", email: "jaisonbinufrank@gmail.com" },
      to: [{ email: to, name: name }],
      subject: `📜 On-Duty Letter - ${event} | IMPULSE 2026`,
      htmlContent: emailHtml,
      attachment: [
        {
          content: pdfBase64,
          name: `OD_Letter_${name.replace(/\s+/g, '_')}.pdf`
        }
      ]
    };

    const response = await fetch(brevoUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Brevo API Error');

    return res.status(200).json({ success: true, messageId: data.messageId });

  } catch (error) {
    console.error('OD Email Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}