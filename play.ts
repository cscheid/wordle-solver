import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt,
  win
} from "./wordle.ts";

import * as colors from "https://deno.land/std@0.121.0/fmt/colors.ts";

function resultToColors(result: Result) {
  const resultStr: string[] = [];
  for (let i = 0; i < 5; ++i) {
    switch (valueAt(result, i)) {
      case 0:
        resultStr.push(colors.bgBrightBlack("  "));
        break;
      case 1:
        resultStr.push(colors.bgBrightYellow("  "));
        break;
      case 2:
        resultStr.push(colors.bgBrightGreen("  "));
        break;
    }
  }
  return resultStr.join(" ");
}

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
    console.log(`boo :( it was ${secretWord}`);
  }
}
