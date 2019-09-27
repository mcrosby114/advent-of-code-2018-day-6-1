import { fetchPuzzleInput } from "../api";

const testData = ` 337, 150
 198, 248
 335, 161
 111, 138
 109, 48
 261, 155
 245, 130
 346, 43
 355, 59
 53, 309
 59, 189
 325, 197
 93, 84
 194, 315
 71, 241
 193, 81
 166, 187
 208, 95
 45, 147
 318, 222
 338, 354
 293, 242
 240, 105
 284, 62
 46, 103
 59, 259
 279, 205
 57, 102
 77, 72
 227, 194
 284, 279
 300, 45
 168, 42
 302, 99
 338, 148
 300, 316
 296, 229
 293, 359
 175, 208
 86, 147
 91, 261
 188, 155
 257, 292
 268, 215
 257, 288
 165, 333
 131, 322
 264, 313
 236, 130
 98, 60`
  .split("\n")
  .map(str => str.trim());

// Correct answer for this test dataset: 4284
function solve6p1Test() {
  const points = testData.map(str => str.split(", ").map(Number));
  console.log(points);
  const xCoords = points.map(([x]) => x);
  const yCoords = points.map(([, y]) => y);
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);
  const diffX = maxX - minX;
  const diffY = maxY - minY;

  // We track the points that have an infinite area here.
  const infinitePoints = new Set();

  // Return the nearest points of a given set of coordinates
  function getNearest(x, y) {
    const distances = points.map(p => Math.abs(p[0] - x) + Math.abs(p[1] - y));
    const minDistance = Math.min(...distances);
    return points.filter((_, i) => distances[i] === minDistance);
  }

  /**
   * If a point is the nearest from some safe distance from the area that
   * includes all the points, then that point has an infinite area.
   */
  for (let x = minX - diffX; x <= maxX + diffX; x++) {
    for (const point of getNearest(x, minY - diffY)) infinitePoints.add(point);
    for (const point of getNearest(x, maxY + diffY)) infinitePoints.add(point);
  }
  for (let y = minY - diffY; y <= maxY + diffY; y++) {
    for (const point of getNearest(minX - diffX, y)) infinitePoints.add(point);
    for (const point of getNearest(maxX + diffX, y)) infinitePoints.add(point);
  }

  const areas = new Array(points.length);

  /**
   * Then we start counting the areas. It's basically brute force, but whatever.
   * I could advise a more mathematical approach, that this is enough.
   */
  for (let x = minX - diffX; x <= maxX + diffX; x++)
    for (let y = minY - diffY; y <= maxY + diffY; y++) {
      const nearest = getNearest(x, y);
      if (nearest.length > 1) continue;
      const [point] = nearest;
      if (infinitePoints.has(point)) continue;
      const index = points.indexOf(point);
      areas[index] = (areas[index] || 0) + 1;
    }

  return Math.max(...areas.filter(Boolean));
}

/**
 * Day 6, part 1: Using only the Manhattan distance, determine the area around
 * each coordinate by counting the number of integer X,Y locations that are
 * closest to that coordinate (and aren't tied in distance to any other coordinate).
 * Your goal is to find the size of the largest area that isn't infinite.
 * (https://adventofcode.com/2018/day/6)
 * API inputs: list of string X,Y Cartesian coordinates
 * @returns {number} - size of the largest area that isn't infinite
 */
export async function solve6p1() {
  // const inputData = await fetchPuzzleInput("6-1");

  // const inputData = ["1, 1", "1, 6", "8, 3", "3, 4", "5, 5", "8, 9"];

  return solve6p1Test();

  const inputData = testData;

  const numRegex = /(\d+)/g;
  let minX = Number.MAX_SAFE_INTEGER,
    maxX = Number.MIN_SAFE_INTEGER,
    minY = Number.MAX_SAFE_INTEGER,
    maxY = Number.MIN_SAFE_INTEGER;
  const coords = {};
  inputData.forEach(input => {
    const [x, y] = input.match(numRegex).map(Number);
    coords[input] = { x, y, numClosest: 0 };
    if (x < minX) minX = x;
    else if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    else if (y > maxY) maxY = y;
  });

  const diffX = maxX - minX;
  const diffY = maxY - minY;

  // (minX = 0), (maxX = 999), (minY = 0), (maxY = 999);

  console.log("total coords: ", inputData.length);

  const manhattanDistance = (x1, y1, x2, y2) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2);

  const entries = Object.entries(coords);
  for (let x = minX - diffX; x <= maxX + diffX; x++) {
    for (let y = minY - diffY; y <= maxY + diffY; y++) {
      let proximities = {};
      let minDistance = Number.MAX_SAFE_INTEGER;
      for (let e = 0; e < entries.length; e++) {
        let distance = manhattanDistance(
          x,
          y,
          entries[e][1].x,
          entries[e][1].y,
        );
        proximities[distance] = [
          ...(proximities[distance]
            ? [...proximities[distance], entries[e][0]]
            : [entries[e][0]]),
        ];
        if (distance < minDistance) minDistance = distance;
      }
      // If we found a non-unique min distance, it's a tie, so don't count it
      if (proximities[minDistance].length !== 1) {
        continue;
      }
      coords[proximities[minDistance][0]].numClosest++;
    }
  }

  const largestAreaSize = Object.values(coords).reduce((size, coord) => {
    console.log(coord);
    if (
      coord.x <= minX ||
      coord.x >= maxX ||
      coord.y <= minY ||
      coord.y >= maxY
    ) {
      console.log("infinite coord, skipping.....");
      return size;
    }
    if (coord.numClosest > size) size = coord.numClosest;
    return size;
  }, 0);

  console.log("largestAreaSize: ", largestAreaSize);

  const totalCoordsInGrid = (maxX - minX + 1) * (maxY - minY + 1);
  console.log("total coords in grid: ", totalCoordsInGrid);

  const numClosestTotalForAll = Object.values(coords).reduce((size, coord) => {
    return size + coord.numClosest;
  }, 0);

  console.log("num closest total for all: ", numClosestTotalForAll);

  const nonInfiniteCoords = [];

  inputData.forEach(input => {
    const { x, y } = coords[input];
    if (x > minX && x < maxX && y > minY && y < maxY) {
      nonInfiniteCoords.push(input);
    }
  });

  console.log("nonInfiniteCoords: ", nonInfiniteCoords);
  console.log("total non-infinite coords: ", nonInfiniteCoords.length);

  console.log("coords map: ", coords);
  console.log("minX: ", minX);
  console.log("maxX: ", maxX);
  console.log("minY: ", minY);
  console.log("maxY: ", maxY);

  return largestAreaSize;
}

/**
 * Day 6, part 2:
 * (https://adventofcode.com/2018/day/6)
 * API inputs:
 * @returns {*}
 */
export async function solve6p2() {
  const inputData = await fetchPuzzleInput("6-2");
}
