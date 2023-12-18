import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("15", "test");
const realInput = readInput("15", "real");

const parseInput = (input: string): string[] => input.split(",");

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash + str.charCodeAt(i)) * 17) % 256;
  }
  return hash;
};
const mapToOperations = (input: string) =>
  parseInput(input).map((op) =>
    op.includes("-")
      ? {
          hash: hashString(op.split("-")[0]),
          label: op.split("-")[0],
          operationType: "-",
        }
      : {
          hash: hashString(op.split("=")[0]),
          label: op.split("=")[0],
          operationType: "=",
          lens: Number(op.split("=")[1]),
        }
  );

const solvePart1 = (input: string) => {
  const csv = parseInput(input);
  return sumArray(csv.map(hashString));
};

type Lens = {
  label: string;
  lens: number;
};
type Box = Lens[];

const solvePart2 = (input: string) => {
  let boxes: Record<number, Box> = {};
  const csv = mapToOperations(input);

  csv.forEach(({ hash, label, operationType, lens }) => {
    if (operationType === "=") {
      if (!boxes[hash]) {
        boxes[hash] = [{ label, lens }];
        return;
      }

      const matchingLensIndex = boxes[hash].findIndex((l) => l.label === label);
      if (matchingLensIndex === -1) {
        boxes[hash].push({ label, lens });
        return;
      }
      boxes[hash][matchingLensIndex] = { label, lens };
      return;
    } else {
      if (!boxes[hash]) {
        return;
      }
      const matchingLensIndex = boxes[hash].findIndex((l) => l.label === label);
      delete boxes[hash][matchingLensIndex];
      boxes[hash] = boxes[hash].filter(Boolean);
      return;
    }
  });

  return sumArray(
    Object.keys(boxes).map((boxKey) => {
      const box = boxes[Number(boxKey)];
      return sumArray(
        box.map(({ lens }, index) => (Number(boxKey) + 1) * (index + 1) * lens)
      );
    })
  );
};

console.log({
  part1: {
    test: solvePart1(testInput),
    real: solvePart1(realInput),
  },
  part2: {
    test: solvePart2(testInput),
    real: solvePart2(realInput),
  },
});
