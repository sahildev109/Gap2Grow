# Gap2Grow Architecture & System Flow

This document provides a comprehensive overview of the technical architecture, tech stack, and internal workflows of the Gap2Grow platform.

---

## 🏗️ 1. Complete Tech Stack Overview

The application utilizes a decoupled, microservices-inspired architecture with distinct environments for the Frontend, User/API Backend, and NLP/Analysis Backend.

### Frontend Client (User Interface)
*   **Core Framework:** React.js (via Vite)
*   **Styling:** Vanilla CSS focusing on modern glassmorphism UI and fluid animations.
*   **Icons:** Lucide-React
*   **Capabilities:** Capturing user input, rendering dynamic dashboard charts, communicating asynchronously with both backend APIs, and rendering complex DOM elements into downloadable PDF formats (via `html2canvas` and `jsPDF`).

### Backend 1: Core API & User Management (Node.js)
*   **Core Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (using Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT) and Bcrypt (password hashing)
*   **Generative AI Integration:** Google Gemini SDK (`@google/generative-ai`)
*   **Purpose:** This is the primary server the frontend talks to for persistent state. It handles user authentication, data permanence (storing reports and roadmaps), and complex logic involving interactions with massive language models (Gemini).

### Backend 2: NLP & Resume Parsing Engine (Python)
*   **Core Runtime:** Python 3.9+
*   **Framework:** FastAPI (high performance, asynchronous)
*   **PDF Parsing:** PyMuPDF (`fitz`) handles extracting raw text from uploaded resumes.
*   **Data Science / NLP:** Uses heuristic text-matching and specific string-cleaning algorithms.
*   **Purpose:** Python is fundamentally better suited for parsing binary documents (like PDFs) and executing data-science-style array manipulations (like calculating skill overlap percentages). This server acts purely as a stateless algorithmic engine.

---

## ⚙️ 2. Core System Workflows

How does data travel from a user clicking a button to seeing a fully generated predictive roadmap? Here is the step-by-step breakdown of the two primary workflows.

### Workflow A: The "Skill Gap Forecast" (Resume Analysis)
This flow determines *what* the user needs to learn.

1.  **File Upload (Frontend):** The user selects a target role and uploads a PDF resume on the React frontend.
2.  **FormData Transmission (Network):** The frontend wraps the PDF and target role in a multi-part form request and sends it directly to the **Python Backend** (`POST http://localhost:8000/analyze`).
3.  **Content Extraction (Python):** PyMuPDF reads the binary PDF and converts it to raw text strings.
4.  **Skill Matching Algorithm (Python):**
    *   The Python code contains predefined dictionaries (mock data) mimicking live job market requirements for roles like "Software Engineer", "Data Scientist", etc.
    *   It scans the extracted resume text against an internal list of hundreds of tech skills to find what the user *currently* knows.
    *   It performs a Set Intersection: `Required Skills` minus `Current Skills` = `Missing Skills`.
    *   It calculates a "Match Percentage Score" and sends a JSON response back to the React Frontend.
5.  **State Synchronization (Node.js):**
    *   The React frontend receives the Python analysis.
    *   *Crucially*, the frontend immediately turns around and makes a second API call, this time to the **Node.js Backend**, saying: "Save this exact analysis payload to the MongoDB database under this User's ID."
    *   Node/MongoDB stores this as the user's `Latest Skill Gap`.

### Workflow B: Generating "AI Career Reports" & "Learning Roadmaps"
This flow uses generative AI to provide action items based on the analysis from Workflow A.

1.  **User Request (Frontend):** The user navigates to the Roadmap or Report page and clicks "Generate".
2.  **Context Retrieval (Node.js):** The Node.js server receives the request. It queries MongoDB for the user's `Latest Skill Gap` document that was saved at the end of Workflow A.
3.  **Prompt Engineering (Node.js):** The Node server dynamically constructs a complex string prompt for the Gemini AI. It injects the specific missing skills, the target role, the match percentage, and the user's current experience level into the prompt. It also instructs Gemini to return the answer strictly in JSON format.
4.  **Generative Request (Google API):** Node.js sends the prompt to the Gemini 2.5-Flash model.
5.  **Parsing & Saving (Node.js):**
    *   Gemini returns a massive JSON payload (e.g., a 6-step array of learning resources).
    *   Node parses the string output into a JavaScript Object.
    *   Node saves this generated Roadmap/Report into MongoDB so it is permanently accessible.
6.  **Visual Render (Frontend):** The final structured data is sent back to React, which iterates over the arrays to render the gorgeous UI cards, timelines, and checkmarks seen on screen.
