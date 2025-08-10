import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, BookOpen, CheckCircle } from "lucide-react";
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
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;
    
    let correctAnswers = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedQuiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
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
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              You've completed the {selectedQuiz.title} quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {score}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                You got {answers.filter((answer, index) => answer === selectedQuiz.questions[index].correctAnswer).length} out of {selectedQuiz.questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Review:</h3>
              {selectedQuiz.questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start space-x-2">
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✗</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                      {answers[index] !== question.correctAnswer && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Your answer: {question.options[answers[index]] || "Not answered"}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Take Another Quiz
              </Button>
              <Button onClick={() => startQuiz(selectedQuiz)} className="flex-1">
                Retake Quiz
              </Button>
            </div>
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
              <CardTitle>{selectedQuiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {selectedQuiz.questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">Time remaining</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline">{currentQ.difficulty}</Badge>
              <Badge variant="secondary">{currentQ.topic}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  answers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={resetQuiz}
            >
              Exit Quiz
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestion] === undefined}
            >
              {currentQuestion === selectedQuiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}