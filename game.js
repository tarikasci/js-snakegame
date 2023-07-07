const scoreElement = document.querySelector('#scoreText')
const highScoreElement = document.querySelector('#highScore')
const gameOverElement = document.querySelector('.gameOver')
const playAgainBtn = document.querySelector('#playAgainBtn')


const cvs = document.getElementById('cvs')
const ctx = cvs.getContext('2d')

cvs.style.border = 'solid 1px #fff'

const width = cvs.width
const height = cvs.height

const FPS = 1000/15
let gameLoop
const squareSize = 20
let gameStarted = false

let boardColor = '#6527BE', headColor = '#FFF', bodyColor = '#999'

let currentDirection = ''
let directionsQue = []
const directions = {
  RIGHT : 'ArrowRight',
  LEFT : 'ArrowLeft',
  UP : 'ArrowUp',
  DOWN : 'ArrowDown'
}

function drawBoard(){
  ctx.fillStyle = boardColor
  ctx.fillRect(0, 0, width, height)
}

function drawSquare(x, y, color){
  ctx.fillStyle = color
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
  ctx.strokeStyle = boardColor
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize)
}

let snake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
]

function drawSnake(){
  snake.forEach((square, index) => {
    const color = index === 0 ? headColor : bodyColor
    drawSquare(square.x, square.y, color)
  })
}

function moveSnake(){

  if (!gameStarted) {
    return
  }

  const head = { ...snake[0]} //!!!!!!!!!!

  if (directionsQue.length) {
    currentDirection = directionsQue.shift() //Removes the first element of an array and returns it at the same time
  }
  
  switch (currentDirection) {
    case directions.RIGHT:
      head.x += 1
      break;
    case directions.LEFT:
      head.x -= 1
      break;
    case directions.UP:
      head.y -= 1
      break;
    case directions.DOWN:
      head.y += 1
      break;
    default:
      break;
  }

  if (hasEatenFood()) {
    food = createFood()
  }
  else{
    snake.pop() //Removes last element of an array
  }
  snake.unshift(head)

}

function hasEatenFood(){
  const head = snake[0]
  return head.x === food.x && head.y === food.y
}

document.addEventListener('keyup', setDirection)
function setDirection(event){
  const newDirection = event.key
  const oldDirection = currentDirection

  if (newDirection === directions.LEFT && oldDirection !== directions.RIGHT 
    ||
    newDirection === directions.RIGHT && oldDirection !== directions.LEFT
    ||
    newDirection === directions.UP && oldDirection !== directions.DOWN
    ||
    newDirection === directions.DOWN && oldDirection !== directions.UP) {
      if (!gameStarted) {
        gameStarted = true
        gameLoop = setInterval(frame, FPS)
      }
      directionsQue.push(newDirection)
  }

}


let food = createFood()
function createFood(){
  let food = {
    x: Math.floor(Math.random() * 20), //20 sq horizantally
    y: Math.floor(Math.random() * 20)  //20 sq vertically
  }

  while(snake.some(square => square.x === food.x && square.y === food.y)){
    food = {
      x: Math.floor(Math.random() * 20), //20 sq horizantally
      y: Math.floor(Math.random() * 20)  //20 sq vertically
    }
  }
  return food
}
function drawFood(){
  drawSquare(food.x, food.y, '#F95700')
}

const initialSnakeLength = snake.length
let score = 0
let highScore = localStorage.getItem('highScore') || 0
function renderScore(){
  score = snake.length - initialSnakeLength
  scoreElement.innerHTML = `⭐️ ${score}`
  highScoreElement.innerHTML = `🏆 ${highScore}`

}

function hitWall(){
  const head = snake[0]
  return(
    head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20
  )
}

function hitSelf(){
  const snakeBody = [...snake]
  const head = snakeBody.shift()

  return snakeBody.some((square) => square.x === head.x && square.y === head.y)
}

function gameOver(){
  const scoreElement = document.querySelector('#gameOverScore #current')
  const highScoreElement = document.querySelector('#gameOverScore #high')

  highScore = Math.max(score, highScore)
  localStorage.setItem('highScore', highScore)

  scoreElement.innerHTML = `⭐️ ${score}`
  highScoreElement.innerHTML = `🏆 ${highScore}`
  gameOverElement.classList.remove('hide')
}

function frame(){
  drawBoard()
  drawFood()
  moveSnake()
  drawSnake()
  renderScore()

  if (hitWall() || hitSelf()) {
    clearInterval(gameLoop)
    gameOver()
  }
}
frame()

playAgainBtn.addEventListener('click', restartGame)
function restartGame(){
  snake = [
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ]
  currentDirection = ''
  directionsQue = []
  gameOverElement.classList.add('hide')
  gameStarted = false
  frame()
}