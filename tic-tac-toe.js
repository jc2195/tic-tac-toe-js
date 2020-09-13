const game = (() => {
  const gameBoard = (() => { 
    let board = ["", "", "", "", "", "", "", "", ""];
    const updateBoard = (index, symbol) => {
      board[index] = symbol;
    }
    const getBoard = () => {
      return board;
    }
    const resetBoard = () => {
      board = board.map(function(square) {
        return "";
      });
    }
    return {updateBoard, getBoard, resetBoard};
  })();

  const logic = (() => {
    const checkWinner = (board) => {
      if (board[0] != "" && board[0] == board[1] && board[0] == board[2]) {
        return true;
      }
      else if (board[3] != "" && board[3] == board[4] && board[3] == board[5]) {
        return true;
      }
      else if (board[6] != "" && board[6] == board[7] && board[6] == board[8]) {
        return true;
      }
      else if (board[0] != "" && board[0] == board[3] && board[0] == board[6]) {
        return true;
      }
      else if (board[1] != "" && board[1] == board[4] && board[1] == board[7]) {
        return true;
      }
      else if (board[2] != "" && board[2] == board[5] && board[2] == board[8]) {
        return true;
      }
      else if (board[0] != "" && board[0] == board[4] && board[0] == board[8]) {
        return true;
      }
      else if (board[2] != "" && board[2] == board[4] && board[2] == board[6]) {
        return true;
      }
      else {
        return false;
      }
    }
    const playTurn = (index, symbol) => {
      gameboard = gameBoard.getBoard();
      if (gameboard[index] == "") {
        gameBoard.updateBoard(index, symbol);
        displayController.updateBoardDisplay(index);
        if (checkWinner(gameboard)) {
          displayController.endGameWin();
        }
        else if (checkFull(gameboard)) {
          displayController.endGameDraw();
        }
        else {
          playerController.changeCurrentPlayer();
          displayController.showPlayer();
        }
      }
    }
    const computerTurn = (board) => {
      let tempboard = board;
      let position = bestMove(tempboard);
      position = position[1];
      playTurn(position.toString(), currentPlayer.symbol);
    }
    const bestMove = (board) => {
      let bestMove = [-9999999999, -9999999999];
      board.forEach(function(square, index) {
        if (square == "") {
          let bestMoveBoard = board.slice(0);
          bestMoveBoard[index] = player2.symbol;
          let minimaxReturn = minimax(bestMoveBoard, false);
          if (minimaxReturn > bestMove[0]) {
            bestMove = [minimaxReturn, index];
          }
        }
      });
      return bestMove;
    }
    const minimax = (board, isMaximisingPlayer) => {
      if (checkWinner(board)) {
        if (isMaximisingPlayer) {
          return -1;
        }
        else {
          return 1;
        }
      }
      else if (checkFull(board)) {
        return 0;
      }
  
      if (isMaximisingPlayer) {
        let bestVal = -9999999999;
        board.forEach(function(square, index) {
          if (square == "") {
            let tempboard = board.slice(0);
            tempboard[index] = player2.symbol;
            let value = minimax(tempboard, false);
            bestVal = Math.max(value, bestVal);
          }
        });
        return bestVal;
      }
  
      else {
        let bestVal = 9999999999;
        board.forEach(function(square, index) {
          if (square == "") {
            let tempboard = board.slice(0);
            tempboard[index] = player1.symbol;
            let value = minimax(tempboard, true);
            bestVal = Math.min(value, bestVal);
          }
        });
        return bestVal;
      }
    }
    const resetGame = (type) => {
      gameBoard.resetBoard();
      let gameSquares = document.querySelectorAll(".gridsquare");
      gameSquares.forEach(function(square) {
        square.innerHTML = "";
      });
      document.querySelector(".play-again").style.display = "none";
      document.querySelector(".main-menu").style.display = "none";
      document.querySelector(".end-message").style.display = "none";
      if (type == 1) {
        document.querySelector(".board").style.display = "grid";
        document.querySelector(".game-message").style.display = "block";
      }
      else {
        document.querySelector(".welcome").style.display = "block";
        document.querySelector(".playbuttons").style.display = "block";
        gameMode = null;
      }
      playerController.assignSymbols();
      playerController.setCurrentPlayer();
      displayController.showPlayer();
    }
    const checkFull = (board) => {
      let full = true;
      board.forEach(function(square) {
        if (square == "") {
          full = false;
        }
      });
      return full;
    }
    return {playTurn, computerTurn, resetGame};
  })();

  const playerController = (() => {
    const player = (name = "", symbol = "") => {
      return { name, symbol };
    };
    const randomOrder = () => {
      if (Math.round(Math.random()) == 1) {
        return true;
      }
      else {
        return false;
      }
    }
    const getPlayerData = () => {
      let namePlayer1 = "";
      let namePlayer2 = ""
      if(gameMode == 1) {
        namePlayer1 = document.getElementById("p1-name").value;
        namePlayer2 = document.getElementById("p2-name").value;
        document.querySelector(".playerform").style.display = "none";
      }
      else {
        namePlayer1 = document.getElementById("p1-computer-name").value;
        namePlayer2 = document.getElementById("p2-computer-name").value;
        document.querySelector(".player-computerform").style.display = "none";
      }
      player1.name = namePlayer1;
      player2.name = namePlayer2;
      document.querySelector(".board").style.display = "grid";
      assignSymbols();
      playerController.setCurrentPlayer();
      document.querySelector(".game-message").style.display = "block";
      displayController.showPlayer();
      return false;
    } 
    const assignSymbols = () => {
      if (randomOrder()) {
        player1.symbol = "○";
        player2.symbol = "⨉";
      }
      else {
        player1.symbol = "⨉";
        player2.symbol = "○";
      }
    }
    const setCurrentPlayer = () => {
      if (randomOrder()) {
        currentPlayer = player1;
      }
      else {
        currentPlayer = player2;
      }
      changeCurrentPlayer();
    }
    const changeCurrentPlayer = () => {
      if (currentPlayer == player1) {
        currentPlayer = player2;
      }
      else {
        currentPlayer = player1;
      }
      if (gameMode == 2 && currentPlayer == player2) {
        logic.computerTurn(gameBoard.getBoard());
      }
    }
    return {player, getPlayerData, assignSymbols, setCurrentPlayer, changeCurrentPlayer};
  })();

  const displayController = (() => {
    const updateBoardDisplay = (id) => {
      let squareToChange = document.getElementById(id);
      squareToChange.innerHTML = currentPlayer.symbol;
    }
    const showPlayer = () => {
      let message = document.querySelector(".game-message");
      message.innerHTML = `${currentPlayer.name} \(${currentPlayer.symbol}\), select a square!`
    }
    const endGameWin = () => {
      document.querySelector(".board").style.display = "none";
      document.querySelector(".game-message").style.display = "none";
      let winningMessage = document.querySelector(".end-message");
      winningMessage.innerHTML = `${currentPlayer.name} \(${currentPlayer.symbol}\) is the winner!`
      winningMessage.style.display = "block";
      let playAgainButton = document.querySelector(".play-again");
      playAgainButton.style.display = "block";
      let menuButton = document.querySelector(".main-menu");
      menuButton.style.display = "block";
    }
    const endGameDraw = () => {
      document.querySelector(".board").style.display = "none";
      document.querySelector(".game-message").style.display = "none";
      let drawMessage = document.querySelector(".end-message");
      drawMessage.innerHTML = `It's a draw!`
      drawMessage.style.display = "block";
      let playAgainButton = document.querySelector(".play-again");
      playAgainButton.style.display = "block";
      let menuButton = document.querySelector(".main-menu");
      menuButton.style.display = "block";
    }
    const playButton = document.querySelector(".play");
    playButton.addEventListener('click', () => {
      document.querySelector(".playbuttons").style.display = "none";
      document.querySelector(".welcome").style.display = "none";
      document.querySelector(".playerform").style.display = "block";
      gameMode = 1;
    });
    const playComputerButton = document.querySelector(".play-computer");
    playComputerButton.addEventListener('click', () => {
      document.querySelector(".playbuttons").style.display = "none";
      document.querySelector(".welcome").style.display = "none";
      document.querySelector(".player-computerform").style.display = "block";
      gameMode = 2;
    });
    const gridSquares = document.querySelectorAll(".gridsquare");
    gridSquares.forEach(function(gridSquare) {
      gridSquare.addEventListener("click", () => {
        logic.playTurn(gridSquare.id, currentPlayer.symbol);
      });
    });
    const playAgainButton = document.querySelector(".play-again");
    playAgainButton.addEventListener("click", () => {
      logic.resetGame(1);
    });
    const menuButton = document.querySelector(".main-menu");
    menuButton.addEventListener("click", () => {
      logic.resetGame(2);
    });
    return {updateBoardDisplay, showPlayer, endGameWin, endGameDraw};
  })();

  const accessController = (() => {
    const getPlayerData = () => {
      return playerController.getPlayerData();
    }
    return {getPlayerData};
  })();

  let currentPlayer = ""
  let gameMode = null;
  let player1 = playerController.player();
  let player2 = playerController.player();

  return {accessController};
})();
