import json

def generate_quiz_and_flashcards(client, content_text: str) -> dict:
    """
    Generate quiz questions and flashcards from content.
    Returns a dictionary with 'quiz' and 'flashcards' keys.
    """
    # Calculate number of questions based on content length
    word_count = len(content_text.split())
    
    # Dynamic question count: 1 question per ~100 words, min 5, max 15
    num_questions = min(15, max(5, word_count // 100))
    num_flashcards = num_questions  # Same number of flashcards
    
    print(f"📊 Content: {word_count} words → Generating {num_questions} questions and {num_flashcards} flashcards")
    
    prompt = f"""Based on the following text, generate:
1. {num_questions} Multiple Choice Questions (MCQs) with 4 options each and the correct answer
2. {num_flashcards} Flashcards with a question/term (front) and answer/definition (back)

Return ONLY a valid JSON object with this exact structure:
{{
    "quiz": [
        {{"question": "What is...?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A"}}
    ],
    "flashcards": [
        {{"front": "Key term or question", "back": "Definition or answer"}}
    ]
}}

Text:
{content_text[:30000]}"""

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a helpful education assistant. You ONLY output valid JSON. No markdown, no explanations, just pure JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=2048,
        response_format={"type": "json_object"}
    )
    
    result_text = chat_completion.choices[0].message.content
    try:
        result_json = json.loads(result_text)
    except json.JSONDecodeError as e:
        print(f"❌ Quiz JSON parse error: {e}\nRaw response: {result_text[:500]}")
        raise Exception("The AI returned an invalid response. Please try again.")
    
    return result_json
