// Service for sending emails via Vercel Serverless Function

// Use relative path for Vercel deployment (same domain)
const EMAIL_API_URL = "/api";

// Client key for API authentication (must match Vercel env variable)
const CLIENT_KEY = "impulse2026secure";

/**
 * Send registration confirmation email
 * @param {string} userEmail - Recipient email
 * @param {string} userName - Participant name
 * @param {string} eventName - Name of the event/workshop
 * @param {string} college - College name
 * @param {string} year - Year of study
 * @param {number} amount - Amount paid
 * @param {string} transactionId - Payment transaction ID
 * @returns {Promise<Object>} Response data validation
 */
export const sendConfirmationEmail = async (userEmail, userName, eventName, college, year, amount, transactionId) => {
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
                college: college,
                year: year,
                amount: amount,
                transactionId: transactionId
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
