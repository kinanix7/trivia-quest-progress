
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPlayerName, savePlayerName, hasPlayerName } from "@/utils/localStorage";
import { Difficulty, QuestionType } from "@/types/quiz";

const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("");
  const [questionType, setQuestionType] = useState<QuestionType>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing player name
  useEffect(() => {
    const savedName = getPlayerName();
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);
  
  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to start the quiz!",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Save player name to localStorage
    savePlayerName(playerName);
    
    // Generate URL with quiz parameters
    const params = new URLSearchParams();
    params.append("amount", questionCount.toString());
    
    if (difficulty) {
      params.append("difficulty", difficulty);
    }
    
    if (questionType) {
      params.append("type", questionType);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/quiz?${params.toString()}`);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-quiz-light p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-quiz-secondary text-center">
            Trivia Quest
          </CardTitle>
          <CardDescription className="text-center">
            Test your knowledge with fun trivia questions!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="border-quiz-primary focus-visible:ring-quiz-accent"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Select
              value={questionCount.toString()}
              onValueChange={(value) => setQuestionCount(parseInt(value))}
            >
              <SelectTrigger id="questionCount">
                <SelectValue placeholder="Number of questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as Difficulty)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type</Label>
            <Select
              value={questionType}
              onValueChange={(value) => setQuestionType(value as QuestionType)}
            >
              <SelectTrigger id="questionType">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="multiple">Multiple Choice</SelectItem>
                <SelectItem value="boolean">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-quiz-primary hover:bg-quiz-secondary text-white"
            onClick={handleStartQuiz}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : hasPlayerName() ? "Resume Quiz" : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
