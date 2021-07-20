import './style.css'
enum Player {
  HUMAN = 'X',
  AI = 'O',
}
type GameBoard = Array<number | Player>
type GameWon = null | { index: number; player: Player }

let gameBoard: GameBoard

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const cells = document.querySelectorAll('.game-cell')
const replay = document.getElementById('replay')
if (replay) replay.addEventListener('click', startGame, false)
startGame()

function startGame(): void {
  document.querySelector('.game-popup')?.setAttribute('style', 'display:none')
  gameBoard = Array.from(Array(9).keys())
  cells.forEach(cell => {
    cell.innerHTML = ''
    cell.classList.remove('win-cell')
    cell.addEventListener('click', turnClickHandler, false)
  })
  return void 0
}

function turnClickHandler(event: Event): void {
  const target = event.target as HTMLElement
  if (typeof gameBoard[Number(target.id)] === 'number') {
    turn(target.id, Player.HUMAN)
    if (!checkTie()) turn(bestSpot(), Player.AI)
  }
  return void 0
}

function checkTie(): boolean {
  return emptySquares().length === 0
}

function bestSpot(): string {
  return emptySquares()[0].toString()
}

function emptySquares(): number[] {
  return gameBoard.reduce(
    (a, e, i) => (typeof e === 'number' ? a.concat(i) : a),
    [] as number[],
  )
}

function turn(id: string, player: Player): void {
  gameBoard[Number(id)] = player
  const cell = document.getElementById(id)
  if (cell) {
    cell.innerHTML = player
  }
  const gameWon: GameWon = checkWin(gameBoard, player)
  if (gameWon) {
    gameOver(gameWon)
  } else if (checkTie()) {
    gameOver(null)
  }
  return void 0
}

function checkWin(board: GameBoard, player: Player): GameWon {
  const plays = board.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    [] as GameBoard,
  )
  let gameWon = null

  winLoop: for (const [index, win] of Array.from(winCombos.entries())) {
    if (win.every(e => plays.includes(e))) {
      gameWon = { index, player }
      break winLoop
    }
  }

  return gameWon
}

function gameOver(gameWon: GameWon): void {
  if (gameWon) {
    const className =
      gameWon.player === Player.HUMAN ? 'win-cell' : 'loose-cell'
    winCombos[gameWon.index].forEach(i => {
      document.getElementById(i.toString())?.classList.add(className)
    })
  }
  declareWinner(gameWon?.player)
  cells.forEach(cell => {
    cell.removeEventListener('click', turnClickHandler, false)
  })
  document.querySelector('.game-popup')?.setAttribute('style', 'display:block')
  return void 0
}

function declareWinner(player?: Player) {
  const popup = document.querySelector('.game-popup')
  if (popup) {
    if (player) {
      popup.innerHTML = `winner is: ${player}`
    } else popup.innerHTML = 'tie'
  }
}
