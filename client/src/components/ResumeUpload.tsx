import { useState } from "react";
import { Upload, FileText, Brain, Target, CheckCircle, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResumeAnalysis {
  skillsFound: number;
  primaryDomain: string;
  skillLevel: string;
  summary: string;
}

interface SkillRecommendation {
  skill: string;
  assessments: string[];
  priority: string;
  reason: string;
}

export default function ResumeUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadProgress(10);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          setUploadProgress(30);

          const uploadData = {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            fileContent: base64String
          };

          setUploadProgress(50);

          const response = await apiRequest("/api/resume/upload", {
            method: "POST",
            body: uploadData
          });

          setUploadProgress(80);

          if (response.ok) {
            const result = await response.json();
            setAnalysis(result.analysis);
            setRecommendations(result.recommendations || []);
            setUploadProgress(100);
            
            toast({
              title: "Resume Uploaded Successfully!",
              description: `Found ${result.analysis.skillsFound} skills. AI analysis completed.`,
            });

            // Reset progress after success
            setTimeout(() => setUploadProgress(0), 2000);
          } else {
            const error = await response.json();
            throw new Error(error.message || "Upload failed");
          }
        } catch (error: any) {
          console.error("Upload error:", error);
          setUploadError(error.message || "Failed to upload resume. Please try again.");
          setUploadProgress(0);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("File processing error:", error);
      setUploadError("Failed to process file. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearError = () => {
    setUploadError("");
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Resume Upload & AI Analysis
          </CardTitle>
          <CardDescription>
            Upload your resume to automatically extract skills and get personalized learning recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isUploading && !analysis && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Drop your resume here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX, and TXT files (max 5MB)
              </p>
              <Button 
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 animate-pulse text-blue-500" />
                <span>AI analyzing your resume...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500">
                {uploadProgress < 30 && "Reading file content..."}
                {uploadProgress >= 30 && uploadProgress < 50 && "Extracting text..."}
                {uploadProgress >= 50 && uploadProgress < 80 && "AI skill analysis in progress..."}
                {uploadProgress >= 80 && "Generating recommendations..."}
              </p>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {uploadError}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Resume Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysis.skillsFound}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Skills Found</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold capitalize">{analysis.primaryDomain}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Primary Domain</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Badge className={`${getSkillLevelColor(analysis.skillLevel)} capitalize`}>
                  {analysis.skillLevel}
                </Badge>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Skill Level</div>
              </div>
            </div>
            
            {analysis.summary && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2">AI Summary</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Skill-Based Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personalized Assessment Recommendations
            </CardTitle>
            <CardDescription>
              Based on your resume skills, here are the most relevant coding challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rec.skill}</Badge>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rec.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.assessments.map((assessment, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        {assessment}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Upload */}
      {analysis && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setAnalysis(null);
              setRecommendations([]);
              setUploadProgress(0);
            }}
          >
            Upload New Resume
          </Button>
        </div>
      )}
    </div>
  );
}