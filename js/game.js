'use strict'

//NEEDS TO BE FIXED:
//Containers! 
//reset button not working, background color when clicking on the cell is not changing
//by losing the window is hanging on the board
//fix signs show up
// work on CSS has to be done, the hardest mode on board is having problems with padding
//code refactoring(!)


const MINE_SIGN = "💣"
const FLAG_SIGN = "🚩"
const LIFE_SIGN = "🧬"
const DEFAULT_SIGN = "😃"
const LOSER_SIGN = "💀"
const WINNER_SIGN = "😎"

//consts for signs 

var gBoard = []
var gGameInterval
var gElModal = document.querySelector('.modal')

var gLevel = { 
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
    CELL: 16
    }

var gGame = {
    isOn: false,
    isOver: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
    }  

//decl. of global variables 
var timer;

//init func for game and creating the board

function initSweeper() {
    gElModal.querySelector('.reset').innerText = DEFAULT_SIGN 
    gBoard= createBoard(gLevel.SIZE)
    createRandomMines()
    renderBoard(gBoard)
    clearInterval(gGameInterval)
    timer = gElModal.querySelector('.timer')
    timer.innerText = 0
    gGame = {
        isOn: false,
        isOver: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    switch (gLevel.SIZE) {
        case 4:
            gLevel.LIVES = 1
            gLevel.MINES = 2
            gLevel.CELL = 16
            break;
        case 8:
            gLevel.LIVES = 3
            gLevel.MINES = 12
            gLevel.CELL = 64
            break;
        case 12:
            gLevel.LIVES  = 3
            gLevel.MINES = 30
            gLevel.CELL = 144
            break;
    }
    renderLives(gLevel.LIVES)
}


function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isMine: false,
                isShelled: false,
                isShown: false,
                isMarked: false,
                minesAroundCount:0
            }
        }
    }
    return board;
}



function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            switch (gLevel.SIZE) {                       //cells
                case 4:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-easy"></td>`

                    break;
                case 8:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-medium"></td>`

                    break;
                case 12:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-hard"></td>`

                    break;
            }

        }
        strHTML += '</tr>'
}
var elBoard = document.querySelector('.board')
elBoard.innerHTML = strHTML
}



//clicks
function cellClicked (elCell, i, j,){
    if (!gGame.isOver) {
       if (!gGame.isOn) {
           gGame.isOn = true
           gGameInterval = setInterval(() => {
               gGame.secsPassed++
               timer.innerText = gGame.secsPassed
            
           }, 1000);
       }
       if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
           if (gBoard[i][j].isMine) {
               gLevel.LIVES--;
               gBoard[i][j].isShelled = true
               renderLives(gLevel.LIVES)
               elCell.innerText = MINE_SIGN
               gBoard[i][j].isShown = true
               if (!gLevel.LIVES) {
                   gElModal.querySelector('.lose-container').classList.add('show');
                   gameOver()
               }
           } else {
               gGame.shownCount++
               var minedNegs = setMinesNegsCount(i, j, gBoard)
               elCell.classList.add('clicked');
               gBoard[i][j].isShown = true
               if (minedNegs) {
                   elCell.innerText = minedNegs
               } else {
                   elCell.innerText = ''
                   showNegs(i, j, gBoard,)
                   
               }
           }
       }
   }
   checkVictory(gBoard)
}



function changeBoardSize(size){
    gLevel.SIZE = size
    switch (gLevel.SIZE) {
        case 4:
            gLevel.LIVES = 1
            gLevel.MINES = 2
            gLevel.CELL = 16
            break;
        case 8:
            gLevel.LIVES = 3
            gLevel.MINES = 12
            gLevel.CELL = 64

            break;
        case 12:
            gLevel.LIVES  = 3
            gLevel.MINES = 30
            gLevel.CELL = 144

            
            break;
    }
    
    initSweeper()

}



function gameOver(){
    gGame.isOver = true
    clearInterval(gGameInterval)
    gGame.isOn = false
}


//counting the mines neighbours 
function setMinesNegsCount(cellI, cellJ, board) {
    var MinesNegsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i > board.length - 1) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j > board[i].length - 1) continue;
        if (i === cellI && j === cellJ) continue;
  
        if (board[i][j].isMine) MinesNegsCount++;
      }
    }
    return MinesNegsCount;
  }


  function showNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            var elCurrCell = gElModal.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            cellClicked(elCurrCell, i, j)
        }
    }
}



function checkVictory(board) {
    var markedCount = 0
    var notMineCount = 0
    var shownCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (!board[i][j].isMine) notMineCount++
            if (board[i][j].isMarked || board[i][j].isShelled) markedCount++
            if (board[i][j].isShown) shownCount++           
        }
    }
   
    if (shownCount === notMineCount && shownCount + markedCount === gLevel.CELLS) {
        gElModal.querySelector('.win-container').classList.add('show');
        
        gameOver()
    }

}
        
//clicks
function cellMarked(elCell, ev, i, j) {
    if (!gGame.isOver) {
        if (ev.which === 3 && !gBoard[i][j].isShown) { // 3 is the right click
            elCell.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
            })
            if (!gGame.isOn) {
                gGame.isOn = true
                gGameInterval = setInterval(() => {
                    gGame.secsPassed++
                    timer.innerText = gGame.secsPassed
                }, 1000);
            }
            if (!gBoard[i][j].isMarked) {

                gBoard[i][j].isMarked = true
                elCell.innerText = FLAG_SIGN
            } else {
                gBoard[i][j].isMarked = false
                elCell.innerText = ''
            }
        } //right click over
        checkVictory(gBoard)
    }
}


function renderLives(alives) {
    var elAlives = gElModal.querySelector('.lives')
    switch (alives) {
        case 1:
            elAlives.innerText = LIFE_SIGN
            break;
        case 2:
            elAlives.innerText = `${LIFE_SIGN}  ${LIFE_SIGN}`
            break;
        case 3:
            elAlives.innerText = `${LIFE_SIGN} ${LIFE_SIGN} ${LIFE_SIGN}`
            break;
        default:
             elAlives.innerText = ' '
            break;

    }
}

function createRandomMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var currI = getRandomInt(0, gLevel.SIZE)
        var currj = getRandomInt(0, gLevel.SIZE)
        if (gBoard[currI][currj].isMine) 
        i--;
        gBoard[currI][currj].isMine = true
    }
    
}

