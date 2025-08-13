import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, Target, Code, Search, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  acceptance: string;
  problemStatement: string;
  starterCode?: string;
  testCases: any;
  matchScore?: number;
  relevantSkills?: string[];
  estimatedTime?: string;
}

interface UserProfile {
  extractedSkills?: {
    technical_skills?: string[];
    programming_languages?: string[];
    frameworks?: string[];
    soft_skills?: string[];
  };
  skillStrengths?: {
    [key: string]: number;
  };
}

export default function ResumeBasedAssessments() {
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user profile with extracted skills
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile/me'],
    enabled: !!user,
  });

  // Fetch all assessments
  const { data: assessments = [], isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Calculate skill-based assessment matching
  const getMatchedAssessments = (): Assessment[] => {
    if (!userProfile?.extractedSkills || !assessments.length) {
      return assessments;
    }

    const userSkills = [
      ...(userProfile.extractedSkills.technical_skills || []),
      ...(userProfile.extractedSkills.programming_languages || []),
      ...(userProfile.extractedSkills.frameworks || [])
    ].map(skill => skill.toLowerCase());

    return assessments.map(assessment => {
      // Calculate match score based on skill overlap
      const assessmentKeywords = [
        assessment.title,
        assessment.description,
        assessment.topic,
        assessment.problemStatement
      ].join(' ').toLowerCase();

      const matchingSkills = userSkills.filter(skill => 
        assessmentKeywords.includes(skill.toLowerCase())
      );

      const matchScore = matchingSkills.length > 0 
        ? Math.min(100, (matchingSkills.length / userSkills.length) * 100 + 20)
        : Math.random() * 40; // Base relevance for non-matching

      // Estimate time based on difficulty and user skill level
      const difficultyMultiplier = assessment.difficulty === 'Easy' ? 0.8 : 
                                   assessment.difficulty === 'Medium' ? 1.2 : 1.8;
      const baseTime = 30; // 30 minutes base
      const estimatedTime = `${Math.round(baseTime * difficultyMultiplier)} min`;

      return {
        ...assessment,
        matchScore: Math.round(matchScore),
        relevantSkills: matchingSkills,
        estimatedTime
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const matchedAssessments = getMatchedAssessments();

  // Filter assessments
  const filteredAssessments = matchedAssessments.filter(assessment => {
    const matchesSearch = searchQuery === "" || 
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === "all" || assessment.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === "all" || assessment.topic === selectedTopic;
    
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // Get unique topics for filter
  const uniqueTopics = Array.from(new Set(assessments.map(a => a.topic)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!userProfile?.extractedSkills) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Resume Analysis Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your resume first to get personalized assessment recommendations based on your skills.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Resume-Based Assessment Matching</span>
          </CardTitle>
          <CardDescription>
            Coding challenges tailored to your extracted skills and experience level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Skills:</span>
            {userProfile.extractedSkills.technical_skills?.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {userProfile.extractedSkills.programming_languages?.slice(0, 3).map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
            {(userProfile.extractedSkills.technical_skills?.length || 0) > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{(userProfile.extractedSkills.technical_skills?.length || 0) - 5} more
              </Badge>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-assessments"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-32" data-testid="select-difficulty-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-40" data-testid="select-topic-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {uniqueTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Grid */}
      <div className="grid gap-4">
        {filteredAssessments.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Matching Assessments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later for new challenges.
              </p>
            </div>
          </Card>
        ) : (
          filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow" data-testid={`assessment-card-${assessment.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      {assessment.matchScore && assessment.matchScore > 60 && (
                        <Badge variant="default" className="bg-green-500">
                          {assessment.matchScore}% Match
                        </Badge>
                      )}
                      {assessment.matchScore && assessment.matchScore <= 60 && assessment.matchScore > 40 && (
                        <Badge variant="secondary">
                          {assessment.matchScore}% Match
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{assessment.description}</CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Badge variant={
                      assessment.difficulty === 'Easy' ? 'secondary' :
                      assessment.difficulty === 'Medium' ? 'default' : 'destructive'
                    }>
                      {assessment.difficulty}
                    </Badge>
                    <Badge variant="outline">{assessment.topic}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Relevant Skills */}
                  {assessment.relevantSkills && assessment.relevantSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Matching skills:</span>
                      {assessment.relevantSkills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20">
                          {skill}
                        </Badge>
                      ))}
                      {assessment.relevantSkills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{assessment.relevantSkills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Assessment Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.estimatedTime || '45 min'}
                      </span>
                      <span>Acceptance: {assessment.acceptance}</span>
                    </div>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      data-testid={`button-start-assessment-${assessment.id}`}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Start Challenge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Match Statistics */}
      {filteredAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Personalization Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {filteredAssessments.filter(a => (a.matchScore || 0) > 60).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">High Match Assessments</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(filteredAssessments.reduce((sum, a) => sum + (a.matchScore || 0), 0) / filteredAssessments.length)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Average Match Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {Array.from(new Set(filteredAssessments.flatMap(a => a.relevantSkills || []))).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Skills Covered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}