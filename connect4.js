class Player {
    constructor(color) {
        this.color = color;
    }
}

class Game {
    constructor(player1, player2, height = 6, width = 7) {
        this.height = height;
        this.width = width;
        this.players = [player1, player2];
        this.currentPlayer = this.players[0];
        this.board = [];
        this.gameOver = false;
        this.makeBoard();
        this.makeHtmlBoard();
    }
  // Make javascript Board
  makeBoard() {
      for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({length: this.width}));
      }
  }

  // Make HTML version of the Board
  makeHtmlBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';

      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this.handleClick.bind(this));

      for (let x = 0; x < this.width; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
      }

      board.append(top);

      for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');

          for (let x = 0; x < this.width; x++) {
              const cell = document.createElement('td');
              cell.setAttribute('id', `${y}-${x}`);
              row.append(cell);
          }

          board.append(row);
      }
  }

  findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
              return y;
          }
      }
      return null;
  }


  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currentPlayer.color;
    piece.style.top = -50 * (y + 2) + "px";

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
}

  endGame(msg) {
      alert(msg);
      this.gameOver = true;
  }

  handleClick(evt) {
    if (this.gameOver) return;
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
        return;
    }

    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);

    // Check for win
    if (this.checkForWin()) {
        return this.endGame(`Player ${this.currentPlayer.color} won!`);
    }

    // Check for tie
    if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
    }

    // Switch players
    this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
}

  checkForWin() {
      const _win = cells =>
          cells.every(
              ([y, x]) =>
                  y >= 0 &&
                  y < this.height &&
                  x >= 0 &&
                  x < this.width &&
                  this.board[y][x] === this.currentPlayer
          );

      for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
              if (_win([[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]) ||
                  _win([[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]) ||
                  _win([[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]) ||
                  _win([[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]])) {
                  return true;
              }
          }
      }
  }
}
// Create a new game
let game;

document.getElementById('player-color-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const player1Color = document.getElementById('player1-color').value;
    const player2Color = document.getElementById('player2-color').value;

    const player1 = new Player(player1Color);
    const player2 = new Player(player2Color);

    game = new Game(player1, player2);
});