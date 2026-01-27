import os
import uuid
import subprocess
import shutil
from utils import retry_with_backoff

def process_audio_file(file_path: str, client):
    """
    Process audio file with automatic chunking for large files.
    Handles files larger than 25MB by splitting them into smaller chunks.
    """
    file_size = os.path.getsize(file_path)
    LIMIT_BYTES = 25 * 1024 * 1024  # 25MB
    
    if file_size < LIMIT_BYTES:
        def transcribe_small_file():
            with open(file_path, "rb") as f:
                return client.audio.transcriptions.create(
                    file=(os.path.basename(file_path), f),
                    model="whisper-large-v3",
                    response_format="json",
                    language="en"
                )
        t = retry_with_backoff(transcribe_small_file)
        return t.text

    print(f"📦 Large file detected ({file_size / 1024 / 1024:.2f} MB). Splitting with FFmpeg...")
    
    # Create chunks directory in /tmp (Render-compatible)
    chunk_dir = os.path.join("/tmp", f"chunks_{uuid.uuid4()}")
    os.makedirs(chunk_dir, exist_ok=True)
    
    output_pattern = os.path.join(chunk_dir, "chunk_%03d.mp3")
    
    # Run ffmpeg to split into 600s segments (10 mins) without re-encoding
    cmd = [
        "ffmpeg", "-i", file_path, 
        "-f", "segment", 
        "-segment_time", "600", 
        "-c", "copy", 
        output_pattern
    ]
    
    try:
        # Run ffmpeg (capture output to disable verbose logs)
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        chunks = sorted(os.listdir(chunk_dir))
        full_text = []
        
        print(f"📦 Split into {len(chunks)} chunks")
        
        for i, chunk in enumerate(chunks):
            chunk_path = os.path.join(chunk_dir, chunk)
            print(f"Processing chunk {i+1}/{len(chunks)}: {chunk}")
            
            try:
                def transcribe_chunk():
                    with open(chunk_path, "rb") as f:
                        return client.audio.transcriptions.create(
                            file=(chunk, f),  # Use chunk name
                            model="whisper-large-v3",
                            response_format="json",
                            language="en"
                        )
                
                t = retry_with_backoff(transcribe_chunk)
                full_text.append(t.text)
            except Exception as e:
                print(f"❌ Error processing chunk {chunk}: {e}")
    
        return " ".join(full_text)
        
    except Exception as e:
        print(f"❌ Error during processing: {e}")
        # Return whatever we got or error?
        if not full_text:
            raise e
        return " ".join(full_text)
    finally:
        # Cleanup
        if os.path.exists(chunk_dir):
            shutil.rmtree(chunk_dir)
            print(f"🧹 Cleaned up chunks directory: {chunk_dir}")
