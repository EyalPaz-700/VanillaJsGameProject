const cardList = document.querySelector(".cards");
let cards = undefined;
const startGameBtn = document.getElementById("start-game");

startGameBtn.addEventListener("click",startGame)

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let cardNumber = 16

function initCards(){
    for (let i = 1; i <= cardNumber; ++i){
        const li = document.createElement('li')
    li.classList.add('card')
    const divFront = document.createElement('div')
    divFront.classList.add('view','front-view')
    const divBack = document.createElement('div')
    divBack.classList.add('view','back-view')
    const queImg =  document.createElement('img')
    queImg.src = "../media/que_icon.svg" 
    queImg.alt = "icon"
    let frontImg = document.createElement('img')
    frontImg.alt = "card-img"
    divBack.appendChild(frontImg)
    divFront.appendChild(queImg)
    li.appendChild(divFront)
    li.appendChild(divBack)
        frontImg.src = `../media/img-${i % 2 ===0 ? parseInt(i / 2) : parseInt(i / 2) + 1}.png`
        cardList.appendChild(li)
    }
    cardList.classList.add(`cards-${cardNumber}`)
    cards = document.querySelectorAll(".card");
}

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        debugger
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == cardNumber / 2) {
            endGame
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCards() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [...Array(cardNumber / 2).keys()].map(x => x + 1)
    arr  = [...arr,...arr]
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `../media/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}
function endGame(){
    cards.forEach(card => {
        card.onclick = undefined
    });
}

function startGame(){
    matched = 0
    shuffleCards();
    cards.forEach(card => {
        card.addEventListener("click", flipCard);
    });
}

initCards()


