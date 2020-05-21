////////////////
/* Challenge 1: Your Age in Days */
////////////////
const ageToDays = () => {
    var birthYear = prompt("輸入你的出生年")
    var birthDays = 365 * (2020 - birthYear)
    var textAnswer = document.createTextNode(`You are ${birthDays} Days`);
    var h1 = document.createElement('h1')
    h1.setAttribute('id', 'birthDays');
    h1.appendChild(textAnswer);
    document.getElementById("flex-box-result").appendChild(h1);
}

const reset = () => {
    document.getElementById("birthDays").innerText = '';
}
////////////////
/*Challenge 2:Cat Generator */
////////////////
const generateCat = () => {
    var image = document.createElement('img');
    var div = document.getElementById('flex-cat-generate');
    image.src = "https://cdn2.thecatapi.com/images/3oi.gif"
    div.appendChild(image);
}
////////////////
/* Challenge 3:Rock, Papaer, Scissors*/
////////////////
const rpsGame = (yourChoice) => {
    var botChoice = numberToChoice(randToRspInt());
    results = rpsWinner(yourChoice.id, botChoice)

    console.log(`your choice: ${yourChoice.id}`);
    console.log(`bot choice: ${botChoice}`);
    // console.log(results)
    console.log(finalMessage(results))
    rpsFrontEnd(yourChoice.id, botChoice, finalMessage(results))
}

const randToRspInt = () => {
    return Math.floor(Math.random() * 3)
}

const numberToChoice = (number) => {
    return ['rock', 'paper', 'scissors'][number]
}

const rpsWinner = (heroChoice, botChoice) => {
    var rpsDatabase = {
        'rock': { 'scissors': 1, 'rock': 0.5, 'paper': 0 },
        'paper': { 'rock': 1, 'paper': 0.5, 'scissors': 0 },
        'scissors': { 'paper': 1, 'scissors': 0.5, 'rock': 0 }
    };

    var yourScore = rpsDatabase[heroChoice][botChoice];
    var botScore = rpsDatabase[botChoice][heroChoice];
    return [yourScore, botScore];
}

const finalMessage = ([yourScore, botScore]) => {
    /* ===完全正確  == "5" == 5 => True */
    if (yourScore === 0) {
        return { 'message': 'You lost!', 'color': 'red' }
    } else if (yourScore === 0.5) {
        return { 'message': 'You tie!', 'color': 'yellow' }
    } else {
        return { 'message': 'You won!', 'color': 'green' }
    }
}

const rpsFrontEnd = (humanImageChoice, botImageChoice, finalMessage) => {
    var imageDatabase = {
        'rock': document.getElementById('rock').src,
        'paper': document.getElementById('paper').src,
        'scissors': document.getElementById('scissors').src
    }
    document.getElementById('rock').remove();
    document.getElementById('paper').remove();
    document.getElementById('scissors').remove();

    var humanDiv = document.createElement('div');
    var botDiv = document.createElement('div');
    var messageDiv = document.createElement('div');

    humanDiv.innerHTML = `<img src="${imageDatabase[humanImageChoice]}"height="220" width="150" style="box-shadow:0px 10px 50px rgba(0, 255, 0, 0.7)">`
    messageDiv.innerHTML = `<h1 style="color:"${finalMessage['color']};font-size =40px; padding:20px;>${finalMessage['message']}`
    botDiv.innerHTML = `<img src="${imageDatabase[botImageChoice]}"height="220" width="150" style="box-shadow:0px 10px 50px rgba(255, 0, 0, 0.7)">`
    document.getElementById('flex-box-rps-div').appendChild(humanDiv)
    document.getElementById('flex-box-rps-div').appendChild(messageDiv)
    document.getElementById('flex-box-rps-div').appendChild(botDiv)

}
/////////////////
/* Challenge 4:Change the Color of All Buttons */
////////////////
var all_buttons = document.getElementsByTagName('button');

var copyAllButtons = [];

//restore all default value of all buttons
for (button of all_buttons) {
    copyAllButtons.push(button.classList['1'])
}
// console.log(copyAllButtons);

const buttonChange = (buttonThingy) => {
    if (buttonThingy.value === 'red') {
        buttonRed();
    } else if (buttonThingy.value === 'green') {
        buttonGreen();
    } else if (buttonThingy.value === 'reset') {
        buttonReset();
    } else if (buttonThingy.value === "random") {
        buttonRandom();

    }
}

const buttonRed = () => {
    for (button of all_buttons) {
        button.classList.remove(button.classList[1])
        button.classList.add('btn-danger')
    }
}
const buttonGreen = () => {
    for (button of all_buttons) {
        button.classList.remove(button.classList[1])
        button.classList.add('btn-success')
    }
}
const buttonReset = () => {
    for (let i = 0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1])
        all_buttons[i].classList.add(copyAllButtons[i])
    }
}

const buttonRandom = () => {
    let choice = ["btn-primary", "btn-success", "btn-danger", "btn-warning"]

    for (let i = 0; i < all_buttons.length; i++) {
        let randN = Math.floor(Math.random() * 4);
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add(choice[randN]);
    }

}

/////////////////
/* Challenge 5:Black Jack */
////////////////


const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lostSound = new Audio('static/sounds/aww.mp3');

// DOM = JS<=>  HTML                    #=>first id with ooxx
document.querySelector('#blackjack-hit').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand').addEventListener('click', dealerLogic);


let blackjackGame = {
    'you': { 'scoreSpan': "#your-blackjack-result", "div": "#yourbox", "score": 0 },
    'dealer': { 'scoreSpan': "#dealer-blackjack-result", "div": "#dealerbox", "score": 0 },
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
    'wins': 0,
    'losses': 0,
    'tie': 0,
    'isStand': false,
    'turnOver': false,
    'hitDealerAndShow': false
};
// player YOU and DEALER
const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']


function blackjackHit() {
    //function when click button "HIT" 
   
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU)
        updateScore(card, YOU)
        showScore(YOU)
    }
    if (blackjackGame['hitDealerAndShow'] === false) {
        dealerLogic()
        blackjackGame['hitDealerAndShow'] = true
    }

}
function blackjackDeal() {
    if (blackjackGame['turnOver'] === true) {
        blackjackGame['isStand'] = false;
        //reset  image   
        let yourImages = document.querySelector('#yourbox').querySelectorAll('img')
        let dealerImages = document.querySelector('#dealerbox').querySelectorAll('img')
        for (image of yourImages) {
            image.remove()
        }
        for (image of dealerImages) {
            image.remove()
        }
        //reset score to 0 and style back to white
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white'
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white'

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black'

       
    }
    blackjackGame['turnOver'] = false;
    blackjackGame['hitDealerAndShow'] = false;
}

async function dealerLogic() {
    // click stand button 
    
    if (blackjackGame['hitDealerAndShow'] === false) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER)
        
    }
    else {
        blackjackGame['isStand'] = true;
        while (DEALER['score'] < 17 && blackjackGame['isStand'] === true) {
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER)

            blackjackGame['turnOver'] = true;

            await sleep(500)

        }
        showResult(computeWinner())
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))

}
function showCard(card, activePlayer) {
    // generate <img> and its sorce path and append <div img....> 
    // add hit sound 
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage)
        hitSound.play();
    }
}



function randomCard() {
    //greneate random card by random num
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    //still have some promblem
    //but first logic is if hit +11 and <=21 let A = 11 else A =1
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card]
    }
}

function showScore(activePlayer) {
    //show score added by card number and > 21 show bust and style =red
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST'
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red'
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
    }
}



function computeWinner() {
    let winner;
    //  you below 21 condition
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['tie']++;
        }
    }
    else if (YOU['score'] > 21) {
        winner = DEALER;
        blackjackGame['losses']++
    }

    console.log(blackjackGame['wins'])
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (blackjackGame['turnOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins']
            message = 'You Won';
            messageColor = 'green';
            winSound.play()
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses']
            message = 'You Lost';
            messageColor = 'red';
            lostSound.play()
        } else {
            document.querySelector('#tie').textContent = blackjackGame['tie']
            message = 'TIE';
            messageColor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}