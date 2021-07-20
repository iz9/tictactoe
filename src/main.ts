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
  clearEventListeners()
  document.querySelector('.game-popup')?.setAttribute('style', 'display:none')
  gameBoard = Array.from(Array(9).keys())
  cells.forEach(cell => {
    cell.innerHTML = ''
    cell.classList.remove('win-cell', 'loose-cell')
    cell.addEventListener('click', turnClickHandler, false)
  })
  return void 0
}

function clearEventListeners() {
  cells.forEach(cell => {
    cell.removeEventListener('click', turnClickHandler, false)
  })
}

function turnClickHandler(event: Event): void {
  const target = event.target as HTMLElement
  if (typeof gameBoard[Number(target.id)] === 'number') {
    turn(target.id, Player.HUMAN)
    if (!checkWin(gameBoard, Player.HUMAN) && !checkTie())
      turn(bestSpot(), Player.AI)
  } else {
    turn(bestSpot(), Player.AI)
  }
  return void 0
}

function checkTie(): boolean {
  return emptySquares().length === 0
}

function bestSpot(): string {
  return minimax(gameBoard, Player.AI).index!.toString()
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
  clearEventListeners()
  document.querySelector('.game-popup')?.setAttribute('style', 'display:flex')
  return void 0
}

function declareWinner(player?: Player) {
  const popup = document.querySelector('.game-popup')
  if (popup) {
    if (player) {
      popup.innerHTML = player === Player.AI ? 'You LOOSE!' : 'You WON!'
    } else popup.innerHTML = 'TIE!'
  }
}

type Move = { score?: number; index?: number }
function minimax(newBoard: GameBoard, player: Player): Move {
  const availSpots: number[] = emptySquares()

  if (checkWin(newBoard, Player.HUMAN)) {
    return { score: -10 }
  } else if (checkWin(newBoard, Player.AI)) {
    return { score: 10 }
  } else if (availSpots.length === 0) {
    return { score: 0 }
  }
  const moves = []
  for (let i = 0; i < availSpots.length; i++) {
    const move: Move = {}
    move.index = newBoard[availSpots[i]] as number
    newBoard[availSpots[i]] = player

    if (player == Player.AI) {
      const result = minimax(newBoard, Player.HUMAN)
      move.score = result.score
    } else {
      const result = minimax(newBoard, Player.AI)
      move.score = result.score
    }

    newBoard[availSpots[i]] = move.index

    moves.push(move)
  }

  let bestMove: number = 0
  if (player === Player.AI) {
    let bestScore = -10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score! > bestScore) {
        bestScore = moves[i].score as number
        bestMove = i
      }
    }
  } else {
    let bestScore = 10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score! < bestScore) {
        bestScore = moves[i].score as number
        bestMove = i
      }
    }
  }

  return moves[bestMove]
}
