import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Clock, Star, TrendingUp, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface LearningResource {
  id: string;
  title: string;
  url?: string;
  type: string;
  description: string;
  tags: string[];
  score?: number;
  source?: string;
  difficulty?: string;
  reason?: string;
  skill?: string;
}

interface LearningPathResponse {
  ok: boolean;
  items: LearningResource[];
  weakSkills?: string[];
  userId?: string;
}

export default function LearningPath() {
  const [searchTopics, setSearchTopics] = useState("");
  const [activeTab, setActiveTab] = useState<"personalized" | "search">("personalized");

  // Fetch personalized recommendations
  const { data: personalizedData, isLoading: personalizedLoading } = useQuery<LearningPathResponse>({
    queryKey: ["/api/learning-path/personalized"],
    enabled: activeTab === "personalized"
  });

  // Fetch search-based recommendations
  const { data: searchData, isLoading: searchLoading, refetch: searchRefetch } = useQuery<LearningPathResponse>({
    queryKey: ["/api/learning-path", { topics: searchTopics }],
    enabled: false
  });

  const handleSearch = () => {
    if (searchTopics.trim()) {
      searchRefetch();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
      case "youtube":
        return "🎥";
      case "article":
        return "📄";
      case "course":
        return "🎓";
      case "tutorial":
        return "📚";
      case "practice":
        return "💻";
      default:
        return "📖";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
      case "youtube":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "article":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "course":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "tutorial":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "practice":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const ResourceCard = ({ resource }: { resource: LearningResource }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getTypeIcon(resource.type)}</span>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
            </div>
            {resource.score && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{(resource.score * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
          <CardDescription className="text-sm">{resource.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Tags and Type */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getTypeColor(resource.type)}>
                {resource.type}
              </Badge>
              {resource.difficulty && (
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
              )}
              {resource.tags?.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* AI Insights */}
            {(resource.reason || resource.skill) && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-1">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    AI Recommendation
                  </span>
                </div>
                {resource.reason && (
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {resource.reason}
                  </p>
                )}
                {resource.skill && (
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    Focus: {resource.skill}
                  </p>
                )}
              </div>
            )}

            {/* Source indicator */}
            {resource.source && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <span>
                  {resource.source === 'profile_analysis' ? 'Based on your progress' : 'AI-matched content'}
                </span>
              </div>
            )}

            {/* Action Button */}
            {resource.url ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Resource
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="w-full" disabled>
                <BookOpen className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI-Powered Learning Path
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Get personalized learning recommendations based on your coding performance and skill gaps,
          powered by AI analysis of your submissions.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Button
            variant={activeTab === "personalized" ? "default" : "ghost"}
            onClick={() => setActiveTab("personalized")}
            className="px-6"
          >
            <Brain className="w-4 h-4 mr-2" />
            Personalized for You
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            onClick={() => setActiveTab("search")}
            className="px-6"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Search Topics
          </Button>
        </div>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter topics (e.g., recursion, arrays, python)"
                  value={searchTopics}
                  onChange={(e) => setSearchTopics(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!searchTopics.trim()}>
                  Search Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Personalized Recommendations */}
        {activeTab === "personalized" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {personalizedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-64">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : personalizedData?.items?.length ? (
              <>
                {/* Weak Skills Identified */}
                {personalizedData.weakSkills && personalizedData.weakSkills.length > 0 && (
                  <Card className="mb-6 border-orange-200 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-300">
                        <TrendingUp className="w-5 h-5" />
                        <span>Skills to Focus On</span>
                      </CardTitle>
                      <CardDescription>
                        Based on your recent coding assessments, we identified these areas for improvement:
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {personalizedData.weakSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalizedData.items.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Complete Some Assessments First
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Take a few coding challenges so our AI can analyze your skills and provide personalized recommendations.
                  </p>
                  <Button onClick={() => window.location.href = "/assessments"}>
                    Start Coding Assessments
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Search Results */}
        {activeTab === "search" && searchData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Searching for resources...</p>
              </div>
            ) : searchData.items?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchData.items.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Resources Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try searching for different topics or check your spelling.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}