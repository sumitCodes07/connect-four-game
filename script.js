// ==============================
// CONNECT FOUR PRO - PART 3A
// ==============================

// Board Configuration
const ROWS = 6;
const COLS = 7;

// Game Variables
let board = [];
let currentPlayer = "red";
let gameOver = false;
let moveCount = 0;
let timer = 30;
let timerInterval = null;

// Scores
let score = {
    red: 0,
    yellow: 0
};

// Move History (for Undo)
let history = [];

// DOM Elements
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const moveCounter = document.getElementById("moveCount");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const timeElement = document.getElementById("time");

// ==============================
// CREATE BOARD
// ==============================

function createBoard() {

    board = [];
    boardElement.innerHTML = "";

    for (let r = 0; r < ROWS; r++) {

        board[r] = [];

        for (let c = 0; c < COLS; c++) {

            board[r][c] = "";

            const cell = document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", () => {
                dropDisc(c);
            });

            boardElement.appendChild(cell);
        }
    }

    currentPlayer = "red";
    gameOver = false;
    moveCount = 0;

    moveCounter.innerText = moveCount;

    statusElement.innerText = "Player 1 (Red)'s Turn";

    startTimer();
}

// ==============================
// UPDATE BOARD
// ==============================

function updateBoard() {

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {

        const row = cell.dataset.row;
        const col = cell.dataset.col;

        cell.classList.remove("red");
        cell.classList.remove("yellow");

        if (board[row][col] !== "") {

            cell.classList.add(board[row][col]);

        }

    });

}

// ==============================
// DROP DISC
// ==============================

function dropDisc(col) {

    if (gameOver) return;

    for (let row = ROWS - 1; row >= 0; row--) {

        if (board[row][col] === "") {

            history.push({
                row,
                col,
                player: currentPlayer
            });

            board[row][col] = currentPlayer;

            moveCount++;

            moveCounter.innerText = moveCount;

            updateBoard();

            // Winner Check
            if (checkWinner(row, col)) {

                endGame();

                return;

            }

            // Draw Check
            if (moveCount === ROWS * COLS) {

                statusElement.innerText = "Match Draw!";

                gameOver = true;

                clearInterval(timerInterval);

                return;

            }

            // Change Player
            currentPlayer =
                currentPlayer === "red"
                ? "yellow"
                : "red";

            statusElement.innerText =
                currentPlayer === "red"
                ? "Player 1 (Red)'s Turn"
                : "Player 2 (Yellow)'s Turn";

            resetTimer();

            return;
        }
    }

}

// ==============================
// PLAYER TIMER
// ==============================

function startTimer() {

    timer = 30;

    timeElement.innerText = timer;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timer--;

        timeElement.innerText = timer;

        if (timer <= 0) {

            clearInterval(timerInterval);

            currentPlayer =
                currentPlayer === "red"
                ? "yellow"
                : "red";

            statusElement.innerText =
                currentPlayer === "red"
                ? "Player 1 (Red)'s Turn"
                : "Player 2 (Yellow)'s Turn";

            startTimer();

        }

    }, 1000);

}

function resetTimer() {

    startTimer();

}

// ==============================
// START GAME
// ==============================

createBoard();
// ==============================
// CONNECT FOUR PRO - PART 3B
// Win Detection & Game Controls
// ==============================

// Count connected discs in one direction
function countDirection(row, col, dr, dc) {

    const color = board[row][col];

    let count = 0;

    let r = row + dr;
    let c = col + dc;

    while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === color
    ) {

        count++;

        r += dr;
        c += dc;

    }

    return count;

}

// Check Winner
function checkWinner(row, col) {

    const directions = [

        [1, 0],   // Vertical

        [0, 1],   // Horizontal

        [1, 1],   // Diagonal

        [1, -1]   // Reverse Diagonal

    ];

    for (let dir of directions) {

        const dr = dir[0];
        const dc = dir[1];

        let total =
            1 +
            countDirection(row, col, dr, dc) +
            countDirection(row, col, -dr, -dc);

        if (total >= 4) {

            return true;

        }

    }

    return false;

}

// ==============================
// END GAME
// ==============================

function endGame() {

    gameOver = true;

    clearInterval(timerInterval);

    if (currentPlayer === "red") {

        score.red++;

        score1.innerText = score.red;

    }

    else {

        score.yellow++;

        score2.innerText = score.yellow;

    }

    const winnerName =
        currentPlayer === "red"
        ? document.getElementById("player1").value || "Player 1"
        : document.getElementById("player2").value || "Player 2";

    statusElement.innerText = winnerName + " Wins!";

    document.getElementById("winnerText").innerText =
        winnerName + " Wins!";

    document
        .getElementById("winnerPopup")
        .classList
        .remove("hidden");

    saveScores();

}

// ==============================
// PLAY AGAIN
// ==============================

document
.getElementById("playAgain")
.addEventListener("click", () => {

    document
    .getElementById("winnerPopup")
    .classList
    .add("hidden");

    createBoard();

});

// ==============================
// RESTART
// ==============================

document
.getElementById("restartGame")
.addEventListener("click", () => {

    createBoard();

});

// ==============================
// NEW GAME
// ==============================

document
.getElementById("newGame")
.addEventListener("click", () => {

    createBoard();

});

// ==============================
// RESET SCORE
// ==============================

document
.getElementById("resetScore")
.addEventListener("click", () => {

    score.red = 0;
    score.yellow = 0;

    score1.innerText = 0;
    score2.innerText = 0;

    localStorage.removeItem("connectFourScore");

});

// ==============================
// UNDO
// ==============================

document
.getElementById("undoBtn")
.addEventListener("click", () => {

    if (history.length === 0 || gameOver)
        return;

    let last = history.pop();

    board[last.row][last.col] = "";

    currentPlayer = last.player;

    moveCount--;

    moveCounter.innerText = moveCount;

    updateBoard();

    statusElement.innerText =
        currentPlayer === "red"
        ? "Player 1 (Red)'s Turn"
        : "Player 2 (Yellow)'s Turn";

});

// ==============================
// THEME TOGGLE
// ==============================

document
.getElementById("themeBtn")
.addEventListener("click", () => {

    document.body.classList.toggle("light");

});

// ==============================
// RULES POPUP
// ==============================

document
.getElementById("rulesBtn")
.addEventListener("click", () => {

    document
    .getElementById("rulesPopup")
    .classList
    .remove("hidden");

});

document
.getElementById("closeRules")
.addEventListener("click", () => {

    document
    .getElementById("rulesPopup")
    .classList
    .add("hidden");

});

// ==============================
// LOCAL STORAGE
// ==============================

function saveScores() {

    localStorage.setItem(
        "connectFourScore",
        JSON.stringify(score)
    );

}

function loadScores() {

    const data =
        localStorage.getItem("connectFourScore");

    if (!data) return;

    score = JSON.parse(data);

    score1.innerText = score.red;

    score2.innerText = score.yellow;

}

loadScores();

// ==============================
// START GAME BUTTON
// ==============================

document
.getElementById("startGame")
.addEventListener("click", () => {

    const p1 =
        document.getElementById("player1").value || "Player 1";

    const p2 =
        document.getElementById("player2").value || "Player 2";

    document.getElementById("name1").innerText = p1;

    document.getElementById("name2").innerText = p2;

    createBoard();

});
