# 🚀 Deployment Guide: Impulse Email Backend

This guide will help you deploy your `email-server` to Render (Free Tier) so it can run 24/7.

## Phase 1: Preparation
1. **Push to GitHub**:
   - Make sure your latest code (including the `email-server` folder) is pushed to your GitHub repository `citimpulse-main`.
   - *Note: Render needs your code to be on GitHub or GitLab.*

## Phase 2: Deploy on Render
1. **Sign Up/Login**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in (use GitHub login).
2. **Create New Service**:
   - Click the **"New +"** button.
   - Select **"Web Service"**.
3. **Connect Repository**:
   - Find your repo `citimpulse-main` and click **"Connect"**.
4. **Configure the Service**:
   Fill in these exact details:
   - **Name**: `impulse-email-backend` (or any unique name)
   - **Trie it**: Select "Free" plan layer.
   - **Region**: Singapore (or nearest to you).
   - **Root Directory**: `email-server` (⚠️ CRITICAL: Don't miss this!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   Scroll down to the "Environment Variables" section and click **"Add Environment Variable"**. Add these two:
   
   | Key | Value |
   |-----|-------|

   | `CLIENT_KEY` | `impulse2026secure` |

6. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will start building your app. Wait for it to finish (approx 2-3 mins).
   - Once it says **"Live"**, look for your URL at the top-left (e.g., `https://impulse-email-backend.onrender.com`).
   - **Copy this URL**.

## Phase 3: Connect Frontend
1. Open `src/utils/externalEmailService.js` in your project.
2. Replace `http://localhost:3000` with your new Render URL.
   ```javascript
   // const EMAIL_API_URL = "http://localhost:3000";
   const EMAIL_API_URL = "https://your-app-name.onrender.com"; // <-- Paste your Render URL here
   ```
3. Commit and push your frontend changes.

## Phase 4: Verify
1. Go to your live website.
2. Register for an event.
3. Check if you receive the email.
