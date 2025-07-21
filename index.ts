import * as readline from "node:readline";
import { parse, format, addDays } from "date-fns";
import { holidaySet } from "./holidays.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const startDateStr = await prompt(
    "Enter the starting date in MM-DD-YYYY format (default = today): ",
  );

  const dateObject = startDateStr
    ? parse(startDateStr, "MM-dd-yyyy", new Date())
    : new Date();

  const addDaysStr = await prompt(
    "Enter the numbers of days to add, separated by spaces or commas: ",
  );
  const daysToAddArray: number[] = addDaysStr
    .split(/[\\s,]+/)
    .map((str) => parseInt(str.trim()))
    .filter((num) => !isNaN(num));

  const newDates = calculateCalendarDays(dateObject, daysToAddArray);
  console.log("The new dates based on differentials are:");
  console.log(newDates); // Assuming calculateCalendarDays returns an array or string representation

  console.log("The new dates are:");
  newDates.forEach((date) => {
    console.log(format(date, "EEEE, MMMM d, yyyy"));
  });

  rl.close();
}

function isCourtDay(date: Date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  // Use local date string to avoid timezone issues
  const iso =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");
  return day !== 0 && day !== 6 && !holidaySet.has(iso);
}

// Adjust to previous valid court day
function adjustBackwardToCourtDay(date: Date) {
  while (!isCourtDay(date)) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}

// Adjust to next valid court day
function adjustForwardToCourtDay(date: Date) {
  while (!isCourtDay(date)) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function calculateCalendarDays(
  startingDate: Date,
  dateDifferentials: Array<number>,
) {
  const newDates = dateDifferentials.map((days) => {
    let newDate = new Date(startingDate);
    if (days > 0) {
      newDate.setDate(newDate.getDate() + days);
      newDate = adjustForwardToCourtDay(newDate);
    } else {
      newDate.setDate(newDate.getDate() - days);
      newDate = adjustBackwardToCourtDay(newDate);
    }
    return newDate;
  });
  return newDates;
}

main();
