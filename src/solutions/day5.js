import { fetchPuzzleInput } from "../api";

function reactPolymer(polymerCode) {
  const initialLength = polymerCode.length;
  let nextString = "",
    i = 0,
    j = 1;
  while (i < polymerCode.length) {
    // If these chars are the same character and differ in upper/lower case
    if (
      Math.abs(polymerCode.charCodeAt(i) - polymerCode.charCodeAt(j)) === 32
    ) {
      i += 2;
      j += 2;
    } else {
      nextString += polymerCode.charAt(i);
      i++;
      j++;
    }
  }
  // Base case, reaction has stopped
  if (initialLength === nextString.length) {
    return nextString;
  }
  return reactPolymer(nextString);
}

/**
 * Day 5, part 1: Given a polymer of units represented by upper/lower case letters,
 * where two adjacent units of the same type and opposite polarity (upper/lower
 * case of same letter) react and are destroyed, how many units remain after all reactions?
 * Note: these rules are applied to any results of a previous chain reaction...
 * (https://adventofcode.com/2018/day/5)
 * API inputs: big-ass string of upper/lower case letters
 * @returns {number} - number of characters (polymer units) remaining
 */
export async function solve5p1() {
  const [inputData] = await fetchPuzzleInput("5-1");
  const resultingCode = reactPolymer(inputData);
  return resultingCode.length;
}

/** Produces an array of upper/lower case chars like: "Aa", "Bb", ... */
const getListOfAlphabeticalChars = () =>
  new Array(26)
    .fill()
    .map(
      (elem, idx) =>
        String.fromCharCode(65 + idx) + String.fromCharCode(65 + 32 + idx),
    );

/**
 * Day 5, part 2: What is the length of the shortest polymer you can produce by
 * removing all units of exactly one type and fully reacting the result?
 * (https://adventofcode.com/2018/day/5)
 * API inputs: big-ass string of upper/lower case letters
 * @returns {number} - length of the shortest possible polymer
 */
export async function solve5p2() {
  const [inputData] = await fetchPuzzleInput("5-2");
  const testCharsList = getListOfAlphabeticalChars();
  let shortestResult = Number.MAX_SAFE_INTEGER;
  testCharsList.forEach(chars => {
    const re = new RegExp(`[^${chars}]+`, "g");
    // Exclude all cases where these characters (e.g., "Aa") show up in input
    const truncatedInput = inputData.match(re).join("");
    const outputLength = reactPolymer(truncatedInput).length;
    if (outputLength < shortestResult) shortestResult = outputLength;
  });

  return shortestResult;
}
