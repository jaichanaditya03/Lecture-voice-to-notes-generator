<div align="center">
  <h1>🎓 Lecture Voice-to-Notes Generator (AI)</h1>
  <p><i>An intelligent web application that converts lecture audio into comprehensive study materials using AI.</i></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Python-3.13+-blue.svg?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/AI-Groq_Whisper-FF6C37?style=for-the-badge&logo=groq&logoColor=white" alt="Groq Whisper" />
    <img src="https://img.shields.io/badge/Llama_3.3_70B-0466C8?style=for-the-badge&logo=meta&logoColor=white" alt="Llama 3" />
  </p>

  <p>
    <b><a href="https://lecture-voice-to-notes-generator-git-main-jaichans-projects.vercel.app/">🌐 Live Demo</a></b> •
    <b><a href="#-features">✨ Features</a></b> •
    <b><a href="#-installation--setup">🚀 Setup</a></b> •
    <b><a href="#-troubleshooting">🔧 Troubleshooting</a></b>
  </p>
</div>

---

Upload audio files, record live lectures, or process YouTube links to automatically generate highly accurate transcripts, organized notes, practice quizzes and interactive flashcards.

## ✨ Features

### 🎙️ Multiple Input Methods
* **File Upload:** Support for MP3, WAV, M4A and WebM audio files up to 6+ hours (340+ MB).
* **Live Recording:** Capture system and microphone audio directly from your browser.
* **Link Processing:** Extract and transcribe audio straight from YouTube and other media platforms.

### 🤖 AI-Powered Processing
* **Speech-to-Text:** Ultra-fast, highly accurate transcription leveraging **Groq's Whisper Large V3** model.
* **Smart Summarization:** AI-generated notes categorized with cleanly structured headings and bullet points via **Llama 3.3 70B Versatile**.
* **Quiz Generation:** Automatically craft challenging multiple-choice questions from the lecture content to test your knowledge.
* **Flashcard Creation:** Generate study flashcards to help you memorize key concepts faster.

### 📄 Export & Study Tools
* **Editable Transcripts:** Easily manually correct or enhance raw transcriptions inside the app.
* **PDF Export:** Download all your study materials (notes, quiz, flashcards) simultaneously in a beautifully formatted PDF.
* **Formatting:** Clean, professional interface with robust custom styling and animations.

---

## ⚙️ How It Works

1. **Input Generation:** The user submits a recording, file, or YouTube URL to the React Frontend.
2. **Audio Extraction:** The FastAPI Backend downloads or processes the audio stream (utilizing `ffmpeg` & `yt-dlp`).
3. **AI Transcription:** Audio chunks are sent to the Groq API for rapid Whisper V3 speech-to-text inference.
4. **AI Generation:** The transcript is parsed by the Llama 3.3 70B model to build Notes, Quizzes, and Flashcards.
5. **Delivery:** The structured JSON payload is returned to the frontend and elegantly rendered for the user to study or export to PDF!

---

## 🛠️ Tech Stack

| **Category** | **Technologies Used** |
| :--- | :--- |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, jsPDF, Lucide React Icons |
| **AI Models** | Groq (Whisper Large V3, Llama 3.3 70B Versatile) |
| **Audio Tools** | `yt-dlp`, `static-ffmpeg`, `youtube-transcript-api` |

---

## 📋 Prerequisites

Before starting, make sure you have the following installed on your machine:
- **Python**: `3.13` or higher
- **Node.js**: `18.x` or higher
- **npm**: `9.x` or higher
- **Groq API Key**: [Get one free here](https://console.groq.com/)
- **Supadata API Key**: [Get one here](https://supadata.ai/) - Useful for bypassing cloud limits on YouTube transcript extraction.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jaichanaditya03/Lecture-voice-to-notes-generator.git
cd Lecture-voice-to-notes-generator
```

### 2. Backend Setup
Navigate into the backend directory and set up the Python environment:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file based on the example
cp .env.example .env
```

**Configure Backend Variables:**
Edit the `backend/.env` file and insert your API keys:
```env
# Required: For Transcription & Generation
GROQ_API_KEY=your_groq_api_key_here

# Optional: For YouTube link extraction reliability on cloud hosts (bypasses bot blocks)
SUPADATA_API_KEY=your_supadata_api_key_here
```

### 3. Frontend Setup
Open a new terminal or navigate back to the frontend directory:

```bash
cd frontend

# Install necessary javascript dependencies
npm install

# Create .env file (for vite configs)
cp .env.example .env
```

**Configure Frontend Variables:**
Check the `frontend/.env` file. It should look like this:
```env
# The URL where your backend is hosted
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 🎯 Running the Application

To run the application locally, you need to spin up both the backend and frontend servers in separate terminals.

<details open>
<summary><b>🔥 Start Backend Server</b></summary>

```bash
cd backend
# Make sure your virtual environment is active!
python -m uvicorn main:app --reload
```
*Backend will run on: `http://localhost:8000`*
</details>

<details open>
<summary><b>💻 Start Frontend Server</b></summary>

```bash
cd frontend
npm run dev
```
*Frontend will run on: `http://localhost:5173`*
</details>

Once both are running, open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```text
lecture-voice-to-notes-ai/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # Application entry point
│   ├── config.py             # Environment configurations
│   ├── models.py             # Pydantic data models
│   ├── utils.py              # Shared/helper functions
│   ├── routes/               # API route definitions
│   │   ├── transcription_routes.py    
│   │   └── processing_routes.py
│   ├── services/             # Core business logic logic
│   │   ├── audio_service.py           
│   │   ├── youtube_service.py         
│   │   └── quiz_service.py            
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React UI Client
│   ├── src/
│   │   ├── components/       # Reusable React components UI (Animations, Buttons, Forms)
│   │   ├── api/              # Axios service endpoints
│   │   ├── utils/            # Helper formats
│   │   ├── App.jsx           # Main App Routing/View
│   │   └── main.jsx          # React DOM render entry
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Component styles & config
│   └── vite.config.js        # Vite bundler config
│
└── README.md                 # You are here
```

---

## 🔧 Troubleshooting

* **YouTube Links failing with "Video is blocked" or "413 Request Entity Too Large"?**
  Cloud hosts occasionally block bot IP traffic. To fix this, register for a free account at [Supadata.ai](https://supadata.ai/) and populate `SUPADATA_API_KEY` in your `backend/.env` file. This falls back to an unblocked API format.

* **Audio Processing Failing (`ffmpeg` errors)?**
  This project utilizes `static-ffmpeg` to handle audio conversions across multiple OS versions automatically. Make sure you don't have overlapping mismatched versions of standard `ffmpeg` conflicting in your environment path variables.

* **Frontend Fetch Errors (Network Error)?**
  Confirm your `VITE_API_BASE_URL` in `frontend/.env` correctly points to the port your FastAPI server runs on (usually `http://localhost:8000/api`). Also, double-check that `uvicorn` is actively running.

---

## 🤝 Contributing

Contributions are always welcome! How to involve yourself:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

* [**Groq**](https://groq.com) - For providing lightning-fast Local AI Inference
* [**Meta Llama**](https://llama.meta.com/) - For state-of-the-art open-source LLM results
* **Tailwind CSS** - For beautiful rapidly designed interfaces

<p align="center">Made with ❤️ by <a href="https://github.com/jaichanaditya03">jaichanaditya03</a></p>
