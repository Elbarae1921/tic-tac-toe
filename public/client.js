// prompt the user to get his choice
const pmpt = prompt("Type 0 for O and 1 for X");



// set the chosen symbol accordingly
const choice = pmpt == 1 ? "X" : pmpt == 0 ? "O" : "X";



// set the CPU's symbol
const CPUchoice = ["X", "O"].filter(x => x!==choice)[0];



// get the cells from the document and map them
let tds = Array.from(document.querySelectorAll('td'), td => {
    return {
        id: td.id,
        element: td,
        checked: false,
        player: undefined
    }
});

// cell : {id: HTML id, element: HTML element, checked: boolean (whether it's checked or not), player: Number (1 for player; 2 for CPU)}

// create an array of cell rows 
const cells = [];



// spliting the tds array into 3 arrays for each row, now cells is a 3 dimension array
for (let i = 3; i > 0; i--) {
    cells.push(tds.splice(0, Math.ceil(tds.length / i)));
}



// freeing memory
tds = null;



// CPU round function
const CPUplay = () => {
    // get the cells that are NOT checked yet
    const freecells = cells.flat().filter(x => x.checked === false);
    // chose a random cell and check it (I know it's inefficient but eh)
    const chosen = freecells[Math.floor(Math.random()*freecells.length)];
    // get the positon of said cell in the square
    const index = cells.flat().indexOf(chosen);
    // check the cell
    chosen.checked = true;
    chosen.player = 2;
    [...chosen.element.children].find(x => x.classList.contains(CPUchoice)).style.display = "block";
    // check for wins ---- checkForWin takes the position of the cell in the square as an argument
    if(checkForWin(index, 2)) {
        alert("CPU won!");
        return resetGame();
    }
    // check for tie
    if(checkForTie()) {
        alert("Tie!");
        return resetGame();
    }
}



// initialize the game
const resetGame = () => {
    // loop through the 3 dimensional array
    for(let x of cells) {
        // loop through the inner arrays
        for(let cell of x) {
            // uncheck every cell
            Array.from(cell.element.children).forEach(child => {
                child.style.display = "none";
            });
            cell.checked = false;
            cell.player = undefined;
        }
    }
}



// check for wins in rows/columns/diagonals, takes the position of the recent move and the player type (player or CPU)
const checkForWin = (pos, player) => {
    
    /* ---------- VERTICAL/HORIZONTAL CHECK ---------- */

    // get the row index of the last move
    const rowIndex = Math.floor(pos / 3);
    // get the column index of the last move
    const columnIndex = Math.floor(pos % 3);
    // get the actual row of the move
    const row = cells[rowIndex];
    // get the actual column of the move
    const column = cells.map(x => x[columnIndex]);
    // array to monitor the row/column checks
    let checks = [false, false, false];

    // loop through the row to check for wins
    for(let i = 0; i < 3; i++) {
        // break if the cell is not checked
        if(!row[i].checked || row[i].player !==player) break;
        
        checks[i] = true;
    }

    // check if the row was a winner
    if(checks.every(x => x)) return true;
    // otherwise reset the checks array
    checks = [false, false, false];

    // loop through the column to check for wins
    for(let i = 0; i < 3; i++) {
        // break if the cell is not checked
        if(!column[i].checked || column[i].player !==player) break;
        
        checks[i] = true;
    }

    // check if the column was a winner
    if(checks.every(x => x)) return true;
    // otherwise reset the checks array
    checks = [false, false, false];


    /* ---------- VERTICAL/HORIZONTAL CHECK ---------- */


    // set the possible diagonals array
    const leftDiagonal = [0, 4, 8];
    const rightDiagonal = [2, 4, 6];
    // check if the cell belongs in a diagonal at all
    if(![...leftDiagonal, ...rightDiagonal].includes(pos)) return false;
    // initial diagonalIndexes array which will point to the diagonal the cell belongs to
    let diagonalIndexes;
    // get the diagonal the cell belongs to
    // if the cell is in position 4 it belongs to both diagonals
    if(pos === 4) {
        // in that case we'll loop through the left diagonal first
        // get the actual diagonal
        const diagonal = cells.flat().filter((_, i) => leftDiagonal.includes(i));
        // loop through the diagonal
        let checks = [false, false, false];
        for(let i = 0; i < 3; i++) {
            if(!diagonal[i].checked || diagonal[i].player !==player) break;
            checks[i] = true;
        }
        if(checks.every(x => x)) return true;
        // if there was no win in the left diagonal we set the right diagonal to diagonalIndexes to be looped through later
        diagonalIndexes = rightDiagonal;
    }
    else { // otherwise we set diagonalIndexes to diagonal indexes the cell belongs to
        diagonalIndexes = leftDiagonal.includes(pos) ? leftDiagonal : rightDiagonal;
    }
    // get the actual diagonal from the diagonalIndexes
    const diagonal = cells.flat().filter((_, i) => diagonalIndexes.includes(i));
    // loop through the diagonal
    for(let i = 0; i < 3; i++) {
        // break if the cell is not checked
        if(!diagonal[i].checked || diagonal[i].player !==player) break;
        checks[i] = true;
    }

    // check if the diagonal was a winner
    if(checks.every(x => x)) return true;
    // no win
    return false;
}



// check for tie
const checkForTie = () => {
    for(let i = 0; i < cells.length; i++) {
        for(let j = 0; j < cells[0].length; j++) {
            if(cells[i][j].checked === false) return false;
        }
    }
    return true;
}



// loop through the 3 dimensional array
for(let x of cells) {

    // loop through the inner arrays
    for(let cell of x) {
        // assigning events to each <td>
        cell.element.addEventListener("click", () => {
            if(cell.checked) return;

            const children = [...cell.element.children];
            const Xsign = children.find(x => x.classList.contains(choice));
            Xsign.style.display = "block";
            cell.checked = true;
            cell.player = 1;
            // check for a win ---- checkForWin takes the position of the cell in the square as an argument
            if(checkForWin(x.indexOf(cell) + cells.indexOf(x)*3, 1)) {
                alert("You won!");
                return resetGame();
            }
            // check for tie
            if(checkForTie()) {
                alert("Tie!");
                return resetGame();
            }
            // CPU's round
            CPUplay();
        });
    }
}