const EPOCH: number = 20401;

export function dailyPuzzleNumber(): number {
  const millisecondsSinceEpoch = Date.now();
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  
  return Math.floor(millisecondsSinceEpoch / millisecondsInADay) - EPOCH;
}
