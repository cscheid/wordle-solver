export const allWords = Deno.readTextFileSync("wordle-sorted-words.txt").split("\n");

// 00: "b"
// 01: "y"
// 10: "g"

//type Result = (0 | 1 | 2)[];
// base 4, 00 00 00 00 00

export type Result = number;
export const win: Result = 2 + (2 << 2) + (2 << 4) + (2 << 6) + (2 << 8);

export function toResult(resultStr: string) : Result
{
  let result: Result = 0;
  for (let i = 0; i < 5; ++i) {
    if (resultStr[i] === 'g')
      result += 2 << (2 * i);
    else if (resultStr[i] === 'y')
      result += 1 << (2 * i);
  }
  return result;
}

export class WordleSimulator
{
  secretWord: string;
  
  constructor(secretWord: string) {
    this.secretWord = secretWord;
  }

  respond(guess: string): Result {
    let result: Result = 0;
    for (let i = 0; i < 5; ++i) {
      const letter = guess[i];
      if (letter === this.secretWord[i]) {
        result += 2 << (2 * i);
      } else if (this.secretWord.indexOf(letter) !== -1) {
        result += 1 << (2 * i);
      } else {
        continue;
        //result[i] = 0;
      }
    }
    return result;
  }
}

function equalsAt(v1: Result, v2: Result, pos: number)
{
  return ~~((v1 ^ v2) & (3 << (2 * pos)))
}

export function valueAt(v: Result, pos: number)
{
  return (v >> (2 * pos)) & 3;
}

export function isConsistent(word: string, guess: string, result: Result)
{
  for (let i = 0; i < 5; ++i) {
    switch (valueAt(result, i)) {
      case 2:
        if (guess[i] !== word[i]) {
          return false;
        }
        break;
      case 1:
        if (word.indexOf(guess[i]) === -1 || guess[i] === word[i]) {
          return false;
        }
        break;
      case 0:
        if (word.indexOf(guess[i]) !== -1) {
          return false;
        }
        break;
    }
  }
  return true;
}

export class WordleSolver
{
  allowedWords: string[];
  
  constructor(words?: string[]) {
    this.allowedWords = words ?? allWords;
  }

  evaluate(sim: WordleSimulator) {
    const result = [];
    for (const word of this.allowedWords) {
      result.push(sim.respond(word));
    }
    return result;
  }

  filter(guess: string, response: Result) {
    const remainingWords: string[] = [];
    for (const word of this.allowedWords) {
      if (isConsistent(word, guess, response)) {
        remainingWords.push(word);
      }
    }
    return remainingWords;
  }
}
