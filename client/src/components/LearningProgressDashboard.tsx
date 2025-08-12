import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Trophy, 
  Star,
  CheckCircle2,
  PlayCircle,
  Lightbulb
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { motion } from 'framer-motion';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  content: any[];
  currentSection?: number;
  completedSections?: string[];
}

interface ProgressSummary {
  totalPaths: number;
  completedPaths: number;
  inProgressPaths: number;
  averageProgress: number;
}

interface SkillGap {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  currentLevel: number;
}

export default function LearningProgressDashboard() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch learning progress
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/learning/progress'],
    queryFn: () => apiRequest('/api/learning/progress'),
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });

  // Generate learning path mutation
  const generatePathMutation = useMutation({
    mutationFn: () => apiRequest('/api/learning/generate', { method: 'POST' }),
    onSuccess: (result) => {
      toast({
        title: "Learning Path Generated!",
        description: `Created personalized path: ${result.learningPath.title}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate learning path",
        variant: "destructive"
      });
    }
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: { pathId: string; completedSections: string[]; currentSection: number; progress: number }) =>
      apiRequest('/api/learning/progress', { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
      toast({
        title: "Progress Updated!",
        description: "Your learning progress has been saved."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive"
      });
    }
  });

  const learningPaths: LearningPath[] = progressData?.learningPaths || [];
  const progressSummary: ProgressSummary = progressData?.progressSummary || {
    totalPaths: 0,
    completedPaths: 0,
    inProgressPaths: 0,
    averageProgress: 0
  };
  const skillGaps: SkillGap[] = progressData?.skillGaps || [];
  const nextRecommendations = progressData?.nextRecommendations || [];

  const markSectionComplete = (pathId: string, sectionIndex: number) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return;

    const completedSections = path.completedSections || [];
    const sectionTitle = path.content[Math.floor(sectionIndex / 2)]?.section || `Section ${sectionIndex + 1}`;
    
    if (!completedSections.includes(sectionTitle)) {
      const newCompletedSections = [...completedSections, sectionTitle];
      const newProgress = Math.round((newCompletedSections.length / path.content.length) * 100);
      
      updateProgressMutation.mutate({
        pathId,
        completedSections: newCompletedSections,
        currentSection: sectionIndex + 1,
        progress: newProgress
      });
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="space-y-6" data-testid="learning-progress-loading">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="learning-progress-dashboard">
      {/* Progress Overview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paths</p>
                <p className="text-2xl font-bold">{progressSummary.totalPaths}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{progressSummary.completedPaths}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <PlayCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{progressSummary.inProgressPaths}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{progressSummary.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Learning Paths */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Learning Paths</h2>
            <Button 
              onClick={() => generatePathMutation.mutate()}
              disabled={generatePathMutation.isPending}
              data-testid="button-generate-path"
            >
              {generatePathMutation.isPending ? "Generating..." : "Generate New Path"}
            </Button>
          </div>

          {learningPaths.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Learning Paths Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a personalized learning path based on your skills and goals.
                </p>
                <Button 
                  onClick={() => generatePathMutation.mutate()}
                  disabled={generatePathMutation.isPending}
                >
                  {generatePathMutation.isPending ? "Generating..." : "Create Your First Path"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <motion.div
                  key={path.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow" data-testid={`learning-path-${path.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <CardDescription className="mt-1">{path.description}</CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{path.category}</Badge>
                            <Badge variant={
                              path.difficulty === 'Beginner' ? 'default' : 
                              path.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
                            }>
                              {path.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{path.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          path.status === 'Completed' ? 'default' : 
                          path.status === 'In Progress' ? 'secondary' : 'outline'
                        }>
                          {path.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>

                        {path.content && path.content.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Sections:</h4>
                            <div className="grid gap-2">
                              {path.content.map((section, index) => {
                                const isCompleted = path.completedSections?.includes(section.section);
                                const isCurrent = path.currentSection === index;
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                                      isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                                      isCurrent ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                                      'bg-muted/50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                                      )}
                                      <span className="text-sm font-medium">{section.section}</span>
                                    </div>
                                    {!isCompleted && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => markSectionComplete(path.id, index)}
                                        disabled={updateProgressMutation.isPending}
                                        data-testid={`button-complete-section-${index}`}
                                      >
                                        Mark Complete
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Gaps & Recommendations */}
        <div className="space-y-6">
          {/* Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Skill Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skillGaps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Take quizzes to identify skill gaps
                </p>
              ) : (
                skillGaps.map((gap, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{gap.skill}</span>
                      <Badge variant={
                        gap.importance === 'High' ? 'destructive' :
                        gap.importance === 'Medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {gap.importance}
                      </Badge>
                    </div>
                    <Progress value={gap.currentLevel * 100} className="h-1" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Next Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextRecommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Complete assessments to get personalized recommendations
                </p>
              ) : (
                nextRecommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {rec.action}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}