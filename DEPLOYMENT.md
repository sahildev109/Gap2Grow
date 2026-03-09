# Gap2Grow - Deployment Guide

Deploying a full-stack application with a dual-backend architecture requires hosting three separate components: the Frontend, the Core Node.js API, and the Python NLP Engine.

Here is the recommended, most cost-effective (mostly free) way to deploy this exact architecture.

---

## 🏗️ 1. Architecture Overview for Production
*   **Database:** MongoDB Atlas (Cloud Database)
*   **Frontend (React/Vite):** Vercel or Netlify
*   **Backend 1 (Node.js):** Render or Railway
*   **Backend 2 (Python/FastAPI):** Render or Railway

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)
Since your app uses MongoDB, you cannot use `mongodb://localhost:27017` in production.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a Free Cluster (M0).
3. Under **Database Access**, create a user and password (save this).
4. Under **Network Access**, add the IP address `0.0.0.0/0` to allow your backend servers to connect to the database.
5. Click **Connect -> Connect your application** and copy the Connection String URI. 
   *(It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/gap2grow`)*

---

## 🐍 Step 2: Deploy Python Backend (NLP Engine)
**Recommended Platform: [Render.com](https://render.com/) (Free Tier)**

1. Push your code to a GitHub Repository.
2. Go to Render and create a new **Web Service**.
3. Connect your GitHub repository and select the root directory (or just set the Root Directory to `backend` in settings).
4. Configure the service:
    *   **Environment:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000` *(Render requires 0.0.0.0 instead of localhost)*
5. Click **Create Web Service**. 
6. Wait for it to build and deploy. Once live, Render will give you a URL (e.g., `https://gap2grow-python.onrender.com`). **Save this URL.**

---

## 🟢 Step 3: Deploy Node.js Backend (Core API)
**Recommended Platform: [Render.com](https://render.com/) (Free Tier) or [Railway.app](https://railway.app/)**

1. Go to Render and create another **Web Service**.
2. Connect your repo and set the Root Directory to `backend-nodejs`.
3. Configure the service:
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start` *(Make sure you have a `"start": "node server.js"` script in your Node package.json)*
4. **Environment Variables!** This is critical. Add these exact variables in the Render dashboard:
    *   `PORT`: `10000` (Render's default internal port)
    *   `MONGO_URI`: *(Paste the MongoDB Atlas URI from Step 1)*
    *   `JWT_SECRET`: *(A long random string, e.g. "my_super_secret_production_key_123")*
    *   `GEMINI_API_KEY`: *(Your Google AI API Key)*
5. **Update Python URL in Node**: Inside your Node.js code (`backend-nodejs/controllers/skillGapController.js` or wherever Node calls Python), you must change `http://localhost:8000` to the Live Python URL you got in Step 2.
6. Click **Create Web Service**. 
7. Save the final Live Node URL (e.g., `https://gap2grow-node.onrender.com`).

---

## ⚛️ Step 4: Deploy React Frontend
**Recommended Platform: [Vercel](https://vercel.com/) (Free and instant for Vite/React)**

1. Open your React frontend code.
2. Inside `frontend/.env`, change your API URL to point to your new LIVE Node.js URL:
   `VITE_API_URL=https://gap2grow-node.onrender.com/api`
3. Push these changes to GitHub.
4. Go to Vercel and **Add New Project**. Import your GitHub Repo.
5. Vercel will automatically detect that you're using Vite. 
6. Set the **Root Directory** to `frontend`.
7. **Environment Variables**: Add `VITE_API_URL` and paste your Live Node.js URL.
8. Click **Deploy**.

---

## ⚠️ Important Deployment Checklist & Common Gotchas

1. **CORS:** Ensure your Node.js `server.js` AND your Python `main.py` CORS configurations contain your live Vercel frontend URL, otherwise, the browser will block the requests!
    *   *Example Node:* `app.use(cors({ origin: 'https://gap2grow.vercel.app' }))`
2. **Ports:** Localhost ports (`5000`, `8000`, `5173`) are irrelevent on the internet. Services talk to each other purely through their live `https://...` URLs.
3. **Sleep Limits:** Free tiers on Render "spin down" after 15 minutes of inactivity. The first time you click "Analyze" after an hour, it might take 45-60 seconds for the backend to wake up. This is normal for free hosting!
