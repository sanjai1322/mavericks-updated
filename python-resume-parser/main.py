"""
FastAPI Resume Parser
A Python backend for parsing PDF/DOCX resumes and extracting skills using NLP.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import io
import re
import spacy
import pdfplumber
from docx import Document
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Resume Parser API",
    description="Parse resumes and extract skills using NLP",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("spaCy English model not found. Installing...")
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Predefined skill sets
TECHNICAL_SKILLS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "ruby", "php", "swift", 
    "kotlin", "go", "rust", "scala", "r", "matlab", "perl", "dart", "objective-c",
    
    # Web Technologies
    "html", "css", "html5", "css3", "sass", "scss", "less", "bootstrap", "tailwind", "bulma",
    
    # Frontend Frameworks/Libraries
    "react", "vue", "angular", "svelte", "jquery", "backbone", "ember", "next.js", "nuxt.js",
    "gatsby", "redux", "mobx", "vuex", "rxjs",
    
    # Backend Frameworks
    "node.js", "express", "fastapi", "django", "flask", "spring", "spring boot", "laravel",
    "rails", "asp.net", "gin", "fiber", "actix", "rocket",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "sql server",
    "dynamodb", "cassandra", "elasticsearch", "neo4j", "firebase", "supabase",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins", "gitlab ci",
    "github actions", "terraform", "ansible", "chef", "puppet", "vagrant",
    
    # Tools & Technologies
    "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", "figma", "sketch",
    "photoshop", "illustrator", "webpack", "vite", "rollup", "babel", "eslint", "prettier",
    
    # Testing
    "jest", "cypress", "selenium", "pytest", "junit", "mocha", "chai", "jasmine", "karma",
    
    # Mobile Development
    "react native", "flutter", "ionic", "xamarin", "android", "ios", "swift ui",
    
    # Data Science & AI
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "opencv", "nltk",
    "spacy", "matplotlib", "seaborn", "plotly", "jupyter", "anaconda",
    
    # Other Technologies
    "graphql", "rest api", "websockets", "microservices", "serverless", "blockchain", "web3"
}

SOFT_SKILLS = {
    "leadership", "teamwork", "communication", "problem solving", "analytical thinking",
    "project management", "time management", "adaptability", "creativity", "collaboration",
    "critical thinking", "decision making", "mentoring", "coaching", "presentation",
    "negotiation", "conflict resolution", "strategic planning", "agile", "scrum"
}

# Response models
class ParsedResume(BaseModel):
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    extracted_skills: List[str] = []
    soft_skills: List[str] = []
    experience_years: Optional[int] = None
    education: List[str] = []
    raw_text_length: int = 0
    confidence_score: float = 0.0

class APIResponse(BaseModel):
    success: bool
    data: Optional[ParsedResume] = None
    message: str = ""
    error: Optional[str] = None

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF using pdfplumber."""
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting PDF text: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX using python-docx."""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting DOCX text: {str(e)}")

def extract_contact_info(text: str) -> tuple[Optional[str], Optional[str]]:
    """Extract email and phone number using regex."""
    # Email regex
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    email = emails[0] if emails else None
    
    # Phone regex (various formats)
    phone_patterns = [
        r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',  # US format
        r'\+?([0-9]{1,3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})',  # International
        r'\b\d{10}\b',  # 10 digits
    ]
    
    phone = None
    for pattern in phone_patterns:
        matches = re.findall(pattern, text)
        if matches:
            if isinstance(matches[0], tuple):
                phone = ''.join(matches[0])
            else:
                phone = matches[0]
            break
    
    return email, phone

def extract_name_with_spacy(text: str) -> Optional[str]:
    """Extract candidate name using spaCy NER."""
    doc = nlp(text[:1000])  # Process first 1000 chars for performance
    
    # Look for PERSON entities
    persons = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    if persons:
        # Return the first person name found
        return persons[0].strip()
    
    # Fallback: Look for name patterns in first few lines
    lines = text.split('\n')[:5]
    for line in lines:
        line = line.strip()
        # Skip email lines and other non-name patterns
        if '@' in line or 'phone' in line.lower() or 'email' in line.lower():
            continue
        
        # Look for lines with 2-3 capitalized words
        words = line.split()
        if 2 <= len(words) <= 3 and all(word[0].isupper() for word in words if word.isalpha()):
            return line
    
    return None

def extract_skills(text: str) -> tuple[List[str], List[str]]:
    """Extract technical and soft skills from text."""
    text_lower = text.lower()
    
    # Extract technical skills
    found_technical_skills = []
    for skill in TECHNICAL_SKILLS:
        # Use word boundaries for better matching
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_technical_skills.append(skill.title())
    
    # Extract soft skills
    found_soft_skills = []
    for skill in SOFT_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_soft_skills.append(skill.title())
    
    return found_technical_skills, found_soft_skills

def extract_experience_years(text: str) -> Optional[int]:
    """Extract years of experience from text."""
    # Patterns to match experience
    experience_patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience',
        r'experience[:\s]*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s+in\s+',
    ]
    
    for pattern in experience_patterns:
        matches = re.findall(pattern, text.lower())
        if matches:
            try:
                return int(matches[0])
            except ValueError:
                continue
    
    return None

def extract_education(text: str) -> List[str]:
    """Extract education information."""
    education_keywords = [
        'bachelor', 'master', 'phd', 'doctorate', 'mba', 'degree',
        'university', 'college', 'institute', 'school'
    ]
    
    education = []
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in education_keywords):
            # Clean and add education line
            clean_line = line.strip()
            if clean_line and len(clean_line) > 10:  # Filter out very short lines
                education.append(clean_line)
    
    return education[:3]  # Limit to 3 education entries

def calculate_confidence_score(parsed_data: ParsedResume) -> float:
    """Calculate confidence score based on extracted data."""
    score = 0.0
    
    # Name found
    if parsed_data.candidate_name:
        score += 0.2
    
    # Contact info found
    if parsed_data.email:
        score += 0.2
    if parsed_data.phone_number:
        score += 0.1
    
    # Skills found
    if parsed_data.extracted_skills:
        score += min(0.3, len(parsed_data.extracted_skills) * 0.05)
    
    # Experience/Education found
    if parsed_data.experience_years:
        score += 0.1
    if parsed_data.education:
        score += 0.1
    
    return min(1.0, score)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Resume Parser API is running!",
        "version": "1.0.0",
        "endpoints": {
            "parse": "/parse-resume",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "spacy_model": "en_core_web_sm"}

@app.post("/parse-resume", response_model=APIResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse resume and extract candidate information and skills.
    
    Supports PDF and DOCX files.
    Returns candidate name, contact info, and extracted skills.
    """
    
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_extension = file.filename.lower().split('.')[-1]
    if file_extension not in ['pdf', 'docx']:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Please upload PDF or DOCX files only."
        )
    
    # Validate file size (5MB limit)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size too large. Maximum 5MB allowed.")
    
    try:
        # Extract text based on file type
        if file_extension == 'pdf':
            text = extract_text_from_pdf(file_content)
        else:  # docx
            text = extract_text_from_docx(file_content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        # Extract information
        candidate_name = extract_name_with_spacy(text)
        email, phone = extract_contact_info(text)
        technical_skills, soft_skills = extract_skills(text)
        experience_years = extract_experience_years(text)
        education = extract_education(text)
        
        # Create response
        parsed_data = ParsedResume(
            candidate_name=candidate_name,
            email=email,
            phone_number=phone,
            extracted_skills=technical_skills,
            soft_skills=soft_skills,
            experience_years=experience_years,
            education=education,
            raw_text_length=len(text)
        )
        
        # Calculate confidence score
        parsed_data.confidence_score = calculate_confidence_score(parsed_data)
        
        return APIResponse(
            success=True,
            data=parsed_data,
            message=f"Resume parsed successfully. Found {len(technical_skills)} technical skills and {len(soft_skills)} soft skills."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return APIResponse(
            success=False,
            message="Failed to parse resume",
            error=str(e)
        )

@app.get("/skills")
async def get_available_skills():
    """Get list of all available skills in the system."""
    return {
        "technical_skills": sorted(list(TECHNICAL_SKILLS)),
        "soft_skills": sorted(list(SOFT_SKILLS)),
        "total_technical": len(TECHNICAL_SKILLS),
        "total_soft": len(SOFT_SKILLS)
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )