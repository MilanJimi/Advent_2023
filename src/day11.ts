import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("11", "test");
const realInput = readInput("11", "real");

let locationDict = {};
let galaxyIndex = 0;
const parseInput = (input) => {
  return input.split("\n").map((line, row) =>
    line.split("").map((x, col) => {
      if (x === ".") return ".";
      galaxyIndex++;
      locationDict[galaxyIndex] = [row, col];
      return galaxyIndex;
    })
  );
};

const findEmptyRows = (parsedInput) => {
  let emptyRows = [];
  parsedInput.forEach((row, index) => {
    if (row.every((x) => x === ".")) {
      emptyRows.push(index);
    }
  });
  return emptyRows;
};

const findEmptyColumns = (parsedInput) => {
  let emptyColumns = [];
  parsedInput[0].forEach((_, index) => {
    if (parsedInput.every((row) => row[index] === ".")) {
      emptyColumns.push(index);
    }
  });
  return emptyColumns;
};

const findManhattanDistance = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};
const isInInterval = (x, interval) =>
  (x >= interval[0] && x <= interval[1]) ||
  (x <= interval[0] && x >= interval[1]);

const input = parseInput(realInput);
const emptyRows = findEmptyRows(input);
const emptyColumns = findEmptyColumns(input);

const findGalaxyDistances = (growthMultiplier) => {
  let distances = {};
  for (let i = 1; i <= galaxyIndex - 1; i++) {
    for (let j = i + 1; j <= galaxyIndex; j++) {
      distances[`${i},${j}`] = findManhattanDistance(
        locationDict[i],
        locationDict[j]
      );
      for (const emptyRow of emptyRows) {
        if (isInInterval(emptyRow, [locationDict[i][0], locationDict[j][0]])) {
          distances[`${i},${j}`] += growthMultiplier - 1;
        }
      }
      for (const emptyColumn of emptyColumns) {
        if (
          isInInterval(emptyColumn, [locationDict[i][1], locationDict[j][1]])
        ) {
          distances[`${i},${j}`] += growthMultiplier - 1;
        }
      }
    }
  }
  return distances;
};

console.log(sumArray(Object.values(findGalaxyDistances(2))));
console.log(sumArray(Object.values(findGalaxyDistances(1000000))));
