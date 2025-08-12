"""
Demo script showing the Resume Parser API capabilities
"""

import json

# Sample resume data for demonstration
sample_resume_content = """
JANE DOE
Senior Python Developer

Contact: jane.doe@email.com | +1-555-987-6543

EXPERIENCE:
Software Engineer at Google (2020-2024)
- Developed scalable web applications using Python, Django, and React
- Led a team of 8 developers in agile environment
- Implemented machine learning models using TensorFlow and scikit-learn
- Worked extensively with AWS, Docker, and Kubernetes for deployment

Python Developer at Microsoft (2018-2020)
- Built REST APIs using FastAPI and Flask
- Managed PostgreSQL and MongoDB databases
- Implemented CI/CD pipelines with Azure DevOps
- 4 years of experience in backend development

EDUCATION:
Master of Science in Computer Science, Stanford University (2018)
Bachelor of Engineering in Software Engineering, UC Berkeley (2016)

TECHNICAL SKILLS:
Programming: Python, JavaScript, Java, C++, TypeScript, Go, Rust
Frameworks: Django, Flask, FastAPI, React, Vue.js, Node.js
Databases: PostgreSQL, MongoDB, MySQL, Redis
Cloud: AWS, Azure, Google Cloud Platform, Docker, Kubernetes
Machine Learning: TensorFlow, PyTorch, scikit-learn, pandas, numpy
Tools: Git, Jenkins, GitHub Actions, Jira

SOFT SKILLS:
Leadership, Communication, Problem Solving, Project Management, Team Collaboration

ACHIEVEMENTS:
- 6+ years of professional software development experience
- Led successful migration of legacy systems to microservices architecture
- Improved system performance by 60% through optimization
- Published 3 technical papers on machine learning applications
"""

def demonstrate_parsing():
    """Show what the API would extract from the sample resume"""
    print("🎯 Resume Parser API - Demonstration")
    print("=" * 50)
    
    print("📄 Sample Resume Content:")
    print("-" * 30)
    print(sample_resume_content[:300] + "...\n")
    
    print("🤖 AI Extraction Results:")
    print("-" * 30)
    
    # Simulate API response
    simulated_response = {
        "success": True,
        "data": {
            "candidate_name": "Jane Doe",
            "email": "jane.doe@email.com",
            "phone_number": "5559876543",
            "extracted_skills": [
                "Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust",
                "Django", "Flask", "FastAPI", "React", "Vue.js", "Node.js",
                "PostgreSQL", "MongoDB", "MySQL", "Redis",
                "AWS", "Azure", "Google Cloud Platform", "Docker", "Kubernetes",
                "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "Numpy",
                "Git", "Jenkins", "GitHub Actions"
            ],
            "soft_skills": [
                "Leadership", "Communication", "Problem Solving", 
                "Project Management", "Team Collaboration"
            ],
            "experience_years": 6,
            "education": [
                "Master of Science in Computer Science, Stanford University (2018)",
                "Bachelor of Engineering in Software Engineering, UC Berkeley (2016)"
            ],
            "raw_text_length": len(sample_resume_content),
            "confidence_score": 0.92
        },
        "message": "Resume parsed successfully. Found 25 technical skills and 5 soft skills."
    }
    
    data = simulated_response["data"]
    
    print(f"👤 Name: {data['candidate_name']}")
    print(f"📧 Email: {data['email']}")
    print(f"📱 Phone: {data['phone_number']}")
    print(f"🎯 Experience: {data['experience_years']} years")
    print(f"📊 Confidence: {data['confidence_score']:.1%}")
    print()
    
    print(f"💻 Technical Skills ({len(data['extracted_skills'])}):")
    for i, skill in enumerate(data['extracted_skills'][:10], 1):
        print(f"  {i:2d}. {skill}")
    if len(data['extracted_skills']) > 10:
        print(f"     ... and {len(data['extracted_skills']) - 10} more")
    print()
    
    print(f"🤝 Soft Skills ({len(data['soft_skills'])}):")
    for skill in data['soft_skills']:
        print(f"  • {skill}")
    print()
    
    print(f"🎓 Education ({len(data['education'])}):")
    for edu in data['education']:
        print(f"  • {edu}")
    print()
    
    print("🚀 API Usage Examples:")
    print("-" * 20)
    
    print("cURL command:")
    print('curl -X POST "http://localhost:8000/parse-resume" \\')
    print('  -H "accept: application/json" \\')
    print('  -H "Content-Type: multipart/form-data" \\')
    print('  -F "file=@resume.pdf"')
    print()
    
    print("Python client:")
    print("""
import requests

with open('resume.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/parse-resume', files=files)
    result = response.json()
    print(f"Found {len(result['data']['extracted_skills'])} skills!")
""")
    print()
    
    print("📚 Supported Features:")
    print("  ✓ PDF and DOCX file parsing")
    print("  ✓ 100+ technical skills recognition")
    print("  ✓ Contact information extraction")
    print("  ✓ Experience years detection")
    print("  ✓ Education background parsing")
    print("  ✓ Confidence scoring")
    print("  ✓ Real-time processing")
    print()
    
    print("🎯 Ready to test with real files!")
    print("Visit http://localhost:8000/docs for interactive API testing")

if __name__ == "__main__":
    demonstrate_parsing()