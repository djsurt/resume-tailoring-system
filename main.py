import os
import io
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import pdfplumber
from .utils.resume_utils import read_resume_from_upload
from mistralai import Mistral

load_dotenv()

app = FastAPI(
    title="Resume Tailoring System",
    description="An API that analyzes a job description an a resume to provide tailored reccomendations.",
    version="1.0.0"
)

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise RuntimeError("MISTRAL_API_KEY environment variable not set.")
client = Mistral(api_key=api_key)

# --- CORS (Cross-Origin Resource Sharing) Middleware ---
# This allows your frontend (e.g., running on http://localhost:3000)
# to communicate with your backend (running on http://localhost:8000)

# List of origins that are allowed to make requests to this API
origins = [
    "http://localhost",
    "http://localhost:3000", # Common port for React dev servers
    "http://localhost:5173", # Common port for Vite dev servers
    # Add your deployed frontend's URL here when you go to production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)
    
async def stream_analysis_from_mistral(job_content: str, resume_text: str | None) -> str:
    """
    An async generator that streams analysis from the Mistral API.
    It yields chunks of text as they are received.
    """

    prompt = f"""
        You are an expert in resume tailoring for software engineering and other tech related roles.

        Please analyze the job posting and current resume provided. Give the current resume a percentage rating depending on how many key words it has which are related to the job posting.
        Then, provide advice on more keywords that the user can include and also how they could improve things on their resume to match the job posting.

        Format the entire output in Markdown.

        CURRENT RESUME:
        {resume_text if resume_text else "No resume provided."}

        JOB POSTING:
        {job_content}

        Please return:

        ### 1. Core Technical Skills & Qualifications Required
        List the main programming languages, tools, frameworks, systems, or certifications mentioned. Please list them as bullet points and be concise.

        ### 2. Critical Keywords & Phrases to Include
        Extract high-impact terms and acronyms to match applicant tracking systems (ATS).

        ### 3. Must-Have Experience or Background
        Note any specific years of experience, domains (e.g., fintech, cloud), or project types expected.

        ### 4. Tailoring Recommendations
        * **Current Rating:** Give a rating from 0 to 100 on how this resume fares compared to this job posting. (required)
        * **Resume Sections:** Which sections to emphasize or reorder. (optional)
        * **Bullet Points:** Specific bullet points to revise or add. Use metrics.
        * **Content to Remove:** What to downplay or remove.
    """
    try:
        response = await client.chat.stream_async(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.3
        )
        async for chunk in response:
            try:
                delta = chunk.data.choices[0].delta
                if delta and delta.content:
                    yield delta.content
            except AttributeError:
                # Likely a CompletionEvent or something else with no choices
                continue

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Mistral API: {e}")

@app.get("/")
async def root():
    """
    A simple root endpoint to check if the API is running.
    """
    return {"message": "Welcome to the Resume Tailoring System API!"}

@app.post("/analyze/tailor/")
async def analyze_job_and_resume(
    job_url: str = Form(...),
    resume: UploadFile = File(None)
):
    """
    The main API endpoint  to analyze a job posting against a resume.
    Endpoint streams response backs to the client.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(job_url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')
        full_text = soup.get_text(separator="\n")
        job_lines = [line.strip() for line in full_text.splitlines() if line.strip()]
        job_content = "\n".join(job_lines)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch job posting: {e}")
    
    resume_text = None
    if resume and resume.filename:
        resume_lines = await read_resume_from_upload(resume)
        resume_text = "\n".join(resume_lines)

    return StreamingResponse(
        stream_analysis_from_mistral(job_content=job_content, resume_text=resume_text),
        media_type="text/event-stream"
    )

@app.post("/analyze/ats/")
async def analyze_ats_score(
    resume: UploadFile = File(None)
):
    """
    Function to analyze if a resume is ATS friendly and provide an ATS score
    """
    resume_content = resume.read()
    pass



if __name__ == "__main__":
    print("Starting FastAPI server...")
    # This block allows you to run the server by executing `python main.py`
    # For production, it's better to use: uvicorn main:app --host 0.0.0.0 --port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)