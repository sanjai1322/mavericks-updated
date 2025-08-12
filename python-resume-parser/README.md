# Resume Parser API

A Python FastAPI backend for parsing PDF/DOCX resumes and extracting skills using NLP.

## Features

- 📄 **Multi-format Support**: Parse PDF and DOCX resume files
- 🧠 **AI-Powered Extraction**: Uses spaCy NLP for intelligent text processing
- 🔍 **Comprehensive Skill Detection**: Matches 100+ technical and soft skills
- 📱 **Contact Info Extraction**: Automatically finds emails and phone numbers
- 🎯 **Smart Name Detection**: Uses Named Entity Recognition for candidate names
- 📊 **Confidence Scoring**: Provides quality metrics for extracted data
- 🚀 **Fast & Lightweight**: Built with FastAPI for high performance

## Quick Start

### Local Installation

1. **Clone and Setup**
   ```bash
   cd python-resume-parser
   pip install -r requirements.txt
   ```

2. **Download spaCy Model** (if not auto-installed)
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Run the Server**
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

### Replit Deployment

1. **Create New Repl**
   - Choose "Python" template
   - Upload the project files

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Configuration**
   - Set run command: `python main.py`
   - The API will be automatically available on Replit's provided URL

## API Endpoints

### 🔥 Main Endpoint

**POST** `/parse-resume`

Upload a resume file and get extracted information.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF or DOCX, max 5MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate_name": "John Doe",
    "email": "john.doe@email.com",
    "phone_number": "5551234567",
    "extracted_skills": ["Python", "React", "SQL", "AWS"],
    "soft_skills": ["Leadership", "Communication"],
    "experience_years": 5,
    "education": ["Bachelor of Computer Science"],
    "raw_text_length": 2847,
    "confidence_score": 0.85
  },
  "message": "Resume parsed successfully. Found 15 technical skills and 3 soft skills."
}
```

### 📋 Additional Endpoints

- **GET** `/` - API information and health check
- **GET** `/health` - Health status
- **GET** `/skills` - List all available skills
- **GET** `/docs` - Interactive API documentation (Swagger UI)

## Testing with cURL

### Basic Resume Upload
```bash
curl -X POST "http://localhost:8000/parse-resume" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/resume.pdf"
```

### Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

### Get Available Skills
```bash
curl -X GET "http://localhost:8000/skills"
```

## Testing with Postman

1. **Create New Request**
   - Method: `POST`
   - URL: `http://localhost:8000/parse-resume`

2. **Setup Body**
   - Select `form-data`
   - Key: `file` (change type to `File`)
   - Value: Select your PDF/DOCX resume file

3. **Send Request**
   - You'll receive a JSON response with extracted data

## Skill Detection

### Technical Skills (100+)
The API recognizes skills across multiple categories:

- **Programming Languages**: Python, Java, JavaScript, TypeScript, C++, etc.
- **Web Technologies**: HTML, CSS, React, Vue, Angular, Node.js, etc.
- **Databases**: SQL, MySQL, PostgreSQL, MongoDB, Redis, etc.
- **Cloud & DevOps**: AWS, Azure, Docker, Kubernetes, Jenkins, etc.
- **Data Science**: Pandas, NumPy, TensorFlow, PyTorch, etc.

### Soft Skills (20+)
- Leadership, Communication, Problem Solving, Project Management, etc.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `candidate_name` | string | Extracted candidate name using NER |
| `email` | string | Email address found in resume |
| `phone_number` | string | Phone number (various formats supported) |
| `extracted_skills` | array | Technical skills matched from predefined list |
| `soft_skills` | array | Soft skills identified in the text |
| `experience_years` | integer | Years of experience mentioned |
| `education` | array | Educational background information |
| `raw_text_length` | integer | Length of extracted text |
| `confidence_score` | float | Quality score (0.0 to 1.0) based on data completeness |

## Error Handling

The API provides detailed error messages for common issues:

- **400**: Invalid file type, file too large, or no text extracted
- **422**: Invalid request format
- **500**: Server processing error

Example error response:
```json
{
  "success": false,
  "message": "Failed to parse resume",
  "error": "Unsupported file type. Please upload PDF or DOCX files only."
}
```

## Performance

- **File Size Limit**: 5MB maximum
- **Supported Formats**: PDF, DOCX
- **Processing Time**: ~1-3 seconds per resume
- **Concurrent Requests**: Supports multiple simultaneous uploads

## Integration Example

### JavaScript/Frontend Integration
```javascript
async function parseResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    return result;
}
```

### Python Client Example
```python
import requests

def parse_resume(file_path):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post('http://localhost:8000/parse-resume', files=files)
    return response.json()
```

## Production Deployment

### Environment Variables
```bash
# Optional: Configure host and port
HOST=0.0.0.0
PORT=8000

# Optional: Set log level
LOG_LEVEL=info
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

## Troubleshooting

### Common Issues

1. **spaCy Model Not Found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **File Upload Errors**
   - Check file size (max 5MB)
   - Ensure file is PDF or DOCX format
   - Verify file is not corrupted

3. **Poor Extraction Results**
   - Ensure resume has clear text (not image-based PDF)
   - Check if skills are spelled correctly
   - Verify resume format is standard

## API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation with live testing capabilities.

## License

MIT License - feel free to use in your projects!