'use strict'
var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: true,
    sevenBoomMode: false,
    useHint: false,
    manualStartPosition: false,
    manualStartPlay: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: 0,
    lives: 3,
    safeClick: 3,
    hints: 3
}
var gTime;
var gTimer = document.querySelector('.timer')
var gTimerObject = {
    tenSeconds: 0, seconds: 0,
    miliSeconds: 0
}
var gClicks = document.querySelector('.safe-clicks')
var gFace = document.querySelector('.face')
var gLives = document.querySelector('.number-of-lives')
var gHint1 = document.querySelector('.hint-1')
var gHint2 = document.querySelector('.hint-2')
var gHint3 = document.querySelector('.hint-3')
var gBoardOfBoards = [];
var gCountTurns = 0;
var gManualMines = [];


const HAPPY_FACE = '😀';
const SAD_FACE = '😪';
const MINE = '💣';
const FLAG = '🚩';

function start() {
    gLives.innerText = gGame.lives;
    clearInterval(gTime)
    gGame.hints = 3
    gGame.sevenBoomMode = false;
    gGame.lives = 3;
    gLives.innerText = '3';
    gGame.isOn = true
    gGame.firstClick = 0;
    gTimerObject.seconds = 0
    gTimerObject.tenSeconds = 0
    gTimerObject.miliSeconds = 0
    gTimer.innerText = '00.000'
    gFace.innerText = HAPPY_FACE
    gGame.safeClick = 3
    gClicks.innerText = 3
    gHint1.innerText = '🌹'
    gHint2.innerText = '🌹'
    gHint3.innerText = '🌹'
   
}

function init() {
    start();
    createBoard(4, 2);
    renderMat(gBoard)
    console.log(gBoard)
}
function restart() {
    start();
    createBoard(gLevel.size, gLevel.mines);
    renderMat(gBoard);
}


function useHint() {
    gGame.useHint = true
}
function clearTheHint(i, j) {
    var currCell = gBoard[i][j];
    var currCells = getNeighbors(gBoard, i, j)
    var color = 'darkgray'
    for (var k = 0; k < currCells.length; k++) {
        if (currCells[k].isMine && currCells[k].isShow === false) {
            renderCell(currCells[k].location, '')
            lightCell(currCells[k].location.i, currCells[k].location.j, color)
        } else if (currCells[k].isShow === false) {
            renderCell(currCells[k].location, '')
            lightCell(currCells[k].location.i, currCells[k].location.j, color)
        }
        if (currCell.isMine && currCell.isShow === false) {
            renderCell(currCell.location, '')
            lightCell(currCell.location.i, currCell.location.j, color)
        }
        else if (currCell.isShow === false) {
            renderCell(currCell.location, '')
            lightCell(currCell.location.i, currCell.location.j, color)
        }
    }
}
function useTheHint(i, j) {
    var currCell = gBoard[i][j];
    var currCells = getNeighbors(gBoard, i, j)
    var color = 'rgb(87, 84, 84)'
    if (!currCell.isShow) {
        for (var i = 0; i < currCells.length; i++) {
            if (currCells[i].isMine) {
                renderCell(currCells[i].location, MINE)
                lightCell(currCells[i].location.i, currCells[i].location.j, color)
            } else {
                renderCell(currCells[i].location, currCells[i].minesAroundCount)
                lightCell(currCells[i].location.i, currCells[i].location.j, color)
            }
            if (currCell.isMine) {
                renderCell(currCell.location, MINE)
                lightCell(currCell.location.i, currCells[i].location.j, color)
            }
            else {
                renderCell(currCell.location, currCell.minesAroundCount)
                lightCell(currCell.location.i, currCells[i].location.j, color)
            }

        }
    }
}

function easyButton() {
    start()
    gLevel.size = 4;
    gLevel.mines = 2;
    createBoard(gLevel.size, gLevel.mines);
    renderMat(gBoard)
}
function mediumButton() {
    start()
    gLevel.size = 8;
    gLevel.mines = 12
    createBoard(gLevel.size, gLevel.mines);
    renderMat(gBoard)
}
function hardButton() {
    start()
    gLevel.size = 12;
    gLevel.mines = 30
    createBoard(gLevel.size, gLevel.mines);
    renderMat(gBoard)
}

function lightCell(cellI, cellJ, color) {
    var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    elCell.style.backgroundColor = `${color}`;
}

function safeClick() {

    var safePlaces = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currPlace = gBoard[i][j]
            if (!currPlace.isMine && !currPlace.isShow) {
                safePlaces.push(currPlace);
            }
        }
    }

    if (gGame.safeClick === 0) {
        return
    }
    var currSafePlace = safePlaces[getRandomIntInclusive(0, safePlaces.length - 1)];
    console.log(currSafePlace);
    var color = 'rgb(42, 40, 38)'
    lightCell(currSafePlace.location.i, currSafePlace.location.j, color)
    color = 'darkgray';
    console.log(gBoard[currSafePlace.location.i][currSafePlace.location.j])
    gGame.isOn = false
    setTimeout(lightCell, 300, currSafePlace.location.i, currSafePlace.location.j, color)
    gGame.isOn = true;
    gGame.safeClick--
    gClicks.innerText = gGame.safeClick
}

function getRandomMines(len) {
    for (var i = 0; i < len; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var currPlace = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
        var mine = gBoard[currPlace.i][currPlace.j]
        mine.isMine = true;
    }
}
function createBoard(boardSize, minesCount) {
    gBoard = createMat(boardSize, boardSize);
    return gBoard
}

function sevenBoom() {
    gGame.sevenBoomMode = true;
    console.log('7Boom!')
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currPlace = gBoard[i][j]
            count++
            if (count % 7 === 0) {
                currPlace.isMine = true;
            }
            if (count > 10 && count < 140) {
                if (count % 10 !== 0) {
                    if ((count % 10) % 7 === 0 || (Math.floor(count / 10)) % 7 === 0) {
                        currPlace.isMine = true;

                    }
                }
                if (count > 140) {
                    if (count === 144) currPlace.isMine = true;
                }
            }
        }
    }
    setMinesNegsCount(gBoard);
}


function positionManual() {
    gGame.manualStartPosition = true;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var numOfNeighbors = getNeighborMines(board, i, j);
            if (numOfNeighbors === 0) {
                numOfNeighbors = '';
                board[i][j].minesAroundCount = numOfNeighbors;
            } else board[i][j].minesAroundCount = numOfNeighbors
        }
    }
}

function playManual() {
    start()
    gGame.firstClick = 1
    for (var i = 0; i < gManualMines.length; i++) {
        gManualMines[i].isMine = true;
    }
    console.log(gBoard)
    // console.log(gManualMines);
    // createBoard(gLevel.size);
    // renderMat(gBoard);
    gGame.manualStartPosition = false;
    gGame.manualStartPlay = true;
}
function undo() {
    // var newBoard = gBoardOfBoards[gCountTurns-1]
    gBoard = gBoardOfBoards[gCountTurns - 1]
    setMinesNegsCount(gBoard)
    renderMat(gBoard);
    gCountTurns--
}



function cellClicked(event, elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.manualStartPosition) {
        gManualMines.push(cell);
        return
    }
    if (!gGame.firstClick) {
        startTimer();
        cell.isShow = true;
        elCell.style.backgroundColor = 'rgb(87, 84, 84)'
        if (gGame.sevenBoomMode) {
            sevenBoom();
            if (cell.isMine) {
                renderCell(cell.location, MINE)
                gGame.firstClick++
                gGame.lives--
                return
            }
        } else {
            getRandomMines(gLevel.mines)
            setMinesNegsCount(gBoard);
        }
        renderCell(cell.location, cell.minesAroundCount);
        gGame.firstClick++
        if (!cell.minesAroundCount && cell.isMine === false) neighborCellCheck(i, j)
    }
    if(gGame.manualStartPlay){
        for (var i = 0; i < gManualMines.length; i++) {
            gManualMines[i].isMine = true;
        }
        setMinesNegsCount(gBoard)
        gGame.manualStartPlay = false;
    
        console.log(gBoard)
    }
    if (gGame.useHint && !cell.isShow) {
        if (gGame.hints) {
            useTheHint(i, j);
            gGame.useHint = false;
            var currSpan = document.querySelector(`.hint-${gGame.hints}`)
            gGame.hints--
            currSpan.innerText = '';
            setTimeout(clearTheHint, 1000, i, j)
            return
        }
    }
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShow) return
    cell.isShow = true;
    elCell.style.backgroundColor = 'rgb(87, 84, 84)'
    if (cell.isMine) {
        gGame.lives--
        gLives.innerText = gGame.lives
        // console.log(gGame.lives)
        if (gGame.lives === 0) {
            gameLost();
            clearInterval(gTime)
        }
        renderCell(cell.location, MINE)

    } else if (!cell.minesAroundCount && cell.isMine === false) {
        cell.isShow = true;
        renderCell(cell.location, cell.minesAroundCount);
        neighborCellCheck(i, j)
        checkIfWinGame();
    }
    else {
        renderCell(cell.location, cell.minesAroundCount)
        checkIfWinGame();
    }
    gBoardOfBoards.push(gBoard);
    // console.log(gBoardOfBoards[0]);
    gCountTurns++
}

function neighborCellCheck(i, j) {
    var neighbors = getNeighbors(gBoard, i, j)
    for (var i = 0; i < neighbors.length; i++) {
        var currNeighbor = neighbors[i]
        var currI = currNeighbor.location.i
        var currJ = currNeighbor.location.j
        if (currNeighbor.isMarked) continue;
        var elNeighbor = document.querySelector(`.cell-${currI}-${currJ}`)
        elNeighbor.style.backgroundColor = 'rgb(87, 84, 84) '
        renderCell(currNeighbor.location, currNeighbor.minesAroundCount);
        if (!currNeighbor.isShow) {
            currNeighbor.isShow = true;
            if (!neighbors[i].minesAroundCount) {
                neighborCellCheck(currI, currJ);
            }
        }
    }
}

function cellRightClick(event, elCell, i, j) {
    event.preventDefault()
    var cell = gBoard[i][j];
    if (cell.isShow) return
    cell.isMarked = true;
    if (elCell.innerText === FLAG) {
        elCell.innerText = '';
        cell.isMarked = false;
    }
    else elCell.innerText = FLAG

}

function gameLost() {
    var minedCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) minedCells.push(currCell)
        }
    }
    for (var i = 0; i < minedCells.length; i++) {
        renderCell(minedCells[i].location, MINE)
        var elMine = document.querySelector(`.cell-${minedCells[i].location.i}-${minedCells[i].location.j}`)
        elMine.style.backgroundColor = 'rgb(105, 101, 101)';
    }
    clearInterval(gTime)
    gGame.isOn = false;

    console.log('you lost!')
    gFace.innerText = SAD_FACE
}
function checkIfWinGame() {
    var shownCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShow && !currCell.isMine) shownCells.push(currCell)
        }
    }
    if (shownCells.length === gLevel.size ** 2 - gLevel.mines) {
        console.log('you win!')
        clearInterval(gTime)
        gGame.isOn = false;

    }

}