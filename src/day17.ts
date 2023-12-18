import { _ } from "lodash";
import { readInput } from "./common";
import PriorityQueue from "ts-priority-queue";

const testInput = readInput("17", "test");
const realInput = readInput("17", "real");

const parseInput = (input: string): number[][] =>
  input.split("\n").map((row) => row.split("").map(Number));

const manhattanDistance = (a: number[], b: number[]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

type QueuePoint = {
  row: number;
  col: number;
  lostHeat: number;
  walkedStraight: number;
  history: string;
  direction: "U" | "D" | "L" | "R";
};
const directionMap = {
  U: { row: -1, col: 0 },
  D: { row: 1, col: 0 },
  L: { row: 0, col: -1 },
  R: { row: 0, col: 1 },
};

const simulate = (input: number[][], minSteps = 0, maxSteps = 3): number => {
  const q = new PriorityQueue<QueuePoint>({
    comparator: (a: QueuePoint, b: QueuePoint) => a.lostHeat - b.lostHeat,
  });

  const initialPoint = {
    row: 0,
    col: 0,
    lostHeat: 0,
    history: "",
    walkedStraight: 1,
  };
  q.queue({ ...initialPoint, direction: "D" });
  q.queue({ ...initialPoint, direction: "R" });
  let finish = 0;
  let visited = {};
  while (true) {
    const { row, col, lostHeat, walkedStraight, direction, history } =
      q.dequeue();

    if (
      row === input.length - 1 &&
      col === input[0].length - 1 &&
      walkedStraight >= minSteps
    ) {
      finish = lostHeat;
      console.log("\n");

      console.log(history.split("").join(","));

      break;
    }
    const key = `${row},${col},${direction},${walkedStraight}`;

    if (visited[key]) {
      continue;
    }
    visited[key] = true;
    const nextRow = row + directionMap[direction].row;
    const nextCol = col + directionMap[direction].col;
    if (
      nextRow < 0 ||
      nextRow >= input.length ||
      nextCol < 0 ||
      nextCol >= input[0].length
    ) {
      continue;
    }
    const nextHeat = lostHeat + input[nextRow][nextCol];
    const newHistory = history + direction;
    switch (direction) {
      case "U":
        if (walkedStraight !== maxSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: walkedStraight + 1,
            direction: "U",
            history: newHistory,
          });
        }
        if (walkedStraight >= minSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "L",
            history: newHistory,
          });
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "R",
            history: newHistory,
          });
        }
        break;

      case "D":
        if (walkedStraight !== maxSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: walkedStraight + 1,
            direction: "D",
            history: newHistory,
          });
        }
        if (walkedStraight >= minSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "L",
            history: newHistory,
          });
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "R",
            history: newHistory,
          });
        }
        break;

      case "L":
        if (walkedStraight !== maxSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: walkedStraight + 1,
            direction: "L",
            history: newHistory,
          });
        }
        if (walkedStraight >= minSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "U",
            history: newHistory,
          });
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            history: newHistory,

            direction: "D",
          });
        }
        break;

      case "R":
        if (walkedStraight !== maxSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: walkedStraight + 1,
            direction: "R",
            history: newHistory,
          });
        }
        if (walkedStraight >= minSteps) {
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "U",
            history: newHistory,
          });
          q.queue({
            row: nextRow,
            col: nextCol,
            lostHeat: nextHeat,
            walkedStraight: 1,
            direction: "D",
            history: newHistory,
          });
        }
        break;
    }
  }

  return finish;
};

const part1 = {
  test: simulate(parseInput(testInput)),
  real: simulate(parseInput(realInput)),
};

const part2 = {
  test: simulate(parseInput(testInput), 4, 10),
  real: simulate(parseInput(realInput), 4, 10),
};

console.log({ part1, part2 });
