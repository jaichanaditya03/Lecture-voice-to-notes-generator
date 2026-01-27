"""
YouTube Transcript Service
Extracts transcripts directly from YouTube videos using the official transcript API.
This bypasses bot detection by using YouTube's built-in captions instead of downloading audio.
"""
import re
from youtube_transcript_api import YouTubeTranscriptAPI
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


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
        TranscriptsDisabled: If video has no captions
        NoTranscriptFound: If no transcript is available
    """
    try:
        # Extract video ID
        video_id = extract_video_id(url)
        print(f"📹 Extracting transcript for video ID: {video_id}")
        
        # Get transcript (tries English first, then any available language)
        try:
            transcript_list = YouTubeTranscriptAPI.get_transcript(video_id, languages=['en'])
        except NoTranscriptFound:
            # Try to get any available transcript
            print("⚠️  English transcript not found, trying other languages...")
            transcript_list = YouTubeTranscriptAPI.get_transcript(video_id)
        
        # Combine all transcript segments into one text
        full_transcript = " ".join([entry['text'] for entry in transcript_list])
        
        print(f"✅ Transcript extracted: {len(full_transcript)} characters")
        return full_transcript
        
    except TranscriptsDisabled:
        raise Exception("This video has no captions/subtitles available. Please upload the audio file directly.")
    except NoTranscriptFound:
        raise Exception("No transcript found for this video. Please upload the audio file directly.")
    except ValueError as e:
        raise Exception(str(e))
    except Exception as e:
        raise Exception(f"Failed to extract transcript: {str(e)}")


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube URL"""
    youtube_patterns = [
        r'youtube\.com',
        r'youtu\.be',
    ]
    return any(re.search(pattern, url) for pattern in youtube_patterns)
