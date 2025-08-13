import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, Clock, MemoryStick, Play } from "lucide-react";
import type { Assessment, Judge0Language } from "@shared/schema";

interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: Assessment;
}

export default function CodeEditorModal({ isOpen, onClose, assessment }: CodeEditorModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<number>(63); // Default to JavaScript
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<string>("");
  const [detailedResults, setDetailedResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available languages
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["/api/assessments/languages"],
    enabled: isOpen,
  });

  // Submit code mutation
  const submitMutation = useMutation({
    mutationFn: async (submissionData: { assessmentId: string; languageId: number; sourceCode: string }) => {
      return apiRequest("/api/assessments/submit", {
        method: "POST",
        body: submissionData,
      });
    },
    onSuccess: (result: any) => {
      setIsRunning(false);
      setDetailedResults(result);
      
      if (result.passed) {
        let resultText = `✅ Success! Score: ${result.score}/100\n\nPassed: ${result.passedTests || 0}/${result.totalTests || 0} tests\n\nOutput:\n${result.stdout}`;
        if (result.extractedSkills && result.extractedSkills.length > 0) {
          resultText += `\n\n🧠 AI-Detected Skills: ${result.extractedSkills.join(', ')}`;
        }
        setTestResults(resultText);
        toast({
          title: "Assessment Completed!",
          description: `Great job! You scored ${result.score}/100`,
        });
      } else {
        let resultText = `❌ Failed. Score: ${result.score}/100\n\nPassed: ${result.passedTests || 0}/${result.totalTests || 0} tests\n\nOutput:\n${result.stdout}\n\nErrors:\n${result.stderr}`;
        if (result.extractedSkills && result.extractedSkills.length > 0) {
          resultText += `\n\n🧠 AI-Detected Skills: ${result.extractedSkills.join(', ')}`;
        }
        setTestResults(resultText);
        toast({
          title: "Try Again",
          description: "Your solution didn't pass all tests. Keep trying!",
          variant: "destructive",
        });
      }
      
      // Invalidate queries to refresh user stats
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/history"] });
    },
    onError: (error: any) => {
      setIsRunning(false);
      console.error('Submission error:', error);
      const errorMessage = error?.message || "Failed to submit code";
      if (errorMessage.includes("Authentication") || errorMessage.includes("token")) {
        setTestResults("❌ Authentication error. Please log in again.");
        toast({
          title: "Authentication Required",
          description: "Please refresh the page and log in again.",
          variant: "destructive",
        });
      } else {
        setTestResults(`❌ Error: ${errorMessage}`);
        toast({
          title: "Submission Error",
          description: "There was an error submitting your code. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && assessment) {
      setCode(assessment.starterCode || "");
      setTestResults("");
      setDetailedResults(null);
      setSelectedLanguage(63); // Default to JavaScript
    }
  }, [isOpen, assessment]);

  const handleSubmit = () => {
    if (!assessment || !code.trim()) {
      toast({
        title: "Missing Code",
        description: "Please write your solution before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setTestResults("Running your code...");
    setDetailedResults(null);
    
    submitMutation.mutate({
      assessmentId: assessment.id,
      languageId: selectedLanguage,
      sourceCode: code,
    });
  };

  const getLanguageName = (languages: any, id: number) => {
    const lang = (languages as Judge0Language[] || []).find(l => l.id === id);
    return lang?.name || "Unknown";
  };

  if (!assessment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {assessment.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {assessment.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-times text-gray-500"></i>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Problem Description */}
              <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  Problem Description
                </h3>
                <div className="prose dark:prose-invert text-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {assessment.problemStatement}
                  </div>
                </div>

                {/* Difficulty and Topic */}
                <div className="mt-4 flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assessment.difficulty === "Easy" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" :
                    assessment.difficulty === "Medium" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" :
                    "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}>
                    {assessment.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {assessment.topic}
                  </span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="w-1/2 flex flex-col">
                {/* Editor Toolbar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Select 
                      value={selectedLanguage.toString()} 
                      onValueChange={(value) => setSelectedLanguage(parseInt(value))}
                      disabled={languagesLoading}
                    >
                      <SelectTrigger className="w-60">
                        <SelectValue>
                          {languagesLoading ? "Loading languages..." : getLanguageName(languages, selectedLanguage)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(languages as Judge0Language[] || []).map((lang: Judge0Language) => (
                          <SelectItem key={lang.id} value={lang.id.toString()}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSubmit}
                        disabled={isRunning || !code.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
                      >
                        {isRunning ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Running...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check mr-1"></i> Submit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Code Area */}
                <div className="flex-1 p-4">
                  <Textarea
                    value={code || assessment.starterCode || ""}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full code-editor resize-none font-mono text-sm"
                    placeholder="// Write your solution here..."
                  />
                </div>

                {/* Test Results */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Test Results
                  </h4>
                  
                  {detailedResults ? (
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="details">Test Details</TabsTrigger>
                        <TabsTrigger value="output">Output</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary" className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Badge variant={detailedResults.passed ? "default" : "destructive"} className="flex items-center gap-1">
                            {detailedResults.passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            Score: {detailedResults.score}/100
                          </Badge>
                          <Badge variant="outline">
                            {detailedResults.passedTests || 0}/{detailedResults.totalTests || 0} Tests Passed
                          </Badge>
                        </div>
                        
                        {detailedResults.extractedSkills && detailedResults.extractedSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI-Detected Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {detailedResults.extractedSkills.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {detailedResults.executionDetails && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              Avg Time: {detailedResults.executionDetails.averageExecutionTime?.toFixed(3)}s
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <MemoryStick className="w-3 h-3" />
                              Max Memory: {detailedResults.executionDetails.totalMemoryUsed}KB
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="details" className="space-y-2 max-h-60 overflow-y-auto">
                        {detailedResults.testResults && detailedResults.testResults.length > 0 ? (
                          detailedResults.testResults.map((test: any, index: number) => (
                            <Card key={index} className="text-xs">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center justify-between">
                                  <span>Test Case {index + 1}</span>
                                  <Badge variant={test.passed ? "default" : "destructive"} className="text-xs">
                                    {test.passed ? "PASSED" : "FAILED"}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-1">
                                <div>
                                  <span className="font-medium">Input:</span> {JSON.stringify(test.input)}
                                </div>
                                <div>
                                  <span className="font-medium">Expected:</span> {JSON.stringify(test.expected)}
                                </div>
                                <div>
                                  <span className="font-medium">Actual:</span> {test.actual || "No output"}
                                </div>
                                <div className="flex gap-4 text-xs text-gray-500">
                                  <span>Time: {test.executionTime}</span>
                                  <span>Memory: {test.memory}KB</span>
                                  <span>Status: {test.status}</span>
                                </div>
                                {test.stderr && (
                                  <div className="text-red-600 dark:text-red-400">
                                    <span className="font-medium">Error:</span> {test.stderr}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-gray-500">No detailed test results available</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="output">
                        <div className="bg-gray-800 dark:bg-gray-900 p-3 rounded font-mono text-sm whitespace-pre-wrap text-green-400 dark:text-green-300 max-h-40 overflow-y-auto">
                          {testResults || "No output yet. Run your code to see results."}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-sm font-mono max-h-32 overflow-y-auto">
                      {testResults ? (
                        <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                          {testResults}
                        </pre>
                      ) : (
                        <div className="text-gray-600 dark:text-gray-400">
                          Write your solution and click Submit to see results...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
