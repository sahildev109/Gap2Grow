# Core API & AI Gateway (Backend 1)

## 📌 What It Does
This component acts as the traditional backend of the application. It is responsible for data persistence, user state management, authentication, and secure integration with external third-party AI APIs.
1. It handles User Sign Up and Login, issuing secure access tokens.
2. It saves the results of the Python backend's skill gap analysis into long-term database storage tied to the specific user.
3. It receives generation requests from the frontend, securely retrieves the user's saved context, and engineers massive prompts.
4. It securely communicates with Google's Gemini AI, parses the unstructured text responses into pure JSON objects, and saves the final personalized Roadmaps and Reports.

## 🛠️ Tech Stack
*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB
*   **ODM / Schemas:** Mongoose
*   **AI SDK:** `@google/generative-ai`
*   **Security:** JSON Web Tokens (JWT), Bcrypt, CORS, Dotenv

## 💡 How It Works
The server uses Express routing to define RESTful endpoints (e.g., `/api/reports/roadmap`). When an authenticated request arrives, middleware validates the JWT to ensure the user is legitimate. The controller then queries MongoDB via Mongoose to retrieve the user's `isLatest: true` Skill Gap record. This memory object is injected into a template string (prompt engineering). The server queries the Gemini Flash model, awaits the response, executes a specialized regex cleaner to guarantee valid JSON formatting, creates a new Mongoose document to save it, and returns the 200 OK payload.

## 🎯 Why This is Useful
**Why Node.js & Express?**
Node.js is asynchronous and event-driven, making it the perfect choice for an I/O-heavy server that spends most of its time opening database connections and waiting for external Network Requests (like pinging the Gemini API). It can handle thousands of concurrent requests while waiting for the AI to respond.

**Why MongoDB?**
MongoDB is a NoSQL document database that uses BSON (Binary JSON). Because large language models (LLMs) like Gemini are programmed to return JSON text blocks, MongoDB is the most seamless way to take exactly what the AI generates and store it directly into the database without needing complex relational table migrations. It is highly flexible for rapidly changing AI outputs.
