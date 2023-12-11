import { readInput } from "./common";
import _ from "lodash";

const testInput = readInput("3", "test");
const realInput = readInput("3", "real");

const parseInput = (input) => {
  return input.split("\n").map((line) => {
    return line.split("");
  });
};
const parsedInput = parseInput(realInput);

const isDigit = (char) => !isNaN(Number(char));

const floodMap = new Array(parsedInput.length)
  .fill(null)
  .map(() => new Array(parsedInput[0].length).fill(false));

const logMap = (map) => {
  console.log(
    map
      .map((row, x) =>
        row.map((col, y) => (col ? parsedInput[x][y] : ".")).join("")
      )
      .join("\n")
  );
};

const floodFill = (input, x, y) => {
  if (x < 0 || y < 0 || x >= input.length || y >= input[0].length) {
    return;
  }

  if (floodMap[x][y] || input[x][y] === ".") {
    return;
  }

  floodMap[x][y] = true;

  floodFill(input, x + 1, y);
  floodFill(input, x + 1, y + 1);
  floodFill(input, x + 1, y - 1);

  floodFill(input, x - 1, y);
  floodFill(input, x - 1, y + 1);
  floodFill(input, x - 1, y - 1);

  floodFill(input, x, y + 1);
  floodFill(input, x, y - 1);
};

for (let x = 0; x < parsedInput.length; x++) {
  for (let y = 0; y < parsedInput[0].length; y++) {
    if (
      parsedInput[x][y] &&
      parsedInput[x][y] !== "." &&
      !isDigit(parsedInput[x][y])
    ) {
      floodFill(parsedInput, x, y);
    }
  }
}

let sum = 0;
const dict = {};
for (let x = 0; x < parsedInput.length; x++) {
  let numberBuilder = "";
  for (let y = 0; y < parsedInput[0].length; y++) {
    if (!isDigit(parsedInput[x][y]) || y === parsedInput[0].length - 1) {
      if (numberBuilder !== "") {
        dict[numberBuilder] = dict[numberBuilder] ? dict[numberBuilder] + 1 : 1;

        sum += Number(numberBuilder);
      }
      numberBuilder = "";
    }
    if (
      isDigit(parsedInput[x][y]) &&
      (floodMap[x][y] || numberBuilder !== "")
    ) {
      numberBuilder += parsedInput[x][y];
    }
  }
}

console.log("Part 1: ", sum);

const readNumber = (row, col) => {
  if (!isDigit(parsedInput[row][col])) {
    return null;
  }
  if (col === 0 || !isDigit(parsedInput[row][col - 1])) {
    let numberBuilder = "";
    for (let i = col; i < parsedInput[0].length; i++) {
      if (isDigit(parsedInput[row][i])) {
        numberBuilder += parsedInput[row][i];
      } else {
        break;
      }
    }
    return {
      value: Number(numberBuilder),
      startsWith: JSON.stringify([row, col]),
    };
  }
  return readNumber(row, col - 1);
};

let gearNumber = 0;
for (let row = 0; row < parsedInput.length; row++) {
  for (let col = 0; col < parsedInput[0].length; col++) {
    if (parsedInput[row][col] !== "*") {
      continue;
    }
    const surroundingNumbers = _.uniqWith(
      [
        readNumber(row + 1, col),
        readNumber(row + 1, col + 1),
        readNumber(row + 1, col - 1),

        readNumber(row - 1, col),
        readNumber(row - 1, col + 1),
        readNumber(row - 1, col - 1),

        readNumber(row, col + 1),
        readNumber(row, col - 1),
      ].filter((x) => x),
      _.isEqual
    );

    console.log(surroundingNumbers);

    if (surroundingNumbers.length === 2) {
      gearNumber += surroundingNumbers[0].value * surroundingNumbers[1].value;
    }
  }
}

console.log(gearNumber);
