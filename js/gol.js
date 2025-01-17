// Game of Life JavaScript Implementation

let rows = 24;
let cols = 24;
let playing = false;
let grid = createEmptyGrid();
let nextGrid = createEmptyGrid();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    adjustGridSizeToScreen();
    createTable();
    setupControlButtons();
});

// Create an empty grid
function createEmptyGrid() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

// Adjust the grid size based on the screen size
function adjustGridSizeToScreen() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth <= 768) { // Mobile layout
        rows = Math.floor(screenHeight / 25); // Smaller cells for mobile
        cols = Math.floor(screenWidth / 25);
    } else { // Desktop layout
        rows = Math.floor(screenHeight / 20); // Larger cells for desktop
        cols = Math.floor(screenWidth / 20);
    }

    grid = createEmptyGrid();
    nextGrid = createEmptyGrid();
}

// Create the table for the grid
function createTable() {
    let gridContainer = document.querySelector("#gridContainer");
    if (!gridContainer) {
        console.error("Problem: no div for the grid table!");
        return;
    }

    gridContainer.innerHTML = ""; // Clear any existing table
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", `${i}_${j}`);
            cell.setAttribute("class", "dead");
            cell.onclick = () => toggleCellState(i, j);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

// Toggle cell state between alive and dead
function toggleCellState(row, col) {
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    updateCellDisplay(row, col);
}

// Update cell display based on its state
function updateCellDisplay(row, col) {
    let cell = document.getElementById(`${row}_${col}`);
    if (grid[row][col] === 1) {
        cell.setAttribute("class", "live");
    } else {
        cell.setAttribute("class", "dead");
    }
}

// Set up control buttons
function setupControlButtons() {
    let startButton = document.querySelector('#start');
    let clearButton = document.querySelector('#clear');

    startButton.onclick = () => {
        if (playing) {
            playing = false;
            startButton.innerHTML = 'Start';
        } else {
            playing = true;
            startButton.innerHTML = 'Pause';
            if (grid.flat().every(cell => cell === 0)) {
                initializeRandomGrid();
            }
            play();
        }
    };

    clearButton.onclick = () => {
        playing = false;
        startButton.innerHTML = "Start";
        clearGrid();
    };
}

// Initialize grid with random live cells
function initializeRandomGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.3 ? 1 : 0; // 30% chance of being alive
        }
    }
    updateGridDisplay();
}

// Clear the grid
function clearGrid() {
    grid = createEmptyGrid();
    nextGrid = createEmptyGrid();
    updateGridDisplay();
}

// Update the entire grid display
function updateGridDisplay() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            updateCellDisplay(i, j);
        }
    }
}

// Game logic: calculate the next generation
function computeNextGeneration() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1) {
                nextGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                nextGrid[i][j] = neighbors === 3 ? 1 : 0;
            }
        }
    }

    // Swap grids
    [grid, nextGrid] = [nextGrid, grid];
}

// Count live neighbors
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let r = (row + i + rows) % rows;
            let c = (col + j + cols) % cols;
            count += grid[r][c];
        }
    }
    return count;
}

// Play the game
function play() {
    if (!playing) return;
    computeNextGeneration();
    updateGridDisplay();
    setTimeout(play, 100);
}
