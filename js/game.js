'use strict'

//NEEDS TO BE FIXED:
//Containers! 
// victory wont appear --fixed
//reset button not working, background color when clicking on the cell is not changing --fixed2
//by losing the window "You lose" is hanging on the board -- fixed
//fix signs show up --fixed

// infinity flags --fixed
//de fix
// work on CSS has to be done,hard mo
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
var gGame;
var firstClick

var gLevel = {
   // SIZE,
   // MINES,
   //LIVES,
   //CELL
}




var timer;
var sevenBoomOn = false


function initSweeper() {
    gElModal.querySelector('.lose-container').classList.remove('show')
    gElModal.querySelector('.win-container').classList.remove('show')
    gElModal.querySelector('.reset').innerText = DEFAULT_SIGN 
    gBoard = createBoard(gLevel.SIZE)                                     
    renderBoard(gBoard)
    clearInterval(gGameInterval)
    timer = gElModal.querySelector('.timer')
    timer.innerText = 0
    initgGame()
    renderLives(gLevel.LIVES)
}

function initgGame(){
    gGame = {
        sevenBoomOn: false,
        isOn: false,
        isOver: false,
        shownCount: 0,
        markedCount: 0,
        markedRight: 0,
        secsPassed: 0
    }
}

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            initCell(board, i, j)
        }
    }
    return board;
}

function initCell(board, i, j){
    board[i][j] = {
        isMine: false,
        isBombed: false,
        isShown: false,
        isMarked: false,
        minesAroundCount:0
    }
}

function renderBoard(board) { 
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            switch (gLevel.SIZE) {                       
                case 4:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-easy" clicked="False"></td>`
                    break;
                case 8:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-medium" clicked="False"></td>`
                    break;
                case 12:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell cell-hard" clicked="False"></td>`
                    break;
            }

        }
        strHTML += '</tr>'
}
var elBoard = document.querySelector('.board')
elBoard.innerHTML = strHTML
}

function turnGameOn(clickedI, clickedJ){
    gGame.isOn = true
    if(gGame.sevenBoomOn){
        createSevenBoomMines()
    }
    else{
        createRandomMines(clickedI, clickedJ)
    }
    gGameInterval = setInterval(() => {
        gGame.secsPassed++
        timer.innerText = gGame.secsPassed
     
    }, 1000);
}

function cellClicked (elCell, i, j,){
        if (!gGame.isOver) {
        if (!gGame.isOn) {
            turnGameOn(i, j);
       }
       var clickedCell = gBoard[i][j]
       if (!clickedCell.isShown && !clickedCell.isMarked) {
           if (clickedCell.isMine) {                           //Clicked on mine
              clickedOnMine(elCell, clickedCell)
           } 

           else {                                                // Clicked not on mine
               gGame.shownCount++
               var minedNegs = setMinesNegsCount(i, j, gBoard)
               //elCell.classList.add('clicked');
               elCell.setAttribute("clicked", "True")
               clickedCell.isShown = true
               if (minedNegs > 0) {
                   elCell.innerText = minedNegs
               } 
               else {
                   showNegs(i, j, gBoard)
               }
           }
       }
    
   }
   checkVictory(gBoard)
}

function clickedOnMine(elCell, clickedCell){
    gLevel.LIVES--;
    renderLives(gLevel.LIVES)

    clickedCell.isBombed = true
    gGame.markedRight++
    gGame.markedCount++
    elCell.innerText = MINE_SIGN
    clickedCell.isShown = true

    if (gLevel.LIVES === 0) {
        gElModal.querySelector('.lose-container').classList.add('show');
        gElModal.querySelector('.reset').innerText = LOSER_SIGN 
        gameOver()
    }
}

// some color to difficulty buttons 



function changeBoardSize(size){
    const easyBtn = document.querySelector('.easy')
    const mediumBtn = document.querySelector('.medium')
    const hardBtn = document.querySelector('.hard')
    const sevenBoomBtn = document.querySelector('.seven_boom')

    // easyBtn.style.backgroundColor = "white"
    // mediumBtn.style.backgroundColor = "white"
    // extremeBtn.style.backgroundColor = "white"
    // sevenBoomBtn.style.backgroundColor = "white"

    // if (size == 4) {
    //     easyBtn.style.backgroundColor = "green"
    // } else if (size == 8) {
    //     mediumBtn.style.backgroundColor = "yellow"
    // } else if (size == 12) {
    //     extremeBtn.style.backgroundColor = "red"
    // }

    gLevel.SIZE = size
    gLevel.CELL = gLevel.SIZE * gLevel.SIZE // no need 
    switch (gLevel.SIZE) {
        case 4:
            gLevel.LIVES = 1
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.LIVES = 3
            gLevel.MINES = 12
            break;
        case 12:
            gLevel.LIVES  = 3
            gLevel.MINES = 30
            break;
    }
    //renderBoard()
    initSweeper()

}

function checkVictory() {
    if (gGame.markedRight === gLevel.MINES) {
        gElModal.querySelector('.win-container').classList.add('show');
        gElModal.querySelector('.reset').innerText = WINNER_SIGN 
        gameOver()
    }

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


  function showNegs(cellI, cellJ, board) { // There is a bug here with diagonal neighbors 
    
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue; // Out of bounds

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue; //Out of bounds
            if (i === cellI && j === cellJ) continue; // Curr cell - not neighbor - not intresting

            var elCurrCell = gElModal.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            cellClicked(elCurrCell, i, j) // Should check it out
        }
    }
}

      
//clicks
function cellMarked(elCell, ev, i, j) {
    var curCell = gBoard[i][j]
    if (!gGame.isOver ) {
        if (ev.which === 3 && !curCell.isShown) {           // 3 is the right click
            elCell.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
            })

            if (!curCell.isMarked && gGame.markedCount < gLevel.MINES) {
                curCell.isMarked = true
                elCell.innerText = FLAG_SIGN
                updateMarked(i, j)
            }
             else if (curCell.isMarked) {
                curCell.isMarked = false
                elCell.innerText = ''
                updateUnMarked(i, j)
            }
        }                                   //right click over
        checkVictory(gBoard)
    }
}

function updateMarked(i, j){
    gGame.markedCount++
    var cell = gBoard[i][j]
    if (cell.isMine){
        gGame.markedRight++
    }
}

function updateUnMarked(i, j){
    gGame.markedCount--
    var cell = gBoard[i][j]
    if (cell.isMine){
        gGame.markedRight--
    }

}

function renderLives(curNumOfLives) {
    var elAlives = gElModal.querySelector('.lives')
    switch (curNumOfLives) {
        case 0:
            elAlives.innerText = ' '
           break;
        case 1:
            elAlives.innerText = LIFE_SIGN
            break;
        case 2:
            elAlives.innerText = `${LIFE_SIGN} ${LIFE_SIGN}`
            break;
        case 3:
            elAlives.innerText = `${LIFE_SIGN} ${LIFE_SIGN} ${LIFE_SIGN}`
            break;
    

    }
}

function createRandomMines(clickedI, clickedJ) {
    var minesPlaced = 0

    while (minesPlaced < gLevel.MINES){

        var currI = getRandomInt(0, gLevel.SIZE)
        var currj = getRandomInt(0, gLevel.SIZE)
        if (currI === clickedI && currj === clickedJ) continue;
        if (!gBoard[currI][currj].isMine){
            gBoard[currI][currj].isMine = true
            minesPlaced++;
        }
    }
}

function isSevenBoom(number){
    if (number % 7 == 0 ) {
        return true
    }
    else if (number.toString().match(/7/)) {
        return true
    }
    else {
        return false
    }
}

function createSevenBoomMines(){
    gLevel.MINES = 0
    var curNum = 1
    for(var currI=0; currI<gLevel.SIZE; currI++){
        for (var currJ=0; currJ<gLevel.SIZE; currJ++){
        if (isSevenBoom(curNum)){
            gBoard[currI][currJ].isMine = true
            gLevel.MINES++; 
          }
        curNum++
        }
    }
}

function changeSevenBoomBtn(){
    const sevenBoomBtn = document.querySelector('.seven_boom')
    // sevenBoomBtn.style.backgroundColor = "blue"
}

function createSevenBoomGame(){
    changeBoardSize(gLevel.SIZE)
    gGame.sevenBoomOn = true
    changeSevenBoomBtn()
}

// function showHint(){
//     if(!gGame.isOn){
//         pass 
//     }
// }
