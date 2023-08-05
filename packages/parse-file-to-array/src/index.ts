import { readFile } from "node:fs/promises";

/**
 * Reads lines of a text file.
 *
 * @param filePath is the path of the file.
 * @returns an array containing each line of the file.
 */
async function readFileLines(filePath: string): Promise<string[]> {
  const fileContent = await readFile(filePath, "utf8");

  // Split lines considering many operating systems' end of line character.
  const eolRegex = /\r\n|\n|\r/;
  const lines = fileContent.split(eolRegex);

  // Remove last line if it is empty.
  if (lines.at(-1) === "") lines.pop(); // ES 2022 feature

  return lines;
}

/**
 * Parses CSV data
 *
 * @param lines are an array of CSV data.
 * @param separator is the character used to separate the data.
 * @returns array of lines having each field as a value in an array.
 */
function parseCSV(lines: string[], separator = ";"): string[][] {
  return lines.map((line) => line.split(separator));
}

/**
 * Given the titles array and a data array, creates an object with keys from titles and given values.
 *
 * @param titles are the titles of the array values.
 * @param values are the value.
 * @returns object with titles and values.
 *
 * @example
 * const object = getRecordWithTitles(["id", "name"], ["1", "pencil"]); // { id: 1, name: "pencil" }
 */
function getRecordWithTitles(titles: string[], values: string[]): Record<string, string> {
  return Object.fromEntries(titles.map((title, index) => [title, values[index]]));
}

/**
 * Parses CSV data containing titles in the first element of the array.
 *
 * @param lines are an array of CSV data.
 * @param separator is the character used to separate the data.
 * @returns array of lines having each field as a value in an array.
 */
function parseCSVWithTitles(lines: string[], separator = ";"): Record<string, string>[] {
  const valueLines = parseCSV(lines, separator);
  const titles = valueLines.shift() ?? [];
  return valueLines.map((valueLine) => getRecordWithTitles(titles, valueLine));
}

const txtLines = await readFileLines("items.txt");
const csvLines = await readFileLines("items.csv");
const csvLinesWithTitles = await readFileLines("items-with-titles.csv");

console.info(txtLines);
console.info(parseCSV(csvLines));
console.info(parseCSVWithTitles(csvLinesWithTitles));
