import fetch from "../include/fetch.js";
import readline from "readline";

// TODO - Now its your turn to make the working example! :)

/* Our example prompts the user to enter the date 
   Using that date we fetch the NHL standings for that date and the schedule for that date
   We then tally up all the goals scored and all the games played in the league and divide to get the rate of goals scored per team per game
   We also then find today's date and we get the number of games being played today
   Using these two pieces of data we can calculate how many goals we can expect to be scored today 
*/

const userInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// API endpoints without today's date
let standingsBase = "https://api-web.nhle.com/v1/standings/";
let scheduleBase = "https://api-web.nhle.com/v1/schedule/";

export function fetchGoalsScoredRate(url: URL): Promise<{ rate: number }> {
  return fetch(url)
    .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
    .then(data => {
      const goals = data.standings.reduce((acc: number, team: { goalFor: number }) => (acc += team.goalFor), 0); // accumulate the total amount of goals scored
      const gamesPlayed = data.standings.reduce((acc: number, team: { gamesPlayed: number }) => (acc += team.gamesPlayed), 0); // accumulate the amount of games played
      return { rate: goals / gamesPlayed }; // calculate the rate goals are being scored at per team
    })
    .catch(e => {
      return Promise.reject(new Error("Error fetching or processing data: Make sure date is valid"));
    });
}

export function fetchGamesToday(url: URL, today: string): Promise<{ todayGames: number }> {
  return fetch(url)
    .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
    .then(data => {
      const tG = data.gameWeek.find((d: { date: string }) => d.date === today); // find todays date in the game week and check if it is todays date (given by user)
      return { todayGames: tG.numberOfGames }; // get the number of games being played today
    })
    .catch(e => {
      return Promise.reject(new Error("Error fetching or processing data: Make sure date is valid"));
    });
}

userInput.question("Enter todays date (YYYY-MM-DD): ", (date: string) => {
  // prompt the user to enter todays date
  if (date.length != 10) throw new Error("Invalid format: make sure you include hyphens and a digit in every spot"); //make sure user input is correct

  // append the date to the API endpoints and make a URL with them
  standingsBase += date;
  scheduleBase += date;
  const standingsUrl = new URL(standingsBase);
  const scheduleUrl = new URL(scheduleBase);

  // use Promise.all to resolve multiple fetches and store the resolved values in an object so we can access the values to calculate our expected
  Promise.all([fetchGoalsScoredRate(standingsUrl), fetchGamesToday(scheduleUrl, date)])
    .then(([goalRate, gamesToday]) => {
      console.log(`The rate goals are being scored per team is ${goalRate.rate}`);
      console.log(`There are ${gamesToday.todayGames} games being played today`);
      const expected = goalRate.rate * 2 * gamesToday.todayGames; // calculate expected goals (2 teams per game so we multiply rate by 2 and then that by the total games being played)
      console.log(`You can expect ${expected} goals to be scored`);
    })
    .catch(err => {
      console.error("Error occurred:", err);
    });
  userInput.close();
});
