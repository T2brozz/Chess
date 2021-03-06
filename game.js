let canv; // the canvas
/*
get image from url
 */
function preload() {
    figurePictures = loadImage("https://t2brozz.github.io/Chess/figures.png"); // get Image from Source
    placeSound = loadSound("https://t2brozz.github.io/Chess/place.mp3");
}

function setup() {
    canv = createCanvas(825, 830);
    canv.parent('canv'); // set parent div to canv
    canv.hide();
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
        movesMade = 0;
        canv.show()
        /*
        some html stuff
         */
        document.getElementById("inGame").style.display = "inline-grid";
        let htmlDisplyStyle = "display: inline-grid"
        let htmlGridSize = "grid-template-columns: " + String(windowWidth / 2 - 410) + "px 820px 50px 150px auto"
        document.getElementById("inGame").style = htmlDisplyStyle + ";" + htmlGridSize;
        document.getElementsByTagName("html")[0].style.backgroundImage = "None"
        if (isSpeedGame) {
            document.getElementById("timeLeft").style.display = "block";
        } else {
            document.getElementById("timeLeft").style.display = "none";
        }
    }
    /*
    the actual game
     */
    if (isPlaying) {
        game();
    }
    if (isMuted) {
        document.getElementById("soundStatus").innerText = "Sound on";
        masterVolume(0);
    } else {
        document.getElementById("soundStatus").innerText = "Sound off";
        masterVolume(1);
    }
}

function game(isRecursion = false) {
    /*
    some side functions
     */
    if (!isRecursion) {
        gameEnd(); // check if game ends
        if (isSpeedGame && (new Date().getTime() - startTime) > 60) { // if speedgame call timer
            speedGame();
        }
    }
    drawBackground();
    updateMouse();
    drawSides();
    if (currentPlayer === "w") { // white
        whiteMove();
    }
    if (!localMultiPlayer) {
        if (currentPlayer === "b") { // black
            ai("b");
            currentPlayer = changeColor("b"); // change black to white
            selectedPanel.after_select = 0;
        }
    } else {
        if (currentPlayer === "b") {
            whiteMove()
        }
    }
    selectedPanel.after_select++;
    for (let i = 0; i < chessBoard.length; i++) { // draw figures
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] !== 0) {
                drawPiece(j, i, chessBoard[i][j]);
            }
        }
    }


    //pawn promotion
    let whiteIndex = chessBoard[0].indexOf("pw")
    if (whiteIndex !== -1) {
        selectedPanel.state = false
        selectedPanel.piece_index.x = whiteIndex;
        selectedPanel.piece_index.y = 0
        pawnChangeMenu(whiteIndex, 0, "w")
    }
}

//let the white player make a move
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
            movesMade++;
            currentPlayer = changeColor(currentPlayer);
            placeSound.play()
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

/*
*function to let the ai make a move
* @param color - string for color, mostly "b"
*/
function ai(thisTurnColor) {
    timeStop = true;
    setTimeout(() => {
        //get move
        let ai_move;
        if (miniMaxDepth === 1) {
            ai_move = maxi(chessBoard, thisTurnColor, Math.floor((Math.random() * 2) + 1))[0];
        } else {
            ai_move = maxi(chessBoard, thisTurnColor, miniMaxDepth)[0];
        }
        // setmove
        chessBoard = setMove(ai_move.OldPos, {x: ai_move.x, y: ai_move.y}, chessBoard)
        placeSound.play()

        timeStop = false; //starts time

    }, 1000)

}

/*
*check if game ends
*@param reason - string to identify reason for end screen
*/
function gameEnd(reason = "check") {
    if (wins.b && !wins.w) {
        isPlaying = false;
        showEndScreen("Black");
    } else if (wins.w && !wins.b) {
        isPlaying = false;

        showEndScreen("White");
    } else {
        // check if players are in chckmate
        wins = {w: !checkCheckMate(chessBoard, "w"), b: !checkCheckMate(chessBoard, "b")};
    }
    // check if time runs out or player gave up
    if (reason === "time" || reason === "giveUp") {
        isPlaying = false;
        showEndScreen("Black");
    }
}

// show timer when in Speedgame mode
function speedGame() {
    if (!timeStop) {
        let timeLeft = calcSpeedTime();
        //check if no time
        if (timeLeft.m === -1) {
            gameEnd("time")
        }
        //show time
        document.getElementById("timeLeft").innerHTML = "Time Left:  " + timeLeft.m + " : " + timeLeft.s;
    }
}


/*
*check if king of a given color is in Check
* @param board - 2 dimensional array
* @param color - string color
* @return - array from enemy moves that lead to check
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

    let enemyMoves = getAllMoves(board, changeColor(color), true)
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
*check if king from a given color is checkMate
* @param board - 2 dimensional array
* @param color - string as color
* @return Boolean - if king is checkmate
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
*returns moves to prevent check
* @param board - 2 dimensional array
* @param color - string for color
* @param moves - array of moves that the player has
* @return - array of moves that prevent check
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


