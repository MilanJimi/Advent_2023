import { get } from "http";
import { readInput, sumArray } from "./common";

const testInput = readInput("9", "test");
const realInput = readInput("9", "real");

const parseInput = (input) =>
  input.split("\n").map((line) => line.split(" ").map(Number));

const getDerivative = (f) => {
  let derivative = [];
  for (let i = 0; i < f.length - 1; i++) {
    derivative.push(f[i + 1] - f[i]);
  }
  return derivative;
};

const interpolateForward = (f) => {
  let derivatives = [f, getDerivative(f)];
  while (!derivatives[derivatives.length - 1].every((x) => x === 0)) {
    derivatives.push(getDerivative(derivatives[derivatives.length - 1]));
  }
  let currentInterpolation = 0;
  for (let i = derivatives.length - 1; i >= 1; i--) {
    currentInterpolation =
      currentInterpolation + derivatives[i - 1][derivatives[i - 1].length - 1];
  }
  return currentInterpolation;
};

console.log(sumArray(parseInput(testInput).map((f) => interpolateForward(f))));
console.log(sumArray(parseInput(realInput).map((f) => interpolateForward(f))));

// Part 2

const interpolateBackwards = (f) => {
  let derivatives = [f, getDerivative(f)];
  while (!derivatives[derivatives.length - 1].every((x) => x === 0)) {
    derivatives.push(getDerivative(derivatives[derivatives.length - 1]));
  }
  let currentInterpolation = 0;
  for (let i = derivatives.length - 1; i >= 1; i--) {
    currentInterpolation = derivatives[i - 1][0] - currentInterpolation;
  }
  return currentInterpolation;
};

console.log(
  sumArray(parseInput(testInput).map((f) => interpolateBackwards(f)))
);
console.log(
  sumArray(parseInput(realInput).map((f) => interpolateBackwards(f)))
);
