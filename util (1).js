"use strict";
'use strict'
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}
function shuffle(items) {
    var randIdx, keep;
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}
// console.log(createMat(4,4))
function createMat(ROWS, COLS) {
    var mat = []

    for (var i = 0; i < ROWS; i++) {
        mat[i] = []
        for (var j = 0; j < COLS; j++) {
            var cell = {
                minesAroundCount: 0,
                isShow: false,
                isMine: false,
                isMarked: false,
                location: {
                    i: i,
                    j: j
                }
            }
            mat[i][j] = cell
        }
    }
    // mat[0][0].isMine=true;
    return mat
}

function renderMat(mat, selector) {
    var strHTML = '<table class="board" border="solid"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + `" onclick="cellClicked(event,this,${i},${j})" oncontextmenu="cellRightClick(event,this,${i},${j})"> `
            if (cell.isShow) {
                if (cell.isMine) strHTML += '*';
                else if (cell.minesAroundCount === 0) strHTML += '';
                else strHTML += `${cell.minesAroundCount}`;
            } else strHTML += '';
            strHTML += ' </td>';

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var board = document.querySelector('.board');
    board.innerHTML = strHTML;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
    return elCell;
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}
function getEmptyCells(board) {
	var emptyCells = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (!board[i][j].isMine && !board[i][j].isShow) {
				var cellPosition = { i: i, j: j }
				emptyCells.push(cellPosition);
			}
		}
	}
	return emptyCells;
}
function getNeighbors(mat, idxI, idxJ) {
    var neightbors = []
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ) continue
            if (j < 0 || j > mat[i].length - 1) continue
            neightbors.push(mat[i][j])
            // console.log('shlaga')
        }
    }
    return neightbors
}


function getNeighborMines(mat, idxI, idxJ) {
    var count = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ) continue
            if (j < 0 || j > mat[i].length - 1) continue
            if (mat[i][j].isMine) {
                count++
                // console.log('shlaga')
            }
        }
    }
    return count
}
function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d];
        console.log(item);
    }
}
function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - 1 - d];
        console.log(item);
    }
}


//** TIMER */
function pad(val) {
    let valString = val + ''
    if (valString.length < 2) return '0' + valString
    return valString
}
// gStartTime = Date.now()
function timer() {
    //NOTICE: WE NEED GLOBAL START TIME - gStartTime
    var timeDiff = Date.now() - gStartTime
    currTime = new Date(timeDiff)
    var timeStr = pad(currTime.getMinutes())
    timeStr += ':' + pad(currTime.getSeconds())
    return timeStr
}
// Collapse

function startTimer() {
    gTime = setInterval(countTime, 10)
}

function countTime() {

    gTimerObject.miliSeconds += 10
    if (gTimerObject.miliSeconds > 1000) {
        gTimerObject.seconds++
        gTimerObject.miliSeconds = 0
    }
    if (gTimerObject.seconds > 9) {
        gTimerObject.tenSeconds++
        gTimerObject.seconds = 0;
        gTimerObject.miliSeconds = 0
    }
    gTimer.innerText = `${gTimerObject.tenSeconds}${gTimerObject.seconds}:${gTimerObject.miliSeconds}`
}