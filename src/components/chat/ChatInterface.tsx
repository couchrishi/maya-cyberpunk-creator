import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Zap, Gamepad2 } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GamePlan {
  title: string;
  description: string;
  codeSnippet: string;
  nextSteps: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hey there! I\'m Maya, your AI game creation companion. Describe the game you want to build and I\'ll help you bring it to life with code. What kind of game are you thinking of?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [gamePlan, setGamePlan] = useState<GamePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const plan: GamePlan = {
        title: "Memory Card Game",
        description: "A classic memory matching game with colorful cards. Players flip cards to find matching pairs.",
        codeSnippet: `// Simple Memory Game Setup
const cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎨'];
const gameBoard = document.getElementById('gameBoard');

function createCard(symbol, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.symbol = symbol;
  card.dataset.index = index;
  return card;
}`,
        nextSteps: [
          "Add card flip animations",
          "Implement matching logic",
          "Add score tracking",
          "Create win condition"
        ]
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Great idea! I'll help you create a ${plan.title}. Here's the plan:

${plan.description}

I've generated the initial code structure for you. You can see it in the Code tab on the right. Ready for the next step?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setGamePlan(plan);
      setIsLoading(false);
    }, 2000);
  };

  const handleNextStep = (step: string) => {
    setInput(step);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <h2 className="text-lg font-orbitron font-bold text-primary neon-pulse">
            MAYA AI
          </h2>
          <Zap className="w-4 h-4 text-accent" />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Game Creation Assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-primary/20 border-primary/50' 
                : 'bg-secondary/20 border-secondary/50'
            } backdrop-blur cyber-grid`}>
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] bg-secondary/20 border-secondary/50 backdrop-blur">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></div>
                  <span className="text-sm text-muted-foreground">Maya is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Plan Display */}
        {gamePlan && (
          <div className="space-y-3">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <h3 className="font-orbitron font-bold text-primary">
                    {gamePlan.title}
                  </h3>
                </div>
                <p className="text-sm mb-3">{gamePlan.description}</p>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-semibold text-primary mb-2">
                    CODE PREVIEW:
                  </h4>
                  <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap">
                    {gamePlan.codeSnippet}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-secondary">
                    SUGGESTED NEXT STEPS:
                  </h4>
                  {gamePlan.nextSteps.map((step, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8 border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                      onClick={() => handleNextStep(step)}
                    >
                      <span className="text-accent mr-2">#{index + 1}</span>
                      {step}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your game idea... (e.g., 'Create a puzzle game where players match colors')"
            className="flex-1 min-h-[60px] bg-background/50 border-primary/30 focus:border-primary/50 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 shadow-[var(--shadow-cyber)] px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="text-accent">•</span>
          <span>Powered by Maya AI</span>
        </div>
      </div>
    </div>
  );
}