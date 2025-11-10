const STATS_KEY: string = "STATS";

export type Stats = {
  seed: number,
  seconds: number,
  mistakes: number,
  won: boolean,
  streak: number,
};

export function currentStats(): Stats {
  const stats: Stats = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
  return stats;
}

export function storeStats(seed: number, seconds: number, mistakes: number, won: boolean) {
  const prevStats = currentStats();
  
  const newStats: Stats = {
    seed,
    seconds,
    mistakes,
    won,
    streak: 1,
  };
  
  // update streak if consecutive daily puzzles were completed
  if (seed - prevStats.seed == 1) {
    newStats.streak = prevStats.streak + 1;
  }
  
  // store stats for today
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
}
