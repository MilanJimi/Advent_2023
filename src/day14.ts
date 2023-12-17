import { _ } from "lodash";
import { memoize, readInput, sumArray } from "./common";

const testInput = readInput("14", "test");
const realInput = readInput("14", "real");

const parseInput = (input: string): string[] => input.split("\n");

const rotateCounterClockwise = (arr: string[]) => {
  const rotated = [];
  for (let i = 0; i < arr[0].length; i++) {
    rotated.push(
      arr
        .map((row) => row[i])
        .reverse()
        .join("")
    );
  }
  return rotated;
};
const rotateClockwise = (arr: string[]) => {
  const rotated = [];
  for (let i = 0; i < arr[0].length; i++) {
    rotated.push(
      arr
        .map((row) => row[i])
        .join("")
        .split("")
        .reverse()
        .join("")
    );
  }
  return rotated;
};

const arrangeSubsection = memoize((subSection: string) => {
  const rocks = subSection.split("").filter((c) => c === "O").length;

  return (
    Array(subSection.length - rocks)
      .fill(".")
      .join("") + Array(rocks).fill("O").join("")
  );
});

const arrangeRow = memoize((row: string) => {
  return row
    .split("#")
    .map((section) => arrangeSubsection(section))
    .join("#");
});

const slideOsToRight = memoize((arr: string[]) =>
  arr.map((row) => arrangeRow(row))
);

const calculateWeight = (arr: string[]) => {
  let weight = 0;
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "O") {
        weight += j + 1;
      }
    }
  }
  return weight;
};

const solvePart1 = (input: string) => {
  const arr = parseInput(input);
  const rotated = rotateCounterClockwise(arr);

  const slid = slideOsToRight(rotated);

  return calculateWeight(slid);
};

const runCycle = (diagram: string[]) => {
  let newDiagram = diagram;
  for (let i = 0; i < 4; i++) {
    const slid = slideOsToRight(newDiagram);
    newDiagram = rotateCounterClockwise(slid);
  }
  return newDiagram;
};

const solvePart2 = (input: string) => {
  const arr = parseInput(input);
  let diagram = rotateCounterClockwise(arr);

  let visitedArrangements = {};
  let cycleLength = 0;
  let cycleOffset = 0;
  const cycles = 1000000000;
  for (let i = 0; i <= cycles; i++) {
    const slid = runCycle(diagram);

    if (calculateWeight(slid) === 64) {
    }

    const key = slid.join("\n");

    if (!visitedArrangements[key]) {
      visitedArrangements[key] = i;
      diagram = slid;

      continue;
    }
    if (visitedArrangements[key]) {
      cycleLength = i - visitedArrangements[key];
      cycleOffset = visitedArrangements[key];
      break;
    }
  }

  const arrangementIndex =
    ((cycles - cycleOffset) % cycleLength) + cycleOffset - 1;

  const [finalDiagram] = Object.entries(visitedArrangements).find(
    (k, v) => v === arrangementIndex
  );

  return calculateWeight(finalDiagram.split("\n"));
};

console.log(solvePart1(testInput));
console.log(solvePart1(realInput));

console.log(solvePart2(testInput));
console.log(solvePart2(realInput));
