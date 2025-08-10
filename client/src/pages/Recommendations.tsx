import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Zap,
  BookOpen,
  ChevronRight,
  Star
} from 'lucide-react';
import { Link } from 'wouter';

interface Recommendation {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  acceptance: string;
  problemStatement: string;
  recommendationScore: number;
  reasoning: string;
  aiRecommended?: boolean;
}

interface UserProfile {
  level: number;
  successRate: number;
  averageScore: number;
  learningVelocity: string;
  strongTopics: string[];
  skillGaps: string[];
  isNewUser?: boolean;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  userProfile: UserProfile;
  reasoning: string;
  stats: {
    totalProblems: number;
    solvedProblems: number;
    currentStreak: number;
    level: number;
    points: number;
  };
  filters: {
    availableDifficulties: string[];
    availableTopics: string[];
  };
}

export default function Recommendations() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const { data: recommendations, isLoading, error, refetch } = useQuery<RecommendationResponse>({
    queryKey: ['/api/recommendations/problems', selectedDifficulty, selectedTopic],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedTopic) params.append('topic', selectedTopic);
      
      const response = await fetch(`/api/recommendations/problems?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    }
  });

  const { data: learningPath } = useQuery({
    queryKey: ['/api/recommendations/learning-path'],
  });

  const { data: dailyChallenge } = useQuery({
    queryKey: ['/api/recommendations/daily-challenge'],
  });

  const { data: skillAnalysis } = useQuery({
    queryKey: ['/api/recommendations/skill-analysis'],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-orange-500';
      case 'advanced': return 'bg-purple-500';
      case 'expert': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-300">
              Failed to load recommendations. Please try again later.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            <Brain className="inline mr-3 text-purple-600" />
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized challenges designed for your learning journey
          </p>
        </div>
        
        {recommendations && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{recommendations.stats.level}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{recommendations.stats.solvedProblems}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Solved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{recommendations.stats.currentStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{recommendations.stats.points}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
          <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
        </TabsList>

        {/* Personalized Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {recommendations && (
            <>
              {/* AI Insight Card */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-purple-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{recommendations.reasoning}</p>
                  {recommendations.userProfile.strongTopics.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Strong Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.userProfile.strongTopics.map(topic => (
                          <Badge key={topic} variant="secondary" className="bg-green-100 text-green-800">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {recommendations.userProfile.skillGaps.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Areas for Improvement:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.userProfile.skillGaps.map(gap => (
                          <Badge key={gap} variant="secondary" className="bg-orange-100 text-orange-800">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="text-sm font-medium">Difficulty:</label>
                      <select 
                        className="ml-2 p-2 border rounded"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        <option value="">All</option>
                        {recommendations.filters.availableDifficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Topic:</label>
                      <select 
                        className="ml-2 p-2 border rounded"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      >
                        <option value="">All</option>
                        {recommendations.filters.availableTopics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.recommendations.map((rec, index) => (
                  <Card key={rec.id} className={`relative ${rec.aiRecommended ? 'border-purple-200 shadow-purple-100' : ''}`}>
                    {rec.aiRecommended && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-600 text-white">
                          <Brain className="w-3 h-3 mr-1" />
                          AI Pick
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">{rec.topic}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(rec.difficulty) + ' text-white'}>
                            {rec.difficulty}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {Math.round(rec.recommendationScore * 100)}% match
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {rec.problemStatement.split('\n')[0]}
                      </p>
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Match Score</div>
                        <Progress value={rec.recommendationScore * 100} className="h-2" />
                      </div>
                      <p className="text-xs text-purple-600 mb-4">{rec.reasoning}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{rec.acceptance} acceptance</Badge>
                        <Link href={`/assessments/${rec.id}`}>
                          <Button size="sm">
                            Start Challenge
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Daily Challenge Tab */}
        <TabsContent value="daily">
          {dailyChallenge && (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-orange-600" />
                  Today's Challenge
                </CardTitle>
                <CardDescription>
                  Daily challenge tailored to your skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dailyChallenge.challenge ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{dailyChallenge.challenge.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{dailyChallenge.challenge.topic}</p>
                      </div>
                      <Badge className={getDifficultyColor(dailyChallenge.challenge.difficulty) + ' text-white'}>
                        {dailyChallenge.challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm">{dailyChallenge.challenge.problemStatement.split('\n')[0]}</p>
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex space-x-4 text-sm">
                        <span>Attempts: {dailyChallenge.attemptsToday}</span>
                        <span>Streak: {dailyChallenge.streak}</span>
                        <span>Points: {dailyChallenge.points}</span>
                      </div>
                      <Link href={`/assessments/${dailyChallenge.challenge.id}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          {dailyChallenge.isCompleted ? 'Review' : 'Start Challenge'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p>Loading today's challenge...</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="learning-path">
          {learningPath && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                    Your Learning Journey
                  </CardTitle>
                  <CardDescription>
                    Structured path based on your current skill level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Badge className={getLevelBadgeColor(learningPath.learningPath.currentLevel) + ' text-white'}>
                        {learningPath.learningPath.currentLevel}
                      </Badge>
                      <span>Current Level</span>
                    </div>
                    <div className="text-sm">
                      <strong>Next Milestone:</strong> {learningPath.learningPath.nextMilestone}
                    </div>
                    <div className="text-sm">
                      <strong>Estimated Completion:</strong> {learningPath.learningPath.estimatedTimeToComplete}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path Phases */}
              <div className="space-y-4">
                {learningPath.learningPath.recommendedPath?.map((phase: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg">{phase.phase}</CardTitle>
                      <CardDescription>{phase.difficulty} • {phase.problems} problems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {phase.topics.map((topic: string) => (
                          <Badge key={topic} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Skill Analysis Tab */}
        <TabsContent value="skills">
          {skillAnalysis && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                    Skill Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of your coding skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold mb-4">
                    Overall Level: 
                    <Badge className={getLevelBadgeColor(skillAnalysis.overallLevel) + ' text-white ml-2'}>
                      {skillAnalysis.overallLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillAnalysis.skillBreakdown?.map((skill: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">{skill.topic}</CardTitle>
                      <CardDescription>
                        <Badge className={getLevelBadgeColor(skill.level) + ' text-white'}>
                          {skill.level}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Rate:</span>
                          <span>{skill.successRate}%</span>
                        </div>
                        <Progress value={skill.successRate} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Average Score:</span>
                          <span>{skill.averageScore}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {skill.problemsSolved}/{skill.totalAttempts} problems solved
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Priority Skills to Develop:</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.recommendations.prioritySkills?.map((skill: string) => (
                          <Badge key={skill} className="bg-red-100 text-red-800">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Strength Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.recommendations.strengthAreas?.map((area: string) => (
                          <Badge key={area} className="bg-green-100 text-green-800">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Next Focus Area:</h4>
                      <p className="text-sm">{skillAnalysis.recommendations.nextFocusArea}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}