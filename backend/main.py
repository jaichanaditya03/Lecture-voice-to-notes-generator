"""
Lecture Voice-to-Notes Generator API
A FastAPI application for transcribing audio lectures and generating study materials.
"""
import static_ffmpeg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS
from routes.transcription_routes import router as transcription_router
from routes.processing_routes import router as processing_router

# Initialize FFmpeg paths
static_ffmpeg.add_paths()

# Initialize FastAPI app
app = FastAPI(
    title="Lecture Voice-to-Notes API",
    description="AI-powered lecture transcription and note generation using Groq",
    version="1.0.0"
)

# Configure CORS - Allow all origins for public deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (public API)
    allow_credentials=False,  # Must be False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(transcription_router)
app.include_router(processing_router)


@app.get("/")
def read_root():
    """Root endpoint - API health check"""
    return {
        "message": "Lecture Voice-to-Notes API (Groq Free Edition) is running! ",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
