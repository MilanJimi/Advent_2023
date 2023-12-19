import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("19", "test");
const realInput = readInput("19", "real");

type Check = {
  property: string;
  value: number;
  check: "<" | ">";
  ifTrue: string;
};
type Rule = {
  instructions: Check[];
  fallbackKey: string;
};
type Part = {
  [key: string]: number;
};

type PartInterval = {
  [key: string]: { min: number; max: number };
};

const parseInput = (input: string) => {
  const [rules, machineParts] = input.split("\n\n");
  const ruleMap: Record<string, Rule> = {};
  for (const rule of rules.split("\n")) {
    const [key, value] = rule.split("{");
    const instructions = value
      .replace(/,[a-zA-Z]+}/, "")
      .split(",")
      .map((s) => {
        const property = s[0];
        const check = s[1] as "<" | ">";
        const value = Number(s.slice(2).split(":")[0]);
        const ifTrue = s.slice(2).split(":")[1];
        return { property, check, value, ifTrue };
      });

    const fallbackKey = value
      .split(",")
      [value.split(",").length - 1].replace("}", "");

    ruleMap[key] = { instructions, fallbackKey };
  }

  return {
    ruleMap,
    parts: machineParts
      .split("\n")
      .map((s) =>
        JSON.parse(s.replace(/=/g, ":").replace(/([a-z])/g, '"$1"'))
      ) as Part[],
  };
};

const followRule = ({ fallbackKey, instructions }: Rule, part: Part) => {
  for (const { property, check, value, ifTrue } of instructions) {
    if (check === "<" && part[property] < value) {
      return ifTrue;
    } else if (check === ">" && part[property] > value) {
      return ifTrue;
    }
  }
  return fallbackKey;
};

const isPartAccepted = (ruleMap: Record<string, Rule>, part: Part) => {
  let key = "in";
  while (key !== "A" && key !== "R") {
    key = followRule(ruleMap[key], part);
  }
  return key === "A";
};

const solvePart1 = (input: string) => {
  const { ruleMap, parts } = parseInput(input);
  let acceptedParts = [];
  let rejectedParts = [];
  for (const part of parts) {
    if (isPartAccepted(ruleMap, part)) {
      acceptedParts.push(part);
    } else {
      rejectedParts.push(part);
    }
  }
  return sumArray(acceptedParts.map((p) => sumArray(Object.values(p))));
};

const part1 = {
  test: solvePart1(testInput),
  real: solvePart1(realInput),
};

console.log(part1);

const followCheckForInterval = (
  { property, value, check, ifTrue }: Check,
  partInterval: PartInterval
): { interval: PartInterval; nextRule: string | null }[] => {
  let nextIntervals = [];
  if (check === ">") {
    if (partInterval[property].min > value) {
      nextIntervals.push({ interval: partInterval, nextRule: ifTrue });
      return nextIntervals;
    }
    if (partInterval[property].max < value) {
      nextIntervals.push({ interval: partInterval, nextRule: null });
      return nextIntervals;
    }

    nextIntervals.push({
      interval: {
        ...partInterval,
        [property]: { min: partInterval[property].min, max: value },
      },
      nextRule: null,
    });
    nextIntervals.push({
      interval: {
        ...partInterval,
        [property]: { min: value + 1, max: partInterval[property].max },
      },
      nextRule: ifTrue,
    });
    return nextIntervals;
  }
  if (check === "<") {
    if (partInterval[property].max < value) {
      nextIntervals.push({ interval: partInterval, nextRule: ifTrue });
      return nextIntervals;
    }
    if (partInterval[property].min > value) {
      nextIntervals.push({ interval: partInterval, nextRule: null });
      return nextIntervals;
    }

    nextIntervals.push({
      interval: {
        ...partInterval,
        [property]: { min: value, max: partInterval[property].max },
      },
      nextRule: null,
    });
    nextIntervals.push({
      interval: {
        ...partInterval,
        [property]: { min: partInterval[property].min, max: value - 1 },
      },
      nextRule: ifTrue,
    });
    return nextIntervals;
  }
};

const followRuleForInterval = (
  { fallbackKey, instructions }: Rule,
  partInterval: PartInterval
) => {
  let resolvedIntervals = [];
  let unresolvedIntervals = [partInterval];
  for (const check of instructions) {
    let newUnresolvedIntervals = [];
    for (const interval of unresolvedIntervals) {
      const nextIntervals = followCheckForInterval(check, interval);
      resolvedIntervals.push(
        ...nextIntervals.filter((n) => n.nextRule !== null)
      );
      newUnresolvedIntervals.push(
        ...nextIntervals
          .filter((n) => n.nextRule === null)
          .map((n) => n.interval)
      );
    }
    unresolvedIntervals = newUnresolvedIntervals;
  }

  resolvedIntervals = [
    ...resolvedIntervals,
    ...unresolvedIntervals.map((interval) => ({
      interval,
      nextRule: fallbackKey,
    })),
  ];

  return resolvedIntervals;
};

const solvePart2 = (input: string) => {
  const fullInterval = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  const { ruleMap } = parseInput(input);
  let intervals = [{ interval: fullInterval, nextRule: "in" }];
  let acceptedSize = 0;
  while (intervals.length > 0) {
    const { interval, nextRule } = intervals.pop();
    const nextIntervals = followRuleForInterval(ruleMap[nextRule], interval);
    for (const { interval, nextRule } of nextIntervals) {
      if (nextRule === "A") {
        acceptedSize +=
          (interval.x.max - interval.x.min + 1) *
          (interval.m.max - interval.m.min + 1) *
          (interval.a.max - interval.a.min + 1) *
          (interval.s.max - interval.s.min + 1);
      } else if (nextRule !== "R") {
        intervals.push({ interval, nextRule });
      }
    }
  }
  return acceptedSize;
};

const part2 = {
  test: solvePart2(testInput),
  real: solvePart2(realInput),
};
console.log(part2);
