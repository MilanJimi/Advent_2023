import { _ } from "lodash";
import { memoize, readInput, sumArray } from "./common";

const testInput = readInput("12", "test");
const realInput = readInput("12", "real");

const parseInput = (input: string) => {
  return input.split("\n").map((row) => {
    const [springs, groupsStr] = row.split(" ");
    const groups = groupsStr.split(",").map(Number);
    return { springs, groups };
  });
};

const getPossibleArrangements = memoize(({ springs, groups }) => {
  if (springs.length === 0) {
    return groups.length === 0 ? 1 : 0;
  }

  if (groups.length === 0) {
    return springs.split("").some((s) => s === "#") ? 0 : 1;
  }

  const neededAtLeast = sumArray(groups) + groups.length - 1;
  if (springs.length < neededAtLeast) {
    return 0;
  }

  if (springs[0] === ".") {
    return getPossibleArrangements({ springs: springs.slice(1), groups });
  }
  if (springs[0] === "#") {
    const [currentGroup, ...remainingGroups] = groups;
    for (let i = 0; i < currentGroup; i++) {
      if (springs[i] === ".") {
        return 0;
      }
    }
    if (springs[currentGroup] === "#") {
      return 0;
    }
    return getPossibleArrangements({
      springs: springs.slice(currentGroup + 1),
      groups: remainingGroups,
    });
  }
  return (
    getPossibleArrangements({ springs: `#${springs.slice(1)}`, groups }) +
    getPossibleArrangements({ springs: `.${springs.slice(1)}`, groups })
  );
});

const part1 = {
  test: sumArray(
    parseInput(testInput).map(({ springs, groups }) =>
      getPossibleArrangements({ springs, groups })
    )
  ),
  real: sumArray(
    parseInput(realInput).map(({ springs, groups }) =>
      getPossibleArrangements({ springs, groups })
    )
  ),
};

const part2 = {
  test: sumArray(
    parseInput(testInput).map(({ springs, groups }) =>
      getPossibleArrangements({
        springs: Array(5).fill(springs).join("?"),
        groups: Array(5).fill(groups).flat(),
      })
    )
  ),
  real: sumArray(
    parseInput(realInput).map(({ springs, groups }) =>
      getPossibleArrangements({
        springs: Array(6).join(`${springs}?`).slice(0, -1),
        groups: Array(5).fill(groups).flat(),
      })
    )
  ),
};

console.log({ part1, part2 });
