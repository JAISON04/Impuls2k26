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

    const { to, name, event, qrCode } = req.body;

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

        const emailData = {
            sender: {
                name: "Jaison (Impulse Team)",
                email: "jaisonbinufrank@gmail.com"
            },
            to: [{ email: to, name: name }],
            subject: "🎉 Registration Confirmed - Impulse 2026",
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0;">Registration Confirmed!</h1>
                        <p style="font-size: 18px; margin-top: 10px;">Impulse 2026</p>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
                        <p>Hello <strong>${name}</strong>,</p>
                        
                        <p>Your registration for <strong>${event}</strong> has been successfully confirmed.</p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Participant:</strong> ${name}</p>
                            <p style="margin: 5px 0;"><strong>Event:</strong> ${event}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ✅ Confirmed</p>
                        </div>

                        ${qrCode ? `
                        <div style="text-align: center; margin: 20px 0;">
                            <p><strong>Your Entry QR Code:</strong></p>
                            <img src="${qrCode}" alt="QR Code" style="width: 200px; height: 200px; border: 5px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
                        </div>
                        ` : ''}

                        <p>Please show this email or your QR code at the registration desk on the day of the event.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        
                        <p style="font-size: 14px; color: #64748b; text-align: center;">
                            Chennai Institute of Technology<br>
                            Sarathy Nagar, Kundrathur, Chennai - 600069
                        </p>
                    </div>
                </body>
                </html>
            `
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
