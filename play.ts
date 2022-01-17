import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt,
  win, resultToColors
} from "./wordle.ts";

import * as colors from "https://deno.land/std@0.121.0/fmt/colors.ts";

if (import.meta.main) {
  let secretWord;
  if (Deno.args.length) {
    secretWord = Deno.args[0];
  } else {
    secretWord = allWords[~~(Math.random() * allWords.length)];
  }
  const sim = new WordleSimulator(secretWord);
  let i;
  for (i = 0; i < 6; ++i) {
    let guess = prompt("Enter your guess:")!;
    const response = sim.respond(guess);
    console.log(resultToColors(response));
    if (response === win) {
      break;
    }
  }
  if (i !== 6) {
    console.log("yay :)");
  } else {
    console.log(`oh no :( it was ${secretWord}`);
  }
}
