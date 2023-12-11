import fs from "fs";

export const readInput = (day, input) => {
  return fs.readFileSync(`./inputs/${day}/${input}.in`, "utf8");
};

export const sumArray = (arr: number[]) =>
  [...arr].reduce((acc, val) => acc + val, 0);

export const multiplyArray = (arr: number[]) =>
  [...arr].reduce((acc, val) => acc * val, 1);
