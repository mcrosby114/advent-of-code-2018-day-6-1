import { fetchPuzzleInput } from "../api";

/**
 * Day 2, part 1: Make a checksum by summing the count of ids with
 * letters appearing 2 and 3 times.
 * (https://adventofcode.com/2018/day/2)
 * API input: array of strings (ids)
 * @returns {number} - checksum
 */
export async function solve2p1() {
  const inputData = await fetchPuzzleInput("2-1");

  let globalTwoCount = 0,
    globalThreeCount = 0;

  for (let i = 0; i < inputData.length; i++) {
    const currentStr = inputData[i];
    const charCountMap = Array.from(currentStr).reduce((map, char) => {
      if (map[char] === undefined) {
        map[char] = 0;
      }
      return {
        ...map,
        [char]: map[char] + 1,
      };
    }, {});
    const charCountList = Object.values(charCountMap);
    if (charCountList.includes(2)) {
      globalTwoCount++;
    }
    if (charCountList.includes(3)) {
      globalThreeCount++;
    }
  }

  return globalTwoCount * globalThreeCount;
}

/**
 * Campares two arrays of strings (assume equal length) to find which indices
 * have differing values
 * @param {string[]} arr1 - first array of strings
 * @param {string[]} arr2 - second array of strings
 * @returns {number[]}    - list of indices where values differ between input arrays
 */
function findDifferingIndices(arr1, arr2) {
  const differingIndices = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      differingIndices.push(i);
    }
  }
  return differingIndices;
}

/**
 * Day 2, part 2: There are two boxes whose IDs differ by exactly one character
 * at the same position in both strings. What letters are common between the two
 * matching IDs?
 * (https://adventofcode.com/2018/day/2)
 * API input: array of strings (ids)
 * @returns {string} - chars that are common between the two correct box IDs
 *                    (excluding the differing chars)
 */
export async function solve2p2() {
  const inputData = await fetchPuzzleInput("2-2");
  const finalPos = inputData.length - 1;

  // O(n^2 / 2)
  for (let outerPos = 0; outerPos < finalPos; outerPos++) {
    const charListA = Array.from(inputData[outerPos]);
    for (let innerPos = outerPos + 1; innerPos <= finalPos; innerPos++) {
      const charListB = Array.from(inputData[innerPos]);
      // Skip if both arrays are not equal length (definitely not correct ones)
      if (charListA.length !== charListB.length) continue;
      const differingCharIndices = findDifferingIndices(charListA, charListB);
      if (differingCharIndices.length === 1) {
        // Found match, return the letters common between both
        return charListA
          .filter((char, idx) => idx !== differingCharIndices[0])
          .join("");
      }
    }
  }
  return "not found";
}
