import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt, toResult
} from "./wordle.ts";

import arrayShuffle from 'https://cdn.skypack.dev/array-shuffle';

function provideGuess(words: string[])
{
  let guesses = words.slice();
  words = arrayShuffle(words);
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
  return scoreList;
}

if (import.meta.main) {
  let words = allWords.slice();
  let nGuesses = 0;
  for (let i = 0; i < Deno.args.length; i += 2) {
    nGuesses++;
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

  let scoreList = provideGuess(words);
  while (nGuesses < 6 && scoreList.length > 1) {
    const guess = scoreList.slice(-1)[0][0];
    console.log(`try "${guess}".`);
    let result = toResult(prompt("What was the result?")!);
    const nextWords = [];
    for (const word of words) {
      if (isConsistent(word, guess, result)) {
        nextWords.push(word);
      }
    }
    nGuesses++;
    words = nextWords;
    scoreList = provideGuess(words);
  }
  if (scoreList.length === 1 && nGuesses === 6) {
    console.log(`The answer was "${scoreList[0][0]}" :(`);
  } else if (scoreList.length === 1) {
    console.log(`The answer is "${scoreList[0][0]}"! :)`);
  } else {
    console.log(`The answer is one of these :(`);
    for (const [word, _] of scoreList) {
      console.log(`  - ${word}`);
    }
  }
}
