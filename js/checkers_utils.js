
export function whosTurn (moveCount) {
    if (moveCount % 2 === 1) {
        document.querySelector("#turn").textContent = "black's turn"
    } else {
        document.querySelector("#turn").textContent = "White's turn"
    }
}

export function getColor(row, column){
    const cell = document.querySelector(`#cell-${row}-${column}`)
    if (!checkEmptyCell(row,column)){
        if (cell.firstElementChild.src.includes('black')){
            return 'black'
        }
        return 'white'
    }
    return null
}

export function checkEmptyCell(row,column) {
   if (isValidMove(row,column)) { 
    const src = getPiece(row,column).firstElementChild.src
        return  src === 'http://127.0.0.1:5500/html/checkers.html' || src === ''
   }
}

export function isValidMove(column,row) {
    return column <= 8 && column >=1 && row <= 8 && row >= 1
}

export function getLocation(piece){
    return  piece.id.split('-').slice(1,3).map( x => parseInt(x))
}

export function distanceFromPiece(piece1,piece2){
    const location1 = getLocation(piece1)
    const location2 = getLocation(piece2)
    return (Math.sqrt(Math.pow(location1[0] - location2[0],2) + Math.pow(location1[1] - location2[1],2)))
}

export function getPiece(row,column){
    return document.querySelector(`#cell-${row}-${column}`)
}

export function getLocationOurForm(location){
    return [parseInt(location / 10),location % 10]
}

export function checkRegularPiece(piece){
    return !piece.classList.contains('king')
}

export function reachedLastRow(piece,lastPieceOfRoute){
    const pieceLocation = getLocation(piece)
    const pieceColor = getColor(pieceLocation[0],pieceLocation[1])
    return (pieceColor === 'white' && getLocation(lastPieceOfRoute)[0] === 1) || 
    (pieceColor === 'black' && getLocation(lastPieceOfRoute)[0] === 8)
}

export function getScore(color){
    return JSON.parse(localStorage.getItem('users'))[getUser()][`${color}WinCount`]
}

export function getUser(){
    const users = JSON.parse(localStorage.getItem('users'))
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let indexUser = undefined;
    users.forEach( (user,index) =>{
        if (user.username === currentUser.username){
            indexUser = index
        }
    })

    return indexUser
}

