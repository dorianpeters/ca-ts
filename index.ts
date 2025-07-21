import * as readline from 'node:readline';
import { parse, format, addDays } from 'date-fns';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const startDateStr = await prompt(
    'Enter the starting date in MM-DD-YYYY format - default = today: '
  );

  const dateObject = startDateStr
    ? parse(startDateStr, 'MM-dd-yyyy', new Date())
    : new Date();

  const addDaysStr = await prompt('Enter the number of days to add: ');
  const daysToAdd = parseInt(addDaysStr, 10);

  const newDate = addDays(dateObject, daysToAdd);

  console.log('The new date is:');
  console.log(format(newDate, 'yyyy-MM-dd'));

  rl.close();
}

main();
