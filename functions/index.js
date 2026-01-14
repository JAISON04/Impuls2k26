/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

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
const emailService = require("./emailService");

exports.sendRegistrationEmail = onCall({ cors: true }, async (request) => {
    // Handling both data.data (if wrapped) and direct data access
    const data = request.data;
    const { email, name, eventName, paymentId, amount, refId, events, workshops, teamCount, teamName, teamMembers } = data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "email" argument.');
    }

    // Adapt the flat data to the structure expected by generateRegistrationEmailTemplate
    const registrationData = {
        registrationId: refId || 'N/A',
        userEmail: email,
        name: name, // generic name field if userDetails not fully present
        userDetails: {
            name: name,
            // Add other fields if available in request.data, otherwise they default to "Not provided"
        },
        paymentDetails: {
            paymentId: paymentId,
            amount: amount
        },
        teamDetails: {
            teamSize: teamCount,
            teamMembers: teamMembers ? teamMembers.map(m => ({ name: m })) : [] // Front end sends array of strings
        },
        teamName: teamName,
        isTeamEvent: !!((teamCount && teamCount > 1) || (teamMembers && teamMembers.length > 0)),
        // We might need to pass selectedEvents/Workshops if they are available in the request.
        // Assuming 'events' and 'workshops' arrays are passed in the request or can be derived.
        // For now, mapping simplified data or empty arrays if not provided.
        selectedEvents: events || [{ title: eventName }], // Fallback to eventName from request
        selectedWorkshops: workshops || []
    };

    // We need a list of all events/workshops to lookup details. 
    // If these are not passed, the template might show empty details or we need to fetch them.
    // For this implementation, we assume the client passes necessary details or we pass empty to just confirm registration.
    // However, the template logic heavily relies on finding these in the 'events' and 'workshops' arrays passed as 2nd/3rd args.
    // If the client doesn't send full catalog, we might only see IDs.

    // In a real scenario, we might want to fetch these from Firestore here, OR expect the client to pass the resolved details.
    // Given the previous code was simple text, we'll try to do our best.

    // For now, we will pass the data as is.

    try {
        const result = await emailService.sendRegistrationConfirmationEmail(
            registrationData,
            events || [], // Pass full event list if available
            workshops || [] // Pass full workshop list if available
        );

        if (result.success) {
            logger.info("Email sent successfully", { messageId: result.messageId });
            return { success: true, messageId: result.messageId };
        } else {
            logger.error("Failed to send email", result.error);
            // Verify if it is a specific error we want to expose
            throw new HttpsError('internal', result.error || 'Unable to send email');
        }

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

    const subject = `On-Duty Letter: Impulse 2026 - ${name}`;
    const htmlContent = `
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

    const textContent = `
    CHENNAI INSTITUTE OF TECHNOLOGY
    On-Duty Request for Student Participation in IMPULSE 2026
    
    To: The Principal / HOD, ${college}
    
    This is to certify that ${name} is a registered participant for IMPULSE 2026.
    The event is scheduled to be held on ${eventDate || 'March 20, 2026'}.
    We kindly request you to grant On-Duty (OD) to this student.
    
    Thank you,
    Convenor - IMPULSE 2026
    `;

    try {
        const result = await emailService.sendNotificationEmail(email, subject, htmlContent, textContent);

        if (result.success) {
            logger.info("OD Email sent successfully", { messageId: result.messageId });
            return { success: true, messageId: result.messageId };
        } else {
            logger.error("Failed to send OD email", result.error);
            throw new HttpsError('internal', result.error || 'Unable to send OD email');
        }
    } catch (error) {
        logger.error("Error sending OD email", error);
        throw new HttpsError('internal', 'Unable to send OD email', error);
    }
});
