
import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  showCorrectAnswer: boolean;
}

const QuestionCard = ({ 
  question, 
  onAnswer, 
  isAnswered,
  showCorrectAnswer
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    question.user_answer || null
  );

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getAnswerClassName = (answer: string) => {
    const baseClasses = "p-4 mb-3 border rounded-lg text-left w-full transition-all duration-300";
    
    // If the question hasn't been answered yet, just show hover state for non-selected
    if (!isAnswered) {
      return cn(
        baseClasses,
        selectedAnswer === answer
          ? "bg-quiz-primary text-white border-quiz-primary"
          : "bg-white hover:bg-quiz-light border-gray-200 hover:border-quiz-primary"
      );
    }
    
    // If showing correct answers (results mode)
    if (showCorrectAnswer) {
      if (answer === question.correct_answer) {
        return cn(baseClasses, "bg-quiz-correct text-white border-quiz-correct");
      } else if (answer === selectedAnswer) {
        return cn(baseClasses, "bg-quiz-incorrect text-white border-quiz-incorrect");
      } else {
        return cn(baseClasses, "bg-white border-gray-200 opacity-70");
      }
    }
    
    // Just show selected state
    return cn(
      baseClasses,
      selectedAnswer === answer
        ? "bg-quiz-primary text-white border-quiz-primary"
        : "bg-white border-gray-200 opacity-70"
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-quiz-light text-quiz-secondary mb-2">
          {question.category}
        </span>
        <span className="mx-2 inline-block px-3 py-1 text-sm font-medium rounded-full bg-quiz-light text-quiz-secondary capitalize">
          {question.difficulty}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-6 text-gray-800">{question.question}</h3>
      
      <div className="space-y-2">
        {question.all_answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(answer)}
            disabled={isAnswered}
            className={getAnswerClassName(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
