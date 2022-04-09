const gameBoard = document.getElementById('gameBoard');
const letters = document.getElementById('alphabet');
const feedback = document.getElementById('feedback');
let wordle = "super";
//using Random Words API to get a random 5 letter word and setting it to 'wordle'
// function getNewWord(){
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
//             'X-RapidAPI-Key': '32052d4099mshded2a25491519e3p1fa16ejsn7a9d6de2c1df'
//         }
//     };
    
//     fetch('https://random-words5.p.rapidapi.com/getMultipleRandom?count=2&wordLength=5', options)
//         .then(response => response.json())
//         .then(response => {
//             setWord(response[0]);
//         })
//         .catch(err => console.error(err));
// }
// getNewWord();
// function setWord(input){
//     wordle = input;
//     console.log("wordle: "+ wordle);
// }

//dev mode

const answer = document.createElement("p");
answer.style.display = "none"; 
answer.innerHTML = wordle;

const dev = document.getElementById('dev');
let isDev = "OFF";
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
            btn.innerHTML = "Dev mode: " + isDev;
        }else{
            isDev = "OFF";
            answer.style.display = "none"; 
            btn.innerHTML = "Dev mode: " + isDev;
        }
    }else{
        btn.disabled;
        alert("can not switch dev mode after game start");
    }
    
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
            console.log(response.result_msg);
            checkResult(response.result_msg, word);
        })
        .catch(err => console.error(err));
}

//making the alphabet
const chars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'q',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'delete',
    'check',
]

//creating the display for the letter choices
chars.forEach(key => {
    const charBtn = document.createElement('button');
    charBtn.textContent = key;
    charBtn.setAttribute('id', key);
    charBtn.addEventListener('click', () => letterClick(key));
    letters.append(charBtn);
})

let currentRow = 0;
let currentTile = 0;

//add function for key press?
//add how to play modal

//function for what happens when a letter is picked
function letterClick(letter){
    if (currentTile < 6 && currentRow < 7) {
        //if user clicks backspace
        if (letter === 'delete') {
            deleteLetter();
            return
        }
        //if user clicks enter
        if (letter === 'check') {
            checkWord();
            return
        }
        
        addLetter(letter);
    }
}

//adding new letter
function addLetter(letter){
    const tile = document.getElementById('gameRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = letter;
    gameArray[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
    console.log(currentTile);
}

function deleteLetter(){
    if(currentTile > 0){
        feedback.innerText = " ";
        currentTile--; //go to space before
        const tile = document.getElementById('gameRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = ''; //delete whats in dom
        gameArray[currentRow][currentTile] = ''; //delete whats in game array
        tile.setAttribute('data', '');
    }
}

//win check function
function checkWord(){
    if(currentTile === 5){
       const word = gameArray[currentRow].join('');
       console.log(gameArray[currentRow].join(''));
        checkGuess(word);  
    }
}

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
        console.log(result + " not in dictionary");
    }
}

function changeTileColor(){

    let row = document.getElementById('gameRow-' + currentRow).childNodes;

    row.forEach((tile, index) => {

        const dataLetter = tile.getAttribute('data');
        const key = document.getElementById(dataLetter);
        console.log(dataLetter, key);
        console.log(wordle[index]);

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

//game over and reset game functionality
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

//creating the game board skeleton with array
//gets filled out as user plays
const gameArray = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]
//setting up the board
gameArray.forEach((gameRow, gameRowIndex) => {
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

