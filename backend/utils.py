import time

def retry_with_backoff(func, max_retries=3, initial_delay=2):
    """
    Retry a function with exponential backoff.
    Handles Groq API rate limits and temporary failures (502 errors).
    """
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            error_msg = str(e)
            # Check if it's a rate limit or server error
            is_retryable = (
                "502" in error_msg or 
                "503" in error_msg or 
                "429" in error_msg or 
                "rate" in error_msg.lower() or
                "InternalServerError" in str(type(e).__name__)
            )
            
            if is_retryable and attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)  # Exponential backoff
                print(f"API error (attempt {attempt + 1}/{max_retries}): {type(e).__name__}")
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                # Not retryable or last attempt
                raise e
    
    raise Exception("Max retries exceeded")