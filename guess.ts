import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt,
  toResult
} from "./wordle.ts";

if (import.meta.main) {
  let previousWords = allWords;
  
  for (let i = 0; i < Deno.args.length; i += 2) {
    const guess = Deno.args[i];
    const result = toResult(Deno.args[i + 1]);
    const nextWords = [];
    for (const word of previousWords) {
      if (isConsistent(word, guess, result)) {
        nextWords.push(word);
      }
    }
    previousWords = nextWords;
  }
  console.log(JSON.stringify(previousWords, null, 2));
}
