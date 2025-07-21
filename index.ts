import * as readline from "node:readline";
import { parse, format, addDays, isWeekend, startOfDay } from "date-fns";
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
    ? startOfDay(parse(startDateStr, "MM-dd-yyyy", new Date()))
    : startOfDay(new Date());

  const addDaysStr = await prompt(
    "Enter the numbers of days to add, separated by spaces or commas: ",
  );
  const daysToAddArray: number[] = addDaysStr
    .split(/[\s,]+/)
    .map((str) => parseInt(str.trim()))
    .filter((num) => !isNaN(num));

  const newDates = calculateCalendarDays(dateObject, daysToAddArray);

  console.log("The new dates are:");
  newDates.forEach((date) => {
    console.log(format(date, "EEEE, MMMM d, yyyy"));
  });

  rl.close();
}

function isCourtDay(date: Date) {
  // Check if it's a weekend using date-fns
  if (isWeekend(date)) {
    return false;
  }

  // Use date-fns format to create ISO string
  const iso = format(date, "yyyy-MM-dd");
  return !holidaySet.has(iso);
}

// Adjust to previous valid court day
function adjustBackwardToCourtDay(date: Date) {
  let adjustedDate = date;
  while (!isCourtDay(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, -1);
  }
  return adjustedDate;
}

// Adjust to next valid court day
function adjustForwardToCourtDay(date: Date) {
  let adjustedDate = date;
  while (!isCourtDay(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, 1);
  }
  return adjustedDate;
}

function calculateCalendarDays(
  startingDate: Date,
  dateDifferentials: Array<number>,
) {
  const newDates = dateDifferentials.map((days) => {
    // Use date-fns addDays instead of native Date methods
    const newDate = addDays(startingDate, days);

    if (days > 0) {
      return adjustForwardToCourtDay(newDate);
    } else {
      return adjustBackwardToCourtDay(newDate);
    }
  });
  return newDates;
}

main();
