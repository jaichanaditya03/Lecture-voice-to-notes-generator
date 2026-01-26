from pydantic import BaseModel
from typing import Optional

class TranscriptRequest(BaseModel):
    transcript: str

class QuizRequest(BaseModel):
    notes: Optional[str] = None
    transcript: Optional[str] = None 

class YouTubeRequest(BaseModel):
    url: str
