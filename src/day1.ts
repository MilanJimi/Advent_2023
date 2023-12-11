import { readInput } from "./common";

const testInput = readInput("1", "test");
const test2Input = readInput("1", "test2");
const realInput = readInput("1", "real");

const sum = (arr: number[]) => [...arr].reduce((acc, val) => acc + val, 0);
const stringNumbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const parseNumber = (input: string) => {
  if (input.length === 1) return Number(input);
  return stringNumbers.indexOf(input) + 1;
};

const isolateNumbers = (input: string) => {
  return input
    .split("\n")
    .map((line) =>
      [
        ...line.matchAll(
          /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g
        ),
      ].map((match) => parseNumber(match[1]))
    )
    .map((line) => {
      const fitNumber = `${line[0]}${line[line.length - 1]}`;
      console.log(line, fitNumber);

      return Number(fitNumber);
    });
};

console.log(sum(isolateNumbers(testInput)));
console.log(sum(isolateNumbers(test2Input)));

console.log(sum(isolateNumbers(realInput)));
