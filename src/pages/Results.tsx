
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/QuestionCard";
import { calculateQuizStats } from "@/services/triviaService";
import { getPlayerName } from "@/utils/localStorage";
import { QuizQuestion } from "@/types/quiz";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, score: 0 });
  const [showDetails, setShowDetails] = useState(false);
  
  const playerName = getPlayerName();
  
  useEffect(() => {
    // Redirect if no data is passed
    if (!location.state || !location.state.questions) {
      navigate("/");
      return;
    }
    
    // Redirect if no player name is set
    if (!playerName) {
      navigate("/");
      return;
    }
    
    const quizQuestions = location.state.questions as QuizQuestion[];
    setQuestions(quizQuestions);
    
    // Calculate quiz statistics
    const quizStats = calculateQuizStats(quizQuestions);
    setStats(quizStats);
  }, [location.state, navigate, playerName]);
  
  const handleReturnHome = () => {
    navigate("/");
  };
  
  const handlePlayAgain = () => {
    navigate("/");
  };
  
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const getFeedbackMessage = (score: number): string => {
    if (score >= 90) return "Outstanding! You're a trivia master!";
    if (score >= 70) return "Great job! You really know your stuff!";
    if (score >= 50) return "Nice effort! You've got a good knowledge base.";
    if (score >= 30) return "Good try! A little more practice and you'll improve!";
    return "Keep learning! Everyone starts somewhere.";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-quiz-light p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-quiz-secondary text-center mb-2">Quiz Results</h1>
          <p className="text-center text-quiz-secondary">
            Well done, {playerName}! Here's how you performed.
          </p>
        </header>
        
        <Card className="mb-8 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative inline-flex justify-center items-center w-48 h-48 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-quiz-primary">{stats.score}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-quiz-primary"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - stats.score / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
              
              <p className="text-xl font-medium text-quiz-secondary mb-1">
                {getFeedbackMessage(stats.score)}
              </p>
              
              <p className="text-sm text-gray-500">
                You got {stats.correct} correct out of {questions.length} questions
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-quiz-light rounded-lg">
                <h3 className="text-sm font-medium text-quiz-secondary mb-1">Correct</h3>
                <p className="text-2xl font-bold text-quiz-correct">{stats.correct}</p>
              </div>
              <div className="p-4 bg-quiz-light rounded-lg">
                <h3 className="text-sm font-medium text-quiz-secondary mb-1">Incorrect</h3>
                <p className="text-2xl font-bold text-quiz-incorrect">{stats.incorrect}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleToggleDetails}
            variant="outline"
            className="mx-2"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          <Button
            onClick={handlePlayAgain}
            className="mx-2 bg-quiz-primary hover:bg-quiz-secondary text-white flex items-center gap-2"
          >
            <RotateCcw size={16} /> Play Again
          </Button>
          <Button
            onClick={handleReturnHome}
            variant="outline"
            className="mx-2 flex items-center gap-2"
          >
            <Home size={16} /> Home
          </Button>
        </div>
        
        {showDetails && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-quiz-secondary">Question Details</h2>
            
            {questions.map((question, index) => (
              <div key={question.id} className="mb-8">
                <QuestionCard
                  question={question}
                  onAnswer={() => {}}
                  isAnswered={true}
                  showCorrectAnswer={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
