# Python NLP & Analysis Engine (Backend 2)

## 📌 What It Does
This component is the computational brain of the Gap2Grow platform. Its primary responsibility is to ingest raw user data (like a PDF resume) and perform complex data extraction and algorithmic scoring to determine a user's current baseline.
1. It receives a multi-part form payload containing a binary PDF file and a target role.
2. It uses Optical Character Recognition (OCR) and text extraction to pull raw text strings from the resume.
3. It cross-references this raw text against predefined job market heuristic data to identify which technical skills the user possesses and which are missing.
4. It calculates a "Skill Gap Score" percentage.

## 🛠️ Tech Stack
*   **Language:** Python 3.9+
*   **Web Framework:** FastAPI
*   **Server:** Uvicorn
*   **PDF Extraction:** PyMuPDF (`fitz`)

## 💡 How It Works
When a POST request is sent to `/analyze`, FastAPI receives the `UploadFile`. The file is passed to `PyMuPDF`, which iterates through the pages and extracts text blocks. This text is converted to lowercase and tokenized. The algorithm then iterates over an array of required skills for the given target role, checking if the skill strings exist within the resume text. It uses Set logic to determine intersections (Matches) and differences (Missing).

## 🎯 Why This is Useful
**Why Python?** 
Python is the undisputed king of data science, text processing, and natural language tasks. Using a separate Python microservice allows us to leverage powerful binary processing libraries (like PyMuPDF) that are far superior to their JavaScript counter-parts. 

**Why FastAPI?** 
FastAPI is incredibly fast and natively supports asynchronous execution. Unlike older frameworks (like Django or Flask), FastAPI allows this server to process heavy PDF extractions without blocking other incoming requests, making it highly scalable for CPU-bound NLP tasks.
