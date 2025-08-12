import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Clock, CheckCircle, XCircle, Book, Trophy, Target } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  language: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  questions: QuizQuestion[];
  timeLimit: number;
  createdAt: Date;
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  questionResults: any[];
  topicAnalysis: any;
  recommendations: any[];
}

export default function QuizSection() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all quizzes
  const { data: quizData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/quizzes'],
    queryFn: () => apiRequest('/api/quizzes')
  });

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: (data: { quizId: string; answers: number[]; timeSpent: number }) => 
      apiRequest('/api/quizzes/submit', { method: 'POST', body: data }),
    onSuccess: (result) => {
      setQuizResult(result);
      toast({
        title: "Quiz Completed!",
        description: `You scored ${result.score}% (${result.correctAnswers}/${result.totalQuestions})`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit quiz",
        variant: "destructive"
      });
    }
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizStarted && timeRemaining > 0 && !quizResult) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, timeRemaining, quizResult]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredQuizzes = quizData?.quizzes?.filter((quiz: Quiz) => 
    selectedCategory === 'all' || quiz.language === selectedCategory
  ) || [];

  const categories = quizData?.categories || [];

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setIsQuizStarted(true);
    setTimeRemaining(quiz.timeLimit * 60);
    setQuizResult(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;
    
    const timeSpent = (selectedQuiz.timeLimit * 60) - timeRemaining;
    submitQuizMutation.mutate({
      quizId: selectedQuiz.id,
      answers,
      timeSpent
    });
    setIsQuizStarted(false);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsQuizStarted(false);
    setTimeRemaining(0);
    setQuizResult(null);
  };

  if (isLoadingQuizzes) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} data-testid={`quiz-loading-${i}`}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Quiz Results View
  if (quizResult && selectedQuiz) {
    return (
      <div className="space-y-6" data-testid="quiz-results">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Quiz Results: {selectedQuiz.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {quizResult.score}%
              </div>
              <div className="text-xl text-muted-foreground">
                {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
              </div>
              <Progress value={quizResult.score} className="w-full max-w-md mx-auto" />
            </div>

            {/* Topic Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance by Topic</h3>
              <div className="grid gap-3">
                {Object.entries(quizResult.topicAnalysis).map(([topic, stats]: [string, any]) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{topic}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={stats.percentage >= 70 ? "default" : "destructive"}>
                        {stats.correct}/{stats.total}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {stats.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {quizResult.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {quizResult.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                          {rec.action && (
                            <Badge variant="outline" className="mt-2">{rec.action}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={resetQuiz} variant="outline" data-testid="button-back-to-quizzes">
                Back to Quizzes
              </Button>
              <Button onClick={() => startQuiz(selectedQuiz)} data-testid="button-retake-quiz">
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Taking View
  if (isQuizStarted && selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="space-y-6" data-testid="quiz-taking">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedQuiz.title}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className={timeRemaining < 300 ? "text-red-600 font-semibold" : ""}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <Badge variant="outline">
                  {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={
                  currentQuestion.difficulty === 'Easy' ? 'default' : 
                  currentQuestion.difficulty === 'Medium' ? 'secondary' : 'destructive'
                }>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.topic}</Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              
              <RadioGroup 
                value={answers[currentQuestionIndex]?.toString() || ""} 
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button 
                onClick={previousQuestion} 
                disabled={currentQuestionIndex === 0}
                variant="outline"
                data-testid="button-previous-question"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
                  <Button 
                    onClick={handleSubmitQuiz} 
                    disabled={answers[currentQuestionIndex] === -1 || submitQuizMutation.isPending}
                    data-testid="button-submit-quiz"
                  >
                    {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
                  </Button>
                ) : (
                  <Button 
                    onClick={nextQuestion} 
                    disabled={answers[currentQuestionIndex] === -1}
                    data-testid="button-next-question"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Selection View
  return (
    <div className="space-y-6" data-testid="quiz-selection">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Programming Quizzes</h2>
        <p className="text-muted-foreground">Test your knowledge and improve your skills</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
          data-testid="category-all"
        >
          All
        </Button>
        {categories.map((category: any) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.name)}
            size="sm"
            data-testid={`category-${category.id}`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Quiz Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz: Quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow" data-testid={`quiz-card-${quiz.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <Badge variant="outline">{quiz.language}</Badge>
              </div>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.timeLimit} min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Difficulty Distribution:</div>
                <div className="flex gap-1">
                  {['Easy', 'Medium', 'Hard'].map(difficulty => {
                    const count = quiz.questions.filter(q => q.difficulty === difficulty).length;
                    return count > 0 ? (
                      <Badge 
                        key={difficulty} 
                        variant={difficulty === 'Easy' ? 'default' : difficulty === 'Medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {difficulty}: {count}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              
              <Button 
                onClick={() => startQuiz(quiz)} 
                className="w-full"
                data-testid={`button-start-quiz-${quiz.id}`}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No quizzes found for the selected category.
        </div>
      )}
    </div>
  );
}