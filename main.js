//listeners
document.addEventListener('keydown', keyPush)

//canvas
const canvas = document.querySelector('canvas');
const title = document.querySelector('h1');
const ctx = canvas.getContext('2d');

//player 
const snakeSize = 50;
let snakeSpeed = snakeSize;
let snakePosX = 0;
let snakePosY = canvas.height / 2;

let velocityX = 1;
let velocityY = 0;

//game
let gameIsRunning = true;

const tileCountX = canvas.width / snakeSize;
const tileCountY = canvas.height / snakeSize;

const fps = 5;

let score = 0;

let tail = [];
let snakeLenght = 2;

//food

let foodPosX = 400;
let foodPosY = 100;


//loop 

function gameLoop() {
    if (gameIsRunning) {
        drawStuff();
        moveStuff();
        setTimeout(gameLoop, 1000 / fps);
    }
}

resetFood();
gameLoop();

/**
*Pohyb vsetkeho
*/

function moveStuff() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;


    //wall collision
    if (snakePosX > canvas.width - snakeSize) {
        snakePosX = 0;
    }

    if (snakePosX < 0) {
        snakePosX = canvas.width;
    }
    if (snakePosY > canvas.height - snakeSize) {
        snakePosY = 0;
    }
    if (snakePosY < 0) {
        snakePosY = canvas.height;
    }

    //GAME OVER 
    tail.forEach(snakePart => {
        if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
            gameOver();
        }
    })

    //tail 
    tail.push({ x: snakePosX, y: snakePosY });

    //zabudne minule pozicie hada
    tail = tail.slice(-1 * snakeLenght);

    //food collision 
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        title.textContent = ++score;
        snakeLenght++;
        resetFood();
    }
}
/**
*Kreslenie vsetkeho
*/

function drawStuff() {
    //background
    rectangle('#ffbf00', 0, 0, canvas.width, canvas.height)

    //grid
    drawGrid()

    //snake
    rectangle('black', snakePosX, snakePosY, snakeSize, snakeSize);

    //food
    rectangle('#00bfff', foodPosX, foodPosY, snakeSize, snakeSize);

    //tail 
    tail.forEach((snakePart) =>
        rectangle('#555', snakePart.x, snakePart.y, snakeSize, snakeSize)
    );
}

//kdeslenie stvorca
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}



// nahodna pozicia jedla 
function resetFood() {
    //GAME OVER (nowhere to go)
    if (snakeLenght === tileCountX * tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * snakeSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * snakeSize;

    //dont spawn food on snake head pls
    if (foodPosX === snakePosX && foodPosY === snakePosY) {
        resetFood();
    }

    //dont spawn food on snake body pls 
    if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetFood();
    }
}

//Game over
function gameOver() {
    title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
    gameIsRunning = false;
}


/*
*KEYBOARD
*/
function keyPush(event) {
    switch (event.key) {
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;

        case "ArrowDown":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;

        case "ArrowLeft":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;

        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;

        default:
            //restart game
            if (!gameIsRunning) location.reload();
            break;
    }


    //grid

}
function drawGrid() {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                '#fff',
                snakeSize * i,
                snakeSize * j,
                snakeSize - 1,
                snakeSize - 1);
        }
    }

}
