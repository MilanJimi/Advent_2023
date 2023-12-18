import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("18", "test");
const realInput = readInput("18", "real");

type Direction = "R" | "L" | "U" | "D";
type Step = {
  direction: Direction;
  distance: number;
};
const directionMap = {
  R: { row: 0, col: 1 },
  L: { row: 0, col: -1 },
  U: { row: -1, col: 0 },
  D: { row: 1, col: 0 },
};

const hexDirectionMap: Direction[] = ["R", "D", "L", "U"];

const parsePart1 = (input: string): Step[] =>
  input.split("\n").map((row) => {
    const [direction, distance] = row.split(" ");
    return {
      direction: direction as Direction,
      distance: Number(distance),
    };
  });

const parsePart2 = (input: string): Step[] =>
  input.split("\n").map((row) => {
    const [_, hex] = row.split("(#").map((s) => s.replace(")", ""));

    return {
      direction: hexDirectionMap[Number(hex[hex.length - 1])],
      distance: parseInt(hex.slice(0, -1), 16),
    };
  });

const stepsToCoordinates = (steps: Step[]) => {
  let coordinates = [{ row: 0, col: 0 }];
  for (const { direction, distance } of steps) {
    const { row, col } = directionMap[direction];
    const last = _.last(coordinates);
    coordinates.push({
      row: last.row + row * distance,
      col: last.col + col * distance,
    });
  }
  return coordinates;
};

const shoelace = (coordinates: { row: number; col: number }[]) => {
  let sum = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const { row: row1, col: col1 } = coordinates[i];
    const { row: row2, col: col2 } = coordinates[i + 1];
    sum += row1 * col2 - row2 * col1;
  }
  return Math.abs(sum) / 2;
};

const solvePart1 = (input: string) => {
  const steps = parsePart1(input);
  const coordinates = stepsToCoordinates(steps);
  const perimeter = sumArray(steps.map((step) => step.distance));
  return shoelace(coordinates) + perimeter / 2 + 1;
};

const part1 = {
  test: solvePart1(testInput),
  real: solvePart1(realInput),
};

const solvePart2 = (input: string) => {
  const steps = parsePart2(input);
  const coordinates = stepsToCoordinates(steps);
  const perimeter = sumArray(steps.map((step) => step.distance));
  return shoelace(coordinates) + perimeter / 2 + 1;
};

const part2 = {
  test: solvePart2(testInput),
  real: solvePart2(realInput),
};

console.log(part1);
console.log(part2);
