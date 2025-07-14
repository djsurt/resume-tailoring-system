from bs4 import BeautifulSoup
import requests
import pdfplumber
import sys
from mistralai import Mistral

def read_resume(pdf_path: str):
    """
    Reads a PDF resume and extracts text content
    """
    try:
        resume_text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    resume_text += text + "\n"
        
        lines = resume_text.splitlines()
        #Remove empty lines
        lines = [line.strip() for line in lines if line.strip()]
        return lines
    except Exception as e:
        print(f"Error reading resume: {e}")
        return None

def analyze_job_with_mistral(job_text, api_key, resume_path=None):
    #Initialize the Mistral client
    client = Mistral(api_key=api_key)
    job_content = "\n".join(job_text)
    resume_text = "\n".join(read_resume(resume_path)) if resume_path else None

    # Create the prompt for resume tailoring suggestions
    prompt = f"""
You are an expert in resume tailoring for software engineering and other technical roles.

Please analyze the job posting and current resume provided. Give specific, actionable feedback to tailor the resume effectively for this position. Focus on skills, technologies, accomplishments, and keywords that matter for technical hiring.

CURRENT RESUME:
{resume_text if resume_text else "No resume provided."}

JOB POSTING:
{job_content}

Please return:

1. Core Technical Skills & Qualifications Required
   List the main programming languages, tools, frameworks, systems, or certifications mentioned.

2. Critical Keywords & Phrases to Include
   Extract high-impact terms and acronyms to match applicant tracking systems (ATS).

3. Must-Have Experience or Background
   Note any specific years of experience, domains (e.g., fintech, cloud), or project types expected.

4. Valued Soft Skills (Only if emphasized)
   Include only those soft skills that appear directly in the job posting and are relevant to engineers (e.g., "collaborates with cross-functional teams").

5. Tailoring Recommendations

   * Which resume sections to emphasize or reorder
   * Specific bullet points to revise or add
   * How to mirror the job posting language without being redundant
   * Remove or downplay any content not aligned with this role
   * Omit generic introductions or summaries unless required

Additional Instructions for Tailoring to Tech Roles:

* Keep the resume concise (1 page if under 10 years' experience)
* Focus on results: use quantifiable metrics (e.g., "reduced load time by 40%")
* Prioritize *what you built, how you built it, and the impact*
* Use active, technical verbs (e.g., “developed”, “optimized”, “deployed”, “automated”)
* Avoid vague soft skills unless clearly demanded
"""
    try:
        #Make the API call
        response = client.chat.stream(
            model="mistral-medium-2505",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        # Stream the response
        full_response = ""
        print("Generating analysis...\n")
        print("="*60)
        
        for chunk in response:
            if chunk.data.choices[0].delta.content is not None:
                content = chunk.data.choices[0].delta.content
                print(content, end='', flush=True)
                full_response += content
        
        print("\n" + "="*60)

        # Save to Markdown file
        with open("resume_analysis.md", "w", encoding="utf-8") as md_file:
            md_file.write(full_response)
        
        return full_response.strip()
    except Exception as e:
        print(f"Error during API call {e}")
        return None

def job_posting(url, api_key=None, resume_path=None):
    """
    The main function to fetch and analyze the job posting against the resume
    """
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    full_text = soup.get_text(separator="\n")
    lines = full_text.splitlines()
    lines = [line.strip() for line in lines if line.strip()]  # Remove empty lines
    #--------Logic to extract specific sections can be added here-----------------
    # for line in lines:
    #     if "Qualifications" in line or "Responsibilities" in line:
    #         print(line)
    #--------------------------------------------------------------------------------
    recommendations = analyze_job_with_mistral(job_text=lines,
                                                api_key=api_key, resume_path=resume_path)


if __name__ == "__main__":
    job_url = sys.argv[1]
    api_key = sys.argv[2]
    resume_path = sys.argv[3] if len(sys.argv) > 3 else None
    print(f"Fetching job posting from: {job_url}")
    job_posting(job_url, api_key=api_key, resume_path=resume_path)