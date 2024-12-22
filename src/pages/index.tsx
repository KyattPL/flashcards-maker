import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Shuffle } from 'lucide-react';

interface Card {
  side1: string,
  side2: string
};

interface FlashcardSet {
  [index: string]: Card[]
};

const FlashcardApp = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('|');
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet>({}); // For managing saved sets
  const [setName, setSetName] = useState('');

  useEffect(() => {
    const retrievedSets = localStorage.getItem('flashcardSets');
    if (retrievedSets !== null) {
      const storedSets = JSON.parse(retrievedSets);
      setFlashcardSets(storedSets);
    }
  }, []);

  const saveSet = () => {
    if (!setName.trim()) return;
    const updatedSets = { ...flashcardSets, [setName]: cards };
    setFlashcardSets(updatedSets);
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
  };

  const loadSet = (name: string) => {
    setCards(flashcardSets[name] || []);
    setIsStudying(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const deleteSet = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _, ...remainingSets } = flashcardSets;
    setFlashcardSets(remainingSets);
    localStorage.setItem('flashcardSets', JSON.stringify(remainingSets));
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

        <Button onClick={createCards} className="w-full" disabled={!input.trim()}>
          Create Flashcards
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Manage Sets</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Flashcard Sets</DialogTitle>
              <DialogDescription>Load or delete your saved flashcard sets below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {Object.keys(flashcardSets).length === 0 ? (
                <p>No sets saved</p>
              ) : (
                Object.keys(flashcardSets).map(name => (
                  <div key={name} className="flex justify-between items-center">
                    <span>{name}</span>
                    <div className="flex space-x-2">
                      <Button onClick={() => loadSet(name)} size="sm">Load</Button>
                      <Button onClick={() => deleteSet(name)} size="sm" variant="destructive">Delete</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">Save Set</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Flashcard Set</DialogTitle>
              <DialogDescription>Enter a name for your flashcard set below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="setName">Set Name</Label>
              <Input
                id="setName"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="Enter set name"
              />
            </div>
            <DialogFooter>
              <Button onClick={saveSet} className="w-full mt-4">Save</Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          onClick={() => setCurrentCardIndex(prev => prev - 1)}
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
          onClick={() => setCurrentCardIndex(prev => prev + 1)}
          disabled={currentCardIndex === cards.length - 1}
          className="w-full"
        >
          Next
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full mt-4">Save Set</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Flashcard Set</DialogTitle>
            <DialogDescription>Enter a name for your flashcard set below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="setName">Set Name</Label>
            <Input
              id="setName"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              placeholder="Enter set name"
            />
          </div>
          <DialogFooter>
            <Button onClick={saveSet} className="w-full mt-4">Save</Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => setIsStudying(false)}
        variant="outline"
        className="w-full"
      >
        Back to Editor
      </Button>
    </div>
  );
};

export default FlashcardApp;