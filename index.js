const centralSessionContainer = document.querySelector('#central_session');
const systemMessageContainer= document.querySelector('#system_message');
const radioButtonChoice = document.querySelectorAll('input[name=opponent]');
const startGameButton = document.querySelector('#start_game_button');
const restartEndButtonsContainer = document.querySelector('#restart_end_buttons');
const gameInterfaceContainer = document.querySelector('#game_interface');
const endPageContainer = document.querySelector('#end_page');

const columns = document.querySelectorAll('.column');

const playerOneContainer = document.querySelector('.players.one');
const playerTwoContainer = document.querySelector('.players.two');
const playerOneScore = document.querySelector('.score_number.p1');
const playerTwoScore = document.querySelector('.score_number.p2');

const opponent = (selectors) => {

  for (element of selectors) {
    if (element.checked) {
      return element.value;
    }
  }
}

const addMainFunctionToColumns = (columns) => {
  
  for (const col of columns) {
    col.addEventListener('click', main);
  }
}

class Player {

  constructor(opponent, color, score = 0) {
    this.opponent = opponent;
    this.color = color;
    this.score = score;
  }

  setOpponent = () => {
    switch(true){
      case (this.opponent === 'Player 1'):
        this.color = 'red';
        break;
      case (this.opponent === 'Player 2'):
        this.color = 'blue';
        break;
      case (this.opponent === 'Computer'):
        this.color = 'rgb(209, 183, 2)';
        break;        
    }
  }
}

const initialGameVariables = {
  playerOneScore: playerOneScore.innerText,
  playerTwoScore: playerTwoScore.innerText,
  positionBackgroundColor: '',
  gameOn: true,
  player1: new Player('Player 1'),
  inititalPlayerContainerBorder: '5px solid black',
  columnPositionsOccupied: 0,
}

let currentGameVariables = {
  playerOneScore: initialGameVariables.playerOneScore,
  playerTwoScore: initialGameVariables.playerTwoScore,
  gameOn: initialGameVariables.gameOn,
  player: initialGameVariables.player1,
  columnPositionsOccupied: initialGameVariables.columnPositionsOccupied,
}

const startGameChangeDom = () => {
  centralSessionContainer.style.visibility = 'visible';
  systemMessageContainer.style.visibility = 'hidden';
  systemMessageContainer.style.height = '100px';
  centralSessionContainer.style.height = 'fit-content';
  restartEndButtonsContainer.style.visibility = 'visible';

  // Set initial values for Player 1
  initialGameVariables.player1.setOpponent();
  playerOneContainer.style.backgroundColor = initialGameVariables.player1.color;
  playerOneContainer.style.border = initialGameVariables.inititalPlayerContainerBorder;
  
  // Set initial values for Player 2
  initialGameVariables.player2 = new Player(opponent(radioButtonChoice));
  initialGameVariables.player2.setOpponent();
  playerTwoContainer.firstChild.data = initialGameVariables.player2.opponent;
  playerTwoContainer.style.backgroundColor = initialGameVariables.player2.color;
}

const computerPlay = (columns) => {

  const col = Math.abs(Math.floor(Math.random() * columns.length))
  return col;
}

// Mark position with player's color.
const selectPiecePosition = (col, player) => {

  // Start from bottom to top, following the game's rules.
  const colsReversed = Array.from(document.getElementById(col.id).children).reverse();


  for (const elem of colsReversed) {
    if (!elem.style.backgroundColor) {
      return elem.style.backgroundColor = player.color;
    }
  }
}

const changePlayer = (player) => {
  if (player === initialGameVariables.player1) {
    playerOneContainer.style.border = ''
    playerTwoContainer.style.border = '5px solid black'
    return currentGameVariables.player = initialGameVariables.player2;
  } 
  
  if (player === initialGameVariables.player2) {
    playerTwoContainer.style.border = ''
    playerOneContainer.style.border = '5px solid black'
    return currentGameVariables.player = initialGameVariables.player1;
  }
}

const checkWinner = () => {
  
  ////// Check for vertical completion.
  for (let col = 0; col < columns.length; col++) {
    for (let line = 0; line < columns[0].children.length; line++) {
      
      if (line + 3 < columns[col].children.length) {

        // Check for PLayer 1 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col].children[line+1].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col].children[line+2].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col].children[line+3].style.backgroundColor === initialGameVariables.player1.color) {
            console.log(initialGameVariables.player1.opponent, 'WINS');
            playerOneScore.innerText++;
            stopGame();
            // I added the return in order to exit the function execution so it doesn't count twice in case of a diagonal and vertical completion at the same time.
            return;
          };
        // Check for Player 2 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col].children[line+1].style.backgroundColor === initialGameVariables.player2.color && 
          columns[col].children[line+2].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col].children[line+3].style.backgroundColor === initialGameVariables.player2.color) {
            console.log(initialGameVariables.player2.opponent, 'WINS');
            playerTwoScore.innerText++;
            stopGame();
            return;
        }    
      }
    }
  }

  ////// Check for horizontal completion.
  for (let col = 0; col < columns.length; col++) {
    for (let line = 0; line < columns[0].children.length; line++) {
      
      if (col + 3 < columns.length) {
        // Check for PLayer 1 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+1].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+2].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+3].children[line].style.backgroundColor === initialGameVariables.player1.color) {
            console.log(initialGameVariables.player1.opponent, 'WINS');
            playerOneScore.innerText++;
            stopGame();
            return;
          }
        // Check for Player 2 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+1].children[line].style.backgroundColor === initialGameVariables.player2.color && 
          columns[col+2].children[line].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+3].children[line].style.backgroundColor === initialGameVariables.player2.color) {
            console.log(initialGameVariables.player2.opponent, 'WINS');
            playerTwoScore.innerText++;
            stopGame();
            return;
        }
      }
    }
  }
  
  ////// Diagonal up-down, left-right
  for (let col = 0; col < columns.length-1; col++) {
    for (let line = 0; line < columns[0].children.length; line++) {

      if (col + 3 < columns.length && line + 3 < columns[0].children.length) {

        // Check for PLayer 1 completion
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+1].children[line+1].style.backgroundColor === initialGameVariables.player1.color && 
          columns[col+2].children[line+2].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+3].children[line+3].style.backgroundColor === initialGameVariables.player1.color) {
            console.log(initialGameVariables.player1.opponent, 'WINS');
            playerOneScore.innerText++;
            stopGame();
            return;
        }
        // Check for Player 2 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+1].children[line+1].style.backgroundColor === initialGameVariables.player2.color && 
          columns[col+2].children[line+2].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+3].children[line+3].style.backgroundColor === initialGameVariables.player2.color) {
            console.log(initialGameVariables.player2.opponent, 'WINS');
            playerTwoScore.innerText++;
            stopGame();
            return;
        }
      }
    }    
  }

  ////// Diagonal down-up, left-right
  for (let col = 0; col < columns.length-1; col++) {
    for (let line = columns[0].children.length-1; line > -1; line--) {

      if (col + 3 < columns.length && line - 3 > -1) {
        
        // Check for PLayer 1 completion
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+1].children[line-1].style.backgroundColor === initialGameVariables.player1.color && 
          columns[col+2].children[line-2].style.backgroundColor === initialGameVariables.player1.color &&
          columns[col+3].children[line-3].style.backgroundColor === initialGameVariables.player1.color) {
            console.log(initialGameVariables.player1.opponent, 'WINS');
            playerOneScore.innerText++;
            stopGame();
            return;
        }
        // Check for Player 2 completion        
        if(columns[col].children[line].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+1].children[line-1].style.backgroundColor === initialGameVariables.player2.color && 
          columns[col+2].children[line-2].style.backgroundColor === initialGameVariables.player2.color &&
          columns[col+3].children[line-3].style.backgroundColor === initialGameVariables.player2.color) {
            console.log(initialGameVariables.player2.opponent, 'WINS');
            playerTwoScore.innerText++;
            stopGame();
            return;
        }
      }
    }    
  }
}

const checkColumnFull = (col) => {

  for (const pos of col.children) {

    if(pos.style.backgroundColor === initialGameVariables.player1.color  || pos.style.backgroundColor === initialGameVariables.player2.color) {

      currentGameVariables.columnPositionsOccupied++;

      if(currentGameVariables.columnPositionsOccupied === col.children.length) {
        console.log('This column is full. Please choose another column to put your piece.');
        col.removeEventListener('click', main);
      }
    }
  } 
  currentGameVariables.columnPositionsOccupied = 0;
}

const stopGame = () => {

  currentGameVariables.gameOn = false;
}

const restartGame = () => {

  for (const col of columns) {
    for (const line of col.children) {
      line.style.backgroundColor = initialGameVariables.positionBackgroundColor;
    }
  }
  currentGameVariables.gameOn = initialGameVariables.gameOn;
  addMainFunctionToColumns(columns);
}

const endGame = () => {

  gameInterfaceContainer.style.display = 'none';
  endPageContainer.style.visibility = 'visible';
}

const playAgain = () => {

  window.location.href = 'index.html';
}

const main = (col) => {
  
  if (currentGameVariables.gameOn) {

    // Two players
    if (initialGameVariables.player2.opponent === 'Player 2') {

      if (currentGameVariables.player.opponent === 'Player 1'){
        selectPiecePosition(col.currentTarget, currentGameVariables.player);
        checkColumnFull(col.currentTarget);
        checkWinner();
        if (currentGameVariables.gameOn === false) {
          currentGameVariables.player = changePlayer(currentGameVariables.player);
          return;
        }
      }
    
      if (currentGameVariables.player.opponent === 'Player 2') {
        selectPiecePosition(col.currentTarget, currentGameVariables.player);
        checkColumnFull(col.currentTarget);
        checkWinner();
        if (currentGameVariables.gameOn === false) {
          currentGameVariables.player = changePlayer(currentGameVariables.player);
          return;
        }
      }
      currentGameVariables.player = changePlayer(currentGameVariables.player);
    }
    
    // Play against Computer
    if (initialGameVariables.player2.opponent === 'Computer') {

      if (currentGameVariables.player.opponent === 'Player 1'){
        selectPiecePosition(col.currentTarget, currentGameVariables.player);
        checkColumnFull(col.currentTarget);
        checkWinner();
        if (currentGameVariables.gameOn === false) {
          return;
        }
        currentGameVariables.player = changePlayer(currentGameVariables.player);
      }
    
      if (currentGameVariables.player.opponent === 'Computer') {
        const col = columns[computerPlay(columns)]
        selectPiecePosition(col, currentGameVariables.player);
        checkColumnFull(col);
        checkWinner();
        currentGameVariables.player = changePlayer(currentGameVariables.player);
        if (currentGameVariables.gameOn === false) {
          return;
        }
      }
    }
  }
}

addMainFunctionToColumns(columns);

