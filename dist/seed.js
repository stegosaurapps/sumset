const EPOCH = 20401;
export function dailyPuzzleNumber() {
    const millisecondsSinceEpoch = Date.now();
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    return Math.floor(millisecondsSinceEpoch / millisecondsInADay) - EPOCH;
}
