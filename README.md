# 🎓 Lecture Voice-to-Notes Generator (AI)

An intelligent web application that converts lecture audio into comprehensive study materials using AI. Upload audio files, record live lectures, or process YouTube links to automatically generate transcripts, organized notes, practice quizzes, and flashcards.

## 🌐 Live Demo

**[Try it here →](your-deployment-link-here)**

## ✨ Features

### 🎙️ Multiple Input Methods
- **File Upload**: Support for MP3, WAV, M4A, and WebM audio files
- **Live Recording**: Capture system audio directly from your browser
- **Link Processing**: Extract and transcribe audio from YouTube and other media platforms

### 🤖 AI-Powered Processing
- **Speech-to-Text**: Ultra-fast transcription using Groq's Whisper Large V3 model
- **Smart Summarization**: AI-generated notes with organized headings and bullet points
- **Quiz Generation**: Automatically create multiple-choice questions from lecture content
- **Flashcard Creation**: Generate study flashcards for quick review

### 📄 Export & Study Tools
- **Editable Transcripts**: Manually correct or enhance transcriptions
- **PDF Export**: Download all materials (notes, quiz, flashcards) in a single PDF
- **Custom Formatting**: Clean, professional formatting with underlined headings

### 🚀 Advanced Capabilities
- **Large File Support**: Process audio files up to 6+ hours (340+ MB) using intelligent chunking
- **Long Transcript Handling**: Summarize extensive transcripts without context limitations
- **Real-time Progress**: Visual feedback during processing

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI Models**: 
  - Groq Whisper Large V3 (Speech-to-Text)
  - Llama 3.3 70B Versatile (Summarization & Quiz Generation)
- **Audio Processing**: yt-dlp, static-ffmpeg
- **API**: RESTful endpoints with CORS support

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Lucide React icons
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF

## 📋 Prerequisites

- **Python**: 3.13 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Groq API Key**: [Get one here](https://console.groq.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone copy this repo link
cd Lecture-voice-to-notes-generator
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

**`.env` Configuration:**
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🎯 Running the Application

### Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload
```
Backend will run on: `http://localhost:8000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 📁 Project Structure

```
lecture-voice-to-notes-ai/
├── backend/
│   ├── main.py                
│   ├── config.py              
│   ├── models.py              
│   ├── utils.py               
│   ├── routes/
│   │   ├── transcription_routes.py    
│   │   └── processing_routes.py
│   ├── services/
│   │   ├── audio_service.py           
│   │   ├── youtube_service.py         
│   │   └── quiz_service.py            
│   ├── requirements.txt        
│   ├── .env                    
│   ├── .env.example           
│   └── .gitignore             
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/              
│   │   ├── utils/            
│   │   ├── App.jsx           
│   │   └── main.jsx          
│   ├── public/               
│   ├── package.json          
│   ├── tailwind.config.js    
│   └── vite.config.js        
│
└── README.md                  
```

### Backend Architecture

The backend follows a modular architecture with clear separation of concerns:

- **routes/**: API endpoint handlers organized by functionality
- **services/**: Business logic for audio processing, summarization, and quiz generation
- **models.py**: Data validation and type safety with Pydantic
- **config.py**: Centralized configuration management
- **utils.py**: Shared utility functions

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Groq**: For providing ultra-fast AI inference

