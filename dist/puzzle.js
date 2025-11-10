// simple seeded RNG (mulberry32)
function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function hasDuplicates(nums) {
    return new Set(nums).size !== nums.length;
}
// pick 2 clue cells so that no row/col has more than 1 clue
function pickClues(rand) {
    const allCells = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            allCells.push({ r, c });
        }
    }
    const shuffled = shuffle(allCells, rand);
    const chosen = [];
    const usedRows = new Set();
    const usedCols = new Set();
    for (const cell of shuffled) {
        if (chosen.length === 2)
            break;
        if (usedRows.has(cell.r))
            continue;
        if (usedCols.has(cell.c))
            continue;
        chosen.push(cell);
        usedRows.add(cell.r);
        usedCols.add(cell.c);
    }
    // super edge case: somehow didn't get 2 (very unlikely) → just take first two
    if (chosen.length < 2) {
        chosen.push(...shuffled.slice(chosen.length, 2));
    }
    return chosen;
}
/**
 * Generate a 3x3 Sumset puzzle from a seed string.
 * Ensures all row sums and all col sums are distinct.
 */
export function generatePuzzleFromSeed(seed) {
    const rand = mulberry32(seed);
    let solution;
    let rowSums;
    let colSums;
    // keep trying until row sums and col sums are all different
    // with 9! space this will succeed quickly
    while (true) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rand);
        solution = [
            nums.slice(0, 3),
            nums.slice(3, 6),
            nums.slice(6, 9),
        ];
        rowSums = solution.map((row) => row[0] + row[1] + row[2]);
        colSums = [0, 1, 2].map((c) => solution[0][c] + solution[1][c] + solution[2][c]);
        if (!hasDuplicates(rowSums) && !hasDuplicates(colSums)) {
            break;
        }
    }
    const clues = pickClues(rand);
    return {
        rowSums,
        colSums,
        solution,
        clues,
    };
}
