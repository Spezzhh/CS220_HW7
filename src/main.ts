import fetch from "../include/fetch.js";
import readline from "readline";

// TODO - Now its your turn to make the working example! :)

/* Our example asks the user for how many goals they want to filter NHL teams by
   Then we make a fetch call to the nhl standings API on the given day (11-21)
   We then filter our result to get two sets of data, 1) total teams in the league that have scored more than given amount
   2) How many of those teams play in the Eastern conference
   Then we output the user the two sets of data
*/

const userInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const url = new URL("https://api-web.nhle.com/v1/standings/2023-11-21");

export function fetchGoalsScored(gs: number, url: URL): Promise<{ totalGs: number; totalInConf: number }> {
    return fetch(url)
        .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
        .then(data => {
            const goals = data.standings.filter((team: { goalFor: number }) => team.goalFor >= gs); //get the first set of data: total teams in the league that have scored more than given amount
            const conf = data.standings.filter(
                (team: { goalFor: number; conferenceAbbrev: string }) => team.goalFor >= gs && team.conferenceAbbrev === "E"
            ); //get the second set of data: How many of those teams play in the Eastern conference
            return { totalGs: goals.length, totalInConf: conf.length };
        })
        .catch(e => {
            return Promise.reject(new Error("Error fetching or processing data"));
        });
}

userInput.question("How many goals do you want to filter the teams by: ", answer => {
    // prompt the user to enter how many goals they want to filter by
    const gs = Number(answer);
    if (Number.isNaN(gs) || gs < 0) throw new Error("Invalid input");
    fetchGoalsScored(gs, url).then(result =>
        console.log(
            "The amount of teams that have scored more than",
            gs,
            "goals are",
            result.totalGs,
            "and ",
            result.totalInConf,
            "are in the Eastern Conference"
        )
    );
    userInput.close();
});
