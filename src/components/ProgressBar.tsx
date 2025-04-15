
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.floor((current / total) * 100) : 0;
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium text-quiz-secondary">Progress</span>
        <span className="font-medium text-quiz-secondary">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-quiz-primary to-quiz-accent h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-quiz-secondary font-medium">
        Question {current} of {total}
      </div>
    </div>
  );
};

export default ProgressBar;
