import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressStepper from "@/components/ProgressStepper";
import ResumeUpload from "@/components/ResumeUpload";
import SkillsSummary from "@/components/SkillsSummary";
import LearningProgressDashboard from "@/components/LearningProgressDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: activities } = useQuery({
    queryKey: ["/api/profile/activities"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the dashboard</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressSteps = [
    { label: "JavaScript Fundamentals", progress: 75, color: "blue" },
    { label: "React Development", progress: 60, color: "green" },
    { label: "Data Structures & Algorithms", progress: 45, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.firstName || user.username}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to continue your coding journey?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-light-primary to-light-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}{user.lastName?.charAt(0) || ''}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {user.title || "Developer"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            Active
                          </span>
                          <span className="text-sm text-gray-500">
                            Level {user.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Learning Progress</h3>
                      <ProgressStepper steps={progressSteps} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities && activities.length > 0 ? (
                      <div className="space-y-3">
                        {activities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <i className="fas fa-check text-green-600 dark:text-green-400 text-sm"></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.createdAt).toRelativeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <i className="fas fa-clock text-2xl mb-2"></i>
                        <p>No recent activity yet. Start coding to see your progress here!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Resume & Skills */}
            <div className="space-y-6">
              {/* Resume & Skills Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Resume & Skills</CardTitle>
                    <CardDescription>
                      Upload your resume for AI-powered skill analysis and personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="summary">Skills Summary</TabsTrigger>
                        <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                      </TabsList>
                      <TabsContent value="summary" className="mt-4">
                        <SkillsSummary />
                      </TabsContent>
                      <TabsContent value="upload" className="mt-4">
                        <ResumeUpload />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Learning Progress Dashboard */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <LearningProgressDashboard />
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/learning">
                      <Button className="w-full bg-gradient-to-r from-light-primary to-light-accent text-white hover:scale-105 transition-transform">
                        <i className="fas fa-play mr-2"></i>
                        Continue Learning
                      </Button>
                    </Link>
                    
                    <Link href="/assessments">
                      <Button variant="outline" className="w-full border-light-primary dark:border-dark-accent text-light-primary dark:text-dark-accent hover:bg-light-primary hover:text-white dark:hover:bg-dark-accent dark:hover:text-black transition-all">
                        <i className="fas fa-brain mr-2"></i>
                        Take Assessment
                      </Button>
                    </Link>
                    
                    <Link href="/leaderboard">
                      <Button variant="secondary" className="w-full">
                        <i className="fas fa-trophy mr-2"></i>
                        View Leaderboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Problems Solved</span>
                      <span className="font-semibold">{user.problemsSolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                      <span className="font-semibold text-orange-500">{user.streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rank</span>
                      <span className="font-semibold text-green-500">#{user.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Points</span>
                      <span className="font-semibold">{user.points}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p className="text-sm font-medium">Weekly Coding Contest</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Tomorrow, 2:00 PM</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-sm font-medium">React Hackathon</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">March 15-17</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
