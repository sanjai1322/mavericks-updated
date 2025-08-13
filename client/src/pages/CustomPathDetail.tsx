import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Star, 
  ArrowLeft,
  Target,
  CheckCircle,
  PlayCircle,
  Brain,
  Code,
  Zap
} from "lucide-react";

interface CustomPath {
  id: string;
  title: string;
  description: string;
  goal: string;
  experience_level: string;
  weekly_hours: number;
  preferred_topics: string[];
  learning_style: string;
  project_preference: string;
  difficulty_preference: string;
  specializations: string[];
  custom_goals: string;
  generated_content: {
    title: string;
    description: string;
    curriculum: Module[];
    estimatedDuration: string;
    difficulty: string;
    learningApproach: string;
    projectTypes: string;
    specializations: string[];
    milestones: string[];
  };
  created_at: string;
}

interface Module {
  title: string;
  duration: string;
  lessons: string[];
}

export default function CustomPathDetail() {
  const { user } = useAuth();
  const params = useParams();
  const pathId = params.id;
  const [activeModule, setActiveModule] = useState<number>(0);

  const { data: customPath, isLoading } = useQuery<CustomPath>({
    queryKey: [`/api/learning-paths/custom/${pathId}`],
    enabled: !!user && !!pathId,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your custom path</h1>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your custom learning path...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customPath) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Custom Learning Path Not Found</h1>
              <Button onClick={() => window.location.href = "/learning"}>
                Back to Learning Paths
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const content = customPath.generated_content;
  const totalLessons = content.curriculum.reduce((sum, module) => sum + module.lessons.length, 0);
  const progressPercentage = 25; // Sample progress

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'career-change': return '🔄';
      case 'skill-upgrade': return '⬆️';
      case 'interview-prep': return '💼';
      case 'freelance': return '💻';
      case 'startup': return '🚀';
      case 'certification': return '🏆';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/learning"}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Paths
            </Button>
          </div>

          {/* Custom Path Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-4xl">{getGoalIcon(customPath.goal)}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{content.title}</h1>
                <p className="text-muted-foreground text-lg mb-4">{content.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={getDifficultyColor(content.difficulty)}>
                    {content.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{content.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>{customPath.weekly_hours}h/week</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progressPercentage)}% completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Path Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Learning Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Your Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Goal</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {customPath.goal.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Learning Style</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {customPath.learning_style.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Project Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {customPath.project_preference.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {customPath.preferred_topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.specializations.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full mt-0.5 ${
                        index < 2 ? 'bg-green-600' : 'border-2 border-muted-foreground'
                      }`} />
                      <span className={`text-sm ${
                        index < 2 ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {milestone}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Curriculum */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Module List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum Modules</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {content.curriculum.map((module, index) => (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                          activeModule === index
                            ? 'border-l-primary bg-muted/50'
                            : 'border-l-transparent'
                        }`}
                        onClick={() => setActiveModule(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{module.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{module.duration}</span>
                              <BookOpen className="w-3 h-3" />
                              <span>{module.lessons.length} lessons</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    {content.curriculum[activeModule]?.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Duration: {content.curriculum[activeModule]?.duration}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium mb-3">Lessons in this module:</h4>
                    {content.curriculum[activeModule]?.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm">{lesson}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Begin Module: {content.curriculum[activeModule]?.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}