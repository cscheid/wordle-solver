import { allWords, Result, WordleSimulator, WordleSolver } from "./wordle.ts";

if (import.meta.main) {
  const guess = "radar";
  const solve = new WordleSolver();
  const sizes: {
    word: string,
    size: number
  }[] = [];
  for (const secretWord of allWords) {
    const sim = new WordleSimulator(secretWord);
    const response = sim.respond(guess);
    sizes.push({ word: secretWord, size: solve.filter(guess, response).length});
  }
  sizes.sort((a, b) => a.size - b.size);

  sizes.forEach(({ word, size }) => console.log(`${word}: ${size}`));
  // const sim = new WordleSimulator("radar");
  // for (const guess of allWords) {
  //   const response = sim.respond(guess);
  //   console.log(`${guess}: ${solve.filter(guess, response).length}`);
  // }
}

