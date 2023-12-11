import { readInput, sumArray } from "./common";
import _ from "lodash";

const testInput = readInput("5", "test");
const realInput = readInput("5", "real");

let almanach = [];

const parseInput = (input) => {
  return input.split("\n\n").map((m) => {
    return m.split("\n");
  });
};

const input = parseInput(realInput);
const seeds = input[0]
  .map((line) => {
    return line.replace("seeds: ", "").split(" ").map(Number);
  })
  .flat();

const parseMaps = (m) => {
  almanach.push(
    m.slice(1).map((line) => {
      const split = line.split(" ");
      return {
        destinationStart: Number(split[0]),
        sourceStart: Number(split[1]),
        length: Number(split[2]),
      };
    })
  );
};

for (let i = 1; i < input.length; i++) {
  parseMaps(input[i]);
}

const simulateSeed = (seed) => {
  let currentValue = seed;

  for (const round of almanach) {
    for (const mapping of round) {
      if (
        mapping.sourceStart <= currentValue &&
        currentValue <= mapping.sourceStart + mapping.length
      ) {
        currentValue =
          mapping.destinationStart + (currentValue - mapping.sourceStart);
        break;
      }
    }
  }
  return currentValue;
};

const finalSeeds = seeds.map(simulateSeed);

// console.log(Math.min(...finalSeeds));
// Part 2

let seedRanges = [];
let acc = { start: 0, length: 0 };
input[0][0]
  .replace("seeds: ", "")
  .split(" ")
  .forEach((seed, index) => {
    if (index % 2 !== 0) {
      acc = { ...acc, length: Number(seed) };
      seedRanges.push(acc);
    }
    acc = { start: Number(seed), length: 0 };
  });

const findIntersect = (range1, range2) => {
  const start = Math.max(range1.start, range2.start);

  const end = Math.min(
    range1.start + range1.length,
    range2.start + range2.length
  );
  if (end - start <= 0) return;

  return { start, length: end - start };
};

const simulateRangeRound = (range, round) => {
  let intersectRanges = [];
  let intersectedRanges = [];
  for (const mapping of round) {
    const intersect = findIntersect(range, {
      start: mapping.sourceStart,
      length: mapping.length,
    });

    if (intersect) {
      intersectRanges.push({
        start:
          mapping.destinationStart + (intersect.start - mapping.sourceStart),
        length: intersect.length,
      });
      intersectedRanges.push(intersect);
    }
  }
  intersectedRanges.sort(({ start }, { start: start2 }) => start - start2);

  let fallbackRanges = [];
  for (let i = 0; i < intersectedRanges.length - 1; i++) {
    if (
      intersectedRanges[i].start + intersectedRanges[i].length <
      intersectedRanges[i + 1].start
    ) {
      fallbackRanges.push({
        start: intersectedRanges[i].start + intersectedRanges[i].length,
        length:
          intersectedRanges[i + 1].start -
          intersectedRanges[i].start -
          intersectedRanges[i].length,
      });
    }
  }
  if (
    intersectedRanges.length > 0 &&
    intersectedRanges[intersectedRanges.length - 1].start +
      intersectedRanges[intersectedRanges.length - 1].length <
      range.start + range.length
  ) {
    fallbackRanges.push({
      start:
        intersectedRanges[intersectedRanges.length - 1].start +
        intersectedRanges[intersectedRanges.length - 1].length,
      length:
        range.start +
        range.length -
        (intersectedRanges[intersectedRanges.length - 1].start +
          intersectedRanges[intersectedRanges.length - 1].length),
    });
  }
  if (
    intersectedRanges.length > 0 &&
    intersectedRanges[0].start > range.start
  ) {
    fallbackRanges.push({
      start: range.start,
      length: intersectedRanges[0].start - range.start,
    });
  }

  if (intersectRanges.length === 0) {
    fallbackRanges.push(range);
  }

  if (
    sumArray(
      [...intersectRanges, ...fallbackRanges].map(({ length }) => length)
    ) !== range.length
  ) {
    console.error(
      range.start,
      range.length,
      // round,
      intersectedRanges,
      fallbackRanges
    );
  }

  return [...intersectRanges, ...fallbackRanges];
};

let min = 9999999999999999999999;
for (const seedRange of seedRanges) {
  let sourceRanges = [seedRange];
  for (const round of almanach) {
    let newRanges = [];
    for (const currentRange of sourceRanges) {
      newRanges.push(simulateRangeRound(currentRange, round));
    }

    sourceRanges = newRanges.flat();
  }
  min = Math.min(min, ...sourceRanges.map(({ start }) => start));
}
console.log(min);
