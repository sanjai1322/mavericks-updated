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
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a PDF, DOC, DOCX, or TXT file');
      }

      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      if (data.extractedSkills) {
        setExtractedSkills(data.extractedSkills);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/resume/analysis'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile/me'] });
      toast({ 
        title: "Resume uploaded successfully!", 
        description: "Your resume has been analyzed and skills extracted." 
      });
      setSelectedFile(null); // Clear the selected file
    },
    onError: (error: Error) => {
      toast({ 
        title: "Upload failed", 
        description: error.message || "Please try again", 
        variant: "destructive" 
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
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
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="space-y-3">
              <p className="text-xl font-medium">Upload your resume for AI analysis</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports PDF, DOC, DOCX, and TXT files (max 10MB)
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
              <Button variant="outline" size="lg" className="mt-6" asChild>
                <span className="px-8">Choose File</span>
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{selectedFile.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <Button 
              onClick={handleUpload} 
              disabled={uploadMutation.isPending}
              className="w-full h-12 text-base"
              size="lg"
              data-testid="button-upload-resume"
            >
              {uploadMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Resume...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Analyze Resume</span>
                </div>
              )}
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