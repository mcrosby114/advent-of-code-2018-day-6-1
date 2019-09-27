import { fetchPuzzleInput } from "../api";

/**
 * Day 4, part 1: One guard is on duty per night after midnight. The guard falls asleep and wakes up
 * between 12am and 1am. Given an unordered list of timestamps (year-month-day hour:minute format),
 * some of which have guard ids, figure out the guard most likely to be asleep at a specific time.
 * (1) Find the guard that has the most minutes asleep. What minute does that guard spend asleep the
 * most? (2) What is the ID of the guard you chose multiplied by the minute you chose?
 * (https://adventofcode.com/2018/day/4)
 * API inputs: array of strings - unordered list of timestamps (year-month-day hour:minute format)
 * @returns {number} - id of guard with most minutes asleep multiplied by his most frequent minute asleep
 */
export async function solve4p1() {
  const inputData = await fetchPuzzleInput("4-1");
  const sortedTimestamps = inputData.sort();
  const guardMap = {};
  const idRegex = /#(\d+)/;
  const minuteRegex = /\d\d:(\d\d)/;
  let currentId, sleepMinute, wakeMinute, idWithMostMins;
  // Build the map, keyed by guard id, each having total mins and list of intervals
  for (const timestamp of sortedTimestamps) {
    if (idRegex.test(timestamp)) {
      [currentId] = idRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
    } else if (timestamp.includes("falls asleep")) {
      [sleepMinute] = minuteRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
    } else if (timestamp.includes("wakes up")) {
      [wakeMinute] = minuteRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
      const entry = guardMap[currentId];
      guardMap[currentId] = {
        totalMins:
          ((entry && entry.totalMins) || 0) + (wakeMinute - sleepMinute),
        intervals: [
          ...((entry && entry.intervals) || []),
          { sleepMinute, wakeMinute },
        ],
      };
      // Update the id with the most minutes
      const maxMinsSoFar =
        (guardMap[idWithMostMins] && guardMap[idWithMostMins].totalMins) || 0;
      idWithMostMins =
        guardMap[currentId].totalMins > maxMinsSoFar
          ? currentId
          : idWithMostMins;
    }
  }
  // Got the id of the guard sleeping the most. Now what minute does he sleep most of all?
  const minuteMap = {};
  for (const { sleepMinute, wakeMinute } of guardMap[idWithMostMins]
    .intervals) {
    for (let m = sleepMinute; m < wakeMinute; m++) {
      minuteMap[m] = ++minuteMap[m] || 1;
    }
  }
  const mostFrequentMinute = Object.entries(minuteMap).reduce(
    (topMin, [min, frequency]) => {
      return frequency > minuteMap[topMin] ? min : topMin;
    },
    0,
  );
  // The answer: (id of guard asleep the most minutes) * (minute he's asleep most often)
  return idWithMostMins * mostFrequentMinute;
}

/**
 * Day 4, part 2: Of all guards, which guard is most frequently asleep on the same minute?
 * (https://adventofcode.com/2018/day/4)
 * API inputs: array of strings - unordered list of timestamps (year-month-day hour:minute format)
 * @returns {number} - the ID of the guard multiplied by the most frequent minute
 */
export async function solve4p2() {
  const inputData = await fetchPuzzleInput("4-2");
  const sortedTimestamps = inputData.sort();
  const guardMap = {};
  const idRegex = /#(\d+)/;
  const minuteRegex = /\d\d:(\d\d)/;
  let currentId,
    sleepMinute,
    wakeMinute,
    maxMinRecord = {
      id: 0,
      min: 0,
      frequency: 0,
    };
  // Build the map, keyed by guard id
  for (const timestamp of sortedTimestamps) {
    if (idRegex.test(timestamp)) {
      [currentId] = idRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
    } else if (timestamp.includes("falls asleep")) {
      [sleepMinute] = minuteRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
    } else if (timestamp.includes("wakes up")) {
      [wakeMinute] = minuteRegex
        .exec(timestamp)
        .slice(1)
        .map(Number);
      // Make sure we have a key for this id
      guardMap[currentId] = { ...(guardMap[currentId] || {}) };
      // Keep a count for every minute this guard is awake
      for (let m = sleepMinute; m < wakeMinute; m++) {
        guardMap[currentId][m] = ++guardMap[currentId][m] || 1;
        // Update record if this guard's minute frequency exceeds the max so far
        if (guardMap[currentId][m] > maxMinRecord.frequency) {
          maxMinRecord = {
            id: currentId,
            min: m,
            frequency: guardMap[currentId][m],
          };
        }
      }
    }
  }
  return maxMinRecord.id * maxMinRecord.min;
}
