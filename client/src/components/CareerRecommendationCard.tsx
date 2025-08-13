import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, DollarSign, Target } from "lucide-react";
import { Link } from "wouter";

interface CareerRecommendationCardProps {
  hasResume: boolean;
  recommendationsCount?: number;
}

export default function CareerRecommendationCard({ hasResume, recommendationsCount = 0 }: CareerRecommendationCardProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Career Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasResume ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{recommendationsCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Career paths matched</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Powered</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <DollarSign className="w-4 h-4 mx-auto text-green-600 mb-1" />
                <div className="text-xs font-medium">Salary Data</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <Target className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="text-xs font-medium">Skill Match</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <TrendingUp className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                <div className="text-xs font-medium">Roadmaps</div>
              </div>
            </div>

            <Link href="/career-path">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-view-career-paths">
                View Career Recommendations
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="text-center py-4">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Get AI-Powered Career Guidance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Upload your resume to receive personalized career path recommendations based on your skills and market demand.
              </p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Salary Analysis</Badge>
                <Badge variant="outline" className="mr-2">Growth Projections</Badge>
                <Badge variant="outline">Learning Roadmaps</Badge>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
              onClick={() => window.location.href = "/dashboard"}
              data-testid="button-upload-for-career"
            >
              Upload Resume for Career Analysis
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}