let canv; // the canvas
/*
get image from url
 */
function preload() {
    figurePictures = loadImage("https://t2brozz.github.io/Chess/figures.png"); // get Image from Source
    backGroundMusic = loadSound("https://t2brozz.github.io/Chess/backgroundMusic.mp3");
}

function setup() {
    canv = createCanvas(825, 830);
    canv.parent('canv'); // set parent div to canv
    canv.hide();
    backGroundMusic.setVolume(0.0005);
    backGroundMusic.loop();
    backGroundMusic.pause();
}

function draw() {
    if (newGame) {
        /*
        resets all game variables
         */
        chessBoard = deepCopy(INITIALGAMBOARD);
        selectedPanel = {
            state: false, piece_index: {x: 0, y: 0}, after_select: 0
        };
        mouse = {x: 0, y: 0, PanelX: 0, PanelY: 0}
        currentPlayer = "w";
        allowableMoves = [];
        wins = {w: false, b: false};
        newGame = false;
        isPlaying = true;
        startTime = new Date().getTime();
        canv.show()
        document.getElementById("inGame").style.display = "block";
        if (isSpeedGame) {
            document.getElementById("timeLeft").style.display = "block";

        } else {
            document.getElementById("timeLeft").style.display = "none";

        }
        backGroundMusic.play();

    }
    /*
    the actual game
     */
    if (isPlaying) {

        game();
    }
    if (isMuted) {

        masterVolume(0)
    } else {
        masterVolume(1)
    }
}

function game() {
    /*
    some side functions
     */
    drawBackground();
    updateMouse();
    drawSides();
    gameEnd(); // check if game ends
    if (currentPlayer === "w") { // white pisRecursion
        whiteMove();
    }
    if (!localMultiPlayer) {

        if (currentPlayer === "b") { // black pisRecursion
            gameEnd(); // check if game ends
            ai("b");
            currentPlayer = changeColor("b"); // change black to white
            selectedPanel.after_select = 0;


        }
    }else {
        if(currentPlayer==="b"){
            whiteMove()
        }
        currentPlayer=changeColor(currentPlayer);



    }

    selectedPanel.after_select++;
    for (let i = 0; i < chessBoard.length; i++) { // draw figures
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] !== 0) {
                drawPiece(j, i, chessBoard[i][j]);
            }
        }

    }

    if (isSpeedGame && (new Date().getTime() - startTime) > 60) { // if speedgame call timer
        speedGame();
    }

}

function whiteMove() {
    //check if is clicking on a same colored figure
    if (chessBoard[mouse.PanelY][mouse.PanelX] !== 0 && mouseIsPressed && selectedPanel.state === false && mouseButton === LEFT && selectedPanel.after_select > 30) {
        if (chessBoard[mouse.PanelY][mouse.PanelX][1] === currentPlayer) {
            //get all possible Moves for this Figure and change selectedPanel
            selectedPanel.state = true;
            selectedPanel.piece_index.x = mouse.PanelX;
            selectedPanel.piece_index.y = mouse.PanelY;
            allowableMoves = getPossibleMoves(selectedPanel.piece_index.x, selectedPanel.piece_index.y, chessBoard, 0);
            selectedPanel.after_select = 0;

        }
        //check if clicking on a free spot or other colored firgue to move
    } else if (mouseIsPressed && mouseButton === LEFT && selectedPanel.state && selectedPanel.after_select > 30) {
        if ((allowableMoves.find(value => value.x === mouse.PanelX && value.y === mouse.PanelY)) !== undefined) {
            //find valid move from x, y pos of mouse ; else return undefined;

            // move figure
            let type = chessBoard[selectedPanel.piece_index.y][selectedPanel.piece_index.x];
            chessBoard[selectedPanel.piece_index.y][selectedPanel.piece_index.x] = 0;
            chessBoard[mouse.PanelY][mouse.PanelX] = type;
            selectedPanel.state = false;
            selectedPanel.after_select = 0;

            currentPlayer = changeColor(currentPlayer)
            // change same colored selected figure
        } else if ((chessBoard[mouse.PanelY][mouse.PanelX][1] === currentPlayer)) {
            selectedPanel.state = true;
            selectedPanel.piece_index.x = mouse.PanelX;
            selectedPanel.piece_index.y = mouse.PanelY;
            allowableMoves = getPossibleMoves(selectedPanel.piece_index.x, selectedPanel.piece_index.y, chessBoard, 0);
        }
    }
    // show allowed moves
    if (selectedPanel.state) {
        for (let i = 0; i < allowableMoves.length; i++) {
            fill("yellow");
            rect(allowableMoves[i].x * 100, allowableMoves[i].y * 100, 100, 100)
        }
        // show selected figure
        fill("blue");
        rect(selectedPanel.piece_index.x * 100, selectedPanel.piece_index.y * 100, 100, 100)

    }

}

// aiMoves
function ai(thisTurnColor) {
    setTimeout(() => {
        //get move
        let ai_move = maxi(chessBoard, thisTurnColor, 2)[0];
        // setmove
        chessBoard = setMove(ai_move.OldPos, {x: ai_move.x, y: ai_move.y}, chessBoard)
        console.log(ai_move); //TODO: devstuff remove

    }, 30)

    console.log("nd") //TODO: devstuff remove
}

// check if game ends
function gameEnd(reason = "check") {
    if (wins.b && !wins.w) {
        console.log("Winner is black");
        isPlaying = false;
        canv.hide();
        EndScreen("black");
    } else if (wins.w && !wins.b) {
        console.log("Winner is white");
        isPlaying = false;
        canv.hide();

        EndScreen("white");
    } else {
        // check if players are in chckmate
        wins = {w: !checkCheckMate(chessBoard, "w"), b: !checkCheckMate(chessBoard, "b")};
    }
    // check if time runs out
    if (reason === "time") {
        console.log("Winner is black, cause white is out of time ");
        isPlaying = false;
        canv.hide();
        EndScreen("black");
        //check if playxer is giving up
    } else if (reason === "giveUp") {
        console.log("Winner is black, cause white quit ");
        isPlaying = false;
        canv.hide();
        EndScreen("black");
    }

}

// show timer when in Speedgame mode
function speedGame() {
    let timeLeft = calcSpeedTime();
    //check if no time
    if (timeLeft.m === -1) {
        gameEnd("time")
    }
    //show time
    document.getElementById("timeLeft").innerHTML = "Time Left:  " + timeLeft.m + " : " + timeLeft.s;
}


/*
check if king of a given color is in Check
 */
function checkCheck(board, color) {
    let kingPos = {x: 0, y: 0}

    for (let i = 0; i < board.length; i++) {
        let xPos = board[i].indexOf("k" + color);
        if (xPos !== -1) {
            kingPos = {x: xPos, y: i}
        }
    }
    //get enemy moves

    let enemyMoves = getAllMoves(board, changeColor(color), 1)
    let flatEnemyMoves = [];
    //make it to a 1 dimensional array
    for (let i = 0; i < enemyMoves.length; i++) {
        for (let j = 0; j < enemyMoves[i].length; j++) {
            flatEnemyMoves.push(enemyMoves[i][j])
        }
    }
    let enemyCheckMoves = []
    enemyMoves.length = 0;
    for (let i = 0; i < flatEnemyMoves.length; i++) {
        if (flatEnemyMoves[i].x === kingPos.x && flatEnemyMoves[i].y === kingPos.y) {
            enemyCheckMoves.push(flatEnemyMoves[i])
        }
    }
    // returns an array with moves from the enemy that leads to check
    return enemyCheckMoves;
}

/*
return if king from a given color is checkMate
 */
function checkCheckMate(board, color) {
    let moves = getAllMoves(board, color, 0);
    let flatMoves = [];
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < moves[i].length; j++) {
            flatMoves.push(moves[i][j])
        }
    }
    return !Boolean(flatMoves.length)
}

/*
returns moves to prevent check
 */
function preventCheck(board, color, enemyMoves, moves) {
    let boards = [];
    let preventCheckMoves = [];
    for (let i = 0; i < moves.length; i++) {
        boards.push(setMove(moves[i].OldPos, {x: moves[i].x, y: moves[i].y}, board))
    }
    for (let i = 0; i < boards.length; i++) {
        if (checkCheck(boards[i], color).length === 0) {
            preventCheckMoves.push(moves[i]);
        }
    }
    return preventCheckMoves;
}


