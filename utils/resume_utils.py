from fastapi import FastAPI, HTTPException, Form, File, UploadFile
import pdfplumber
import io

async def read_resume_from_upload(file: UploadFile) -> list[str]:
    """
    Reads the resume from an uploaded file in memory and extracts text content
    """
    try:
        #Read the file content into a bytes buffer
        pdf_bytes = await file.read()

        resume_text = ""
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    resume_text += text + "\n"
        lines = resume_text.splitlines()

        return [line.strip() for line in lines if line.strip()] # Removing empty lines
    except Exception as e:
        print(f"Error reading resume: {e}")
        raise HTTPException(status_code=400, detail=f"Could not read the provided PDF file. Error: {e}")