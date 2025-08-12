import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, BookOpen, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { sampleQuizzes, type Quiz, type QuizQuestion } from "@shared/quiz-schema";

interface QuizSectionProps {
  selectedLanguage?: string;
}

export function QuizSection({ selectedLanguage }: QuizSectionProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [detailedResults, setDetailedResults] = useState<any[]>([]);

  // Filter quizzes based on selected language
  const filteredQuizzes = selectedLanguage 
    ? sampleQuizzes.filter(quiz => quiz.language.toLowerCase() === selectedLanguage.toLowerCase())
    : sampleQuizzes;

  useEffect(() => {
    if (selectedQuiz && !quizCompleted) {
      setTimeLeft(selectedQuiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [selectedQuiz, quizCompleted]);

  useEffect(() => {
    if (timeLeft > 0 && selectedQuiz && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedQuiz && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, selectedQuiz, quizCompleted]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizCompleted(false);
    setScore(0);
    setQuizStarted(true);
    setCurrentAnswer(null);
    setDetailedResults([]);
    setTimeLeft(quiz.timeLimit * 60); // Reset timer when starting quiz
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setCurrentAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentAnswer === null) return; // Prevent proceeding without answer
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null); // Reset for next question
    } else {
      // Submit quiz with final answer
      const finalAnswers = [...newAnswers];
      calculateResults(finalAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    if (!selectedQuiz) return;
    
    let correctCount = 0;
    const results: any[] = [];
    const topicScores: { [key: string]: { correct: number; total: number } } = {};
    
    selectedQuiz.questions.forEach((question, index) => {
      const isCorrect = finalAnswers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      // Track topic performance
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0 };
      }
      topicScores[question.topic].total++;
      if (isCorrect) topicScores[question.topic].correct++;
      
      results.push({
        question,
        userAnswer: finalAnswers[index],
        isCorrect,
        answerText: question.options[finalAnswers[index]] || "Not answered"
      });
    });
    
    const finalScore = Math.round((correctCount / selectedQuiz.questions.length) * 100);
    
    setAnswers(finalAnswers);
    setScore(finalScore);
    setDetailedResults(results);
    setQuizCompleted(true);
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;
    
    // If current question has answer, save it first
    if (currentAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentAnswer;
      calculateResults(newAnswers);
    } else {
      calculateResults(answers);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setQuizStarted(false);
    setCurrentAnswer(null);
    setDetailedResults([]);
  };

  // Calculate weakness analysis
  const getWeaknessAnalysis = () => {
    if (!selectedQuiz || detailedResults.length === 0) return null;
    
    const topicScores: { [key: string]: { correct: number; total: number } } = {};
    const difficultyScores: { [key: string]: { correct: number; total: number } } = {};
    
    detailedResults.forEach(result => {
      const topic = result.question.topic;
      const difficulty = result.question.difficulty;
      
      // Topic analysis
      if (!topicScores[topic]) {
        topicScores[topic] = { correct: 0, total: 0 };
      }
      topicScores[topic].total++;
      if (result.isCorrect) topicScores[topic].correct++;
      
      // Difficulty analysis
      if (!difficultyScores[difficulty]) {
        difficultyScores[difficulty] = { correct: 0, total: 0 };
      }
      difficultyScores[difficulty].total++;
      if (result.isCorrect) difficultyScores[difficulty].correct++;
    });
    
    // Find weak areas (< 70% accuracy)
    const weakTopics = Object.entries(topicScores)
      .filter(([_, scores]) => (scores.correct / scores.total) < 0.7)
      .map(([topic, scores]) => ({
        topic,
        accuracy: Math.round((scores.correct / scores.total) * 100),
        questions: scores.total
      }));
    
    const strongTopics = Object.entries(topicScores)
      .filter(([_, scores]) => (scores.correct / scores.total) >= 0.8)
      .map(([topic, scores]) => ({
        topic,
        accuracy: Math.round((scores.correct / scores.total) * 100),
        questions: scores.total
      }));
    
    return { weakTopics, strongTopics, topicScores, difficultyScores };
  };

  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Programming Language Quizzes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with interactive quizzes covering various programming concepts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{quiz.language}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.timeLimit} minutes</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startQuiz(quiz)}
                    className="w-full"
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const weaknessAnalysis = getWeaknessAnalysis();
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const totalQuestions = selectedQuiz.questions.length;
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Summary */}
        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              score >= 80 ? 'bg-green-100 dark:bg-green-900' :
              score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' :
              'bg-red-100 dark:bg-red-900'
            }`}>
              <Trophy className={`w-8 h-8 ${
                score >= 80 ? 'text-green-600 dark:text-green-400' :
                score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              {selectedQuiz.title} - {selectedQuiz.language}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                score >= 80 ? 'text-green-600 dark:text-green-400' :
                score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {score}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {correctAnswers} out of {totalQuestions} questions correct
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalQuestions - correctAnswers}</div>
                  <div className="text-sm text-gray-500">Wrong</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatTime(selectedQuiz.timeLimit * 60 - timeLeft)}</div>
                  <div className="text-sm text-gray-500">Time Used</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weakness Analysis */}
        {weaknessAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Performance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weaknessAnalysis.weakTopics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Areas for Improvement:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {weaknessAnalysis.weakTopics.map((topic, index) => (
                      <div key={index} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="font-medium">{topic.topic}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {topic.accuracy}% accuracy ({topic.questions} questions)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {weaknessAnalysis.strongTopics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Strong Areas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {weaknessAnalysis.strongTopics.map((topic, index) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="font-medium">{topic.topic}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {topic.accuracy}% accuracy ({topic.questions} questions)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedResults.map((result, index) => (
              <div key={result.question.id} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
                <div className="flex items-start space-x-2">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium">Q{index + 1}: {result.question.question}</p>
                      <Badge variant={
                        result.question.difficulty === 'Easy' ? 'default' :
                        result.question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                      }>
                        {result.question.difficulty}
                      </Badge>
                      <Badge variant="outline">{result.question.topic}</Badge>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Correct: {result.question.options[result.question.correctAnswer]}
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        ✗ Your answer: {result.answerText}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {result.question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button onClick={resetQuiz} variant="outline" className="flex-1">
            Take Another Quiz
          </Button>
          <Button onClick={() => startQuiz(selectedQuiz)} className="flex-1">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{selectedQuiz.title}</CardTitle>
            <CardDescription className="text-lg">
              {selectedQuiz.description}
            </CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto">{selectedQuiz.language}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{selectedQuiz.questions.length}</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{selectedQuiz.timeLimit}</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Instructions:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Answer all questions within the time limit</li>
                <li>• You can only move forward, no going back</li>
                <li>• Each question must be answered to proceed</li>
                <li>• Review your results at the end</li>
              </ul>
            </div>
            
            <Button onClick={() => setQuizStarted(true)} className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = selectedQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{selectedQuiz.title}</span>
                <Badge variant="outline">{selectedQuiz.language}</Badge>
              </CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {selectedQuiz.questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                <Clock className="w-4 h-4 inline mr-1" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">Time remaining</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Progress: {Math.round(progress)}%</span>
              <span>{currentQuestion + 1}/{selectedQuiz.questions.length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant={
                currentQ.difficulty === 'Easy' ? 'default' :
                currentQ.difficulty === 'Medium' ? 'secondary' : 'destructive'
              }>
                {currentQ.difficulty}
              </Badge>
              <Badge variant="outline">{currentQ.topic}</Badge>
            </div>
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  currentAnswer === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {currentAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={resetQuiz}
            >
              Exit Quiz
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={currentAnswer === null}
              className="px-8"
            >
              {currentQuestion === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}