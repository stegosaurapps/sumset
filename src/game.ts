import { CellPos, Puzzle, generatePuzzleFromSeed } from "./puzzle.js";
import { dailyPuzzleNumber } from "./seed.js";
import { Stats, currentStats, storeStats } from "./stats.js"

export type Phase = "start" | "playing" | "summary";

export type Game = {
  puzzle: Puzzle;
  phase: Phase;
  seed: number,
  timerId: number | null;
  selected: CellPos | null;
  seconds: number;
  mistakes: number;
  solved: boolean;
  finshGame(won: boolean): void;
  doneToday(): boolean;
  summary(): string;
};

export function dailyGame(): Game {
  const seed: number = dailyPuzzleNumber();
  const puzzle: Puzzle = generatePuzzleFromSeed(seed);

  return {
    puzzle,
    phase: "playing",
    seed,
    timerId: null,
    selected: null,
    seconds: 0,
    mistakes: 0,
    solved: false,
    doneToday: function(): boolean {
      const stats: Stats = currentStats();
      
      // stats are only stored after the puzzle has been won or lost
      return this.seed == stats.seed;
    },
    finshGame(won: boolean): void {
      storeStats(this.seed, this.seconds, this.mistakes, won);
    },
    summary(): string {
      const stats: Stats = currentStats();
      
      let summary: string;
      let outcome: string; 
      if (stats.won) {
        outcome = "solved";
      } else {
        outcome = "failed";
      }

      summary = `Puzzle #${stats.seed} ${outcome} in ${secondsToDisplay(stats.seconds)} with ${stats.mistakes} incorrect guess${ stats.mistakes === 1 ? "" : "es"}. Current streak ${stats.streak}`;

      return summary;
    }
  }
}

function secondsToDisplay(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return `${minutes}:${seconds}`;
}
