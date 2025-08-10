import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@shared/schema";

export default function Leaderboard() {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    enabled: !!user,
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🏆 1st";
    if (rank === 2) return "🥈 2nd";
    if (rank === 3) return "🥉 3rd";
    return `#${rank}`;
  };

  const getPodiumGradient = (rank: number) => {
    if (rank === 1) return "from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800";
    if (rank === 2) return "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800";
    if (rank === 3) return "from-orange-100 to-orange-200 dark:from-orange-700 dark:to-orange-800";
    return "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900";
  };

  const getAvatarGradient = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-500";
    if (rank === 2) return "from-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-500";
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-purple-500 to-pink-600",
      "from-indigo-500 to-blue-600",
      "from-red-500 to-pink-600",
    ];
    return gradients[(rank - 4) % gradients.length];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the leaderboard</h1>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const restOfLeaderboard = leaderboard?.slice(3) || [];

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
              Leaderboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              See where you stand among the coding community
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-wrap gap-4"
          >
            <Select defaultValue="all-time">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-categories">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="algorithms">Algorithms</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`order-1 md:order-1 bg-gradient-to-br ${getPodiumGradient(2)} rounded-xl p-6 text-center transform md:translate-y-4`}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarGradient(2)} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                        <span className="text-white text-lg font-bold">
                          {getInitials(topThree[1].firstName, topThree[1].lastName)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                        {topThree[1].firstName} {topThree[1].lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {topThree[1].title}
                      </p>
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-1">
                        {topThree[1].points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">points</div>
                      <span className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                        🥈 2nd
                      </span>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`order-2 md:order-2 bg-gradient-to-br ${getPodiumGradient(1)} rounded-xl p-6 text-center animate-glow`}
                    >
                      <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarGradient(1)} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                        <span className="text-white text-xl font-bold">
                          {getInitials(topThree[0].firstName, topThree[0].lastName)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xl mb-1 text-gray-900 dark:text-white">
                        {topThree[0].firstName} {topThree[0].lastName}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {topThree[0].title}
                      </p>
                      <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">
                        {topThree[0].points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">points</div>
                      <span className="px-3 py-1 bg-yellow-300 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                        🏆 1st
                      </span>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`order-3 md:order-3 bg-gradient-to-br ${getPodiumGradient(3)} rounded-xl p-6 text-center transform md:translate-y-8`}
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(3)} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                        <span className="text-white text-base font-bold">
                          {getInitials(topThree[2].firstName, topThree[2].lastName)}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
                        {topThree[2].firstName} {topThree[2].lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {topThree[2].title}
                      </p>
                      <div className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                        {topThree[2].points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">points</div>
                      <span className="px-3 py-1 bg-orange-300 dark:bg-orange-600 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                        🥉 3rd
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Full Leaderboard Table */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Badges
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Solved
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {restOfLeaderboard.map((userEntry: User, index: number) => (
                        <motion.tr
                          key={userEntry.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            userEntry.id === user?.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className={`text-lg font-bold ${
                                index + 4 === 4 ? "text-yellow-500" : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {index + 4}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(index + 4)} rounded-full flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">
                                  {getInitials(userEntry.firstName, userEntry.lastName)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {userEntry.firstName} {userEntry.lastName}
                                  {userEntry.id === user?.id && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {userEntry.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {userEntry.points.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-1">
                              {userEntry.points > 5000 && <span className="text-lg">🏆</span>}
                              {userEntry.streak > 7 && <span className="text-lg">🔥</span>}
                              {userEntry.problemsSolved > 100 && <span className="text-lg">⭐</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {userEntry.problemsSolved}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
