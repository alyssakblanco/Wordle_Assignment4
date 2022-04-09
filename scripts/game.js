// 
// html elements
//
const gameBoard = document.getElementById('gameBoard');
const letters = document.getElementById('alphabet');
const feedback = document.getElementById('feedback');

// 
// global vars
// 
let currentRow = 0;
let currentTile = 0;
let wordle;

// 
// onLoad function
// 
window.onload = function start(){
    GameBoard.build();
    Keyboard.build();
    getNewWord();
}

// 
// game objects
// 
const GameBoard = {
    gameArray: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ],
    build: function(){
        this.gameArray.forEach((gameRow, gameRowIndex) => {
            //create rows for each row in gameArray
            const row = document.createElement('div')
            row.setAttribute('id', 'gameRow-' + gameRowIndex)
            //creating a tile for each item in the gameArray array
            gameRow.forEach((_guess, guessIndex) => {
                const tile = document.createElement('div')
                tile.setAttribute('id', 'gameRow-' + gameRowIndex + '-tile-' + guessIndex)
                tile.classList.add('tile')
                row.append(tile)
            })
            gameBoard.append(row)
        })
    },
    addLetter: function(letter){
            const tile = document.getElementById('gameRow-' + currentRow + '-tile-' + currentTile);
            tile.textContent = letter;
            this.gameArray[currentRow][currentTile] = letter;
            tile.setAttribute('data', letter);
            currentTile++;
    },
    deleteLetter: function(){
        if(currentTile > 0){
            feedback.innerText = " ";
            currentTile--; //go to space before
            const tile = document.getElementById('gameRow-' + currentRow + '-tile-' + currentTile);
            tile.textContent = ''; //delete whats in dom
            this.gameArray[currentRow][currentTile] = ''; //delete whats in game array
            tile.setAttribute('data', '');
        }
    } 
}

const Keyboard = {
    chars: [
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
        'p','q','r','s','t','u','v','w','x','y','z',
        'delete',
        'check',
    ],
    build: function(){
        this.chars.forEach(key => {
            const charBtn = document.createElement('button');
            charBtn.textContent = key;
            charBtn.setAttribute('id', key);
            charBtn.addEventListener('click', () => this.letterClick(key));
            letters.append(charBtn);
        })
    },
    letterClick: function(letter){
        if (currentTile < 6 && currentRow < 7) {
            //if user clicks backspace
            if (letter === 'delete') {
                GameBoard.deleteLetter();
                return
            }
            //if user clicks enter
            if (letter === 'check') {
                checkWord();
                return
            }
            
            GameBoard.addLetter(letter);
        }
    },
}

// 
// API's
// 
//using Random Words API to get a random 5 letter word and setting it to 'wordle'
function getNewWord(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
            'X-RapidAPI-Key': '32052d4099mshded2a25491519e3p1fa16ejsn7a9d6de2c1df'
        }
    };
    
    fetch('https://random-words5.p.rapidapi.com/getMultipleRandom?count=2&wordLength=5', options)
        .then(response => response.json())
        .then(response => {
            setWord(response[0]);
        })
        .catch(err => console.error(err));
}
function setWord(input){
    wordle = input;
    console.log("wordle: "+ wordle);
}
//checking guesses with Word Dictionary API
function checkGuess(word){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com',
            'X-RapidAPI-Key': '32052d4099mshded2a25491519e3p1fa16ejsn7a9d6de2c1df'
        }
    };

    const url = "https://twinword-word-graph-dictionary.p.rapidapi.com/difficulty/?entry="+word;
    
    fetch(url, options)
        .then(response => response.json())
        .then(response => {
            checkResult(response.result_msg, word);
        })
        .catch(err => console.error(err));
}

//
// gameplay functionality 
// 
function checkResult(result, word){
    if(result == "Success"){
        changeTileColor();
       //winner winner chicken dinner
        if(wordle == word){
            gameOverModal("You Won!");
        }
        else{
            //no more guesses allowed
            if(currentRow >= 5){ 
                gameOverModal("You Lost");
            }
            //go to next row
            if(currentRow < 5){
                currentRow++;
                currentTile = 0;
            }
        }
    }else{
        feedback.innerText = "Word not in dictionary, try again";
    }
}
function changeTileColor(){

    let row = document.getElementById('gameRow-' + currentRow).childNodes;

    row.forEach((tile, index) => {

        const dataLetter = tile.getAttribute('data');
        const key = document.getElementById(dataLetter);

        if(dataLetter == wordle[index]){
            tile.classList.add('green');
            key.classList.add('green');
        }
        else if(wordle.includes(dataLetter)){
            tile.classList.add('yellow');
            key.classList.add('yellow');
        }
        else{
            key.classList.add('red');
        }
    })
}
function checkWord(){
    if(currentTile === 5){
       const word = GameBoard.gameArray[currentRow].join('');
       checkGuess(word);  
    }
}

//
// dev mode vars & function
//
const dev = document.getElementById('dev');
let isDev = "OFF";
const answer = document.createElement("p");
dev.append(answer);
const btn = document.createElement("button");
btn.innerHTML = "Dev mode: " + isDev;
btn.addEventListener("click", devMode);

const options = document.getElementById('options');
options.appendChild(btn);

function devMode(){
     if(currentRow == 0 && currentTile == 0){
        if(isDev == "OFF"){
            isDev = "ON";
            answer.style.display = "inline";
            answer.innerHTML = wordle;
            btn.innerHTML = "Dev mode: " + isDev;
        }else{
            isDev = "OFF";
            answer.style.display = "none"; 
            answer.innerHTML = "";
            btn.innerHTML = "Dev mode: " + isDev;
        }
    }else{
        btn.disabled;
        alert("can not switch dev mode after game start");
    } 
}

//
//game over and reset game functionality
//
const resetBtn = document.createElement("button");
resetBtn.innerHTML = "Start New Game";
resetBtn.addEventListener("click", resetGame);

function gameOverModal(gameOverTxt){
    const modal = document.createElement("div");
    modal.setAttribute('id','modal');
    letters.innerHTML = "";
    letters.appendChild(modal);
    modal.innerHTML = gameOverTxt;
    modal.appendChild(resetBtn);
}

function resetGame(){
    location.reload();
}