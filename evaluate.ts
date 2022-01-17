import {
  allWords, Result, WordleSimulator, WordleSolver, isConsistent, valueAt,
  win, resultToColors
} from "./wordle.ts";

import * as colors from "https://deno.land/std@0.121.0/fmt/colors.ts";
import { GreedyGuesser } from "./greedy-guesser.ts";
import { difference } from "https://deno.land/std@0.121.0/datetime/mod.ts";

function rot13(str: string) {
  var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var index     = (x: string) => input.indexOf(x);
  var translate = (x: string) => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

function solveOne(n: number, quiet: boolean)
{
  let secretWord = rot13(Deno.readTextFileSync("spoilers/solutions_rot_13.txt").split("\n")[n - 1]);

  const sim = new WordleSimulator(secretWord);
  const solver = new GreedyGuesser();
  let guess;

  while (solver.nGuesses < 6) {
    guess = solver.provideGuess();
    const result = sim.respond(guess);
    if (!quiet)
      console.log(`\nGuess: ${guess} -> ${resultToColors(result)}`);
    solver.update(guess, result);
    if (result === win) {
      break;
    }
  }

  if (solver.words.length > 1) {
    if (!quiet)
      console.log(`\nDidn't solve`);
    return undefined;
  } else {
    if (!quiet)
      console.log(`\nSolved in ${solver.nGuesses}`);
    return {
      word: guess,
      guesses: solver.nGuesses
    };
  }
}

function solveAll(last: number)
{
  for (let n = 1; n <= last; ++n) {
    let solution = solveOne(n, true);
    if (solution) {
      console.log(`Wordle ${n}: ${solution.word} in ${solution.guesses}`);
    } else {
      console.log(`Wordle ${n}: -- fail --`);
    }
  }
}

if (import.meta.main) {
  let epoch = new Date("2021-06-19");
  let today = new Date();
  let daysElapsed = difference(today, epoch, { units: ["days"] }).days;
  let todaysWordle = daysElapsed!;

  if (Deno.args.length === 0) {
    solveAll(todaysWordle);
  } else {
    let n = Number(Deno.args[0]);
    if (n >= todaysWordle) {
      console.log("Why would you spoil yourself?");
      Deno.exit(1);
    }
    solveOne(n, false);
  }
}
