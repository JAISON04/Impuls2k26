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
const BREVO_KEY = process.env.BREVO_KEY || "bskoE9LLAnki7An";

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
