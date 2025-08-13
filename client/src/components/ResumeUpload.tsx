import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, Brain, Target, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeAnalysis {
  experienceLevel: string;
  strengths: string[];
  recommendations: string[];
  skillGaps: string[];
  careerSuggestions: string[];
  overallScore: number;
  categories: Record<string, number>;
}

export default function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      setExtractedSkills(data.extractedSkills);
      queryClient.invalidateQueries({ queryKey: ['/api/resume/analysis'] });
      toast({ title: "Resume analyzed successfully!" });
    },
    onError: () => {
      toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload your resume for AI analysis</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized insights, skill analysis, and learning recommendations
              </p>
            </div>
            
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="resume-upload"
              data-testid="input-resume-file"
            />
            <label htmlFor="resume-upload">
              <Button variant="outline" className="mt-4" asChild>
                <span>Choose File</span>
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <Button 
              onClick={handleUpload} 
              disabled={uploadMutation.isPending}
              className="w-full"
              data-testid="button-upload-resume"
            >
              {uploadMutation.isPending ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Resume Score</span>
                <span className="text-2xl font-bold text-blue-600">{analysis.overallScore}/100</span>
              </div>
              <Progress value={analysis.overallScore} className="h-3 mb-4" />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analysis.categories).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-blue-600">{score}/10</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{category}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">{analysis.experienceLevel}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">Experience Level</span>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI-Extracted Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(extractedSkills).map(([skill, confidence]) => (
                  <Badge key={skill} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <span className="text-xs text-gray-500">
                      {Math.round(confidence * 100)}%
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Career Path Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.careerSuggestions.map((career, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {career}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}