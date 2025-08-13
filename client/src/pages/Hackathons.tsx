import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Calendar, Trophy, Target, Sparkles, Globe, MapPin } from "lucide-react";
import type { Hackathon, Submission } from "@shared/schema";

export default function Hackathons() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recommended");

  const { data: hackathons, isLoading } = useQuery({
    queryKey: ["/api/hackathons"],
    enabled: !!user,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/hackathons", "recommendations"],
    enabled: !!user,
  });

  const { data: submissions } = useQuery({
    queryKey: ["/api/hackathons", "submissions"],
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
      case "open":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Upcoming":
      case "upcoming":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Past":
      case "ended":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getTechColor = (tech: string) => {
    const colors = [
      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    ];
    return colors[tech.length % colors.length];
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `Ends in ${days} days, ${hours} hours`;
  };

  const formatStartDate = (startDate: string) => {
    return new Date(startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filterHackathonsByStatus = (status: string) => {
    if (status === "ongoing") {
      return hackathons?.filter((hackathon: any) => 
        hackathon.status === "Live" || hackathon.status === "open"
      ) || [];
    }
    if (status === "upcoming") {
      return hackathons?.filter((hackathon: any) => 
        hackathon.status === "Upcoming" || hackathon.status === "upcoming"
      ) || [];
    }
    if (status === "past") {
      return hackathons?.filter((hackathon: any) => 
        hackathon.status === "Past" || hackathon.status === "ended"
      ) || [];
    }
    return hackathons || [];
  };

  const isDevpostHackathon = (hackathon: any) => {
    return hackathon.url && hackathon.url.includes('devpost.com');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access hackathons</h1>
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
              Hackathons
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compete with developers worldwide and showcase your skills
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="ongoing">Live</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            {/* Recommended Hackathons */}
            <TabsContent value="recommended" className="mt-6">
              {recommendations?.recommendations?.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Personalized Recommendations
                      </h2>
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Based on your resume skills: {recommendations?.userSkills?.join(', ')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recommendations.recommendations.map((hackathon: any, index: number) => (
                      <motion.div
                        key={hackathon.id || index}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="border-2 border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all relative overflow-hidden">
                          {hackathon.isRecommended && (
                            <div className="absolute top-2 right-2 z-10">
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Target className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {hackathon.title}
                                  </h3>
                                  {isDevpostHackathon(hackathon) && (
                                    <Badge variant="outline" className="text-xs">
                                      <Globe className="w-3 h-3 mr-1" />
                                      Devpost
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                  {hackathon.description}
                                </p>
                                
                                {hackathon.matchingSkills && hackathon.matchingSkills.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your matching skills:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {hackathon.matchingSkills.map((skill: string, skillIndex: number) => (
                                        <Badge key={skillIndex} variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hackathon.status)}`}>
                                {hackathon.status}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{hackathon.endDate ? formatTimeRemaining(hackathon.endDate) : "No end date"}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{hackathon.participants?.toLocaleString()} participants</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Trophy className="w-4 h-4 mr-2" />
                                <span>{hackathon.prize || hackathon.prizeAmount}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="capitalize">{hackathon.location}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {(hackathon.technologies || hackathon.tags || []).map((tech: string, techIndex: number) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              {isDevpostHackathon(hackathon) ? (
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(hackathon.url, '_blank')}
                                  data-testid={`button-join-devpost-${index}`}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Join on Devpost
                                </Button>
                              ) : (
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white hover:opacity-90 transition-opacity"
                                  data-testid={`button-join-local-${index}`}
                                >
                                  Join Now
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    No Personalized Recommendations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {recommendations?.message || "Upload your resume to get personalized hackathon recommendations based on your skills"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/dashboard'}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    Upload Resume
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading hackathons...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterHackathonsByStatus("Live").map((hackathon: Hackathon, index: number) => (
                    <motion.div
                      key={hackathon.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border-green-200 dark:border-green-700 hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {hackathon.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {hackathon.description}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hackathon.status)}`}>
                              {hackathon.status}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <i className="fas fa-calendar-alt w-4 mr-2"></i>
                              <span>{hackathon.endDate ? formatTimeRemaining(hackathon.endDate) : "No end date"}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <i className="fas fa-users w-4 mr-2"></i>
                              <span>{hackathon.participants.toLocaleString()} participants</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <i className="fas fa-trophy w-4 mr-2"></i>
                              <span>{hackathon.prize}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {hackathon.technologies && Array.isArray(hackathon.technologies) ? 
                              hackathon.technologies.map((tech: string, techIndex: number) => (
                                <span
                                  key={techIndex}
                                  className={`px-2 py-1 text-xs rounded ${getTechColor(tech)}`}
                                >
                                  {tech}
                                </span>
                              )) : null}
                          </div>

                          <Button 
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white hover:opacity-90 transition-opacity"
                          >
                            Join Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterHackathonsByStatus("Upcoming").map((hackathon: Hackathon, index: number) => (
                  <motion.div
                    key={hackathon.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                              {hackathon.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {hackathon.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hackathon.status)}`}>
                            {hackathon.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-calendar-alt w-4 mr-2"></i>
                            <span>Starts {hackathon.startDate ? formatStartDate(hackathon.startDate) : "TBD"}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-clock w-4 mr-2"></i>
                            <span>3 days duration</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-trophy w-4 mr-2"></i>
                            <span>{hackathon.prize}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hackathon.technologies && Array.isArray(hackathon.technologies) ? 
                            hackathon.technologies.map((tech: string, techIndex: number) => (
                              <span
                                key={techIndex}
                                className={`px-2 py-1 text-xs rounded ${getTechColor(tech)}`}
                              >
                                {tech}
                              </span>
                            )) : null}
                        </div>

                        <Button 
                          variant="secondary"
                          className="w-full"
                        >
                          Register Interest
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterHackathonsByStatus("Past").map((hackathon: Hackathon, index: number) => (
                  <motion.div
                    key={hackathon.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="opacity-75 hover:opacity-100 transition-opacity">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                              {hackathon.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {hackathon.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor("Past")}`}>
                            Ended
                          </span>
                        </div>
                        <Button variant="outline" className="w-full" disabled>
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {submissions && submissions.length > 0 ? (
                    <div className="space-y-4">
                      {submissions.map((submission: Submission) => (
                        <div key={submission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {submission.title}
                            </h4>
                            {submission.rank && submission.rank <= 3 && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.rank === 1 ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" :
                                submission.rank <= 10 ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" :
                                "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                              }`}>
                                {submission.rank === 1 ? "Winner" : `Top ${submission.rank <= 10 ? "10" : "50"}`}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {submission.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            {submission.rank && <span>Rank: {submission.rank}</span>}
                            {submission.score && <span>Score: {submission.score}/100</span>}
                            {submission.prize && <span>Prize: {submission.prize}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <i className="fas fa-code text-2xl mb-2"></i>
                      <p>No submissions yet. Join a hackathon to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
