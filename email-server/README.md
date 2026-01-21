# 🚀 Impulse External Email Backend

This is a standalone Node.js + Express server designed to send emails via Brevo (formerly Sendinblue). It allows you to bypass Firebase Spark plan limitations on outbound networking by hosting the email logic on a separate free platform like Render.com.

## 📂 Folder Structure
```
citimpulse-main/
├── email-server/         <-- THE NEW BACKEND
│   ├── index.js          # Main server logic
│   ├── package.json      # Dependencies
│   └── .env.example      # Config template
├── src/                  # Your React Frontend
└── ...
```

## 🛠️ Setup Guide

### 1. Get Brevo API Key
1. Go to [Brevo (Sendinblue)](https://www.brevo.com/) and sign up (Free).
2. Go to **My Account** -> **SMTP & API**.
3. Click **Generate a new API key**.
4. Name it `ImpulseWebsite` and copy the long `xkeysib-...` string.

### 2. Local Testing
1. Open this folder in terminal:
   ```bash
   cd email-server
   npm install
   ```
2. Create a `.env` file (copy from `.env.example`) and fill it:
   ```
   PORT=3000
   CLIENT_KEY=secret123  <-- Make up a secure password
   BREVO_API_KEY=xkeysib-... <-- Paste Brevo key here
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. It should say `🚀 Email Backend running on port 3000`.

### 3. Deploy to Render (Free)
1. Push your `citimpulse-main` code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `impulse-email-backend`
   - **Root Directory**: `email-server` (IMPORTANT!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free
6. scroll down to **Environment Variables** and add:
   - `BREVO_API_KEY`: (Your Brevo Key)
   - `CLIENT_KEY`: (Your chosen secret key, e.g., `impulse2026secure`)
7. Click **Create Web Service**.
8. Wait for deployment. Copy the **Service URL** (e.g., `https://impulse-email.onrender.com`).

## 🔌 Frontend Integration

In your React app (`src/services/emailApi.js`), use the URL from Render and the `CLIENT_KEY` you created.

```javascript
const EMAIL_API_URL = "https://impulse-email.onrender.com"; // Change this after deploy
const CLIENT_KEY = "impulse2026secure"; // Must match Render env var

export const sendConfirmationEmail = async (userEmail, userName, eventName) => {
  try {
    const response = await fetch(`${EMAIL_API_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLIENT_KEY
      },
      body: JSON.stringify({
        to: userEmail,
        name: userName,
        event: eventName
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Email failed:", error);
    return { success: false, error: error.message };
  }
};
```
