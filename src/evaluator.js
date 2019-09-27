import puzzleListing from "./puzzleListing";
import { apiMap } from "./api";
import * as solns from "./solutions";

const solutions = {
  "1-1": solns.solve1p1,
  "1-2": solns.solve1p2,
  "2-1": solns.solve2p1,
  "2-2": solns.solve2p2,
  "3-1": solns.solve3p1,
  "3-2": solns.solve3p2,
  "4-1": solns.solve4p1,
  "4-2": solns.solve4p2,
  "5-1": solns.solve5p1,
  "5-2": solns.solve5p2,
  "6-1": solns.solve6p1,
};

export const puzzleOptions = Object.entries(puzzleListing).reduce(
  (updatedMap, [key, val]) => {
    return {
      ...updatedMap,
      [key]: {
        ...updatedMap[key],
        hasInputs: !!apiMap[key],
        solved: !!solutions[key],
      },
    };
  },
  puzzleListing,
);

export const solvePuzzle = id => {
  if (!solutions[id]) {
    return Promise.resolve("Oops, that hasn't been solved yet");
  }
  return solutions[id]();
};
