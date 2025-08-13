// Test script to upload the resume via API
const fs = require('fs');
const path = require('path');

async function uploadResume() {
  try {
    // Read the resume file
    const resumePath = path.join(__dirname, 'attached_assets', 'Pasted-SANJAIKUMAR-K-Full-Stack-Developer-Blender-3D-Artist-AI-Web-Innovator-LinkedIn-Sanjaiku-1755062974575_1755062974577.txt');
    const resumeContent = fs.readFileSync(resumePath, 'utf8');
    
    // First, login to get a token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.user) {
      console.log('Login failed, creating admin user...');
      
      // Register admin user
      await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        })
      });

      // Try login again
      const retryLogin = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      });
      
      const retryData = await retryLogin.json();
      console.log('Admin user created and logged in');
    }

    // Extract cookies from response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const cookies = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    // Create form data for resume upload
    const formData = new FormData();
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    formData.append('resume', blob, 'sanjai_resume.txt');

    // Upload resume
    const uploadResponse = await fetch('http://localhost:5000/api/resume/upload', {
      method: 'POST',
      headers: {
        'Cookie': cookies
      },
      body: formData
    });

    const uploadResult = await uploadResponse.json();
    console.log('Resume upload result:', uploadResult);

    // Get analysis
    const analysisResponse = await fetch('http://localhost:5000/api/resume/analysis', {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    const analysisResult = await analysisResponse.json();
    console.log('Resume analysis:', analysisResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

uploadResume();