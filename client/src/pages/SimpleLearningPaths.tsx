import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Brain, Code, Database, Globe, Users, Trophy } from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  lessons: number;
  duration: string;
  category: string;
  progress: number;
  createdAt: string;
}

export default function SimpleLearningPaths() {
  const { user } = useAuth();

  const { data: learningPaths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
    enabled: !!user,
  });

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

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Programming Languages': <Code className="w-5 h-5" />,
      'Programming Basics': <BookOpen className="w-5 h-5" />,
      'Problem Solving': <Brain className="w-5 h-5" />,
      'Data Structures': <Database className="w-5 h-5" />,
      'Algorithms': <Star className="w-5 h-5" />,
      'Programming Paradigms': <Globe className="w-5 h-5" />,
      'Frontend Development': <Globe className="w-5 h-5" />,
      'Competitive Programming': <Trophy className="w-5 h-5" />,
      'System Architecture': <Brain className="w-5 h-5" />,
      'Machine Learning': <Star className="w-5 h-5" />,
      'Web Development': <Globe className="w-5 h-5" />,
      'Mobile Development': <Code className="w-5 h-5" />,
      'DevOps': <Users className="w-5 h-5" />,
      'Data Science': <Database className="w-5 h-5" />,
      'Backend Development': <Database className="w-5 h-5" />
    };
    return iconMap[category] || <BookOpen className="w-5 h-5" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access learning paths</h1>
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
              <p className="mt-4 text-muted-foreground">Loading learning paths...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group paths by difficulty
  const groupedPaths = learningPaths.reduce((acc, path) => {
    const difficulty = path.difficulty;
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(path);
    return acc;
  }, {} as Record<string, LearningPath[]>);

  const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Learning Paths
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Structured learning journeys to master programming skills with hands-on projects
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{learningPaths.length}</h3>
                <p className="text-muted-foreground">Learning Paths</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{learningPaths.reduce((sum, path) => sum + path.lessons, 0)}</h3>
                <p className="text-muted-foreground">Total Lessons</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">15</h3>
                <p className="text-muted-foreground">Career Tracks</p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Paths by Difficulty */}
          {difficultyOrder.map((difficulty) => {
            const paths = groupedPaths[difficulty] || [];
            if (paths.length === 0) return null;

            return (
              <div key={difficulty} className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty}
                  </Badge>
                  <span>{difficulty} Level ({paths.length} paths)</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paths.map((path, index) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card 
                        className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                        data-testid={`card-path-${path.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{path.icon}</span>
                              <div>
                                <CardTitle className="text-lg mb-1">{path.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {getCategoryIcon(path.category)}
                                  <span>{path.category}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {path.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{path.lessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{path.duration}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            data-testid={`button-start-${path.id}`}
                            onClick={() => window.location.href = `/learning/${path.id}`}
                          >
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {learningPaths.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Learning Paths Available</h3>
              <p className="text-muted-foreground">Check back later for new learning content!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}