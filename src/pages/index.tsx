import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shuffle } from 'lucide-react';

const FlashcardApp = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('|');
  const [cards, setCards] = useState<{ side1: string, side2: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  const shuffleCards = () => {
    setCards(cards => {
      const shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const createCards = () => {
    const lines = input.split('\n').filter(line => line.trim());
    const newCards = lines.map(line => {
      const [side1, side2] = line.split(separator).map(text => text.trim());
      return { side1, side2 };
    }).filter(card => card.side1 && card.side2);

    if (newCards.length > 0) {
      setCards(newCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setIsStudying(true);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const resetStudy = () => {
    setIsStudying(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (!isStudying) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="flashcards">Enter your flashcards (one pair per line)</Label>
          <Textarea
            id="flashcards"
            placeholder={`English${separator}Spanish\nHello${separator}Hola\nGoodbye${separator}Adiós`}
            className="h-48"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="separator">Separator</Label>
          <Input
            id="separator"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-24"
          />
        </div>

        <Button
          onClick={createCards}
          className="w-full"
          disabled={!input.trim()}
        >
          Create Flashcards
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 p-4">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500">
          Card {currentCardIndex + 1} of {cards.length}
        </span>
      </div>

      <Card
        className="w-full h-64 cursor-pointer flex items-center justify-center p-6 text-center"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="text-2xl">
          {isFlipped ? cards[currentCardIndex].side1 : cards[currentCardIndex].side2}
        </div>
      </Card>

      <div className="flex justify-between gap-2">
        <Button
          onClick={previousCard}
          disabled={currentCardIndex === 0}
          className="w-full"
        >
          Previous
        </Button>
        <Button
          onClick={shuffleCards}
          variant="outline"
          className="w-20"
        >
          <Shuffle className="w-4 h-4" />
        </Button>
        <Button
          onClick={nextCard}
          disabled={currentCardIndex === cards.length - 1}
          className="w-full"
        >
          Next
        </Button>
      </div>

      <Button
        onClick={resetStudy}
        variant="outline"
        className="w-full"
      >
        Back to Editor
      </Button>
    </div>
  );
};

export default FlashcardApp;