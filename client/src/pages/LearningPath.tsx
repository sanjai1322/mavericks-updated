import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearningPath } from "@shared/schema";

export default function LearningPathPage() {
  const { user } = useAuth();

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ["/api/learning-path"],
    enabled: !!user,
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "from-green-500 to-green-600";
    if (progress >= 40) return "from-blue-500 to-blue-600";
    if (progress >= 20) return "from-yellow-500 to-yellow-600";
    return "from-gray-400 to-gray-500";
  };

  const getGradientFromIcon = (icon: string) => {
    if (icon.includes("js")) return "from-blue-500 to-purple-600";
    if (icon.includes("react")) return "from-cyan-500 to-blue-600";
    if (icon.includes("database")) return "from-green-500 to-teal-600";
    if (icon.includes("python")) return "from-purple-500 to-pink-600";
    if (icon.includes("aws")) return "from-orange-500 to-red-600";
    if (icon.includes("mobile")) return "from-indigo-500 to-purple-600";
    return "from-gray-500 to-gray-600";
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
              Structured learning journeys tailored to your goals
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading learning paths...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths?.map((path: LearningPath, index: number) => (
                <motion.div
                  key={path.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-pointer"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getGradientFromIcon(path.icon)} rounded-lg flex items-center justify-center mb-3`}>
                          <i className={`${path.icon} text-white text-xl`}></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {path.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {path.description}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Progress</span>
                          <span className="font-medium">{path.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${path.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            className={`bg-gradient-to-r ${getProgressColor(path.progress)} h-2 rounded-full`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{path.lessons} Lessons</span>
                        <span>{path.duration}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          path.difficulty === "Beginner" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" :
                          path.difficulty === "Intermediate" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" :
                          "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}>
                          {path.difficulty}
                        </span>
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${getGradientFromIcon(path.icon)} text-white hover:opacity-90 transition-opacity`}
                      >
                        {path.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
