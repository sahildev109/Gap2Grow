# Gap2Grow - AI Career Growth & Skill Gap Platform

Gap2Grow is a comprehensive full-stack platform designed to accelerate employability. It uses a dual-backend architecture to parse resumes with NLP, predict skill gaps based on live market data, and leverage Google Gemini AI to generate highly personalized Career Reports and Learning Roadmaps.

## 🏗️ Architecture

- **Frontend:** React.js, Vite, Vanilla CSS (Glassmorphism & High-Aesthetic Animations)
- **Backend 1 (Data & AI Generation):** Node.js, Express, MongoDB, Google Gemini SDK
- **Backend 2 (NLP & Resume Parsing):** Python, FastAPI, PyMuPDF
- **Database:** MongoDB (User Auth, Skill Gaps, Roadmaps, Reports)

---

## 🚀 Setup Guide

To run this application, you will need to run all three parts of the stack simultaneously in separate terminal windows.

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher)
- MongoDB (Running locally or a MongoDB Atlas URI)

---

### Step 1: Node.js Backend (Core API & Authentication)
This server handles user accounts, database operations, and calls to the Gemini AI API.

1. Open a terminal and navigate to the Node.js backend directory:
   ```bash
   cd backend-nodejs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables:** Create a `.env` file inside the `backend-nodejs` folder and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gap2grow
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *(Server will run on http://localhost:5000)*

---

### Step 2: Python Backend (NLP & Analysis)
This server handles parsing PDF resumes and calculating skill gap scores using Python math and NLP logic.

1. Open a second terminal and navigate to the Python backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(Server will run on http://localhost:8000)*

---

### Step 3: React Frontend (Visual UI)
This is the beautiful user-facing web application.

1. Open a third terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables:** Create a `.env` file inside the `frontend` folder and add the following:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
   *(Frontend will typically run on http://localhost:5173)*

---

## 💡 Usage Guide

1. **Start all 3 servers** (Node.js, Python, and React).
2. Open the React frontend URL in your browser.
3. Sign up for a new account and log in.
4. Navigate to the **Skill Gap Forecast**, upload your tech resume, and generate your baseline analysis.
5. Head to the **AI Career Report** and **Learning Roadmap** tabs to generate customized, downloadable PDF strategies generated instantly by Gemini AI!
