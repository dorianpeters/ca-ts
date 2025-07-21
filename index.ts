import * as readline from 'node:readline';
import { parse, format, addDays } from 'date-fns';
import { holidaySet } from './holidays.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const startDateStr = await prompt(
    'Enter the starting date in MM-DD-YYYY format (default = today): '
  );

  const dateObject = startDateStr
    ? parse(startDateStr, 'MM-dd-yyyy', new Date())
    : new Date();

  const addDaysStr = await prompt('Enter the number of days to add: ');
  const daysToAdd = parseInt(addDaysStr);

  const newDate = addDays(dateObject, daysToAdd);

  console.log('The new date is:');
  console.log(format(newDate, 'EEEE, MMMM d, yyyy'));

  rl.close();
}


function isCourtDay(date: Date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  // Use local date string to avoid timezone issues
  const iso = date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
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

function calculateCalendarDays (startingDate: Date, dateDifferentials: Array<Number>){

}

main();
