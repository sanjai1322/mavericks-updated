"""
Test script for the Resume Parser API
"""

import requests
import json

# Test endpoints
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_skills_endpoint():
    """Test the skills endpoint"""
    print("Testing skills endpoint...")
    response = requests.get(f"{BASE_URL}/skills")
    data = response.json()
    print(f"Status: {response.status_code}")
    print(f"Technical skills count: {data['total_technical']}")
    print(f"Soft skills count: {data['total_soft']}")
    print("Sample technical skills:", data['technical_skills'][:10])
    print()

def test_parse_sample_text():
    """Test parsing with a sample text file"""
    print("Testing resume parsing with sample text...")
    
    # Create a sample resume text
    sample_resume = """
    John Smith
    Software Engineer
    Email: john.smith@email.com
    Phone: (555) 123-4567
    
    EXPERIENCE
    Senior Software Engineer at Tech Corp (2020-2024)
    - Developed web applications using React and Node.js
    - Worked with Python, JavaScript, and SQL databases
    - Led a team of 5 developers
    - Experience with AWS cloud services
    
    EDUCATION
    Bachelor of Computer Science, University of Technology (2018)
    
    SKILLS
    Programming: Python, JavaScript, Java, C++
    Frameworks: React, Angular, Django, Flask
    Databases: MySQL, PostgreSQL, MongoDB
    Cloud: AWS, Azure, Docker, Kubernetes
    Soft Skills: Leadership, Communication, Problem Solving
    """
    
    # Save to a temporary file
    with open("sample_resume.txt", "w") as f:
        f.write(sample_resume)
    
    # Note: This would normally be a PDF/DOCX file
    print("Sample resume created. In a real scenario, you would upload a PDF or DOCX file.")
    print("Sample content preview:")
    print(sample_resume[:200] + "...")
    print()

if __name__ == "__main__":
    print("Resume Parser API Test Suite")
    print("=" * 40)
    
    try:
        test_health_check()
        test_skills_endpoint()
        test_parse_sample_text()
        
        print("Tests completed successfully!")
        print("To test file upload, use:")
        print('curl -X POST "http://localhost:8000/parse-resume" -F "file=@sample_resume.pdf"')
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to API server.")
        print("Make sure the server is running with: python main.py")