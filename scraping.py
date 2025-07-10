from bs4 import BeautifulSoup
import requests
from mistralai import Mistral

def job_posting(url):
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

    return lines

def analyze_job_with_mistral(job_text, api_key):
    #Initialize the Mistral client
    client = Mistral(api_key=api_key)
    job_content = "\n".join(job_text)
    # Create the prompt for resume tailoring suggestions
    prompt = f"""
    Please analyze the following job posting and provide specific suggestions for resume tailoring:

    JOB POSTING:
    {job_content}

    Please provide:
    1. Key skills and qualifications mentioned
    2. Important keywords to include in resume
    3. Specific experience requirements
    4. Soft skills emphasized
    5. Resume tailoring recommendations

    Focus on actionable advice for customizing a resume for this position.
    """
    try:
        #Make the API call
        response = client.chat.complete(
            model="mistal-large-latest"
        )

text = job_posting("https://optiver.com/working-at-optiver/career-opportunities/7973726002/?gh_src=9fb491cd2&utm_source=ouckah")