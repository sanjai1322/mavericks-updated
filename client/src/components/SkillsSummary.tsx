import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Code, TrendingUp, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

interface ExtractedSkills {
  technical?: string[];
  soft?: string[];
  categories?: {
    programming?: string[];
    frameworks?: string[];
    tools?: string[];
    databases?: string[];
    cloud?: string[];
  };
}

interface ResumeAnalysis {
  hasResume: boolean;
  analysis?: {
    personalInfo?: any;
    skills?: ExtractedSkills;
    skillLevel?: string;
    primaryDomain?: string;
    summary?: string;
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
      {/* Header */}
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

      {/* Primary Domain */}
      {analysis?.primaryDomain && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Primary Domain:</strong> {analysis.primaryDomain}
          </AlertDescription>
        </Alert>
      )}

      {/* Technical Skills */}
      {allTechnicalSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technical Skills ({allTechnicalSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {displayedSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
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

      {/* Skill Categories */}
      {Object.keys(skillCategories).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Skill Categories
          </h4>
          
          {Object.entries(skillCategories).map(([category, categorySkills]) => {
            if (!categorySkills || categorySkills.length === 0) return null;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Code className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {category} ({categorySkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 ml-5">
                  {categorySkills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {categorySkills.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{categorySkills.length - 4} more
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
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Soft Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {skills.soft.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {analysis?.summary && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
            <Brain className="h-3 w-3" />
            AI Summary
          </h4>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Last Updated */}
      {resumeAnalysis.fileName && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          From: {resumeAnalysis.fileName}
        </div>
      )}
    </div>
  );
}