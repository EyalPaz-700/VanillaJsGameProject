const board = document.querySelector('.board')


const whiteCircle = "../media/black-circle.svg"
const blackCircle = "../media/circle-15.svg"

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
            if (i >= 6){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
                    tempCell.appendChild(document.createElement("img"))
                    tempCell.firstElementChild.src = whiteCircle
                }
            }
            if (i<=3){
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ){
                    tempCell.appendChild(document.createElement("img"))
                    tempCell.firstElementChild.src = blackCircle
                }
            }
        }
        tempRow.appendChild(tempCell)
    }
        board.appendChild(tempRow)
    }
}


initBoard()
