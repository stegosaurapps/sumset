import { dailyGame } from "./game.js";
import { dailyPuzzleNumber } from "./seed.js";
const game = dailyGame();
// ---------------- VIEW ----------------
function showView(phase) {
    game.phase = phase;
    document.getElementById("start-view").hidden = phase !== "start";
    document.getElementById("game-view").hidden = phase !== "playing";
    document.getElementById("summary-view").hidden = phase !== "summary";
}
// ---------------- TIMER ----------------
function startTimer() {
    if (game.timerId !== null)
        return;
    game.timerId = window.setInterval(() => {
        if (game.solved)
            return;
        game.seconds++;
        renderTimer();
    }, 1000);
}
function stopTimer() {
    game.solved = true;
    if (game.timerId !== null) {
        window.clearInterval(game.timerId);
        game.timerId = null;
    }
}
function renderTimer() {
    const el = document.getElementById("timer");
    if (!el)
        return;
    const m = Math.floor(game.seconds / 60);
    const s = game.seconds % 60;
    el.textContent = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
// ---------------- BOARD ----------------
function initBoard() {
    // row sums
    game.puzzle.rowSums.forEach((sum, r) => {
        const el = document.getElementById(`row-sum-${r}`);
        if (el)
            el.textContent = String(sum);
    });
    // col sums
    game.puzzle.colSums.forEach((sum, c) => {
        const el = document.getElementById(`col-sum-${c}`);
        if (el)
            el.textContent = String(sum);
    });
    // cells
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const el = document.getElementById(`cell-${r}-${c}`);
            el.textContent = "";
            el.classList.remove("given");
            el.onclick = () => selectCell(r, c);
        }
    }
    // clues
    game.puzzle.clues.forEach(({ r, c }) => {
        const el = document.getElementById(`cell-${r}-${c}`);
        el.textContent = String(game.puzzle.solution[r][c]);
        el.classList.add("given");
    });
    renderNumberPad();
    renderMistakes();
}
function selectCell(r, c) {
    const el = document.getElementById(`cell-${r}-${c}`);
    if (el.classList.contains("given")) {
        return;
    }
    ;
    document.querySelectorAll(".cell.selected").forEach((node) => node.classList.remove("selected"));
    el.classList.add("selected");
    game.selected = { r, c };
}
function getUsedDigits() {
    var _a;
    const used = new Set();
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const el = document.getElementById(`cell-${r}-${c}`);
            const txt = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (txt) {
                const num = Number(txt);
                if (!Number.isNaN(num))
                    used.add(num);
            }
        }
    }
    return used;
}
function renderPuzzleNumber() {
    const seed = dailyPuzzleNumber();
    const puzzleTitles = document.getElementsByClassName("puzzle-number");
    for (const puzzleTitle of puzzleTitles) {
        puzzleTitle.textContent = `Puzzle #${seed}`;
    }
}
function renderNumberPad() {
    const pad = document.getElementById("number-pad");
    pad.innerHTML = "";
    const used = getUsedDigits();
    for (let n = 1; n <= 9; n++) {
        const btn = document.createElement("button");
        btn.textContent = String(n);
        if (used.has(n)) {
            btn.classList.add("disabled");
        }
        else {
            btn.onclick = () => placeNumber(n);
        }
        pad.appendChild(btn);
    }
}
function renderMistakes() {
    const cont = document.getElementById("mistakes");
    if (!cont) {
        return;
    }
    ;
    cont.innerHTML = "";
    for (let i = 0; i < game.mistakes && i < 3; i++) {
        const span = document.createElement("span");
        span.textContent = "✖";
        span.className = "mistake-x";
        cont.appendChild(span);
    }
}
// ---------------- FEEDBACK ----------------
function flashWrongCell(r, c) {
    game.mistakes++;
    renderMistakes();
    const el = document.getElementById(`cell-${r}-${c}`);
    el.classList.add("flash-wrong");
    setTimeout(() => el.classList.remove("flash-wrong"), 250);
    if (game.mistakes >= 3) {
        finishGame(false);
    }
}
function flashCorrectCell(r, c) {
    const el = document.getElementById(`cell-${r}-${c}`);
    el.classList.add("flash-correct");
    setTimeout(() => el.classList.remove("flash-correct"), 250);
}
// ---------------- PLACE NUMBER ----------------
function placeNumber(n) {
    if ((game.phase !== "playing") || (!game.selected)) {
        return;
    }
    ;
    const { r, c } = game.selected;
    const correct = game.puzzle.solution[r][c];
    if (n === correct) {
        const el = document.getElementById(`cell-${r}-${c}`);
        el.textContent = String(n);
        el.classList.remove("selected");
        game.selected = null;
        flashCorrectCell(r, c);
        renderNumberPad();
        if (isSolved()) {
            finishGame(true);
        }
    }
    else {
        flashWrongCell(r, c);
    }
}
function isSolved() {
    var _a;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const el = document.getElementById(`cell-${r}-${c}`);
            const txt = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            const val = txt ? Number(txt) : null;
            if (val !== game.puzzle.solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}
// ---------------- SUMMARY / SHARE ----------------
function finishGame(won) {
    stopTimer();
    game.finshGame(won);
    document.getElementById("summary-stats").textContent = game.summary();
    showView("summary");
}
function setupHelpPopover() {
    const helpBtn = document.getElementById("help-btn");
    const popover = document.getElementById("help-popover");
    if (!helpBtn || !popover)
        return;
    const toggle = (show) => {
        if (typeof show === "boolean")
            popover.hidden = !show;
        else
            popover.hidden = !popover.hidden;
    };
    helpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
    });
    helpBtn.addEventListener("mouseenter", () => toggle(true));
    helpBtn.addEventListener("mouseleave", (e) => {
        const to = e.relatedTarget || null;
        if (to && popover.contains(to))
            return;
        toggle(false);
    });
    popover.addEventListener("mouseleave", () => toggle(false));
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!helpBtn.contains(target) && !popover.contains(target))
            toggle(false);
    });
}
async function copySummaryToClipboard() {
    var _a, _b;
    const text = (_b = (_a = document.getElementById("summary-stats")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "";
    const finalText = `🧩 Sumset Daily — ${text}`;
    try {
        await navigator.clipboard.writeText(finalText);
        alert("Copied to clipboard!");
    }
    catch (_c) {
        // fallback for non-secure origins
        const ta = document.createElement("textarea");
        ta.value = finalText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
    }
}
// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b;
    renderPuzzleNumber();
    if (game.doneToday()) {
        document.getElementById("summary-stats").textContent = game.summary();
        showView("summary");
    }
    else {
        showView("start");
    }
    // start button
    (_a = document.getElementById("start-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        showView("playing");
        initBoard();
        renderTimer();
        startTimer();
        setupHelpPopover();
        const status = document.getElementById("status-text");
        if (status)
            status.textContent = "";
    });
    // share
    (_b = document.getElementById("share-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        void copySummaryToClipboard();
    });
});
