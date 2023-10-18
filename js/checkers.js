import * as utils from "./checkers_utils.js"

let board = document.querySelector('.board')


const whiteCircle = "../media/white-circle.svg"
const blackCircle = "../media/black-circle.svg"
const blackQueen = "../media/black-queen.svg"
const whiteQueen =  "../media/white-queen.svg"

let moveCount = 0
let routes = []
let activePiece = null
const gameModeInput = document.getElementById('game-mode')
let gameMode =  Array.from(document.getElementsByName('game-mode')).filter( x => x.checked)[0].value === "hard" ? 1 : 0 

function initBoard(){
    const div = document.createElement('div')
    div.classList.add('game-started')
    board.appendChild(div)
    for (let i = 0; i < 9; ++i){
        let tempRow = document.createElement('tr')
        tempRow.classList.add('row')
        for (let j = 0; j < 9; ++j){
            let tempCell = document.createElement('td')
            tempCell.id = `cell-${i}-${j}`
            tempCell.classList.add('cell')
            if (i === 0){
                tempCell.classList.add('outline')
               if (j !== 0){ 
                tempCell.appendChild(document.createTextNode(String.fromCharCode(j + 97 - 1)))
            }
        }
            else if (j === 0){
                tempCell.classList.add('outline')
               if (i !== 0){ 
                tempCell.appendChild(document.createTextNode(i))
            }
        }
        else {
            tempCell.classList.add('colored')
            tempCell.appendChild(document.createElement("img"))
            if (i >= 6){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
                    tempCell.classList.add('piece')
                    tempCell.firstElementChild.src = whiteCircle
                }
            }
            if (i<=3){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
                    tempCell.classList.add('piece')
                    tempCell.firstElementChild.src = blackCircle
                }
            }
        }
        tempRow.appendChild(tempCell)
    }
        board.appendChild(tempRow)
    }
    utils.whosTurn(moveCount);
}

function checkValidity(func) {
    return function() {
        if ((this.firstElementChild.src.includes('white') && moveCount % 2 === 0) ||
            (this.firstElementChild.src.includes('black') && moveCount % 2 === 1)) {
            resetAvailableMoves()
            func.apply(this, arguments);
        }
    };
}

function resetAvailableMoves(){
    document.querySelectorAll('.available-move').forEach( e => {
        e.classList.remove('available-move')
    })
    document.querySelectorAll('.clicked').forEach(el => {el.classList.remove('clicked')})
}

function resetOnClicks(){
    routes.forEach(route => {
        const lastPieceOfRoute = utils.getPiece(parseInt(route[route.length - 1] / 10),route[route.length - 1] % 10)
        if (lastPieceOfRoute !== activePiece){
        lastPieceOfRoute.onclick = checkValidity(movePiece)}
    })
}

function movePiece(){
    resetOnClicks()
    if (this.classList.contains('king')){
        availableMovesKing(this)}
    else{
        availableMoves(this)
    }
    this.classList.add('clicked')
    const location = utils.getLocation(this)
    const row = location[0]
    const column = location[1]
    routes.forEach(route => {
        const lastPieceOfRoute = utils.getPiece(parseInt(route[route.length - 1] / 10),route[route.length - 1] % 10)
        if (gameMode === 0){
            lastPieceOfRoute.classList.add('available-move')
        }
        lastPieceOfRoute.onclick = () => {
            if (utils.distanceFromPiece(this,lastPieceOfRoute) > Math.sqrt(2) ){ 
                route.slice(0,route.length).forEach( (pieceInRoute,index) => {
                    if (index === 0) {
                    if (!this.classList.contains('king')) {
                        pieceInRoute = utils.getPiece( (parseInt(pieceInRoute / 10) + row) / 2, (pieceInRoute % 10 + column) / 2)}
                        else {
                            pieceInRoute = utils.getPiece(parseInt(pieceInRoute / 10), pieceInRoute % 10)
                        }
                    }
                    else {
                        pieceInRoute = utils.getPiece((utils.getLocationOurForm(pieceInRoute)[0] + utils.getLocationOurForm(route[index-1])[0]) / 2, (utils.getLocationOurForm(pieceInRoute)[1] + utils.getLocationOurForm(route[index-1])[1]) / 2)
                    }
                    pieceInRoute.firstElementChild.src = ' '
                    pieceInRoute.classList.remove('piece')
                
                })
            }
            makeMove(this,lastPieceOfRoute)
           
        }
        })
 }


function makeMove(piece,lastPieceOfRoute){
    moveCount++;
    lastPieceOfRoute.onclick = piece.onclick
    lastPieceOfRoute.classList = piece.classList
    if (utils.checkRegularPiece(piece) && (utils.reachedLastRow(piece,lastPieceOfRoute))){
        lastPieceOfRoute.firstElementChild.src = utils.getLocation(lastPieceOfRoute)[0] === 1 ? whiteQueen : blackQueen
        lastPieceOfRoute.classList.add('king')
    }
    else {
    lastPieceOfRoute.firstElementChild.src = piece.firstElementChild.currentSrc}
    piece.onclick = null
    piece.firstElementChild.src = ' '
    resetAvailableMoves()
    resetOnClicks()
    checkEndGame()
    utils.whosTurn(moveCount)
}

function availableMovesKing(piece){
    routes = []
    const location = utils.getLocation(piece)
    const row = location[0]
    const column = location[1]
    const color = utils.getColor(row,column)
    function canEat(newRow,newColumn,previousRow,previousColumn,route = []) {
            if (route.includes((newRow)* 10 + newColumn)){
                return
            }
            if (utils.checkEmptyCell(newRow,newColumn) && !utils.checkEmptyCell((newRow + previousRow) / 2, (previousColumn + newColumn) / 2) && (color !== utils.getColor( (newRow + previousRow) / 2, (previousColumn + newColumn) / 2))){
                route.push(newRow* 10 + newColumn)
                routes.push(route)
                canEat(newRow+2,newColumn+2,newRow,newColumn,[...route])
                canEat(newRow+2,newColumn-2,newRow,newColumn,[...route])
                canEat(newRow-2,newColumn-2,newRow,newColumn,[...route])
                canEat(newRow-2,newColumn+2,newRow,newColumn,[...route])
            }
    }
    
    for (let newRow = row + 1,newColumn = column + 1; newRow <=8 && newColumn <=8; newRow++, newColumn++) {
            if (utils.checkEmptyCell(newRow,newColumn)) {
                routes.push([newRow * 10 + newColumn])
            } else {
                canEat(newRow + 1,newColumn + 1,newRow - 1,newColumn - 1,[(newRow -1)* 10 +newColumn - 1 ])
                break
            }
    }

    for (let newRow = row - 1,newColumn = column + 1 ; newRow >= 1 && newColumn <=8; newRow--, newColumn++) {
            if (utils.checkEmptyCell(newRow,newColumn)) {
                routes.push([newRow * 10 + newColumn])
            } else {
                canEat(newRow - 1,newColumn + 1, newRow + 1,newColumn - 1,[(newRow +1)* 10 +newColumn - 1 ])
                break
            }
    }

    for (let newRow = row + 1, newColumn = column - 1; newRow <=8 && newColumn >= 1; newRow++, newColumn--) {
            if (utils.checkEmptyCell(newRow,newColumn)) {
                routes.push([newRow * 10 + newColumn])
            } else {
                canEat(newRow + 1,newColumn - 1, newRow - 1,newColumn + 1,[(newRow -1)* 10 +newColumn + 1 ])
                break
            }
    }

    for (let newRow = row - 1,  newColumn = column - 1; newRow >= 1 && newColumn >= 1; newRow--, newColumn--) {
        if (utils.checkEmptyCell(newRow,newColumn)) {
                routes.push([newRow * 10 + newColumn])
            } else {
                canEat(newRow - 1,newColumn - 1,newRow + 1,newColumn + 1,[(newRow +1)* 10 +newColumn + 1 ])
                break
            }
    }
    return routes
}

function availableMoves(piece) {
    routes = []
    const location = utils.getLocation(piece)
    const row = location[0]
    const column = location[1]
    let previousRow = row
    let previousColumn = column
    if (utils.getColor(row,column) === 'black'){
        if (utils.checkEmptyCell(row + 1,column + 1)) {
            routes.push([(row + 1 )* 10 + column + 1])
        }
        if (utils.checkEmptyCell(row + 1,column - 1)) {
            routes.push([(row + 1 )* 10 + column - 1])
        }
        canEat(row+2,column+2,previousRow,previousColumn)
        canEat(row+2,column-2,previousRow,previousColumn)
    }
    else {
        if (utils.checkEmptyCell(row - 1,column + 1)) {
            routes.push([(row - 1 )* 10 + column + 1])
        }
        if (utils.checkEmptyCell(row - 1,column - 1)) {
            routes.push([(row - 1 )* 10 + column - 1])
        }
        
        canEat(row-2,column-2,previousRow,previousColumn)
        canEat(row-2,column+2,previousRow,previousColumn)
    }

    function canEat(newRow,newColumn,previousRow, previousColumn,route = []) {

            if (route.includes((newRow)* 10 + newColumn)){
                return
            }
            if (utils.checkEmptyCell(newRow,newColumn) && !utils.checkEmptyCell((newRow + previousRow) / 2, (previousColumn + newColumn) / 2) && (utils.getColor(row,column) !== utils.getColor( (newRow + previousRow) / 2, (previousColumn + newColumn) / 2))){
                route.push(newRow* 10 + newColumn)
                routes.push(route)
                const previousColumn = newColumn
                const previousRow = newRow
                canEat(newRow+2,newColumn+2,previousRow,previousColumn,[...route])
                canEat(newRow+2,newColumn-2,previousRow,previousColumn,[...route])
                canEat(newRow-2,newColumn-2,previousRow,previousColumn,[...route])
                canEat(newRow-2,newColumn+2,previousRow,previousColumn,[...route])
            }
    }
}

function checkEndGame() {
    let countBlack = 0;
    let countWhite = 0;
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (utils.getColor(i, j) === 'black') {
                countBlack++;
            } else if (utils.getColor(i, j) === 'white') {
                countWhite++;
            }
        }
    }
    if (countWhite === 0 || countBlack == 0) {gameEnd()};
}

function gameEnd() {
    const message = document.querySelector('.game-started')
    message.classList.remove('game-started')
    message.classList.add('game-ended')
    if (moveCount % 2 == 1) {
            message.textContent += "white wins";
            increaseScore('white',1)
    } 
    else {
            message.textContent += "black wins";
            increaseScore('black',1)

        }

}

function increaseScore(color, amount = 0,initial = false){
    const scoreElement = document.querySelector(`#${color}-win-count`)
    const score = scoreElement.textContent.trim().split(':')
    scoreElement.textContent = score[0] + ': ' +  (parseInt(score[1].trim())+amount)
    if (!initial){
    let currentUserIndex = utils.getUser()
    const users = JSON.parse(localStorage.getItem('users'))
    const user = users[currentUserIndex]
    user[`${color}WinCount`]+= amount
    localStorage.setItem('users',JSON.stringify(users))
    }
}


function setInitialScores(){
    increaseScore('black',utils.getScore('black'),true)
    increaseScore('white',utils.getScore('white'),true)
}

function resetBoard(){
    document.querySelector('.game').removeChild(document.querySelector('.board'))
    board = document.createElement('div')
    board.classList.add('board')
    document.querySelector('.game').appendChild(board)
    initBoard()
    initOnClicks()
    moveCount = 0
}

function initOnClicks(){
    const pieces = document.querySelectorAll('.piece')
pieces.forEach((piece) => {
    piece.onclick = checkValidity(movePiece)
})
}

function gameStart(){
    gameModeInput.addEventListener('change', () => {
        gameMode = !gameMode 
        resetBoard()
    })
    initBoard()
    setInitialScores()
    initOnClicks()
    moveCount = 0
    const resetGame = document.getElementById('reset-game')
    resetGame.addEventListener('click', resetBoard)
}


gameStart()
