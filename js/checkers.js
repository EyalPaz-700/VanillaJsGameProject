const board = document.querySelector('.board')


const whiteCircle = "../media/white-circle.svg"
const blackCircle = "../media/black-circle.svg"

let moveCount = 0
let routes = []
let activePiece = null

function initBoard(){
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


function getColor(row, column){
    const cell = document.querySelector(`#cell-${row}-${column}`)
    if (!checkEmptyCell(row,column)){
        if (cell.firstElementChild.src.includes('black')){
            return 'black'
        }
        return 'white'
    }
    return null
}

function checkEmptyCell(row,column) {
   if (isValidMove(row,column)) { 
    const src = getPiece(row,column).firstElementChild.src
        return  src === 'http://127.0.0.1:5500/html/checkers.html' || src === ''
   }
}

function isValidMove(column,row) {
    return column <= 8 && column >=1 && row <= 8 && row >= 1
}

function getLocation(piece){
    return  piece.id.split('-').slice(1,3).map( x => parseInt(x))
}

function distanceFromPiece(piece1,piece2){
    const location1 = getLocation(piece1)
    const location2 = getLocation(piece2)
    return (Math.sqrt(Math.pow(location1[0] - location2[0],2) + Math.pow(location1[1] - location2[1],2)))
}

function getPiece(row,column){
    return document.querySelector(`#cell-${row}-${column}`)
}

function getLocationOurForm(location){
    return [parseInt(location / 10),location % 10]
}
function resetAvailableMoves(){
    document.querySelectorAll('.available-move').forEach( e => {
        e.classList.remove('available-move')
    })
    document.querySelectorAll('.clicked').forEach(el => {el.classList.remove('clicked')})
}

function resetOnClicks(){
    routes.forEach(route => {
        const lastPieceOfRoute = getPiece(parseInt(route[route.length - 1] / 10),route[route.length - 1] % 10)
        if (lastPieceOfRoute !== activePiece){
        lastPieceOfRoute.onclick = checkValidity(movePiece)}
    })
}

function movePiece(){
    resetOnClicks()
    availableMoves(this)
    this.classList.add('clicked')
    const location = getLocation(this)
    const row = location[0]
    const column = location[1]
    routes.forEach(route => {
        const lastPieceOfRoute = getPiece(parseInt(route[route.length - 1] / 10),route[route.length - 1] % 10)
        lastPieceOfRoute.classList.add('available-move')
        if (distanceFromPiece(this,lastPieceOfRoute) > Math.sqrt(2) ){
        lastPieceOfRoute.onclick = () => {
            moveCount++;
            route.slice(0,route.length).forEach( (pieceInRoute,index) => {
                if (index === 0) {
                    pieceInRoute = getPiece( (parseInt(pieceInRoute / 10) + row) / 2, (pieceInRoute % 10 + column) / 2)
                }
                else {
                    pieceInRoute = getPiece((getLocationOurForm(pieceInRoute)[0] + getLocationOurForm(route[index-1])[0]) / 2, (getLocationOurForm(pieceInRoute)[1] + getLocationOurForm(route[index-1])[1]) / 2)
                }
                pieceInRoute.firstElementChild.src = ' '
                pieceInRoute.onclick = null
                pieceInRoute.classList.remove('piece')
             
            }
            )
            activePiece = lastPieceOfRoute
            activePiece.firstElementChild.src = this.firstElementChild.src
            activePiece.onclick = this.onclick
            activePiece.classList.add('piece')
            this.firstElementChild.src = ' '
            this.onclick = null
            resetAvailableMoves()
            resetOnClicks()
        }
    }
        else {
            lastPieceOfRoute.onclick = () => {
            moveCount++;
            lastPieceOfRoute.onclick = this.onclick
            lastPieceOfRoute.classList.add('piece')
            lastPieceOfRoute.firstElementChild.src = this.firstElementChild.src
            this.onclick = null
            this.firstElementChild.src = ' '
            resetAvailableMoves()
            resetOnClicks()
            }
        }
 }
    )

}

function queenMove(){
    const location = getLocation(this)
    const color = getColor(this)
    const row = location[0]
    const column = location[1]
    routes = []
    for (let i = row, j = column; i < 9 && j < 9; ++i, ++j){
        
    }
}

function availableMoves(piece) {
    routes = []
    const location = getLocation(piece)
    const row = location[0]
    const column = location[1]
    let previousRow = row
    let previousColumn = column
    if (getColor(row,column) === 'black'){
        if (checkEmptyCell(row + 1,column + 1)) {
            routes.push([(row + 1 )* 10 + column + 1])
        }
        if (checkEmptyCell(row + 1,column - 1)) {
            routes.push([(row + 1 )* 10 + column - 1])
        }
        canEat(row+2,column+2)
        canEat(row+2,column-2)
    }
    else {
        if (checkEmptyCell(row - 1,column + 1)) {
            routes.push([(row - 1 )* 10 + column + 1])
        }
        if (checkEmptyCell(row - 1,column - 1)) {
            routes.push([(row - 1 )* 10 + column - 1])
        }
        
        canEat(row-2,column-2)
        canEat(row-2,column+2)
    }

    function canEat(newRow,newColumn,route = []) {

            if (route.includes((newRow)* 10 + newColumn)){
                return
            }
            if (checkEmptyCell(newRow,newColumn) && !checkEmptyCell((newRow + previousRow) / 2, (previousColumn + newColumn) / 2) && (getColor(row,column) !== getColor( (newRow + previousRow) / 2, (previousColumn + newColumn) / 2))){
                route.push(newRow* 10 + newColumn)
                routes.push(route)
                previousColumn = newColumn
                previousRow = newRow
                canEat(newRow+2,newColumn+2,[...route])
                canEat(newRow+2,newColumn-2,[...route])
                canEat(newRow-2,newColumn-2,[...route])
                canEat(newRow-2,newColumn+2,[...route])
            }
    }
}

function checkEndGame() {
    let countBlack = 0;
    let countWhite = 0;
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (getColor(i, j) === 'black') {
                countBlack++;
            } else if (getColor(i, j) === 'white') {
                countWhite++;
            }
        }
    }
    if (countWhite === 0 || countBlack == 0) {gameEnd()};
}

function gameEnd() {
    const message = document.querySelector('#gameEnded')
        if (moveCount % 2 == 0) {
            message.style.display = "inline";
            message.textContent += "white wins";
        } else {
            message.textContent += "black wins";
        }

}

initBoard()

const pieces = document.querySelectorAll('.piece')
pieces.forEach((piece) => {
    piece.onclick = checkValidity(movePiece)
})