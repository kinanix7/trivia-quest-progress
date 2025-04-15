
export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

export interface QuizQuestion extends TriviaQuestion {
  id: number;
  all_answers: string[];
  user_answer?: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;
  quizCompleted: boolean;
}

export interface QuizStats {
  total: number;
  correct: number;
  incorrect: number;
  score: number;
}

export type Difficulty = "easy" | "medium" | "hard" | "any" | "";
export type QuestionType = "multiple" | "boolean" | "any" | "";
