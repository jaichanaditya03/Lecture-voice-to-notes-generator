def generate_summary(client, transcript: str) -> str:
    """
    Generate a formatted summary from a transcript.
    Handles large transcripts by chunking them.
    """
    print(f"📝 Summarizing transcript ({len(transcript)} characters)...")
    
    # Chunking logic for large transcripts
    CHUNK_SIZE = 15000
    if len(transcript) > CHUNK_SIZE:
        chunks = [transcript[i:i+CHUNK_SIZE] for i in range(0, len(transcript), CHUNK_SIZE)]
        print(f"📦 Large transcript. Splitting into {len(chunks)} chunks...")
        
        raw_summaries = []
        for i, chunk in enumerate(chunks):
            print(f"Processing summary section {i+1}/{len(chunks)}...")
            try:
                completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "system", 
                            "content": """You are a helpful assistant that summarizes lecture transcripts into clear, organized notes.

FORMATTING RULES:
- For headings, write the heading text on one line, then add underline on next line using equal signs (===)
- Use bullet points with the • symbol (not asterisks)
- Keep it concise and well-organized
- Use proper spacing between sections"""
                        },
                        {
                            "role": "user",
                            "content": f"Summarize this section of the lecture (Part {i+1}/{len(chunks)}):\n\n{chunk}"
                        }
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                    max_tokens=1024
                )
                raw_summaries.append(completion.choices[0].message.content)
            except Exception as e:
                print(f"❌ Error summarizing chunk {i}: {e}")
        
        summary = "\n\n".join(raw_summaries)
    else:
        # Normal Processing
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful assistant that summarizes lecture transcripts into clear, organized notes.

FORMATTING RULES:
- For headings, write the heading text on one line, then add underline on next line using equal signs (===)
- Use bullet points with the • symbol (not asterisks)
- Keep it concise and well-organized
- Use proper spacing between sections

Example format:
Introduction to Topic
=====================
• First key point about the topic
• Second important concept
• Third detail to remember

Main Concepts
=============
• Core idea one
• Core idea two"""
                },
                {
                    "role": "user",
                    "content": f"Summarize the following lecture transcript into organized notes with underlined headings and bullet points:\n\n{transcript}"
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024
        )
        summary = chat_completion.choices[0].message.content
    
    # Post-process to clean up formatting
    summary = clean_summary_formatting(summary)
    print(f"✅ Summary generated and formatted ({len(summary)} characters)")
    return summary


def clean_summary_formatting(summary: str) -> str:
    """Clean and format the summary text"""
    lines = summary.split('\n')
    cleaned_lines = []
    
    for i, line in enumerate(lines):
        # Convert ### headings to underlined format
        if line.strip().startswith('###'):
            heading_text = line.strip().replace('###', '').strip()
            cleaned_lines.append(heading_text)
            cleaned_lines.append('=' * len(heading_text))
        # Convert ## headings to underlined format
        elif line.strip().startswith('##'):
            heading_text = line.strip().replace('##', '').strip()
            cleaned_lines.append(heading_text)
            cleaned_lines.append('=' * len(heading_text))
        # Convert # headings to underlined format
        elif line.strip().startswith('#'):
            heading_text = line.strip().replace('#', '').strip()
            cleaned_lines.append(heading_text)
            cleaned_lines.append('=' * len(heading_text))
        # Convert * bullet points to •
        elif line.strip().startswith('*'):
            bullet_text = line.replace('*', '•', 1)
            cleaned_lines.append(bullet_text)
        # Convert - bullet points to •
        elif line.strip().startswith('-'):
            bullet_text = line.replace('-', '•', 1)
            cleaned_lines.append(bullet_text)
        else:
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)
