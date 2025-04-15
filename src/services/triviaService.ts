
import { QuizQuestion, TriviaResponse, Difficulty, QuestionType } from "@/types/quiz";

// Function to decode HTML entities
const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const fetchQuizQuestions = async (
  amount: number = 10,
  difficulty: Difficulty = "",
  type: QuestionType = ""
): Promise<QuizQuestion[]> => {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}`;
    
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    
    if (type) {
      url += `&type=${type}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }
    
    const data: TriviaResponse = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error(`API Error: Response code ${data.response_code}`);
    }
    
    // Transform the questions
    const quizQuestions: QuizQuestion[] = data.results.map((question, index) => {
      // Decode all text fields to handle HTML entities
      const decodedQuestion = decodeHtml(question.question);
      const decodedCorrectAnswer = decodeHtml(question.correct_answer);
      const decodedIncorrectAnswers = question.incorrect_answers.map(decodeHtml);
      
      // Create all answers array and shuffle it
      const all_answers = shuffleArray([
        decodedCorrectAnswer,
        ...decodedIncorrectAnswers,
      ]);
      
      return {
        ...question,
        id: index,
        question: decodedQuestion,
        correct_answer: decodedCorrectAnswer,
        incorrect_answers: decodedIncorrectAnswers,
        all_answers,
      };
    });
    
    return quizQuestions;
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error;
  }
};

export const calculateQuizStats = (questions: QuizQuestion[]): { correct: number; incorrect: number; score: number } => {
  const answeredQuestions = questions.filter(q => q.user_answer !== undefined);
  
  const correct = answeredQuestions.filter(
    q => q.user_answer === q.correct_answer
  ).length;
  
  const incorrect = answeredQuestions.length - correct;
  
  const score = answeredQuestions.length > 0 
    ? Math.round((correct / answeredQuestions.length) * 100) 
    : 0;
  
  return {
    correct,
    incorrect,
    score,
  };
};
