var ballX = 75;
var ballSpeedX = 5;
var ballY = 75;
var ballSpeedY = 7;
var canvas, context;
const paddleWidth = 100;
const paddleThickness = 10;
const bottomGap = 60;
const brickWidth = 80;
const brickHeight = 20;
const brickCols = 10;
const brickRows = 14;
const brickGap = 2;
var brickGrid = new Array(brickCols * brickRows);
var bricksLeft = 0;
var paddleX = 400;
var mouseX = 0;
var mouseY = 0;
window.onload = function () {
    canvas = document.getElementById("canvas");
    
    context = canvas.getContext('2d');
    function updateMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;

        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;
        paddleX = mouseX - paddleWidth / 2;
    }
    ballreset();

    var framePerSecond = 30;
    setInterval(updateAll, 1000 / framePerSecond)

    canvas.addEventListener('mousemove', updateMousePos)
}
function updateAll() {
    moveAll();
    drawAll();
}
brickReset();
function ballreset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballmove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX > canvas.width && ballSpeedX > 0.0 || ballX < 0 && ballSpeedX < 0.0) {
        ballSpeedX *= -1;
    }
    if (ballY < 0 && ballSpeedY < 0.0) {
        ballSpeedY *= -1;
    }
    if (ballY > canvas.height) {
        ballreset();
        brickReset();
    }
}
function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / brickWidth);
    var ballBrickRow = Math.floor(ballY / brickHeight);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)
    if (ballBrickCol >= 0
        && ballBrickCol < brickCols
        &&
        ballBrickRow >= 0
        && ballBrickRow < brickRows
    ) {
        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / brickWidth);
            var prevBrickRow = Math.floor(prevBallY / brickHeight);
            var bothTestsFailed = true;
            if (prevBrickCol != ballBrickCol) {
                var adjBrickSide = rowColToArrayIndex(prevBrickCol, prevBrickRow)
            if(brickGrid[adjBrickSide] == false){
                ballSpeedX *= -1;
                bothTestsFailed = false;
            }
                
            }
            if (prevBrickRow != ballBrickRow) {
                var adjBrickTopBot = rowColToArrayIndex(ballBrickRow, prevBrickRow)
                if(brickGrid[adjBrickTopBot]){
                    ballSpeedY *= -1;
                    bothTestsFailed = false;

                }
            }
            if(bothTestsFailed){
                ballSpeedX *= -1;
                ballSpeedY*= -1;
            }
        }
    }
}
function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height - bottomGap;
    var paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;
    if (ballY > paddleTopEdgeY
        && ballY < paddleBottomEdgeY
        && ballX > paddleLeftEdgeX
        && ballX < paddleRightEdgeX
    ) {
        ballSpeedY *= -1;
        var centerOfPaddleX = paddleX + paddleWidth / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
    if(bricksLeft == 0){
        brickReset();
    }
}
function moveAll() {
    ballmove();
    ballBrickHandling();
    ballPaddleHandling();
}
function rowColToArrayIndex(col, row) {
    return col + brickCols * row;
}
function drawBricks() {
    for (var eachRow = 0; eachRow < brickRows; eachRow++) {
        for (var eachCol = 0; eachCol < brickCols; eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (brickGrid[arrayIndex]) {
                colorRect(brickWidth * eachCol, brickHeight * eachRow, brickWidth - brickGap, brickHeight - brickGap, 'blue');
            }
        }
    }
}
function brickReset() {
    bricksLeft = 0;
    var i;
    for (i = 0; i < 3 * brickCols; i++) {
        brickGrid[i] = false;
    }
    for(; i < brickCols * brickRows; i++){
        brickGrid[i] = true;
        bricksLeft++;
    }
}
function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    colorCircle(ballX, ballY, 10, 'white');
    colorRect(paddleX, canvas.height - bottomGap, paddleWidth, paddleThickness, 'white');
    drawBricks();

}
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillcolor) {
    context.fillStyle = fillcolor;
    context.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}
function colorCircle(centerX, centerY, radius, fillcolor) {
    context.fillStyle = fillcolor;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    context.fill();
}
function colorText(showWords, textX, textY, fillcolor) {
    context.fillStyle = fillcolor;
    context.fillText(showWords, textX, textY);
}
