import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  CheckCircle, 
  Trophy,
  ExternalLink,
  Brain,
  Code,
  Database,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface LearningResource {
  title: string;
  type: 'video' | 'article' | 'exercise' | 'project';
  duration: string;
  url: string;
  difficulty: string;
  provider: string;
}

// Enhanced learning resources with structured content for all tracks
const learningResources: Record<string, LearningResource[]> = {
  "Programming Fundamentals": [
    {
      title: "Variables and Data Types Mastery",
      type: "video",
      duration: "1 hour",
      url: "https://www.geeksforgeeks.org/programming-fundamentals/",
      difficulty: "Beginner",
      provider: "GeeksforGeeks"
    },
    {
      title: "Control Structures & Logic Building",
      type: "exercise",
      duration: "2 hours",
      url: "https://www.codecademy.com/learn/learn-how-to-code",
      difficulty: "Beginner",
      provider: "Codecademy"
    },
    {
      title: "Build a Calculator Project",
      type: "project",
      duration: "4 hours",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/",
      difficulty: "Beginner",
      provider: "freeCodeCamp"
    }
  ],
  "First Steps in Problem Solving": [
    {
      title: "Algorithm Design & Pseudocode",
      type: "article",
      duration: "45 mins",
      url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript",
      difficulty: "Beginner",
      provider: "MDN Web Docs"
    },
    {
      title: "Breaking Down Complex Problems",
      type: "video",
      duration: "30 mins",
      url: "https://www.youtube.com/watch?v=azcrPFhaY9k",
      difficulty: "Beginner",
      provider: "YouTube"
    },
    {
      title: "Text-Based Adventure Game Project",
      type: "project",
      duration: "6 hours",
      url: "https://www.codecademy.com/projects/board-game",
      difficulty: "Beginner",
      provider: "Codecademy"
    }
  ],
  "JavaScript Fundamentals": [
    {
      title: "JavaScript Basics - Variables and Data Types",
      type: "video",
      duration: "45 mins",
      url: "https://www.geeksforgeeks.org/javascript-tutorial/",
      difficulty: "Beginner",
      provider: "GeeksforGeeks"
    },
    {
      title: "Functions and Scope in JavaScript",
      type: "article",
      duration: "30 mins",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
      difficulty: "Beginner",
      provider: "MDN Web Docs"
    },
    {
      title: "DOM Manipulation Projects",
      type: "project",
      duration: "2 hours",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      difficulty: "Intermediate",
      provider: "freeCodeCamp"
    },
    {
      title: "ES6+ Features Deep Dive",
      type: "video",
      duration: "1 hour",
      url: "https://www.youtube.com/playlist?list=PLillGF-RfqbZ7s3t6ZInY3NjEOOX7hsBv",
      difficulty: "Intermediate",
      provider: "YouTube"
    }
  ],
  "Data Structures Mastery": [
    {
      title: "Arrays and Linked Lists Implementation",
      type: "video",
      duration: "1.5 hours",
      url: "https://www.geeksforgeeks.org/data-structures/",
      difficulty: "Intermediate",
      provider: "GeeksforGeeks"
    },
    {
      title: "Stacks, Queues, and Trees",
      type: "exercise",
      duration: "3 hours",
      url: "https://leetcode.com/explore/learn/card/data-structure/",
      difficulty: "Intermediate",
      provider: "LeetCode"
    },
    {
      title: "Build Custom Data Structure Library",
      type: "project",
      duration: "12 hours",
      url: "https://github.com/trekhleb/javascript-algorithms",
      difficulty: "Intermediate",
      provider: "GitHub"
    }
  ],
  "Algorithm Design Patterns": [
    {
      title: "Two Pointers & Sliding Window",
      type: "video",
      duration: "2 hours",
      url: "https://www.youtube.com/watch?v=jM2dhDPYMQM",
      difficulty: "Intermediate",
      provider: "YouTube"
    },
    {
      title: "Dynamic Programming Fundamentals",
      type: "article",
      duration: "1 hour",
      url: "https://www.geeksforgeeks.org/dynamic-programming/",
      difficulty: "Intermediate",
      provider: "GeeksforGeeks"
    },
    {
      title: "Route Optimization System Project",
      type: "project",
      duration: "15 hours",
      url: "https://www.hackerrank.com/domains/algorithms",
      difficulty: "Advanced",
      provider: "HackerRank"
    }
  ],
  "Competitive Programming Track": [
    {
      title: "Advanced Data Structures (Segment Trees)",
      type: "video",
      duration: "3 hours",
      url: "https://www.youtube.com/watch?v=Tr-xEGoByFQ",
      difficulty: "Advanced",
      provider: "YouTube"
    },
    {
      title: "Mathematical Algorithms & Number Theory",
      type: "article",
      duration: "2 hours",
      url: "https://cp-algorithms.com/",
      difficulty: "Advanced",
      provider: "CP-Algorithms"
    },
    {
      title: "Mock Contest Participation",
      type: "exercise",
      duration: "4 hours",
      url: "https://codeforces.com/contests",
      difficulty: "Advanced",
      provider: "Codeforces"
    }
  ],
  "System Design & Architecture": [
    {
      title: "Scalability & Load Balancing",
      type: "video",
      duration: "2 hours",
      url: "https://www.youtube.com/watch?v=UzLMhqg3_Wc",
      difficulty: "Advanced",
      provider: "YouTube"
    },
    {
      title: "Database Design & Optimization",
      type: "article",
      duration: "1.5 hours",
      url: "https://www.geeksforgeeks.org/database-management-system/",
      difficulty: "Advanced",
      provider: "GeeksforGeeks"
    },
    {
      title: "Design a Distributed System Project",
      type: "project",
      duration: "20 hours",
      url: "https://github.com/donnemartin/system-design-primer",
      difficulty: "Advanced",
      provider: "GitHub"
    }
  ],
  "Web Development Full Stack": [
    {
      title: "Frontend Fundamentals (HTML, CSS, JS)",
      type: "video",
      duration: "4 hours",
      url: "https://www.freecodecamp.org/learn/responsive-web-design/",
      difficulty: "Intermediate",
      provider: "freeCodeCamp"
    },
    {
      title: "Backend Development & APIs",
      type: "exercise",
      duration: "6 hours",
      url: "https://www.codecademy.com/learn/learn-express",
      difficulty: "Intermediate",
      provider: "Codecademy"
    },
    {
      title: "Full-Featured Web Application Project",
      type: "project",
      duration: "30 hours",
      url: "https://www.theodinproject.com/paths/full-stack-javascript",
      difficulty: "Advanced",
      provider: "The Odin Project"
    }
  ],
  "Data Structures & Algorithms": [
    {
      title: "Array and String Algorithms",
      type: "article",
      duration: "1 hour",
      url: "https://www.geeksforgeeks.org/data-structures/",
      difficulty: "Intermediate",
      provider: "GeeksforGeeks"
    },
    {
      title: "Linked Lists Implementation",
      type: "exercise",
      duration: "2 hours",
      url: "https://leetcode.com/explore/learn/card/linked-list/",
      difficulty: "Intermediate",
      provider: "LeetCode"
    },
    {
      title: "Binary Trees and BST",
      type: "video",
      duration: "1.5 hours",
      url: "https://www.coursera.org/learn/algorithms-part1",
      difficulty: "Advanced",
      provider: "Coursera"
    },
    {
      title: "Dynamic Programming Masterclass",
      type: "project",
      duration: "3 hours",
      url: "https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=dynamic-programming",
      difficulty: "Advanced",
      provider: "HackerRank"
    }
  ],
  "React Development": [
    {
      title: "React Fundamentals",
      type: "video",
      duration: "2 hours",
      url: "https://reactjs.org/tutorial/tutorial.html",
      difficulty: "Beginner",
      provider: "React.js"
    },
    {
      title: "State Management with Hooks",
      type: "article",
      duration: "45 mins",
      url: "https://www.freecodecamp.org/news/react-hooks-cheatsheet/",
      difficulty: "Intermediate",
      provider: "freeCodeCamp"
    },
    {
      title: "Build a Complete React App",
      type: "project",
      duration: "4 hours",
      url: "https://www.codecademy.com/learn/react-101",
      difficulty: "Intermediate",
      provider: "Codecademy"
    },
    {
      title: "React Performance Optimization",
      type: "video",
      duration: "1 hour",
      url: "https://egghead.io/courses/optimize-react-re-renders",
      difficulty: "Advanced",
      provider: "Egghead"
    }
  ],
  "Python for Data Science": [
    {
      title: "Python Basics for Data Science",
      type: "article",
      duration: "1 hour",
      url: "https://www.geeksforgeeks.org/python-programming-language/",
      difficulty: "Beginner",
      provider: "GeeksforGeeks"
    },
    {
      title: "NumPy and Pandas Tutorial",
      type: "video",
      duration: "2 hours",
      url: "https://www.kaggle.com/learn/pandas",
      difficulty: "Intermediate",
      provider: "Kaggle"
    },
    {
      title: "Data Visualization with Matplotlib",
      type: "exercise",
      duration: "1.5 hours",
      url: "https://matplotlib.org/stable/tutorials/index.html",
      difficulty: "Intermediate",
      provider: "Matplotlib"
    },
    {
      title: "Machine Learning Project",
      type: "project",
      duration: "5 hours",
      url: "https://www.coursera.org/learn/machine-learning",
      difficulty: "Advanced",
      provider: "Coursera"
    }
  ]
};

export default function EnhancedLearningPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: learningPaths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
    enabled: !!user,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/user/progress'],
    enabled: !!user,
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ pathId, progress }: { pathId: string; progress: number }) =>
      apiRequest('/api/user/progress', {
        method: 'POST',
        body: { pathId, progress }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/progress'] });
      toast({ title: "Progress updated successfully!" });
    },
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'exercise':
        return <Code className="w-4 h-4" />;
      case 'project':
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Programming Languages': <Code className="w-6 h-6" />,
      'Computer Science': <Brain className="w-6 h-6" />,
      'Frontend Development': <Globe className="w-6 h-6" />,
      'Backend Development': <Database className="w-6 h-6" />,
      'Data Science': <Trophy className="w-6 h-6" />,
      'Machine Learning': <Star className="w-6 h-6" />,
      'DevOps': <Users className="w-6 h-6" />,
      'System Architecture': <Brain className="w-6 h-6" />
    };
    return iconMap[category] || <BookOpen className="w-6 h-6" />;
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

  if (selectedPath) {
    const pathResources = learningResources[selectedPath.title] || [];
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPath(null)}
                className="mb-4"
                data-testid="button-back"
              >
                ← Back to Learning Paths
              </Button>
              
              <div className="flex items-start gap-6">
                <div className="text-4xl">{selectedPath.icon}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{selectedPath.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedPath.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getDifficultyColor(selectedPath.difficulty)}>
                      {selectedPath.difficulty}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {selectedPath.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      {selectedPath.lessons} lessons
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPath.progress}%
                      </span>
                    </div>
                    <Progress value={selectedPath.progress} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="mt-6">
                <div className="grid gap-4">
                  {pathResources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                                {getTypeIcon(resource.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{resource.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  <span>{resource.provider}</span>
                                  <span>•</span>
                                  <span>{resource.duration}</span>
                                  <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                                    {resource.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(resource.url, '_blank')}
                                data-testid={`resource-${index}`}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const newProgress = Math.min(selectedPath.progress + 10, 100);
                                  updateProgressMutation.mutate({
                                    pathId: selectedPath.id,
                                    progress: newProgress
                                  });
                                }}
                                data-testid={`complete-${index}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        GeeksforGeeks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Comprehensive programming tutorials and practice problems
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://www.geeksforgeeks.org/', '_blank')}
                        data-testid="link-geeksforgeeks"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        freeCodeCamp
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Interactive coding lessons and certification programs
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://www.freecodecamp.org/', '_blank')}
                        data-testid="link-freecodecamp"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Coursera
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        University-level courses and professional certificates
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://www.coursera.org/', '_blank')}
                        data-testid="link-coursera"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Overall Progress</h4>
                        <Progress value={selectedPath.progress} className="h-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {selectedPath.progress}% complete • {Math.ceil((100 - selectedPath.progress) / 10)} lessons remaining
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{Math.floor(selectedPath.progress / 10)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedPath.lessons - Math.floor(selectedPath.progress / 10)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Remaining</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{selectedPath.duration}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Duration</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Learning Paths
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Structured learning journeys to master programming skills
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading learning paths...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedPath(path)}
                  data-testid={`learning-path-${path.id}`}
                >
                  <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-blue-200 dark:hover:border-blue-700">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{path.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold">{path.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                            <Badge variant="outline">{path.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {path.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>{path.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>{path.duration}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {path.progress}%
                          </span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>

                      <Button className="w-full" data-testid={`start-path-${path.id}`}>
                        {path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {learningPaths.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No learning paths available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learning paths will appear here once they're created by administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}