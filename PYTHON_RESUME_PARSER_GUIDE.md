# Python FastAPI Resume Parser - Complete Guide

## Overview

The Python FastAPI Resume Parser is a standalone backend service that provides advanced resume parsing capabilities using Natural Language Processing (NLP). It's designed to work alongside the main Mavericks Coding Platform or as an independent service.

## Features

### 🚀 Core Capabilities
- **Multi-format Parsing**: PDF and DOCX resume processing
- **Advanced NLP**: spaCy-powered Named Entity Recognition
- **Comprehensive Skill Detection**: 100+ technical skills + 20+ soft skills
- **Contact Extraction**: Email and phone number detection
- **Experience Analysis**: Years of experience and education parsing
- **Quality Scoring**: Confidence metrics for extracted data

### 🎯 Technical Stack
- **FastAPI**: Modern Python web framework
- **spaCy**: Advanced NLP library with pre-trained models
- **pdfplumber**: PDF text extraction
- **python-docx**: DOCX document processing
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production deployment

## Installation & Setup

### Local Development

1. **Navigate to the Python parser directory**
   ```bash
   cd python-resume-parser
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download spaCy language model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Start the server**
   ```bash
   python main.py
   # OR
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Access the API**
   - API Base: `http://localhost:8000`
   - Interactive Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

### Replit Deployment

1. **Upload files to Replit**
   - Create new Python Repl
   - Upload all files from `python-resume-parser/` directory

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. **Configure run command**
   ```bash
   python main.py
   ```

4. **Access via Replit URL**
   - The API will be available on your Replit-provided URL
   - Add `/docs` for interactive documentation

## API Endpoints

### 📋 Main Endpoints

#### POST `/parse-resume`
Upload and parse a resume file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF or DOCX, max 5MB)

**Response Example:**
```json
{
  "success": true,
  "data": {
    "candidate_name": "John Smith",
    "email": "john.smith@email.com",
    "phone_number": "5551234567",
    "extracted_skills": [
      "Python", "JavaScript", "React", "Node.js", "AWS", "Docker"
    ],
    "soft_skills": [
      "Leadership", "Communication", "Problem Solving"
    ],
    "experience_years": 5,
    "education": [
      "Bachelor of Computer Science, MIT (2018)"
    ],
    "raw_text_length": 2847,
    "confidence_score": 0.85
  },
  "message": "Resume parsed successfully. Found 15 technical skills and 3 soft skills."
}
```

#### GET `/skills`
Retrieve all available skills in the system.

#### GET `/health`
Health check endpoint.

#### GET `/`
API information and status.

## Testing Examples

### cURL Examples

**Health Check:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Parse Resume:**
```bash
curl -X POST "http://localhost:8000/parse-resume" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@resume.pdf"
```

**Get Skills List:**
```bash
curl -X GET "http://localhost:8000/skills"
```

### Python Client Example

```python
import requests

def parse_resume(file_path):
    """Parse a resume file using the API"""
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://localhost:8000/parse-resume', 
            files=files
        )
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            data = result['data']
            print(f"Candidate: {data['candidate_name']}")
            print(f"Skills found: {len(data['extracted_skills'])}")
            print(f"Confidence: {data['confidence_score']:.1%}")
            return data
        else:
            print(f"Error: {result['message']}")
    else:
        print(f"HTTP Error: {response.status_code}")
    
    return None

# Usage
result = parse_resume('path/to/resume.pdf')
```

### JavaScript Integration

```javascript
async function parseResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('http://localhost:8000/parse-resume', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Skills found:', result.data.extracted_skills);
            return result.data;
        } else {
            console.error('Parsing failed:', result.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
```

## Skill Detection

### Technical Skills (100+)

The parser recognizes skills across multiple categories:

**Programming Languages:**
- Python, JavaScript, Java, C++, C#, TypeScript, Go, Rust, etc.

**Web Technologies:**
- HTML, CSS, React, Vue.js, Angular, Node.js, Express, etc.

**Databases:**
- SQL, MySQL, PostgreSQL, MongoDB, Redis, etc.

**Cloud & DevOps:**
- AWS, Azure, Google Cloud, Docker, Kubernetes, Jenkins, etc.

**Data Science:**
- TensorFlow, PyTorch, scikit-learn, pandas, NumPy, etc.

### Soft Skills (20+)
Leadership, Communication, Problem Solving, Project Management, Team Collaboration, etc.

## Advanced Features

### Confidence Scoring

The API calculates a confidence score (0.0 to 1.0) based on:
- Name detection (0.2 points)
- Email found (0.2 points)
- Phone found (0.1 points)
- Skills found (up to 0.3 points)
- Experience/Education (0.2 points total)

### Error Handling

**Common Errors:**
- `400`: Invalid file type or size
- `422`: Invalid request format
- `500`: Server processing error

**Error Response Example:**
```json
{
  "success": false,
  "message": "Failed to parse resume",
  "error": "Unsupported file type. Please upload PDF or DOCX files only."
}
```

### Performance Optimization

- **File Size Limit**: 5MB maximum
- **Processing Time**: 1-3 seconds per resume
- **Memory Usage**: Optimized for concurrent requests
- **Caching**: spaCy model loaded once at startup

## Integration with Mavericks Platform

### Adding to Existing Platform

1. **Start the Python server** on port 8000
2. **Update frontend** to call Python API for resume parsing
3. **Proxy requests** through the main Express server if needed

### Example Integration Code

```typescript
// In your existing TypeScript/Node.js backend
async function parseResumeWithPython(fileBuffer: Buffer, fileName: string) {
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob, fileName);
  
  const response = await fetch('http://localhost:8000/parse-resume', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}
```

## Production Deployment

### Environment Variables
```bash
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Resource Requirements
- **Memory**: 512MB minimum (1GB recommended)
- **CPU**: 1 core minimum (2 cores recommended)
- **Storage**: 200MB for dependencies and models

## Troubleshooting

### Common Issues

1. **spaCy Model Not Found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **Port Already in Use**
   ```bash
   # Change port in main.py or kill existing process
   lsof -ti:8000 | xargs kill -9
   ```

3. **File Upload Errors**
   - Check file size (max 5MB)
   - Ensure file format is PDF or DOCX
   - Verify file is not corrupted

4. **Poor Extraction Results**
   - Ensure resume has clear text (not image-based PDF)
   - Check skill spelling and formatting
   - Verify resume follows standard format

### Performance Tuning

1. **Increase concurrent workers**
   ```bash
   uvicorn main:app --workers 4
   ```

2. **Enable response caching** for repeated requests
3. **Use nginx** as reverse proxy for production
4. **Monitor memory usage** with large file uploads

## Testing & Validation

### Sample Test Data

The repository includes:
- `sample_resume.txt`: Text-based sample resume
- `demo.py`: Demonstration script showing expected output
- `test_api.py`: Basic API testing script

### Running Tests

```bash
# Run demo
python demo.py

# Test API endpoints
python test_api.py

# Manual testing with sample file
curl -X POST "http://localhost:8000/parse-resume" \
  -F "file=@sample_resume.txt"
```

## License & Contributing

This resume parser is part of the Mavericks Coding Platform and follows the same MIT license. Contributions are welcome for:

- Additional skill patterns
- New file format support
- Performance improvements
- Error handling enhancements

## Support

For issues or questions:
1. Check the `/docs` endpoint for API documentation
2. Review the troubleshooting section
3. Test with the provided sample files
4. Verify spaCy model installation