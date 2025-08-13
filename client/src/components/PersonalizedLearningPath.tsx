import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  content: Array<{
    section: string;
    topics: Array<{
      title: string;
      description: string;
      estimatedHours: number;
      resources: Array<{
        type: string;
        title: string;
        difficulty?: string;
      }>;
    }>;
  }>;
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
  progress?: number;
  status?: string;
}

interface LearningProgress {
  learningPaths: LearningPath[];
  progressSummary: {
    totalPaths: number;
    completedPaths: number;
    inProgressPaths: number;
    averageProgress: number;
  };
  skillGaps: Array<{
    skill: string;
    currentLevel: number;
    recommendedAction: string;
  }>;
  nextRecommendations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export default function PersonalizedLearningPath() {
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  // Fetch learning progress
  const { data: learningProgress, isLoading, error } = useQuery<LearningProgress>({
    queryKey: ['/api/learning/progress'],
    queryFn: () => apiRequest('/api/learning/progress'),
  });

  // Generate new learning path
  const generatePathMutation = useMutation({
    mutationFn: () => apiRequest('/api/learning/generate', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
      toast({ 
        title: "Learning path generated!", 
        description: "Your personalized learning path has been created based on your resume skills." 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Generation failed", 
        description: error.message || "Failed to generate learning path. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Update progress
  const updateProgressMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/learning/progress', { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
      toast({ title: "Progress updated!" });
    },
  });

  const handleStartPath = (path: LearningPath) => {
    setSelectedPath(path);
  };

  const handleUpdateProgress = (pathId: string, sectionIndex: number) => {
    updateProgressMutation.mutate({
      pathId,
      completedSections: [`section-${sectionIndex}`],
      currentSection: sectionIndex + 1,
      progress: Math.min(((sectionIndex + 1) / (selectedPath?.content.length || 1)) * 100, 100)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Generate Your Learning Path
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create a personalized learning path based on your resume and skills.
          </p>
          <Button 
            onClick={() => generatePathMutation.mutate()}
            disabled={generatePathMutation.isPending}
            data-testid="button-generate-learning-path"
          >
            {generatePathMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate Learning Path
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (!learningProgress?.learningPaths || learningProgress.learningPaths.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Learning Paths Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload your resume first, then generate a personalized learning path based on your skills.
          </p>
          <Button 
            onClick={() => generatePathMutation.mutate()}
            disabled={generatePathMutation.isPending}
            data-testid="button-generate-learning-path"
          >
            {generatePathMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate Learning Path
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (selectedPath) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPath.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{selectedPath.description}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedPath(null)}>
            Back to Paths
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{selectedPath.difficulty}</Badge>
              <Badge variant="secondary">{selectedPath.category}</Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{selectedPath.estimatedHours} hours</span>
            </div>
            <Progress value={selectedPath.progress || 0} className="flex-1" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning Modules</h3>
            {selectedPath.content.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.section}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{topic.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{topic.estimatedHours}h</span>
                            <div className="flex space-x-1">
                              {topic.resources.map((resource, resourceIndex) => (
                                <Badge key={resourceIndex} variant="outline" className="text-xs">
                                  {resource.type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateProgress(selectedPath.id, sectionIndex)}
                          disabled={updateProgressMutation.isPending}
                          data-testid={`button-complete-topic-${topicIndex}`}
                        >
                          {(selectedPath.progress || 0) > ((sectionIndex + 1) / selectedPath.content.length) * 100 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress Overview</CardTitle>
          <CardDescription>Your personalized learning journey based on resume analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{learningProgress.progressSummary.totalPaths}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Paths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{learningProgress.progressSummary.completedPaths}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{learningProgress.progressSummary.inProgressPaths}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{learningProgress.progressSummary.averageProgress}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Learning Paths</h2>
          <Button 
            onClick={() => generatePathMutation.mutate()}
            disabled={generatePathMutation.isPending}
            data-testid="button-generate-new-path"
          >
            {generatePathMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate New Path
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {learningProgress.learningPaths.map((path) => (
            <Card key={path.id} data-testid={`learning-path-${path.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={path.difficulty === 'Beginner' ? 'secondary' : path.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                      {path.difficulty}
                    </Badge>
                    <Badge variant="outline">{path.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {path.estimatedHours} hours
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {path.content?.length || 0} modules
                      </span>
                    </div>
                    <Badge variant={path.status === 'Completed' ? 'default' : path.status === 'In Progress' ? 'secondary' : 'outline'}>
                      {path.status || 'Not Started'}
                    </Badge>
                  </div>
                  
                  <Progress value={path.progress || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {path.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handleStartPath(path)}
                      data-testid={`button-start-path-${path.id}`}
                    >
                      {path.status === 'In Progress' ? 'Continue' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      {learningProgress.skillGaps && learningProgress.skillGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skill Development Areas</CardTitle>
            <CardDescription>Areas where you can improve based on your current skill level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningProgress.skillGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{gap.skill}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{gap.recommendedAction}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={gap.currentLevel * 100} className="w-20 h-2" />
                    <span className="text-sm text-gray-500">{Math.round(gap.currentLevel * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}