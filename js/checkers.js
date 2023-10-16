const board = document.querySelector('.board')


const whiteCircle = "../media/black-circle.svg"
const blackCircle = "../media/circle-15.svg"

let moveCount = 0
let routes = []



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
            tempCell.classList.add('piece')
            if (i >= 6){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
                    tempCell.firstElementChild.src = whiteCircle
                }
            }
            if (i<=3){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
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
        
        if ((this.firstElementChild.src.includes('black') && moveCount % 2 === 0) ||
            (this.firstElementChild.src.includes('15') && moveCount % 2 === 1)) {

            document.querySelectorAll('.available-move').forEach( e => {
                e.classList.remove('available-move')
            })
            func.apply(this, arguments);
        }
    };
}


function getColor(row, column){
    const cell = document.querySelector(`#cell-${row}-${column}`)
    if (!checkEmptyCell(column,row)){
        if (cell.firstElementChild.src === blackCircle){
            return 'black'
        }
        return 'white'
    }
    return null
}

function checkEmptyCell(row,column) {
   if (isValidMove(row,column)) { 
    const src = getPiece(row,column).firstElementChild.src
        return  src === 'http://127.0.0.1:5500/html/' || src === ''
   }
}

function isValidMove(column,row) {
    return column <= 8 && column >=1 && row <= 8 && row >= 1
}

function getLocation(piece){
    return  piece.id.split('-').slice(1,3).map( x => parseInt(x))
}

function getPiece(row,column){
    return document.querySelector(`#cell-${row}-${column}`)
}

function availableMoves() {
    routes = []
    const location = getLocation(this)
    const row = location[0]
    const column = location[1]
    if (getColor(row,column) === 'black'){
        if (checkEmptyCell(row + 1,column + 1)) {
            routes.push([(row + 1 )* 10 + column + 1])
        }
        if (checkEmptyCell((row + 1,column - 1))) {
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
            if (route.includes((row + 1 )* 10 + column + 1)){
                return
            }
            if (checkEmptyCell(newRow,newColumn) && !checkEmptyCell(row,column) && !checkEmptyCell((newRow + row) / 2, (column + newColumn) / 2) && (getColor(row,column) !== getColor( (newRow + row) / 2, (column + newColumn) / 2))){
                route.push(newRow,newColumn)
                routes.push(route)
                    canEat(row+2,column+2,route)
                    canEat(row+2,column-2,route)
                    canEat(row-2,column-2,route)
                    canEat(row-2,column+2,route)
            }
    }
   
}

initBoard()

const pieces = document.querySelectorAll('.piece')
pieces.forEach((piece) => {
    piece.onclick = checkValidity(availableMoves)
})