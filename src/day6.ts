import { multiplyArray, readInput, sumArray } from "./common";

const testInput = readInput("6", "test");
const realInput = readInput("6", "real");

const parseInput = (input) => {
  const split = input.split("\n");
  const timeLineParsed = split[0]
    .replace("Time:", "")
    .trim()
    .split(/\s+/)
    .map((time) => parseInt(time));
  const distanceLineParsed = split[1]
    .replace("Distance:", "")
    .trim()
    .split(/\s+/)
    .map((distance) => parseInt(distance));

  return timeLineParsed.map((time, index) => ({
    time,
    distance: distanceLineParsed[index],
  }));
};

const findCriticalTimes = ({ time, distance }) => {
  const D = time * time - 4 * distance;
  const a = (-time + Math.sqrt(D)) / 2;
  const b = (-time - Math.sqrt(D)) / 2;

  return [
    Math.round(-a + 0.5),
    Math.round(b) === b ? -b : Math.round(-b + 0.5),
  ];
};

console.log(
  multiplyArray(
    parseInput(realInput)
      .map(findCriticalTimes)
      .map(([min, max]) => max - min)
  )
);

// Part 2

const parseInputWithoutSpaces = (input) => {
  const split = input.split("\n").map((line) => line.replaceAll(/\s+/g, ""));

  const time = Number(split[0].replace("Time:", "").trim());
  const distance = Number(split[1].replace("Distance:", "").trim());

  return { time, distance };
};

const part2Input = parseInputWithoutSpaces(realInput);

console.log(
  findCriticalTimes(part2Input)[1] - findCriticalTimes(part2Input)[0]
);
