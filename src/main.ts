import './style.css'

let gameBoard: Array<number | Player>
enum Player {
  HUMAN = 'O',
  AI = 'X',
}
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [1, 4, 8],
  [2, 4, 6],
]

const cells = document.querySelectorAll('.game-cell')
const replay = document.getElementById('replay')
startGame()

function startGame() {
  cleanup()
  document.querySelector('.game-popup')?.setAttribute('style', 'display:none')
  gameBoard = Array.from(Array(9).keys())
  cells.forEach(cell => {
    cell.innerHTML = ''
    cell.classList.remove('win-cell')
    cell.addEventListener('click', turnClickHandler, false)
  })
  if (replay) replay.addEventListener('click', startGame, false)
}

function cleanup() {
  if (replay) replay.removeEventListener('click', startGame)
  if (cells) {
    cells.forEach(cell => {
      cell.removeEventListener('click', turnClickHandler)
    })
  }
}

function turnClickHandler(event: Event) {
  const target = event.target as HTMLElement
  turn(target.id, Player.HUMAN)
}

function turn(id: string, player: Player) {
  gameBoard[Number(id)] = player
  const cell = document.getElementById(id)
  if (cell) {
    cell.innerHTML = player
  }
}
