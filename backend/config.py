import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_groq_client():
    """Initialize and return Groq client"""
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
        print("WARNING: Please add your GROQ_API_KEY to the .env file")
        return None
    return Groq(api_key=GROQ_API_KEY)

# CORS origins configuration
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

