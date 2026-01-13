/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Brevo = require('@getbrevo/brevo');

const brevoClient = new Brevo.TransactionalEmailsApi();
// Ideally this should be in secret manager, but for simplicity/demo:
// You should set this via: firebase functions:secrets:set BREVO_API_KEY
// For now, we'll assume it's passed or env var, or hardcoded (discouraged).
// We will use process.env.BREVO_KEY for safety.
const BREVO_KEY = process.env.BREVO_KEY;

brevoClient.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

exports.sendRegistrationEmail = onCall({ cors: true }, async (request) => {
    // Handling both data.data (if wrapped) and direct data access
    const data = request.data;
    const { email, name, eventName, paymentId, amount, refId } = data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "email" argument.');
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Registration Confirmed: ${eventName}`;
    sendSmtpEmail.htmlContent = `<html><body>
        <h1>Registration Confirmed!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for registering for <b>${eventName}</b>.</p>
        <p><strong>Ref ID:</strong> ${refId}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <br/>
        <p>See you at the event!</p>
    </body></html>`;
    sendSmtpEmail.sender = { "name": "Impulse Team", "email": "noreply@citimpulse.com" };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
        logger.info("Email sent successfully", { result });
        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error("Error sending email", error);
        throw new HttpsError('internal', 'Unable to send email', error);
    }
});

exports.sendODEmail = onCall({ cors: true }, async (request) => {
    const data = request.data;
    const { email, name, college, eventDate } = data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "email" argument.');
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `On-Duty Letter: Impulse 2026 - ${name}`;
    sendSmtpEmail.htmlContent = `
    <html>
    <head>
        <style>
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #000; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-weight: bold; font-size: 24px; margin-bottom: 5px; }
            .subtitle { font-size: 16px; margin-bottom: 20px; }
            .content { margin-bottom: 30px; }
            .signature { margin-top: 50px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">CHENNAI INSTITUTE OF TECHNOLOGY</div>
            <div class="subtitle">Sarathy Nagar, Kundrathur, Chennai - 600069</div>
            <hr/>
        </div>

        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>To:</strong></p>
        <p>The Principal / HOD,<br/>
        ${college}</p>

        <p><strong>Sub: On-Duty Request for Student Participation in IMPULSE 2026</strong></p>

        <p>Respected Sir/Madam,</p>

        <div class="content">
            <p>This is to certify that <strong>${name}</strong> is a registered participant for <strong>IMPULSE 2026</strong>, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering, Chennai Institute of Technology.</p>
            
            <p>The event is scheduled to be held on <strong>${eventDate || 'March 20, 2026'}</strong>.</p>
            
            <p>We kindly request you to grant On-Duty (OD) to this student to enable their participation in the event.</p>
        </div>

        <p>Thank you,</p>

        <div class="signature">
            <p>Yours Sincerely,</p>
            <br/><br/>
            <p><strong>Convenor - IMPULSE 2026</strong><br/>
            Department of EEE<br/>
            Chennai Institute of Technology</p>
        </div>
    </body>
    </html>`;

    sendSmtpEmail.sender = { "name": "Impulse Team", "email": "noreply@citimpulse.com" };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
        logger.info("OD Email sent successfully", { result });
        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error("Error sending OD email", error);
        throw new HttpsError('internal', 'Unable to send OD email', error);
    }
});
