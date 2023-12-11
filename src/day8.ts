import { parse } from "path";
import { multiplyArray, readInput, sumArray } from "./common";
import test from "node:test";

const testInput = readInput("8", "test");
const test2Input = readInput("8", "test2");
const test3Input = readInput("8", "test3");
const realInput = readInput("8", "real");

const parseInput = (input) => {
  const split = input.split("\n");
  const steps = split[0].split("");
  let nodeMap = {};
  split.slice(2).map((line) => {
    const [node, rl] = line.split(" = (");
    const [L, R] = rl.replace(")", "").split(", ");

    nodeMap[node] = { R, L };
  });
  return { steps, nodeMap };
};

const simulateSteps = (steps, nodeMap) => {
  let currentNode = "AAA";
  let currentStep = 0;
  while (currentNode !== "ZZZ") {
    const step = steps[currentStep % steps.length];
    const nextNode = nodeMap[currentNode][step];
    currentNode = nextNode;
    console.log(currentNode);

    currentStep++;
  }
  return currentStep;
};

const { steps, nodeMap } = parseInput(realInput);
// console.log(nodeMap);

// console.log(simulateSteps(steps, nodeMap));

const endsWithA = Object.keys(nodeMap).filter((key) => key.endsWith("A"));
const endsWithZ = Object.keys(nodeMap).filter((key) => key.endsWith("Z"));

const findGhostCycle = (steps, nodeMap, startNode) => {
  let returnedOnStep: Record<string, { modulo: number[]; offset: number[] }> =
    endsWithZ.reduce(
      (acc, node) => ({ ...acc, [node]: { modulo: [], offset: [] } }),
      {}
    );
  let currentStep = 0;
  let cycleSize = { offset: 0, cycleSize: 0 };
  let currentNode = startNode;
  while (true) {
    const step = steps[currentStep % steps.length];
    if (currentNode.endsWith("Z")) {
      const index = returnedOnStep[currentNode].modulo.indexOf(
        currentStep % steps.length
      );
      if (index === -1) {
        returnedOnStep[currentNode].modulo.push(currentStep % steps.length);
        returnedOnStep[currentNode].offset.push(currentStep);
      } else {
        const size = currentStep - returnedOnStep[currentNode].offset[index];
        const offset = returnedOnStep[currentNode].offset[index] - size;
        cycleSize = {
          offset,
          cycleSize: size,
        };
        break;
      }
    }

    currentNode = nodeMap[currentNode][step];
    currentStep++;
  }
  return cycleSize;
};

endsWithA.forEach((node) => {
  console.log(findGhostCycle(steps, nodeMap, node).cycleSize);
});
