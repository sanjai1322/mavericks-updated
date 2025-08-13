import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Brain,
  Target,
  BookOpen,
  Award,
  ExternalLink,
  Star,
  CheckCircle,
  Clock,
  Building,
  Globe,
  Lightbulb
} from "lucide-react";

interface CareerRecommendation {
  title: string;
  matchScore: number;
  description: string;
  averageSalary: string;
  growthRate: string;
  requiredSkills: string[];
  optionalSkills: string[];
  companies: string[];
  nextSteps: string[];
  marketDemand: string;
  remoteOpportunities: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengthLevel: string;
}

interface CareerDetails {
  description: string;
  averageSalary: string;
  growthRate: string;
  requiredSkills: string[];
  optionalSkills: string[];
  companies: string[];
  nextSteps: string[];
  marketDemand: string;
  remoteOpportunities: string;
  skillAlignment?: {
    overallMatch: number;
    matchingSkills: string[];
    missingSkills: string[];
    strengthAreas: string[];
  };
  marketTrends: {
    jobOpenings: string;
    salaryTrend: string;
    topRegions: string[];
  };
}

interface LearningRoadmap {
  timeline: string;
  phases: Array<{
    phase: string;
    skills: string[];
    projects: string[];
    resources: string[];
  }>;
  certifications: string[];
  jobSearchTips: string[];
}

export default function CareerPath() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recommendations");

  const { data: recommendations = [], isLoading } = useQuery<CareerRecommendation[]>({
    queryKey: ['/api/career/recommendations'],
    enabled: !!user,
    select: (data: any) => data.recommendations || []
  });

  const { data: careerDetails } = useQuery<CareerDetails>({
    queryKey: ['/api/career/paths', selectedCareer],
    enabled: !!selectedCareer,
  });

  const { data: roadmap } = useQuery<LearningRoadmap>({
    queryKey: ['/api/career/roadmap', selectedCareer],
    enabled: !!selectedCareer,
  });

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200";
    return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200";
  };

  const getDemandColor = (demand: string) => {
    if (demand === "Extremely High") return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200";
    if (demand === "Very High") return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200";
    if (demand === "High") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";
    return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access career recommendations</h1>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (selectedCareer && careerDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCareer(null)}
                className="mb-4"
                data-testid="button-back-to-careers"
              >
                ← Back to Career Recommendations
              </Button>
              
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{selectedCareer}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{careerDetails.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Average Salary</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{careerDetails.averageSalary}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Growth Rate</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{careerDetails.growthRate}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Job Openings</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{careerDetails.marketTrends.jobOpenings}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Globe className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Remote Work</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{careerDetails.remoteOpportunities}</div>
                    </div>
                  </div>

                  {careerDetails.skillAlignment && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Your Skill Alignment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Overall Match</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {careerDetails.skillAlignment.overallMatch}%
                            </span>
                          </div>
                          <Progress value={careerDetails.skillAlignment.overallMatch} className="h-3" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">Matching Skills</h4>
                            <div className="space-y-1">
                              {careerDetails.skillAlignment.matchingSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="mr-1 mb-1 text-green-700 border-green-300">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-orange-600 mb-2">Skills to Learn</h4>
                            <div className="space-y-1">
                              {careerDetails.skillAlignment.missingSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="mr-1 mb-1 text-orange-700 border-orange-300">
                                  <Target className="w-3 h-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Strength Areas</h4>
                            <div className="space-y-1">
                              {careerDetails.skillAlignment.strengthAreas.map((skill) => (
                                <Badge key={skill} variant="outline" className="mr-1 mb-1 text-blue-700 border-blue-300">
                                  <Star className="w-3 h-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
                <TabsTrigger value="companies">Top Companies</TabsTrigger>
                <TabsTrigger value="growth">Career Growth</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {careerDetails.requiredSkills.map((skill) => (
                          <Badge key={skill} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Optional Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {careerDetails.optionalSkills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Market Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Market Demand:</span>
                          <Badge className={getDemandColor(careerDetails.marketDemand)}>
                            {careerDetails.marketDemand}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Salary Trend:</span>
                          <span className="text-green-600">{careerDetails.marketTrends.salaryTrend}</span>
                        </div>
                        <div>
                          <span className="font-medium">Top Regions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {careerDetails.marketTrends.topRegions.map((region) => (
                              <Badge key={region} variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {region}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Career Progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {careerDetails.nextSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="roadmap" className="mt-6">
                {roadmap && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Learning Timeline: {roadmap.timeline}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {roadmap.phases.map((phase, index) => (
                            <div key={index} className="border-l-2 border-blue-200 pl-4">
                              <h3 className="font-bold text-lg mb-2">{phase.phase}</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <h4 className="font-medium text-blue-600 mb-2">Skills to Learn</h4>
                                  <div className="space-y-1">
                                    {phase.skills.map((skill) => (
                                      <Badge key={skill} variant="outline" className="mr-1 mb-1">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-green-600 mb-2">Projects</h4>
                                  <div className="space-y-1">
                                    {phase.projects.map((project) => (
                                      <div key={project} className="text-sm flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {project}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-purple-600 mb-2">Resources</h4>
                                  <div className="space-y-1">
                                    {phase.resources.map((resource) => (
                                      <div key={resource} className="text-sm flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        {resource}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Recommended Certifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {roadmap.certifications.map((cert) => (
                              <div key={cert} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                <Award className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm">{cert}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Job Search Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {roadmap.jobSearchTips.map((tip, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                <span className="text-sm">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="companies" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Hiring Companies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {careerDetails.companies.map((company) => (
                        <div key={company} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <div className="font-medium text-sm">{company}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Growth Path</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {careerDetails.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{step}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {index === 0 && "Immediate next step in your career progression"}
                              {index === 1 && "Mid-term career goal with expanded responsibilities"}
                              {index === 2 && "Senior position with leadership opportunities"}
                              {index === 3 && "Executive level with strategic oversight"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {index === 0 && "1-2 years"}
                              {index === 1 && "3-5 years"}
                              {index === 2 && "5-8 years"}
                              {index === 3 && "8+ years"}
                            </div>
                          </div>
                        </div>
                      ))}
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
              AI-Powered Career Recommendations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Personalized career paths based on your skills, experience, and market demand
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your profile...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No career recommendations available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload your resume first to get personalized AI-powered career recommendations
                </p>
                <Button onClick={() => window.location.href = "/dashboard"}>
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {recommendations.map((career, index) => (
                <motion.div
                  key={career.title}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCareer(career.title)}
                  data-testid={`career-${career.title.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <Card className="hover:shadow-xl transition-all border-2 hover:border-blue-200 dark:hover:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{career.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {career.description}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getMatchColor(career.matchScore)}`}>
                            {career.matchScore}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{career.strengthLevel}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">Salary</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{career.averageSalary}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <TrendingUp className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">Growth</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{career.growthRate}</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">Demand</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{career.marketDemand}</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <Globe className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">Remote</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{career.remoteOpportunities}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-green-600 mb-2">Your Matching Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {career.matchingSkills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs text-green-700 border-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {career.missingSkills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-orange-600 mb-2">Skills to Develop</h4>
                            <div className="flex flex-wrap gap-1">
                              {career.missingSkills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs text-orange-700 border-orange-300">
                                  <Target className="w-3 h-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))}
                              {career.missingSkills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{career.missingSkills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Top companies: {career.companies.slice(0, 3).join(", ")}
                          </div>
                          <Button variant="outline" size="sm">
                            View Details →
                          </Button>
                        </div>
                      </div>
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