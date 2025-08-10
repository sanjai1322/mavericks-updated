const fetch = require("node-fetch");

// Profile Agent - AI-powered skill extraction and profile management
class ProfileAgent {
  constructor() {
    this.name = "ProfileAgent";
    this.version = "1.0.0";
  }

  // Extract skills from user bio using AI
  async extractSkillsFromBio(bio) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen/qwen-2.5-coder-32b-instruct",
          messages: [
            {
              role: "system",
              content: "You are an AI that extracts programming skills and technologies from user bios. Respond ONLY with a JSON array of skills. Extract specific programming languages, frameworks, tools, and technologies mentioned. Be concise and accurate."
            },
            { 
              role: "user", 
              content: `Extract programming skills from this bio: "${bio}"` 
            }
          ],
          temperature: 0.3,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const skillsText = data.choices?.[0]?.message?.content;

      if (!skillsText) {
        console.error("No content received from OpenRouter");
        return [];
      }

      // Try to parse the JSON safely
      let skills = [];
      try {
        // Clean up the response text - remove markdown code blocks if present
        const cleanText = skillsText.replace(/```json\n?|\n?```/g, '').trim();
        skills = JSON.parse(cleanText);
        
        // Ensure it's an array
        if (!Array.isArray(skills)) {
          skills = [];
        }
      } catch (parseError) {
        console.error("Error parsing skills JSON:", skillsText);
        console.error("Parse error:", parseError.message);
        
        // Fallback: try to extract skills manually from response
        const fallbackSkills = this.extractSkillsFallback(skillsText);
        return fallbackSkills;
      }

      return skills;
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      return [];
    }
  }

  // Fallback method to extract skills when JSON parsing fails
  extractSkillsFallback(text) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
      'HTML', 'CSS', 'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'Express',
      'Vue.js', 'Angular', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
      'Swift', 'Kotlin', 'Flutter', 'React Native', 'Redux', 'GraphQL',
      'PostgreSQL', 'MySQL', 'Firebase', 'Tailwind CSS', 'Bootstrap',
      'Sass', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js', 'Laravel',
      'Django', 'Flask', 'Spring', 'TensorFlow', 'PyTorch', 'Kubernetes'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  }

  // Update user profile with extracted skills
  async updateUserProfile(userId, bio, storage) {
    try {
      const skills = await this.extractSkillsFromBio(bio);
      
      // Get current user data
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        throw new Error("User not found");
      }

      // Update user profile with bio and extracted skills
      const updatedUser = await storage.updateUser(userId, {
        bio: bio,
        skills: skills
      });

      return {
        ...updatedUser,
        extractedSkills: skills
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Analyze profile completeness
  async analyzeProfileCompleteness(profileData) {
    const requiredFields = ['firstName', 'lastName', 'title', 'bio'];
    const optionalFields = ['skills', 'experience', 'projects'];
    
    const missingRequired = requiredFields.filter(field => 
      !profileData[field] || profileData[field].trim() === ''
    );
    
    const missingOptional = optionalFields.filter(field => 
      !profileData[field] || (Array.isArray(profileData[field]) && profileData[field].length === 0)
    );
    
    const totalFields = requiredFields.length + optionalFields.length;
    const completedFields = totalFields - missingRequired.length - missingOptional.length;
    const completenessScore = Math.round((completedFields / totalFields) * 100);
    
    return {
      completenessScore,
      missingRequired,
      missingOptional,
      suggestions: this.generateCompletnessSuggestions(missingRequired, missingOptional)
    };
  }

  // Generate profile completeness suggestions
  generateCompletnessSuggestions(missingRequired, missingOptional) {
    const suggestions = [];
    
    if (missingRequired.includes('bio')) {
      suggestions.push("Add a professional bio describing your experience and interests");
    }
    if (missingRequired.includes('title')) {
      suggestions.push("Set your professional title (e.g., 'Full Stack Developer')");
    }
    if (missingOptional.includes('skills')) {
      suggestions.push("List your technical skills to help others understand your expertise");
    }
    if (missingOptional.includes('projects')) {
      suggestions.push("Showcase your projects to demonstrate your capabilities");
    }
    
    return suggestions;
  }
}

module.exports = { ProfileAgent };