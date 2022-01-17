import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt, toResult
} from "./wordle.ts";

import arrayShuffle from 'https://cdn.skypack.dev/array-shuffle';

if (import.meta.main) {
  let words = allWords.slice();
  for (let i = 0; i < Deno.args.length; i += 2) {
    const guess = Deno.args[i];
    const result = toResult(Deno.args[i + 1]);
    const nextWords = [];
    for (const word of words) {
      if (isConsistent(word, guess, result)) {
        nextWords.push(word);
      }
    }
    words = nextWords;
  }

  let guesses = words.slice();
  words = arrayShuffle(words);
  guesses = arrayShuffle(guesses);
   
  let secretN = Math.min(100, words.length); 
  let guessN = Math.min(100, guesses.length);
  let solver = new WordleSolver();

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
  for (const [word, score] of scoreList) {
    let pct = Math.round(10000 * score / (words.length * guessN)) / 100;
    console.log(`${word}: ${100 - pct}`);
  }
}
