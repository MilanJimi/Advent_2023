import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("16", "test");
const realInput = readInput("16", "real");

const parseInput = (input: string): string[][] =>
  input.split("\n").map((row) => row.split(""));

const directionMap = {
  U: { row: -1, col: 0 },
  D: { row: 1, col: 0 },
  L: { row: 0, col: -1 },
  R: { row: 0, col: 1 },
};
type Location = { row: number; col: number };
type Direction = keyof typeof directionMap;

const logVisitedSpaces = (visitedSpaces: any[][]) => {
  console.log("----------------------");
  console.log(
    visitedSpaces
      .map((row) =>
        row
          .map((space) => (!!Object.values(space).some(Boolean) ? "#" : "."))
          .join("")
      )
      .join("\n")
  );
};

const simulate = (
  input: string[][],
  initialLocation: Location,
  initialDirection: Direction
) => {
  let visitedSpaces = input.map((row) =>
    row.map((_) => ({ U: false, D: false, L: false, R: false }))
  );
  const step = (location: Location, direction: Direction) => {
    // logVisitedSpaces(visitedSpaces);
    // console.log(location, direction);
    if (visitedSpaces[location.row][location.col][direction]) {
      return;
    }

    visitedSpaces[location.row][location.col][direction] = true;
    const nextRow = location.row + directionMap[direction].row;
    const nextCol = location.col + directionMap[direction].col;
    if (
      nextRow < 0 ||
      nextRow >= input.length ||
      nextCol < 0 ||
      nextCol >= input[0].length
    ) {
      return;
    }

    switch (input[nextRow][nextCol]) {
      case ".": {
        return step({ row: nextRow, col: nextCol }, direction);
      }
      case "|": {
        if (direction === "L" || direction === "R") {
          return [
            step({ row: nextRow, col: nextCol }, "U"),
            step({ row: nextRow, col: nextCol }, "D"),
          ];
        }
        return step({ row: nextRow, col: nextCol }, direction);
      }
      case "-": {
        if (direction === "U" || direction === "D") {
          return [
            step({ row: nextRow, col: nextCol }, "L"),
            step({ row: nextRow, col: nextCol }, "R"),
          ];
        }
        return step({ row: nextRow, col: nextCol }, direction);
      }
      case "\\": {
        switch (direction) {
          case "U":
            return step({ row: nextRow, col: nextCol }, "L");
          case "D":
            return step({ row: nextRow, col: nextCol }, "R");
          case "L":
            return step({ row: nextRow, col: nextCol }, "U");
          case "R":
            return step({ row: nextRow, col: nextCol }, "D");
        }
      }
      case "/": {
        switch (direction) {
          case "U":
            return step({ row: nextRow, col: nextCol }, "R");
          case "D":
            return step({ row: nextRow, col: nextCol }, "L");
          case "L":
            return step({ row: nextRow, col: nextCol }, "D");
          case "R":
            return step({ row: nextRow, col: nextCol }, "U");
        }
      }
    }
    return;
  };
  step(initialLocation, initialDirection);

  return visitedSpaces;
};

const sumVisitedSpaces = (visitedSpaces: any[][]) => {
  return sumArray(
    visitedSpaces.map((row) =>
      sumArray(
        row.map((space) => (!!Object.values(space).some(Boolean) ? 1 : 0))
      )
    )
  );
};

const part1 = {
  test: sumVisitedSpaces(
    simulate(parseInput(testInput), { row: 0, col: 0 }, "D")
  ),
  real: sumVisitedSpaces(
    simulate(parseInput(realInput), { row: 0, col: 0 }, "D")
  ),
};

const findMaxVisitedSpaces = (input: string[][]) => {
  let max = 0;
  for (let row = 0; row < input.length; row++) {
    max = Math.max(
      max,
      sumVisitedSpaces(simulate(input, { row, col: 0 }, "R")),
      sumVisitedSpaces(simulate(input, { row, col: input[0].length - 1 }, "L"))
    );
  }
  for (let col = 0; col < input[0].length; col++) {
    max = Math.max(
      max,
      sumVisitedSpaces(simulate(input, { row: 0, col }, "D")),
      sumVisitedSpaces(simulate(input, { row: input.length - 1, col }, "U"))
    );
  }
  return max;
};

const part2 = {
  test: findMaxVisitedSpaces(parseInput(testInput)),
  real: findMaxVisitedSpaces(parseInput(realInput)),
};

console.log({ part1, part2 });
