import { fetchPuzzleInput } from "../api";

/**
 * Day 1, part 1: Find the net frequency change.
 * (https://adventofcode.com/2018/day/1)
 * API input: array of numbers
 * @returns {number} - final frequency after changes
 */
export async function solve1p1() {
  const inputData = await fetchPuzzleInput("1-1");
  return inputData.reduce((net, val) => {
    return net + val;
  }, 0);
}

// function* findRepeatedFrequency(changes) {
//   const frequencyMap = {};
//   let frequency = 0;
//   let idx = 0;
//   while (true) {
//     frequency += changes[idx % changes.length];
//     if (frequencyMap[frequency]) {
//       yield frequency;
//       return;
//     }
//     frequencyMap[frequency] = true;
//     yield ++idx;
//   }
// }
// let f;
// for (f of findRepeatedFrequency(inputData)) {
// }
// return f;

/**
 * Produces Generator to change frequency indefinitely
 * @param {number[]} - list of frequency changes
 * @returns {Generator}
 */
function* changeFrequency(changes) {
  let idx = 0;
  let frequency;
  while (true) {
    frequency = yield null;
    yield frequency + changes[idx++ % changes.length];
  }
}

/**
 * Day 1, part 2: Find the first frequency reached twice,
 * allowing repeated iterations.
 * (https://adventofcode.com/2018/day/1)
 * API input: array of numbers
 * @returns {number} - first frequency reached twice
 */
export async function solve1p2() {
  const inputData = await fetchPuzzleInput("1-2");

  // const MAX_ITERATIONS = 150;
  // const frequencyMap = {};
  // let frequency = 0;
  // for (let i = 0; i < MAX_ITERATIONS; i++) {
  //   for (let j = 0; j < inputData.length; j++) {
  //     frequency += inputData[j];
  //     if (frequencyMap[frequency]) {
  //       return frequency;
  //     }
  //     frequencyMap[frequency] = true;
  //   }
  // }

  const frequencyMap = {};
  let nextFrequency = 0;
  const it = changeFrequency(inputData);
  while (true) {
    it.next(); // returns null, tees up following next to assign value
    nextFrequency = it.next(nextFrequency).value;
    if (frequencyMap[nextFrequency]) {
      return nextFrequency;
    }
    frequencyMap[nextFrequency] = true;
  }
}
