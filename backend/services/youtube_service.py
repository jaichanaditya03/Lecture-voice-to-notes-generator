import os
import uuid
import yt_dlp

def download_audio_from_url(url: str, preferred_codec: str = 'm4a') -> str:
    """
    Download audio from a URL (YouTube or other supported platforms).
    Returns the path to the downloaded file.
    """
    temp_filename = os.path.join("/tmp", f"temp_{uuid.uuid4()}.{preferred_codec}")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': temp_filename,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': preferred_codec,
        }],
        'quiet': True,
        'no_warnings': True
    }

    print(f"⬇️  Downloading audio from URL...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    print(f"✅ Audio downloaded to {temp_filename}")
    return temp_filename


def download_audio_from_generic_link(url: str) -> str:
    """
    Download audio from a generic link with dynamic extension handling.
    Returns the path to the downloaded file.
    """
    job_id = str(uuid.uuid4())
    temp_base = os.path.join("/tmp", f"temp_{job_id}")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f"{temp_base}.%(ext)s",
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'no_warnings': True
    }

    print("⬇️  Downloading audio from link...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    # Find the generated file in /tmp
    final_filename = None
    for file in os.listdir("/tmp"):
        if file.startswith(os.path.basename(temp_base)):
            final_filename = os.path.join("/tmp", file)
            break
    
    if not final_filename:
        raise Exception("Downloaded file not found (yt-dlp failed to create file)")

    print(f"✅ Audio downloaded to {final_filename}")
    return final_filename
