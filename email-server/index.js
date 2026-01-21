import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Security Middleware: Validate API Key
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.CLIENT_KEY;

    if (!apiKey || apiKey !== validKey) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden: Invalid or missing API Key'
        });
    }
    next();
};

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'online', service: 'Impulse Email Backend' });
});

// Email Sending Endpoint
app.post('/send-email', validateApiKey, async (req, res) => {
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

        // Brevo SMTP API Configuration
        const brevoUrl = 'https://api.brevo.com/v3/smtp/email';
        const brevoApiKey = process.env.BREVO_API_KEY;

        if (!brevoApiKey) {
            throw new Error('Server misconfiguration: BREVO_API_KEY is missing');
        }

        // Email Content
        const emailData = {
            sender: {
                name: "Impulse Team",
                email: "noreply@citimpulse.com" // You can change this to your verified sender
            },
            to: [
                {
                    email: to,
                    name: name
                }
            ],
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

        // Send Request to Brevo
        const response = await axios.post(brevoUrl, emailData, {
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json'
            }
        });

        console.log(`✅ Email sent successfully! Message ID: ${response.data.messageId}`);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: response.data.messageId
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.response?.data?.message || error.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Email Backend running on port ${PORT}`);
});
