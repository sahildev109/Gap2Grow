# Gap2Grow - AI Resume Analyzer & Skill Gap Prediction Platform

Gap2Grow is a full-stack, hackathon-ready employability enhancement platform. It uses AI to parse resumes, compare user skills against real-time job market mock data, and generate personalized learning roadmaps.

## Architecture

- **Frontend:** React.js, Vite, Vanilla CSS (Glassmorphism & High Aesthetic UI)
- **Backend:** Python, FastAPI, Motor (MongoDB), PyMuPDF (PDF Parsing)
- **System Flow:**
  1. User uploads a PDF resume and enters a target role on the frontend dashboard.
  2. The FastAPI backend extracts text via `PyMuPDF` and uses a heuristic NLP strategy to identify tech skills.
  3. The analysis service retrieves the mock job skills from the data layer and compares them via Set intersection to calculate a "Skill Gap Score."
  4. The roadmap service generates a prioritized step-by-step roadmap for missing skills, including relevant Coursera/Udemy links.
  5. The React frontend visualizes the results dynamically using radial progress bars, badges, and a custom timeline.

## How to Run Locally

### 1. Backend (FastAPI)
Navigate to the backend directory, activate the Python virtual environment, install dependencies, and run the server.

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will run on `http://localhost:8000`.

### 2. Frontend (React + Vite)
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on the port provided by Vite (e.g., `http://localhost:5173`).

### 3. Usage
- Go to the frontend URL.
- Use the aesthetic Login/Signup view (Auth logic is mocked for the demo).
- On the Dashboard, choose your "Target Role" and select a sample PDF resume.
- Analyze your future potential and view your targeted upskilling roadmap on the dynamic Results page!
