import { fetchPuzzleInput } from "../api";

/**
 * Pulls out five pieces of numerical information from a "claim":
 * (1) ID, (2) left offset, (3) top offset, (4) width, (5) height
 * @param {string}     - "#{id} @ {left offset},{top offset}: {width}x{height}"
 * @returns {number[]} - list of numerical info for this claim
 */
function extractIdAndCoordinates(claim) {
  const re = /#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)/g;
  return re
    .exec(claim)
    .slice(1)
    .map(Number);
}

/**
 * Transforms a list of strings with positional information into a map of
 * intersection counts keyed to coordinates from a grid of 1000 x 1000.
 * @param {string[]} inputData - list of strings of the form:
 *                                  "#{id} @ {left offset},{top offset}: {width}x{height}"
 * @returns {object}           - map of coordinates : intersection count
 */
function getHitsByCoordinateMap(inputData) {
  return inputData.reduce((map, fabricClaim) => {
    const [left, top, width, height] = extractIdAndCoordinates(
      fabricClaim,
    ).slice(1);
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        map[`${x},${y}`] = ++map[`${x},${y}`] || 1;
      }
    }
    return map;
  }, {});
}

/**
 * Day 3, part 1: Given a 1,000 sq. in. fabric, and a list of claims with positions
 * within that fabric, find the number of sq. in. where 2+ claims overlap.
 * (https://adventofcode.com/2018/day/3)
 * API inputs: array of strings:
 *                      "#{id} @ {left offset},{top offset}: {width}x{height}"
 * @returns {number} - number of square inches of fabric with overlapping claims
 */
export async function solve3p1() {
  const inputData = await fetchPuzzleInput("3-1");
  const hitsByCoordMap = getHitsByCoordinateMap(inputData);
  return Object.values(hitsByCoordMap).filter(hits => hits > 1).length;
}

/**
 * Day 3, part 2: exactly one claim does not overlap with any others. What is its ID?
 * (https://adventofcode.com/2018/day/3)
 * API inputs: array of strings:
 *                      "#{id} @ {left offset},{top offset}: {width}x{height}"
 * @returns {number} - ID of the claim that has no overlaps with anything else
 */
export async function solve3p2() {
  const inputData = await fetchPuzzleInput("3-2");
  const hitsByCoordMap = getHitsByCoordinateMap(inputData);
  inputLoop: for (let i = 0; i < inputData.length; i++) {
    const [id, left, top, width, height] = extractIdAndCoordinates(
      inputData[i],
    );
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        if (hitsByCoordMap[`${x},${y}`] > 1) continue inputLoop;
      }
    }
    return id;
  }
}
