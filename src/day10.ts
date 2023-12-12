import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("10", "test");
const testInput2 = readInput("10", "test2");
const testInput3 = readInput("10", "test3");
const testInput4 = readInput("10", "test4");
const testInput5 = readInput("10", "test5");
const testInput6 = readInput("10", "test6");
const realInput = readInput("10", "real");

const allowedEntries = {
  "|": [
    [-1, 0],
    [1, 0],
  ],
  "-": [
    [0, -1],
    [0, 1],
  ],
  L: [
    [-1, 0],
    [0, 1],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
  "7": [
    [0, -1],
    [1, 0],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
};

const tile = (type, coords) => {
  const entries = allowedEntries[type];

  const attemptEntry = (coordsFrom) => {
    const entryVector = [coordsFrom[0] - coords[0], coordsFrom[1] - coords[1]];

    if (
      entries.find((entry) =>
        _.eq(JSON.stringify(entry), JSON.stringify(entryVector))
      )
    ) {
      return entries.find(
        (entry) => JSON.stringify(entry) !== JSON.stringify(entryVector)
      );
    }
  };
  return { attemptEntry, coords, type };
};

let start = [0, 0];

const parseInput = (input) => [
  input.split("\n").map(() => undefined),
  ...input.split("\n").map((line, row) => {
    return [
      undefined,
      ...line.split("").map((type, col) => {
        if (type === "S") {
          start = [row + 1, col + 1];
          return "S";
        }
        if (type === ".") return;
        return tile(type, [row + 1, col + 1]);
      }),
      undefined,
    ];
  }),
  input.split("\n").map(() => undefined),
];

const map = parseInput(realInput);

let visitedPlaces = map.map((row) => row.map((col) => -1));
let cycleIndex;
let cycleLength;

const crawlStep = (index, currentStep, currentCoords, direction) => {
  visitedPlaces[currentCoords[0]][currentCoords[1]] = {
    index,
    step: currentStep,
  };

  const nextTile =
    map[currentCoords[0] + direction[0]][currentCoords[1] + direction[1]];

  if (nextTile === "S") {
    cycleIndex = index;
    cycleLength = currentStep;
    return;
  }
  if (!nextTile) return;
  const nextDirection = nextTile.attemptEntry(currentCoords);
  if (!nextDirection) return;

  return {
    index,
    nextStep: currentStep + 1,
    nextCoords: nextTile.coords,
    nextDirection,
  };
};

const crawl = (index, direction) => {
  let currentStep = 0;
  let currentCoords = start;
  let currentDirection = direction;
  while (true) {
    const next = crawlStep(index, currentStep, currentCoords, currentDirection);
    if (!next) return;
    const { nextStep, nextCoords, nextDirection } = next;
    currentStep = nextStep;
    currentCoords = nextCoords;
    currentDirection = nextDirection;
  }
};

[
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
].forEach((direction, index) => {
  crawl(index, direction);
});

let x, y;

for (let i = 0; i < visitedPlaces.length; i++) {
  for (let j = 0; j < visitedPlaces[i].length; j++) {
    if (
      visitedPlaces[i][j].index === cycleIndex &&
      visitedPlaces[i][j].step === (cycleLength + 1) / 2
    ) {
      x = i;
      y = j;
    }
  }
}

console.log(cycleIndex, (cycleLength + 1) / 2, x, y);

// Part 2

// We don't need to check other corners - F or 7 are required to switch, and F7 switches twice (as it's just U-shape)
const borders = ["F", "7", "|"];

// 7 Checked manually. Can't be bothered to code this.
map[start[0]][start[1]] = tile("7", start);
visitedPlaces[start[0]][start[1]] = { index: cycleIndex, step: 0 };

const isCorner = (tile) => borders.includes(tile);
let count = 0;

map.forEach((row, rowIndex) => {
  let isIn = false;
  row.forEach((cell, colIndex) => {
    if (
      cell &&
      isCorner(cell.type) &&
      visitedPlaces[rowIndex][colIndex].index === cycleIndex
    ) {
      isIn = !isIn;
    }

    if (visitedPlaces[rowIndex][colIndex].index !== cycleIndex && isIn) count++;
  });
});
console.log(count);
