
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { fetchQuizQuestions } from "@/services/triviaService";
import { getPlayerName, saveQuizProgress, getQuizProgress, clearQuizProgress } from "@/utils/localStorage";
import { QuizQuestion, Difficulty, QuestionType } from "@/types/quiz";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const playerName = getPlayerName();
  
  useEffect(() => {
    // Redirect to home if no player name is set
    if (!playerName) {
      toast({
        title: "Please enter your name",
        description: "You need to provide your name before starting the quiz.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get parameters from URL
        const amount = parseInt(searchParams.get("amount") || "10");
        const difficulty = (searchParams.get("difficulty") || "") as Difficulty;
        const type = (searchParams.get("type") || "") as QuestionType;
        
        // Fetch questions from API
        const newQuestions = await fetchQuizQuestions(amount, difficulty, type);
        
        // Check if there's saved progress
        const savedProgress = getQuizProgress();
        
        if (savedProgress) {
          // Apply saved answers to questions
          const questionsWithSavedAnswers = newQuestions.map((q) => {
            const savedAnswer = savedProgress.answers[q.id];
            return savedAnswer ? { ...q, user_answer: savedAnswer } : q;
          });
          
          setQuestions(questionsWithSavedAnswers);
          setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        } else {
          setQuestions(newQuestions);
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [navigate, playerName, searchParams, toast]);
  
  // Save progress whenever questions or current index changes
  useEffect(() => {
    if (questions.length > 0) {
      const answers: Record<number, string> = {};
      
      questions.forEach((q) => {
        if (q.user_answer) {
          answers[q.id] = q.user_answer;
        }
      });
      
      saveQuizProgress(currentQuestionIndex, answers);
    }
  }, [questions, currentQuestionIndex]);
  
  const handleAnswerSelected = (answer: string) => {
    // Update the current question with the user's answer
    setQuestions((prevQuestions) => 
      prevQuestions.map((q, idx) => 
        idx === currentQuestionIndex ? { ...q, user_answer: answer } : q
      )
    );
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Count unanswered questions
    const unansweredCount = questions.filter(q => !q.user_answer).length;
    
    if (unansweredCount > 0) {
      toast({
        title: "Unanswered Questions",
        description: `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`,
        action: (
          <Button onClick={confirmSubmit} variant="outline">
            Submit Anyway
          </Button>
        ),
      });
      setIsSubmitting(false);
    } else {
      confirmSubmit();
    }
  };
  
  const confirmSubmit = () => {
    // Clear progress data
    clearQuizProgress();
    
    // Navigate to results page with the questions data
    navigate("/results", { 
      state: { questions } 
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-quiz-light p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-quiz-secondary mb-4">Loading Quiz...</h2>
          <div className="w-16 h-16 border-4 border-quiz-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-quiz-light p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-quiz-secondary mb-4">Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const questionsAnswered = questions.filter(q => q.user_answer).length;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-quiz-light p-4">
      <header className="mb-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-quiz-secondary">Trivia Quest</h1>
          <div className="text-quiz-secondary">
            <span className="font-medium">Player: </span>
            <span>{playerName}</span>
          </div>
        </div>
        
        <ProgressBar 
          current={questionsAnswered} 
          total={totalQuestions} 
          className="mb-4" 
        />
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswerSelected}
            isAnswered={!!currentQuestion.user_answer}
            showCorrectAnswer={false}
          />
        )}
      </main>
      
      <footer className="mt-8 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          
          <div className="text-sm text-quiz-secondary">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              onClick={goToNextQuestion}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="bg-quiz-primary hover:bg-quiz-secondary text-white flex items-center gap-2"
            >
              Submit <Check size={16} />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Quiz;
