"""
YouTube Transcript Service
Extracts transcripts directly from YouTube videos using the official transcript API.
This bypasses bot detection by using YouTube's built-in captions instead of downloading audio.

Updated for youtube-transcript-api v1.0+ (instance-based API).
"""
import re
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


def get_youtube_transcript(url: str) -> str:
    """
    Get transcript directly from YouTube video using built-in captions.
    
    Args:
        url: YouTube video URL
        
    Returns:
        str: Full transcript text
        
    Raises:
        ValueError: If video ID cannot be extracted
        Exception: If no transcript is available
    """
    try:
        # Extract video ID
        video_id = extract_video_id(url)
        print(f"[YT-Transcript] Extracting transcript for video ID: {video_id}")
        
        # Create API instance (v1.0+ requires instance-based usage)
        ytt_api = YouTubeTranscriptApi()
        
        # Try English first, then fall back to any available language
        try:
            transcript = ytt_api.fetch(video_id, languages=['en'])
        except Exception as lang_error:
            print(f"[YT-Transcript] English not found ({lang_error}), trying other languages...")
            transcript = ytt_api.fetch(video_id)
        
        # Convert to raw data and combine all segments into one text
        raw_data = transcript.to_raw_data()
        full_transcript = " ".join([entry['text'] for entry in raw_data])
        
        print(f"[YT-Transcript] Success! Extracted {len(full_transcript)} characters")
        return full_transcript
        
    except Exception as e:
        error_msg = str(e).lower()
        print(f"[YT-Transcript] Error: {type(e).__name__}: {e}")
        
        if "disabled" in error_msg or "no captions" in error_msg:
            raise Exception("This video has no captions/subtitles available. Please upload the audio file directly.")
        elif "unavailable" in error_msg or "no longer available" in error_msg:
            raise Exception("This video is unavailable or restricted. Please try a different video or upload the audio file directly.")
        elif "not found" in error_msg or "no transcript" in error_msg:
            raise Exception("No transcript found for this video. Please upload the audio file directly.")
        elif "video id" in error_msg or "could not extract" in error_msg:
            raise Exception(str(e))
        else:
            raise Exception(f"Failed to extract transcript: {str(e)}")


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube URL"""
    youtube_patterns = [
        r'youtube\.com',
        r'youtu\.be',
    ]
    return any(re.search(pattern, url) for pattern in youtube_patterns)
