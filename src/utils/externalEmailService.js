// Service for sending emails via External Node.js Backend (Render)
// Bypasses Firebase Spark Plan limitations

// TODO: Replace this with your actual Render URL after deployment
const EMAIL_API_URL = "http://localhost:3000"; // Use localhost for testing, then Render URL
// const EMAIL_API_URL = "https://impulse-email-backend.onrender.com";

// TODO: Replace with the key you set in your backend .env
const CLIENT_KEY = "my-secure-client-key-123";

/**
 * Send registration confirmation email
 * @param {string} userEmail - Recipient email
 * @param {string} userName - Participant name
 * @param {string} eventName - Name of the event/workshop
 * @param {string} qrCode - (Optional) QR Code URL
 * @returns {Promise<Object>} Response data validation
 */
export const sendConfirmationEmail = async (userEmail, userName, eventName, qrCode = null) => {
    try {
        console.log(`📨 Sending email to ${userEmail} via external backend...`);

        const response = await fetch(`${EMAIL_API_URL}/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": CLIENT_KEY
            },
            body: JSON.stringify({
                to: userEmail,
                name: userName,
                event: eventName,
                qrCode: qrCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        console.log("✅ Email sent successfully:", data);
        return { success: true, messageId: data.messageId };

    } catch (error) {
        console.error("❌ Email sending failed:", error);
        return { success: false, error: error.message };
    }
};
