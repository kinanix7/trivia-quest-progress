
// localStorage key constants
const PLAYER_NAME_KEY = "triviaQuest_playerName";
const QUIZ_PROGRESS_KEY = "triviaQuest_progress";

// Save player name to localStorage
export const savePlayerName = (name: string): void => {
  localStorage.setItem(PLAYER_NAME_KEY, name);
};

// Get player name from localStorage
export const getPlayerName = (): string | null => {
  return localStorage.getItem(PLAYER_NAME_KEY);
};

// Check if player name exists
export const hasPlayerName = (): boolean => {
  return !!getPlayerName();
};

// Clear player name from localStorage
export const clearPlayerName = (): void => {
  localStorage.removeItem(PLAYER_NAME_KEY);
};

// Interface for quiz progress data
interface QuizProgress {
  currentQuestionIndex: number;
  answers: Record<number, string>;
}

// Save quiz progress to localStorage
export const saveQuizProgress = (currentQuestionIndex: number, answers: Record<number, string>): void => {
  const progress: QuizProgress = {
    currentQuestionIndex,
    answers,
  };
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
};

// Get quiz progress from localStorage
export const getQuizProgress = (): QuizProgress | null => {
  const progressData = localStorage.getItem(QUIZ_PROGRESS_KEY);
  if (!progressData) return null;
  
  try {
    return JSON.parse(progressData) as QuizProgress;
  } catch (e) {
    console.error("Error parsing quiz progress:", e);
    return null;
  }
};

// Clear quiz progress from localStorage
export const clearQuizProgress = (): void => {
  localStorage.removeItem(QUIZ_PROGRESS_KEY);
};
