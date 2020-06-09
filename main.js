//canvas settings
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", newGame);
//Game Constants
var x = Math.floor(Math.random()*canvas.width);
var y = canvas.height-30;
let dx = 1;
let dy = -1;
let speed = 2;
let ballRadius = 15;
let colour;
let difficulty = 5;
getRandomColor();
var paddleHeight = 10;
var paddleWidth = 75;
let paddleSpeed = 5;
var paddleX = (canvas.width-paddleWidth) / 2;
let leftPressed = false;
let rightPressed = false;
let score = 0;
let isLoser = false;
let level = 1
let placingBricks = false;
//brick variables 

var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var minHeight = 0;
initializeBricks();



//functions
function newGame(e){
    if(e.key = "Space" && isLoser){
        x = Math.floor(Math.random()*canvas.width);
    y = canvas.height-30;
    getRandomColor();
    dx = 1;
    dy = -1;
    speed = 2;
    score = 0;
    isLoser = false;
    level = 1;
    brickRowCount = 4;
    paddleX = (canvas.width-paddleWidth) / 2;
    drawBricks();
    let scoreBoard = document.getElementById("myScore");
    scoreBoard.innerHTML = "Score: " + score.toString();
    let levelDisplay = document.getElementById("myLevel");
    levelDisplay.innerHTML = "Level: " + level.toString();
    initializeBricks();
    }
    
}
function isIntersect(point){
    if(point.x > 70 && point.x < 410){
        if(point.y>100 && point.y < 220){
            newGame();
        }
    }
}
function speedUp(){
    if(score % difficulty == 0 && score != 0){
        speed = speed * 1.05
        console.log(dx);
    }
}
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function movePaddle(){
    if(rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
}

function drawball() {
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath();
    
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    
}
function gameOver(){
    let boxwidth = 340;
    let boxheight = 120;
    ctx.beginPath();
    ctx.rect((canvas.width-boxwidth)/2, (canvas.height-boxheight)/2, boxwidth, boxheight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", (canvas.width-30)/2-80, (canvas.height-30)/2);
    ctx.fillText("Press Space to restart",(canvas.width-30)/2-140,(canvas.height-30)/2+30);
    
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var newColour = '#';
    for (var i = 0; i < 6; i++) {
      newColour += letters[Math.floor(Math.random() * 16)];
    }
    colour = newColour;
  }
function checkCollision(){
    let X;
    let Y;
    if(!placingBricks){
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            X = bricks[c][r].x;
            Y = bricks[c][r].y;

            if(x + dx *speed > X  && x+dx*speed < X + brickWidth && bricks[c][r].status){
                if( y + dy  > Y -  ballRadius && y < Y + brickHeight + ballRadius  ){
                    dy = -dy;
                    let index = Math.round(Math.random(0,1))
                    let direction = [-1, 1];
                    dx = dx*direction[index];
                    bricks[c][r].status = 0;
                    score++;
                    speedUp();
                    getRandomColor();
                    let scoreBoard = document.getElementById("myScore");
                    scoreBoard.innerHTML = "Score: " + score.toString(); 
                }
            }
            
        }
    }
}
    if(y + dy * speed > canvas.height - ballRadius){
        if(x  > paddleX-ballRadius && x < paddleX + paddleWidth + ballRadius) {
            dx = (paddleX + paddleWidth/2 -x);
            if(dx != 0){
                dx = -dx/(paddleWidth/2);
            }
            dy = -dy;
            getRandomColor();
        }
        else {
            dy = 0;
            dx = 0;
            isLoser = true;
            
        }
        
    }
    if(x + dx * speed < ballRadius || x + dx * speed > canvas.width-ballRadius){
        dx = -dx;
        getRandomColor();
    }
    if(y + dy*speed < ballRadius){
        dy = -dy;
        getRandomColor();
    } 
}
function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();  
    drawball();
    drawPaddle();
    movePaddle();
    x += dx*speed;
    y += dy*speed;

    checkCollision();
    levelUp();
    
    if(placingBricks && y > minHeight){
        placingBricks = false;
        initializeBricks();
        
    }
    if(isLoser){
        gameOver();
    }
    else if(!placingBricks){
        drawBricks();
    } 
    
}
// brick functions
function initializeBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0 , status: 1};
        }
    }
}
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//Leveling up
function levelUp(){
    let maxScore = level * 5 + 15;
    if(score >= maxScore){
        level ++;
        score = 0;
        brickRowCount ++;
        minHeight = 40 * level + +140;
        placingBricks = true;
        let scoreBoard = document.getElementById("myLevel");
        scoreBoard.innerHTML = "Level: " + level.toString();
    }

}


setInterval(draw, 10);

