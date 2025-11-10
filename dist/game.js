import { generatePuzzleFromSeed } from "./puzzle.js";
import { dailyPuzzleNumber } from "./seed.js";
import { currentStats, storeStats } from "./stats.js";
export function dailyGame() {
    const seed = dailyPuzzleNumber();
    const puzzle = generatePuzzleFromSeed(seed);
    return {
        puzzle,
        phase: "playing",
        seed,
        timerId: null,
        selected: null,
        seconds: 0,
        mistakes: 0,
        solved: false,
        doneToday: function () {
            const stats = currentStats();
            console.log("stats: ");
            console.log(stats);
            // stats are only stored after the puzzle has been won or lost
            return this.seed == stats.seed;
        },
        finshGame(won) {
            storeStats(this.seed, this.seconds, this.mistakes, won);
        },
        summary() {
            const stats = currentStats();
            let summary;
            let outcome;
            if (stats.won) {
                outcome = "solved";
            }
            else {
                outcome = "failed";
            }
            summary = `Puzzle #${stats.seed} ${outcome} in ${secondsToDisplay(stats.seconds)} with ${stats.mistakes} incorrect guess${stats.mistakes === 1 ? "" : "es"}. Current streak ${stats.streak}`;
            return summary;
        }
    };
}
function secondsToDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    return `${minutes}:${seconds}`;
}
