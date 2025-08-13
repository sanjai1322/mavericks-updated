import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Code, TrendingUp, Calendar, FileText, Star, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

interface ExtractedSkills {
  technical?: string[];
  soft?: string[];
  categories?: {
    programming?: string[];
    frontend?: string[];
    backend?: string[];
    frameworks?: string[];
    tools?: string[];
    databases?: string[];
    cloud?: string[];
    testing?: string[];
    mobile?: string[];
  };
}

interface ResumeAnalysis {
  hasResume: boolean;
  analysis?: {
    personalInfo?: {
      name?: string;
      title?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    skills?: ExtractedSkills;
    skillLevel?: string;
    primaryDomain?: string;
    summary?: string;
    experience?: any[];
    yearsOfExperience?: number;
    seniorityLevel?: string;
    strongestSkills?: string[];
    confidenceScore?: number;
  };
  uploadedAt?: string;
  fileName?: string;
}

export default function SkillsSummary() {
  const { user } = useAuth();
  const [showAllSkills, setShowAllSkills] = useState(false);

  const { data: resumeAnalysis, isLoading } = useQuery<ResumeAnalysis>({
    queryKey: ["/api/resume/analysis"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Brain className="h-6 w-6 animate-pulse text-blue-500 mr-2" />
        <span>Loading skills analysis...</span>
      </div>
    );
  }

  if (!resumeAnalysis?.hasResume) {
    return (
      <div className="text-center p-6 space-y-4">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            No Resume Uploaded
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload your resume to get AI-powered skill analysis and personalized recommendations
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              // Switch to upload tab - we'll implement this with context later
              const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
              uploadTab?.click();
            }}
          >
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  const analysis = resumeAnalysis.analysis;
  const skills = analysis?.skills;
  const allTechnicalSkills = skills?.technical || [];
  const skillCategories = skills?.categories || {};

  const getSkillLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const displayedSkills = showAllSkills 
    ? allTechnicalSkills 
    : allTechnicalSkills.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Header with Professional Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Skills Analysis
            </h3>
            {resumeAnalysis.uploadedAt && (
              <p className="text-xs text-gray-500">
                Updated {new Date(resumeAnalysis.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {analysis?.skillLevel && (
            <Badge className={getSkillLevelColor(analysis.skillLevel)}>
              {analysis.skillLevel}
            </Badge>
          )}
        </div>

        {/* Professional Info Card */}
        {analysis?.personalInfo && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {analysis.personalInfo.name?.charAt(0) || 'U'}
                </div>
                <div>
                  {analysis.personalInfo.name && (
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {analysis.personalInfo.name}
                    </h4>
                  )}
                  {analysis.personalInfo.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.personalInfo.title}
                    </p>
                  )}
                  {analysis.yearsOfExperience && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {analysis.yearsOfExperience} years experience
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Primary Domain & Confidence */}
      <div className="grid grid-cols-1 gap-3">
        {analysis?.primaryDomain && (
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Primary Domain:</strong> {analysis.primaryDomain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </AlertDescription>
          </Alert>
        )}
        
        {analysis?.confidenceScore && (
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Resume Analysis Confidence
              </span>
              <span className="text-sm text-green-600 dark:text-green-400">
                {Math.round(analysis.confidenceScore * 100)}%
              </span>
            </div>
            <Progress value={analysis.confidenceScore * 100} className="h-2" />
          </div>
        )}
      </div>

      {/* Strongest Skills Highlight */}
      {analysis?.strongestSkills && analysis.strongestSkills.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Top Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.strongestSkills.slice(0, 5).map((skill, index) => (
              <Badge key={index} className="bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {allTechnicalSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4" />
            Technical Skills ({allTechnicalSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {displayedSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
          {allTechnicalSkills.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="text-xs h-6 px-2"
            >
              {showAllSkills 
                ? `Show less` 
                : `Show ${allTechnicalSkills.length - 8} more`
              }
            </Button>
          )}
        </div>
      )}

      {/* Skill Categories with Icons */}
      {Object.keys(skillCategories).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Skill Categories
          </h4>
          
          {Object.entries(skillCategories).map(([category, categorySkills]) => {
            if (!categorySkills || categorySkills.length === 0) return null;
            
            const getCategoryIcon = (cat: string) => {
              switch (cat) {
                case 'programming': return '💻';
                case 'frontend': return '🎨';
                case 'backend': return '⚙️';
                case 'databases': return '🗄️';
                case 'cloud': return '☁️';
                case 'tools': return '🔧';
                case 'testing': return '🧪';
                case 'mobile': return '📱';
                default: return '📋';
              }
            };
            
            return (
              <div key={category} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {category.replace(/([A-Z])/g, ' $1')} ({categorySkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {categorySkills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                      {skill}
                    </Badge>
                  ))}
                  {categorySkills.length > 6 && (
                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      +{categorySkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Soft Skills */}
      {skills?.soft && skills.soft.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Soft Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.soft.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {analysis?.summary && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Brain className="h-4 w-4" />
            AI Career Summary
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Footer Info */}
      {resumeAnalysis.fileName && (
        <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
          <FileText className="h-3 w-3" />
          <span>Source: {resumeAnalysis.fileName}</span>
          {resumeAnalysis.uploadedAt && (
            <>
              <span>•</span>
              <Calendar className="h-3 w-3" />
              <span>Processed {new Date(resumeAnalysis.uploadedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}