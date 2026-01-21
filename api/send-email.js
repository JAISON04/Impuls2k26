// Vercel Serverless Function for sending emails via Brevo API

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate API Key
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.CLIENT_KEY;

    if (!apiKey || apiKey !== validKey) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden: Invalid or missing API Key'
        });
    }

    const { to, name, event, college, year, amount, transactionId } = req.body;

    // Basic Validation
    if (!to || !name || !event) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: to, name, event'
        });
    }

    try {
        console.log(`📨 Sending email to ${to} for event: ${event}`);

        const brevoUrl = 'https://api.brevo.com/v3/smtp/email';
        const brevoApiKey = process.env.BREVO_API_KEY;

        if (!brevoApiKey) {
            throw new Error('Server misconfiguration: BREVO_API_KEY is missing');
        }

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
            <h2 style="color: #00d4ff; margin: 0 0 15px 0; font-size: 24px;">🎉 Registration Successful!</h2>
            <p style="color: #e0e0e0; margin: 0; line-height: 1.6;">
              Dear <strong style="color: #00d4ff;">${name}</strong>,<br><br>
              Your registration for <strong style="color: #ff00ff;">${event}</strong> has been confirmed. We're excited to have you join us!
            </p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 18px;">📋 Registration Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Event</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">${event}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Name</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">College</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${college || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Year</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${year || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Amount Paid</td>
                <td style="padding: 12px 0; color: #00ff88; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">₹${amount || 0}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888;">Transaction ID</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId || 'N/A'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 212, 255, 0.1)); border: 1px solid rgba(255, 0, 255, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #ff00ff; margin: 0 0 10px 0;">📅 February 6, 2026</h3>
            <p style="color: #e0e0e0; margin: 0;">Department of Electrical and Electronics Engineering</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #666; font-size: 12px; margin: 0;">
              For any queries, contact us at impulse2026@citimpulse.com<br><br>
              © 2026 IMPULSE - EEE Department Symposium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        const emailData = {
            sender: {
                name: "IMPULSE 2026",
                email: "jaisonbinufrank@gmail.com"
            },
            to: [{ email: to, name: name }],
            subject: `Registration Confirmed - ${event} | IMPULSE 2026`,
            htmlContent: emailHtml
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

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email via Brevo');
        }

        console.log(`✅ Email sent successfully! Message ID: ${data.messageId}`);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: data.messageId
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.message);

        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.message
        });
    }
}
