// board variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird variables
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipe variables
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game physics
let velocityX = -2;// moving towards left
let velocityY = 0;// bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // here the bird is drawn
    // context.fillStyle = "green";
    // context.fillRect(bird.x , bird.y , bird.width , bird.height);

    // load image

    // bird image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //pipe image
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    // placing pipes every 1.5 seconds
    setInterval(placePipes, 1500);
    document.addEventListener("keydown" , moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity; 
    // bird.y += velocityY;
   // adding limit to how far above the bird can go
    bird.y = Math.max(bird.y + velocityY , 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    if(bird.y >= board.height){
        gameOver = true;
    }
    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(pipe.passed == false && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird , pipe)){
            gameOver = true;
        }
    }
    
    // clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        // shift removes the fist element of array
        pipeArray.shift();
    }
    // score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score , 5 , 45);

    if(gameOver){
        context.fillText("GameOver" , 5 , 90);
    }
}

function placePipes() {
    if(gameOver){
        return ;
    }
    // for top pipes
    let randomPipeY = pipeY - pipeHeight / 4 -
        Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    // fr bottom pipes
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        // jump
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a , b){
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
