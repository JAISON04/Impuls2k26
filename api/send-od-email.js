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

        const emailData = {
            sender: { name: "Impulse Team", email: "noreply@citimpulse.com" },
            to: [{ email: to, name: name }],
            subject: "📜 On-Duty Letter - Impulse 2026",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #0f172a;">On-Duty Letter</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>Please find attached the On-Duty letter for your participation in <strong>${event}</strong> at Impulse 2026.</p>
                    <p>You can submit this to your institution.</p>
                    <br>
                    <p>Regards,<br>Impulse Team<br>Chennai Institute of Technology</p>
                </div>
            `,
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
