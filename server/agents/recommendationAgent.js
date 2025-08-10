const fetch = require('node-fetch');

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const HF_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Personalized Problem Recommendation Engine
 * Analyzes user performance, skills, and learning patterns to suggest optimal challenges
 */
class RecommendationAgent {
  constructor() {
    this.difficultyWeights = {
      'Easy': 1,
      'Medium': 2,
      'Hard': 3
    };
  }

  /**
   * Generate personalized problem recommendations based on user data
   */
  async generateRecommendations(user, userAssessments, allProblems, limit = 5) {
    try {
      // Analyze user performance and skills
      const userProfile = this.analyzeUserProfile(user, userAssessments);
      
      // Score and rank problems based on user profile
      const scoredProblems = this.scoreProblems(allProblems, userProfile);
      
      // Use AI to refine recommendations
      const aiRecommendations = await this.getAIRecommendations(userProfile, scoredProblems);
      
      // Combine scoring algorithms and AI insights
      const finalRecommendations = this.combineRecommendations(scoredProblems, aiRecommendations, limit);
      
      return {
        recommendations: finalRecommendations,
        userProfile,
        reasoning: this.generateRecommendationReasoning(userProfile, finalRecommendations)
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to basic recommendation logic
      return this.getFallbackRecommendations(user, allProblems, limit);
    }
  }

  /**
   * Analyze user profile based on performance and skills
   */
  analyzeUserProfile(user, assessments) {
    const profile = {
      level: user.level || 1,
      totalProblems: assessments.length,
      averageScore: 0,
      successRate: 0,
      skillGaps: [],
      strongTopics: [],
      weakTopics: [],
      preferredDifficulty: 'Easy',
      learningVelocity: 'beginner', // beginner, intermediate, advanced
      topicExperience: {}
    };

    if (assessments.length === 0) {
      return { ...profile, isNewUser: true };
    }

    // Calculate performance metrics
    const passedAssessments = assessments.filter(a => a.passed);
    profile.successRate = (passedAssessments.length / assessments.length) * 100;
    profile.averageScore = assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length;

    // Analyze topic performance
    const topicStats = {};
    assessments.forEach(assessment => {
      const topic = assessment.topic || 'General';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, passed: 0, avgScore: 0, scores: [] };
      }
      topicStats[topic].total++;
      topicStats[topic].scores.push(assessment.score || 0);
      if (assessment.passed) topicStats[topic].passed++;
    });

    // Calculate topic strengths and weaknesses
    Object.keys(topicStats).forEach(topic => {
      const stats = topicStats[topic];
      stats.avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
      stats.successRate = (stats.passed / stats.total) * 100;
      
      profile.topicExperience[topic] = stats;
      
      if (stats.successRate > 70 && stats.avgScore > 70) {
        profile.strongTopics.push(topic);
      } else if (stats.successRate < 40 || stats.avgScore < 50) {
        profile.weakTopics.push(topic);
        profile.skillGaps.push(topic);
      }
    });

    // Determine preferred difficulty and learning velocity
    const recentAssessments = assessments.slice(-5); // Last 5 assessments
    const difficultyPreference = this.analyzeDifficultyPreference(recentAssessments);
    profile.preferredDifficulty = difficultyPreference;

    if (profile.averageScore > 80 && profile.successRate > 75) {
      profile.learningVelocity = 'advanced';
    } else if (profile.averageScore > 60 && profile.successRate > 60) {
      profile.learningVelocity = 'intermediate';
    }

    return profile;
  }

  /**
   * Score problems based on user profile
   */
  scoreProblems(problems, userProfile) {
    return problems.map(problem => {
      let score = 0;
      
      // Base score from problem difficulty vs user level
      const difficultyScore = this.calculateDifficultyScore(problem.difficulty, userProfile);
      score += difficultyScore * 0.3;

      // Topic relevance score
      const topicScore = this.calculateTopicScore(problem.topic, userProfile);
      score += topicScore * 0.4;

      // Learning progression score
      const progressionScore = this.calculateProgressionScore(problem, userProfile);
      score += progressionScore * 0.3;

      return {
        ...problem,
        recommendationScore: Math.round(score * 100) / 100,
        reasoning: this.generateProblemReasoning(problem, userProfile, difficultyScore, topicScore, progressionScore)
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  calculateDifficultyScore(difficulty, userProfile) {
    const userLevel = userProfile.learningVelocity;
    
    if (userLevel === 'beginner') {
      return difficulty === 'Easy' ? 1.0 : difficulty === 'Medium' ? 0.3 : 0.1;
    } else if (userLevel === 'intermediate') {
      return difficulty === 'Easy' ? 0.5 : difficulty === 'Medium' ? 1.0 : 0.6;
    } else { // advanced
      return difficulty === 'Easy' ? 0.2 : difficulty === 'Medium' ? 0.7 : 1.0;
    }
  }

  calculateTopicScore(topic, userProfile) {
    const topicExp = userProfile.topicExperience[topic];
    
    // Prioritize skill gaps for improvement
    if (userProfile.skillGaps.includes(topic)) {
      return 1.0; // High priority for weak areas
    }
    
    // Balance between known topics and new exploration
    if (userProfile.strongTopics.includes(topic)) {
      return 0.6; // Medium priority for strong areas
    }
    
    // New topics get medium-high priority
    if (!topicExp) {
      return 0.8;
    }
    
    return 0.5; // Default for other topics
  }

  calculateProgressionScore(problem, userProfile) {
    // Encourage gradual difficulty increase
    if (userProfile.isNewUser) {
      return problem.difficulty === 'Easy' ? 1.0 : 0.2;
    }
    
    const recentSuccessRate = userProfile.successRate;
    if (recentSuccessRate > 80) {
      // User is doing well, can handle harder problems
      return problem.difficulty === 'Hard' ? 1.0 : problem.difficulty === 'Medium' ? 0.8 : 0.5;
    } else if (recentSuccessRate > 60) {
      // User is progressing, medium challenges appropriate
      return problem.difficulty === 'Medium' ? 1.0 : 0.7;
    } else {
      // User struggling, stick to easier problems
      return problem.difficulty === 'Easy' ? 1.0 : 0.3;
    }
  }

  /**
   * Get AI-powered recommendation insights
   */
  async getAIRecommendations(userProfile, topProblems) {
    try {
      const prompt = `As an AI coding education expert, analyze this student profile and recommend the best learning path:

User Profile:
- Level: ${userProfile.level}
- Success Rate: ${userProfile.successRate}%
- Average Score: ${userProfile.averageScore}
- Learning Velocity: ${userProfile.learningVelocity}
- Strong Topics: ${userProfile.strongTopics.join(', ') || 'None yet'}
- Skill Gaps: ${userProfile.skillGaps.join(', ') || 'None identified'}

Top Problem Options:
${topProblems.slice(0, 10).map((p, i) => 
  `${i+1}. ${p.title} (${p.difficulty}, ${p.topic}) - Score: ${p.recommendationScore}`
).join('\n')}

Provide recommendations in JSON format:
{
  "recommendedProblems": [problem indices from the list above],
  "learningPath": "suggested sequence of topics",
  "focusAreas": ["areas to prioritize"],
  "motivationalMessage": "encouraging message for the user"
}`;

      const response = await this.callAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI recommendation error:', error);
      return null;
    }
  }

  async callAI(prompt) {
    // Try OpenRouter first
    if (OPENROUTER_KEY) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "model": "anthropic/claude-3-haiku",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 1000
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (error) {
        console.error('OpenRouter API error:', error);
      }
    }

    // Fallback to Hugging Face
    if (HF_KEY) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
          {
            headers: { Authorization: `Bearer ${HF_KEY}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          return result[0]?.generated_text || '';
        }
      } catch (error) {
        console.error('Hugging Face API error:', error);
      }
    }

    throw new Error('No AI service available');
  }

  /**
   * Combine algorithmic scoring with AI recommendations
   */
  combineRecommendations(scoredProblems, aiRecommendations, limit) {
    if (!aiRecommendations) {
      return scoredProblems.slice(0, limit);
    }

    // Weight AI recommendations with algorithmic scores
    const recommendations = [];
    const usedProblems = new Set();

    // First, add AI-recommended problems with boosted scores
    if (aiRecommendations.recommendedProblems) {
      aiRecommendations.recommendedProblems.forEach((index, priority) => {
        const problem = scoredProblems[index - 1]; // Convert to 0-based index
        if (problem && !usedProblems.has(problem.id)) {
          recommendations.push({
            ...problem,
            recommendationScore: problem.recommendationScore + (1.0 - priority * 0.1),
            aiRecommended: true,
            aiReasoning: aiRecommendations.learningPath
          });
          usedProblems.add(problem.id);
        }
      });
    }

    // Fill remaining slots with top algorithmic recommendations
    scoredProblems.forEach(problem => {
      if (recommendations.length < limit && !usedProblems.has(problem.id)) {
        recommendations.push(problem);
        usedProblems.add(problem.id);
      }
    });

    return recommendations.slice(0, limit);
  }

  /**
   * Fallback recommendations when AI fails
   */
  getFallbackRecommendations(user, problems, limit) {
    const userLevel = user.level || 1;
    
    // Simple rule-based recommendations
    let filteredProblems = problems;
    
    if (userLevel <= 2) {
      filteredProblems = problems.filter(p => p.difficulty === 'Easy');
    } else if (userLevel <= 5) {
      filteredProblems = problems.filter(p => ['Easy', 'Medium'].includes(p.difficulty));
    }
    
    // Randomize and limit
    const shuffled = filteredProblems.sort(() => 0.5 - Math.random());
    
    return {
      recommendations: shuffled.slice(0, limit).map(p => ({
        ...p,
        recommendationScore: 0.5,
        reasoning: 'Basic recommendation based on user level'
      })),
      userProfile: { level: userLevel, isNewUser: true },
      reasoning: 'Using fallback recommendation system'
    };
  }

  /**
   * Analyze difficulty preference from recent assessments
   */
  analyzeDifficultyPreference(assessments) {
    if (assessments.length === 0) return 'Easy';
    
    const difficultyPerformance = {};
    assessments.forEach(assessment => {
      const diff = assessment.difficulty || 'Easy';
      if (!difficultyPerformance[diff]) {
        difficultyPerformance[diff] = { total: 0, passed: 0, avgScore: 0, scores: [] };
      }
      difficultyPerformance[diff].total++;
      difficultyPerformance[diff].scores.push(assessment.score || 0);
      if (assessment.passed) difficultyPerformance[diff].passed++;
    });

    // Find the highest difficulty where user has >60% success rate
    const difficulties = ['Hard', 'Medium', 'Easy'];
    for (const diff of difficulties) {
      const stats = difficultyPerformance[diff];
      if (stats && (stats.passed / stats.total) >= 0.6) {
        return diff;
      }
    }
    
    return 'Easy';
  }

  /**
   * Generate reasoning for individual problem recommendations
   */
  generateProblemReasoning(problem, userProfile, difficultyScore, topicScore, progressionScore) {
    const reasons = [];
    
    if (userProfile.skillGaps.includes(problem.topic)) {
      reasons.push(`Helps improve weak area: ${problem.topic}`);
    }
    
    if (userProfile.strongTopics.includes(problem.topic)) {
      reasons.push(`Builds on your strength in ${problem.topic}`);
    }
    
    if (progressionScore > 0.8) {
      reasons.push(`Good difficulty match for your current level`);
    }
    
    if (difficultyScore > 0.8) {
      reasons.push(`Appropriate challenge level`);
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'General recommendation';
  }

  /**
   * Generate overall recommendation reasoning
   */
  generateRecommendationReasoning(userProfile, recommendations) {
    const insights = [];
    
    if (userProfile.isNewUser) {
      insights.push("Starting with foundational problems to build confidence");
    } else {
      insights.push(`Based on ${userProfile.successRate}% success rate and ${Math.round(userProfile.averageScore)} average score`);
    }
    
    if (userProfile.skillGaps.length > 0) {
      insights.push(`Focusing on improving: ${userProfile.skillGaps.join(', ')}`);
    }
    
    if (userProfile.strongTopics.length > 0) {
      insights.push(`Building on strengths in: ${userProfile.strongTopics.join(', ')}`);
    }
    
    return insights.join('. ') + '.';
  }
}

module.exports = { RecommendationAgent };