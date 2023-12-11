import { readInput, sumArray } from "./common";

const testInput = readInput("2", "test");
// const test2Input = readInput("2", "test2");
const realInput = readInput("2", "real");

const maxGame = { red: 12, green: 13, blue: 14 };
const isTurnDoable = (game) => {
  for (const key of Object.keys(maxGame)) {
    if (game[key] > maxGame[key]) {
      return false;
    }
  }
  return true;
};

const findMinNumberOfCubes = (game) => {
  const minRed = Math.max(...game.map(({ red }) => red));
  const minGreen = Math.max(...game.map(({ green }) => green));
  const minBlue = Math.max(...game.map(({ blue }) => blue));

  return minRed * minGreen * minBlue;
};

const parseGame = (input: string) => {
  return input.split("\n").map((line) => {
    const game = line.replace("Game ", "").replace(" ", "").split(":");

    const gameNumber = Number(game[0]);
    const parsedGame = game[1].split(";").map((round) => {
      let counts = {
        red: 0,
        green: 0,
        blue: 0,
      };
      round.split(",").forEach((turn) => {
        const pair = turn.trim().split(" ");

        counts[pair[1]] += Number(pair[0]);
      });
      return counts;
    });
    return { gameNumber, parsedGame };
  });
};

const findUndoableGames = (parsedGames) => {
  const doableGames = parsedGames.filter(
    ({ parsedGame }) => !parsedGame.find((round) => !isTurnDoable(round))
  );

  return sumArray(doableGames.map(({ gameNumber }) => gameNumber));
};

const findPowerOfCubes = (parsedGames) => {
  return sumArray(
    parsedGames.map(({ parsedGame }) => findMinNumberOfCubes(parsedGame))
  );
};

console.log(findPowerOfCubes(parseGame(testInput)));
console.log(findPowerOfCubes(parseGame(realInput)));
