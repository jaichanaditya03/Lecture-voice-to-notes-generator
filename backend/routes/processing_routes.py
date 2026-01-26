from fastapi import APIRouter
from fastapi.responses import JSONResponse

from models import TranscriptRequest, QuizRequest
from config import get_groq_client
from services.summarization_service import generate_summary
from services.quiz_service import generate_quiz_and_flashcards

router = APIRouter(prefix="/api", tags=["processing"])

client = get_groq_client()


@router.post("/summarize")
async def summarize_transcript(request: TranscriptRequest):
    """Generate a summary from a transcript"""
    if not client:
        return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})
    
    try:
        summary = generate_summary(client, request.transcript)
        return {"summary": summary, "notes": summary}

    except Exception as e:
        print(f"❌ Summarize Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/quiz")
async def generate_quiz(request: QuizRequest):
    """Generate quiz questions and flashcards from notes or transcript"""
    if not client:
        return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})
    
    content_text = request.notes or request.transcript
    if not content_text:
        return JSONResponse(status_code=400, content={"error": "No text provided"})

    try:
        result = generate_quiz_and_flashcards(client, content_text)
        return result

    except Exception as e:
        print(f"❌ Quiz Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
