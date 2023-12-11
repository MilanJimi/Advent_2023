import { multiplyArray, readInput, sumArray } from "./common";

const testInput = readInput("7", "test");
const realInput = readInput("7", "real");

const mapCardToValue = (card) => {
  const cardMap = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  };

  return cardMap[card] || Number(card);
};

const isFiveOfAKind = (hand) => {
  return hand.every((card) => card === hand[0]);
};
const isFourOfAKind = (hand) => {
  return hand.some((card) => hand.filter((c) => c === card).length === 4);
};
const isThreeOfAKind = (hand) => {
  return hand.some((card) => hand.filter((c) => c === card).length === 3);
};
const findOnePair = (hand) => {
  return hand.find((card) => hand.filter((c) => c === card).length === 2);
};
const isTwoPair = (hand) => {
  const firstPair = findOnePair(hand);
  if (!firstPair) return false;
  const secondPair = findOnePair(hand.filter((card) => card !== firstPair));
  return !!secondPair;
};
const isFullHouse = (hand) => {
  return isThreeOfAKind(hand) && findOnePair(hand);
};

const findHandValue = (hand) => {
  if (isFiveOfAKind(hand)) return 6;
  if (isFourOfAKind(hand)) return 5;
  if (isFullHouse(hand)) return 4;
  if (isThreeOfAKind(hand)) return 3;
  if (isTwoPair(hand)) return 2;
  if (findOnePair(hand)) return 1;
  return 0;
};

const parseInput = (input) =>
  input.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    const parsedHand = hand.split("").map(mapCardToValue);
    return {
      hand: parsedHand,
      bid: Number(bid),
      value: findHandValue(parsedHand),
    };
  });

const compareHighestCard = (hand1, hand2) => {
  for (let i = 0; i < 5; i++) {
    if (hand1[i] > hand2[i]) return 1;
    if (hand1[i] < hand2[i]) return -1;
  }
  return 0;
};

const compareHands = (hand1, hand2) => {
  if (hand1.value > hand2.value) return 1;
  if (hand1.value < hand2.value) return -1;
  return compareHighestCard(hand1.hand, hand2.hand);
};

console.log(
  sumArray(
    parseInput(testInput)
      .sort(compareHands)
      .map((h, i) => h.bid * (i + 1))
  )
);
console.log(
  sumArray(
    parseInput(realInput)
      .sort(compareHands)
      .map((h, i) => h.bid * (i + 1))
  )
);

// Part 2

const mapWithJokersToValue = (hand) => {
  const cardMap = {
    A: 14,
    K: 13,
    Q: 12,
    J: -1,
    T: 10,
  };

  return cardMap[hand] || Number(hand);
};

const findHandValueWithJokers = (hand) => {
  let nonJokers = new Set();
  for (const card of hand) {
    if (card !== -1) {
      nonJokers.add(card);
    }
  }
  if (nonJokers.size === 0) return 6;

  let maxValue = 0;
  for (const substitution of nonJokers) {
    const newHand = hand.map((card) => (card === -1 ? substitution : card));
    maxValue = Math.max(maxValue, findHandValue(newHand));
  }
  return maxValue;
};

const parseInputWithJokers = (input) =>
  input.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    const parsedHand = hand.split("").map(mapWithJokersToValue);

    return {
      hand: parsedHand,
      bid: Number(bid),
      value: findHandValueWithJokers(parsedHand),
    };
  });

console.log(
  sumArray(
    parseInputWithJokers(testInput)
      .sort(compareHands)
      .map((h, i) => h.bid * (i + 1))
  )
);
console.log(
  sumArray(
    parseInputWithJokers(realInput)
      .sort(compareHands)
      .map((h, i) => h.bid * (i + 1))
  )
);
