import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Assessment } from "@shared/schema";

interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: Assessment;
}

export default function CodeEditorModal({ isOpen, onClose, assessment }: CodeEditorModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<string>("");

  const handleRun = () => {
    setTestResults("Running tests... (This would integrate with code execution service)");
  };

  const handleSubmit = () => {
    setTestResults("Solution submitted! (This would be processed by the backend)");
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
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleRun}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <i className="fas fa-play mr-1"></i> Run
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <i className="fas fa-check mr-1"></i> Submit
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
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                    Test Results
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testResults || "Run your code to see test results here..."}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
