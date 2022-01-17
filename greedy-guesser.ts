import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt, toResult, win,
  resultToColors
} from "./wordle.ts";

import arrayShuffle from 'https://cdn.skypack.dev/array-shuffle';

import * as colors from "https://deno.land/std@0.121.0/fmt/colors.ts";

export class GreedyGuesser
{
  words: string[];
  nGuesses: number;
  
  constructor() {
    this.words = allWords.slice();
    this.nGuesses = 0;
  }

  provideGuess() {
    let guesses = this.words.slice();
    let words = arrayShuffle(this.words);
    guesses = arrayShuffle(guesses);
    
    let secretN = Math.min(100, words.length); 
    let guessN = Math.min(100, guesses.length);
    let solver = new WordleSolver(words);

    let scores: Record<string, number> = {};
    
    for (let j = 0; j < secretN; ++j) {
      const word = words[j];
      const sim = new WordleSimulator(word);
      for (let i = 0; i < guessN; ++i) {
        const guess = guesses[i];
        const response = sim.respond(guess);
        scores[guess] = (scores[guess] || 0) + solver.filter(guess, response).length;
      }
    }

    let scoreList = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return scoreList.slice(-1)[0][0];
  }

  update(guess: string, result: Result) {
    const nextWords = [];
    for (const word of this.words) {
      if (isConsistent(word, guess, result)) {
        nextWords.push(word);
      }
    }
    this.words = nextWords;
    this.nGuesses++;
  }

  hasSolution() {
    return this.words.length === 1;
  }

  getSolution() {
    if (!this.hasSolution()) {
      return undefined;
    } else {
      return this.words[0];
    }
  }
}
