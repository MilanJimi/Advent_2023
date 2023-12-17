import { _ } from "lodash";
import { readInput, sumArray } from "./common";

const testInput = readInput("13", "test");
const realInput = readInput("13", "real");

const parseInput = (input: string) => {
  return input.split("\n\n").map((pattern) => {
    return pattern.split("\n").map((row) => {
      return row.split("");
    });
  });
};
const countPartialSums = (pattern: string[][]) => {
  const { rows, cols } = { rows: [0], cols: [0] };
  for (let i = 0; i < pattern.length; i++) {
    const row = pattern[i];
    rows.push(rows[rows.length - 1] + row.filter((c) => c === "#").length);
  }
  for (let i = 0; i < pattern[0].length; i++) {
    let colSum = 0;
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j][i] === "#") {
        colSum++;
      }
    }
    cols.push(cols[cols.length - 1] + colSum);
  }
  return { rows, cols };
};

const findSumPossibleMirrors = (partialSums: number[], smudges = 0) => {
  let possibleMirrors = [];
  for (let i = 1; i < partialSums.length - 1; i++) {
    const mirroredDistance = Math.min(i, partialSums.length - i - 1);

    if (
      Math.abs(
        partialSums[i] -
          partialSums[i - mirroredDistance] -
          (partialSums[i + mirroredDistance] - partialSums[i])
      ) === smudges
    ) {
      possibleMirrors.push(i);
    }
  }
  return possibleMirrors;
};
const findSumPossibleMirrorsSecondPass = (
  partialSums: number[],
  possibleMirrors: number[]
) => {
  let possibleMirrorsSecondPass = [];
  for (const possibleMirror of possibleMirrors) {
    const mirroredDistance = Math.min(
      possibleMirror,
      partialSums.length - possibleMirror - 1
    );
    let isPossibleMirror = true;
    for (let i = 0; i < mirroredDistance; i++) {
      if (
        partialSums[possibleMirror - i] -
          partialSums[possibleMirror - i - 1] !==
        partialSums[possibleMirror + i + 1] - partialSums[possibleMirror + i]
      ) {
        isPossibleMirror = false;
        break;
      }
    }
    isPossibleMirror && possibleMirrorsSecondPass.push(possibleMirror);
  }
  return possibleMirrorsSecondPass;
};

const matchMirrorsOneForOne = (
  pattern: string[][],
  rowMirrors: number[],
  colMirrors: number[],
  smudges = 0
) => {
  let verifiedRowMirrors = [];
  rowMirrors.forEach((rowMirror) => {
    let isVerified = true;
    let smudgesFound = 0;
    const mirroredDistance = Math.min(
      Math.min(rowMirror, pattern.length - rowMirror)
    );
    for (let i = 0; i < mirroredDistance; i++) {
      const top = pattern[rowMirror - i - 1];
      const bot = pattern[rowMirror + i];
      if (
        Math.abs(
          top.filter((c) => c === "#").length -
            bot.filter((c) => c === "#").length
        ) === 1
      ) {
        for (let j = 0; j < top.length; j++) {
          if (
            (top[j] === "#" && bot[j] === ".") ||
            (top[j] === "." && bot[j] === "#")
          ) {
            smudgesFound++;
          }
        }
        if (smudgesFound > smudges) {
          isVerified = false;
          break;
        }
        continue;
      }
      if (!_.isEqual(top, bot)) {
        isVerified = false;
        break;
      }
    }
    isVerified &&
      smudgesFound === smudges &&
      verifiedRowMirrors.push(rowMirror);
  });

  let verifiedColMirrors = [];
  colMirrors.forEach((colMirror) => {
    let isVerified = true;
    let smudgesFound = 0;
    const mirroredDistance = Math.min(
      Math.min(colMirror, pattern[0].length - colMirror)
    );
    for (let i = 0; i < mirroredDistance; i++) {
      const left = pattern.map((row) => row[colMirror - i - 1]);
      const right = pattern.map((row) => row[colMirror + i]);
      if (
        Math.abs(
          left.filter((c) => c === "#").length -
            right.filter((c) => c === "#").length
        ) === 1
      ) {
        for (let j = 0; j < left.length; j++) {
          if (
            (left[j] === "#" && right[j] === ".") ||
            (left[j] === "." && right[j] === "#")
          ) {
            smudgesFound++;
          }
        }
        if (smudgesFound > smudges) {
          isVerified = false;
          break;
        }
        continue;
      }
      if (!_.isEqual(left, right)) {
        isVerified = false;
        break;
      }
    }
    isVerified &&
      smudgesFound === smudges &&
      verifiedColMirrors.push(colMirror);
  });
  return { verifiedRowMirrors, verifiedColMirrors };
};

const solve = (input: string, smudges = 0) => {
  const parsed = parseInput(input);
  const summaries = parsed.map((pattern) => {
    const { rows, cols } = countPartialSums(pattern);
    const rowMirrors = findSumPossibleMirrors(rows, smudges);
    const colMirrors = findSumPossibleMirrors(cols, smudges);

    const secondPassRows = smudges
      ? rowMirrors
      : findSumPossibleMirrorsSecondPass(rows, rowMirrors);
    const secondPassCols = smudges
      ? colMirrors
      : findSumPossibleMirrorsSecondPass(cols, colMirrors);

    const { verifiedRowMirrors, verifiedColMirrors } = matchMirrorsOneForOne(
      pattern,
      secondPassRows,
      secondPassCols,
      smudges
    );

    return sumArray([
      ...verifiedColMirrors,
      ...verifiedRowMirrors.map((row) => row * 100),
    ]);
  });
  return sumArray(summaries);
};

const part1 = {
  test: solve(testInput),
  real: solve(realInput),
};

const part2 = {
  test: solve(testInput, 1),
  real: solve(realInput, 1),
};

console.log(part1);
console.log(part2);
