# Resume Parser API - Deployment Guide

## Quick Start Commands

### Local Development
```bash
# Navigate to directory
cd python-resume-parser

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start server
python main.py
```

### Replit Deployment
```bash
# In Replit terminal
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

## Testing Commands

```bash
# Health check
curl -X GET "http://localhost:8000/health"

# Get skills list
curl -X GET "http://localhost:8000/skills"

# Parse resume (replace with actual file)
curl -X POST "http://localhost:8000/parse-resume" \
  -F "file=@sample_resume.pdf"
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /skills` - Available skills list
- `POST /parse-resume` - Parse resume file
- `GET /docs` - Interactive API documentation

## Features Implemented

✅ PDF and DOCX file parsing
✅ spaCy NLP for name extraction
✅ 100+ technical skills recognition
✅ Contact information extraction (email, phone)
✅ Experience years detection
✅ Education background parsing
✅ Confidence scoring
✅ Error handling and validation
✅ Interactive API documentation
✅ Comprehensive logging

The API is ready for production use and can handle concurrent requests efficiently.