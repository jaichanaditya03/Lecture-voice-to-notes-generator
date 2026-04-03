"""
YouTube Transcript Service
Extracts transcripts from YouTube videos using multiple strategies:
1. Supadata API (managed service - works from cloud servers, no IP blocking)
2. youtube-transcript-api (direct - works locally, blocked on cloud servers)

The Supadata API requires a SUPADATA_API_KEY environment variable.
Free tier: 100 requests/month at https://supadata.ai
"""
import os
import re
import requests
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url: str) -> str:
    """
    Extract YouTube video ID from various URL formats.
    Supports: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
    """
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com/watch\?.*v=([a-zA-Z0-9_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError(f"Could not extract video ID from URL: {url}")


def _fetch_via_supadata(url: str) -> str:
    """
    Fetch YouTube transcript using Supadata managed API.
    This works from cloud servers because Supadata handles proxy rotation.
    Free tier: 100 requests/month.
    """
    api_key = os.getenv("SUPADATA_API_KEY")
    if not api_key:
        raise Exception("SUPADATA_API_KEY not configured")
    
    print(f"[YT-Transcript] Trying Supadata API...")
    
    response = requests.get(
        "https://api.supadata.ai/v1/youtube/transcript",
        params={"url": url, "text": "true"},
        headers={"x-api-key": api_key},
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        # Supadata returns { "content": "transcript text" } when text=true
        transcript = data.get("content") or data.get("transcript") or data.get("text", "")
        
        if not transcript:
            # Try extracting from chunks format
            chunks = data.get("chunks") or data.get("segments") or []
            if chunks:
                transcript = " ".join([c.get("text", "") for c in chunks])
        
        if transcript:
            print(f"[YT-Transcript] Supadata success! Got {len(transcript)} characters")
            return transcript
        else:
            raise Exception("Supadata returned empty transcript")
    elif response.status_code == 404:
        raise Exception("No transcript found for this video")
    else:
        raise Exception(f"Supadata API error: {response.status_code} - {response.text[:200]}")


def _fetch_via_direct_api(url: str) -> str:
    """
    Fetch YouTube transcript using youtube-transcript-api directly.
    Works locally but blocked on most cloud servers.
    """
    video_id = extract_video_id(url)
    print(f"[YT-Transcript] Trying direct API for video ID: {video_id}")
    
    ytt_api = YouTubeTranscriptApi()
    
    try:
        transcript = ytt_api.fetch(video_id, languages=['en'])
    except Exception:
        print("[YT-Transcript] English not found, trying other languages...")
        transcript = ytt_api.fetch(video_id)
    
    raw_data = transcript.to_raw_data()
    full_transcript = " ".join([entry['text'] for entry in raw_data])
    
    print(f"[YT-Transcript] Direct API success! Got {len(full_transcript)} characters")
    return full_transcript


def get_youtube_transcript(url: str) -> str:
    """
    Get transcript from YouTube video. Tries multiple strategies:
    1. Supadata API (works from cloud servers)
    2. Direct youtube-transcript-api (works locally)
    
    Args:
        url: YouTube video URL
        
    Returns:
        str: Full transcript text
    """
    errors = []
    
    # Strategy 1: Supadata managed API (works on cloud servers)
    try:
        return _fetch_via_supadata(url)
    except Exception as e:
        errors.append(f"Supadata: {e}")
        print(f"[YT-Transcript] Supadata failed: {e}")
    
    # Strategy 2: Direct youtube-transcript-api (works locally)
    try:
        return _fetch_via_direct_api(url)
    except Exception as e:
        errors.append(f"Direct API: {e}")
        print(f"[YT-Transcript] Direct API failed: {e}")
    
    # All strategies failed
    error_summary = " | ".join(errors)
    print(f"[YT-Transcript] All strategies failed: {error_summary}")
    
    # Provide user-friendly error
    error_lower = error_summary.lower()
    if "disabled" in error_lower or "no captions" in error_lower:
        raise Exception("This video has no captions/subtitles available. Please upload the audio file directly.")
    elif "unavailable" in error_lower or "no longer available" in error_lower:
        raise Exception("This video is unavailable or restricted. Please try a different video.")
    elif "not found" in error_lower or "no transcript" in error_lower:
        raise Exception("No transcript found for this video. Please upload the audio file directly.")
    elif "supadata_api_key not configured" in error_lower and "blocking" in error_lower:
        raise Exception("YouTube is blocking requests from this server. Please upload the audio file directly.")
    else:
        raise Exception(f"Could not extract transcript. Please upload the audio file directly.")


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube URL"""
    youtube_patterns = [
        r'youtube\.com',
        r'youtu\.be',
    ]
    return any(re.search(pattern, url) for pattern in youtube_patterns)
