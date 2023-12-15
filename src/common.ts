import fs from "fs";

export const readInput = (day, input) => {
  return fs.readFileSync(`./inputs/${day}/${input}.in`, "utf8");
};

export const sumArray = (arr: number[]) =>
  [...arr].reduce((acc, val) => acc + val, 0);

export const multiplyArray = (arr: number[]) =>
  [...arr].reduce((acc, val) => acc * val, 1);

export function memoize<TArgs extends unknown[], TResult>(
  fn: Function
): Function {
  const cache = new Map<string, TResult>();

  return (...args: TArgs) => {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = fn(...args);
    cache.set(cacheKey, result);

    return result;
  };
}
