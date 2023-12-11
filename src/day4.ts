import { readInput, sumArray } from "./common";
import _ from "lodash";

const testInput = readInput("4", "test");
const realInput = readInput("4", "real");

const parseInput = (input) => {
  return input.split("\n").map((line) => {
    const round = line
      .replace(/Card\s+/, "")
      .split(":")[1]
      .split("|")
      .map((listOfNumbers) => {
        return listOfNumbers.trim().split(/\s+/).map(Number);
      });

    return { winning: round[0], found: round[1], copies: 1 };
  });
};

const input = parseInput(realInput);

const findWinningScore = (row: number) => {
  const round = input[row];
  let score = 0;
  round.found.forEach((num) => {
    if (round.winning.includes(num)) {
      score ? (score = score * 2) : (score = 1);
    }
  });
  return score;
};

const spreadCopies = (row: number) => {
  const round = input[row];
  let score = 0;
  round.found.forEach((num) => {
    if (round.winning.includes(num)) {
      score += 1;
    }
  });

  for (let i = row + 1; i <= row + score; i++) {
    input[i].copies += input[row].copies;
  }
};

const roundScores = input.map((_, i) => findWinningScore(i));
input.forEach((_, i) => spreadCopies(i));

console.log(sumArray(roundScores));
console.log(sumArray(input.map(({ copies }) => copies)));
