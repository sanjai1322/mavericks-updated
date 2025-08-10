import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodeEditorModal from "@/components/CodeEditorModal";
import type { Assessment } from "@shared/schema";

export default function Assessments() {
  const { user } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!user,
  });

  const openCodeEditor = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const filteredAssessments = assessments?.filter((assessment: Assessment) => {
    const matchesDifficulty = difficultyFilter === "all" || assessment.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === "all" || assessment.topic === topicFilter;
    return matchesDifficulty && matchesTopic;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access assessments</h1>
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
              Coding Assessments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Challenge yourself with our curated coding problems
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-wrap gap-4"
          >
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="Arrays">Arrays</SelectItem>
                <SelectItem value="Strings">Strings</SelectItem>
                <SelectItem value="Trees">Trees</SelectItem>
                <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => {
                setDifficultyFilter("all");
                setTopicFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>

          {/* Assessments Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading assessments...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acceptance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAssessments?.map((assessment: Assessment) => (
                      <motion.tr
                        key={assessment.id}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {assessment.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assessment.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {assessment.topic}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {assessment.acceptance}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => openCodeEditor(assessment)}
                            className="bg-light-primary dark:bg-dark-accent text-white hover:opacity-90 transition-opacity"
                          >
                            Start
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <CodeEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assessment={selectedAssessment || undefined}
      />
    </div>
  );
}
