import os
import uuid
import shutil
import asyncio
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from models import YouTubeRequest
from config import get_groq_client
from services.audio_service import process_audio_file
from services.youtube_service import download_audio_from_url, download_audio_from_generic_link
from services.youtube_transcript_service import get_youtube_transcript, is_youtube_url

router = APIRouter(prefix="/api", tags=["transcription"])

client = get_groq_client()


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe an uploaded audio file"""
    if not client:
        return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})
    
    try:
        print(f"📁 Received file: {file.filename}")
        
        # Save upload to temp file (use system temp dir for cross-platform compatibility)
        file_ext = os.path.splitext(file.filename)[1] or ".mp3"
        temp_filename = os.path.join(tempfile.gettempdir(), f"upload_{uuid.uuid4()}{file_ext}")
        
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"💾 Saved to {temp_filename}")
        
        try:
            # Process the file (handles chunking if needed)
            transcript_text = await asyncio.to_thread(process_audio_file, temp_filename, client)
            
            print("✅ Transcription complete")
            return {"transcript": transcript_text}
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)

    except Exception as e:
        print(f"❌ Transcribe Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/youtube-transcribe")
async def youtube_transcribe(request: YouTubeRequest):
    """Transcribe audio from a YouTube URL"""
    if not client:
        return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})

    temp_filename = None
    try:
        print(f"🎥 Processing YouTube URL: {request.url}")
        
        # Download audio from YouTube
        temp_filename = download_audio_from_url(request.url, preferred_codec='m4a')

        # Process audio file (handles chunking for large files)
        print("🎙️  Processing audio file (will chunk if >25MB)...")
        transcript_text = await asyncio.to_thread(process_audio_file, temp_filename, client)
        
        print("✅ YouTube transcription complete")
        print(f"📊 Transcript length: {len(transcript_text)} characters")
        
        return {"transcript": transcript_text}

    except Exception as e:
        print(f"❌ YouTube Transcribe Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Failed to extract audio from YouTube: {str(e)}"})
    finally:
        # Cleanup temp file
        if temp_filename and os.path.exists(temp_filename):
            os.remove(temp_filename)
            print(f"🧹 Cleaned up temp file: {temp_filename}")


@router.post("/fetch-audio")
async def fetch_audio(request: YouTubeRequest):
    """Transcribe audio from a generic link"""
    if not client:
        return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})

    final_filename = None
    try:
        print(f"🔗 Processing Link: {request.url}")
        
        # For YouTube URLs, use transcript extraction (yt-dlp is blocked on cloud servers)
        if is_youtube_url(request.url):
            print("📹 YouTube URL detected - extracting transcript from captions...")
            try:
                transcript_text = get_youtube_transcript(request.url)
                print("✅ Transcript extracted successfully from YouTube captions!")
                print(f"📊 Transcript length: {len(transcript_text)} characters")
                return {"transcript": transcript_text}
            except Exception as transcript_error:
                # Log the full error for debugging in Render logs
                print(f"❌ YouTube transcript extraction failed: {type(transcript_error).__name__}: {transcript_error}")
                import traceback
                traceback.print_exc()
                
                # Return a helpful error — don't attempt yt-dlp for YouTube (always blocked on cloud)
                error_detail = str(transcript_error)
                if "captions" in error_detail.lower() or "disabled" in error_detail.lower():
                    user_message = "This video has no captions/subtitles available. Please upload the audio file directly instead."
                elif "not found" in error_detail.lower():
                    user_message = "No transcript found for this video. Please upload the audio file directly instead."
                else:
                    user_message = f"Could not extract YouTube transcript: {error_detail}. Please try uploading the audio file directly."
                
                return JSONResponse(status_code=500, content={"error": user_message})
        
        # For non-YouTube links, download audio and transcribe
        final_filename = download_audio_from_generic_link(request.url)

        # Process audio file (handles chunking for large files)
        print("🎙️  Processing audio file (will chunk if >25MB)...")
        transcript_text = await asyncio.to_thread(process_audio_file, final_filename, client)
        
        print("✅ Link transcription complete")
        print(f"📊 Transcript length: {len(transcript_text if transcript_text else '')} characters")
        
        return {"transcript": transcript_text}

    except Exception as e:
        print(f"❌ Fetch Audio Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        
        # Provide user-friendly error messages
        error_msg = str(e)
        if "413" in error_msg or "too large" in error_msg.lower():
            user_message = "Audio file is too large. This shouldn't happen - please report this issue."
        elif "502" in error_msg or "503" in error_msg:
            user_message = "Groq API is temporarily unavailable. Please try again in a few minutes."
        elif "429" in error_msg or "rate" in error_msg.lower():
            user_message = "Rate limit exceeded. Please wait a moment before trying again."
        else:
            user_message = f"Failed to process link: {str(e)}"
        
        return JSONResponse(status_code=500, content={"error": user_message})
    finally:
        # Cleanup temp file
        if final_filename and os.path.exists(final_filename):
            try:
                os.remove(final_filename)
                print(f"🧹 Cleaned up temp file: {final_filename}")
            except Exception as e:
                print(f"⚠️  Failed to delete temp file: {e}")
