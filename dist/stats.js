const STATS_KEY = "STATS";
export function currentStats() {
    const stats = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
    return stats;
}
export function storeStats(seed, seconds, mistakes, won) {
    const prevStats = currentStats();
    const newStats = {
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
