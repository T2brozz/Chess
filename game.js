let canv; // the canvas
let baa = 0;
/*
get image from url
 */
function preload() {
    FigurePictures = loadImage("https://i.imgur.com/rl1be8q.png"); // get Image from Source
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
        foundKings = {w: false, b: false};
        newGame = false;
        isPlaying = true;
        startTime = new Date().getTime();
        canv.show()
        if (isSpeedGame) {
            document.getElementById("inGame").style.display = "block";
        }
    }
    /*
    the actual game
     */
    if (isPlaying) {

        game();
    }
}

function game() {

    drawBackground();
    updateMouse();
    drawSides();

    if (chessBoard[mouse.PanelY][mouse.PanelX] !== 0 && mouseIsPressed && selectedPanel.state === false && mouseButton == LEFT && selectedPanel.after_select > 30) {
        if (chessBoard[mouse.PanelY][mouse.PanelX][1] === currentPlayer) {
            selectedPanel.state = true;
            selectedPanel.piece_index.x = mouse.PanelX;
            selectedPanel.piece_index.y = mouse.PanelY;
            allowableMoves = getPossibleMoves(selectedPanel.piece_index.x, selectedPanel.piece_index.y, chessBoard, 0);
            selectedPanel.after_select = 0;

        }


    } else if (mouseIsPressed && mouseButton === LEFT && selectedPanel.state && selectedPanel.after_select > 30) {
        if ((allowableMoves.find(value => value.x === mouse.PanelX && value.y === mouse.PanelY)) !== undefined) {
            //find valid move from x, y pos of mouse ; else return undefined;

            let type = chessBoard[selectedPanel.piece_index.y][selectedPanel.piece_index.x];
            chessBoard[selectedPanel.piece_index.y][selectedPanel.piece_index.x] = 0;
            chessBoard[mouse.PanelY][mouse.PanelX] = type;
            selectedPanel.state = false;
            selectedPanel.after_select = 0;
            currentPlayer = changeColor(currentPlayer)
        } else if ((chessBoard[mouse.PanelY][mouse.PanelX][1] == currentPlayer)) {
            selectedPanel.state = true;
            selectedPanel.piece_index.x = mouse.PanelX;
            selectedPanel.piece_index.y = mouse.PanelY;
            allowableMoves = getPossibleMoves(selectedPanel.piece_index.x, selectedPanel.piece_index.y, chessBoard, 0);
        }
    }

    if (selectedPanel.state) {
        for (let i = 0; i < allowableMoves.length; i++) {
            fill("yellow");
            rect(allowableMoves[i].x * 100, allowableMoves[i].y * 100, 100, 100)
        }

        fill("blue");
        rect(selectedPanel.piece_index.x * 100, selectedPanel.piece_index.y * 100, 100, 100)

    }
    selectedPanel.after_select++;
    for (let i = 0; i < chessBoard.length; i++) { // draw figures
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] !== 0) {
                drawPiece(j, i, chessBoard[i][j]);
            }
        }

    }

    if (currentPlayer === "b") {
        gameEnd();
        ai("b");
        currentPlayer = changeColor("b");
        selectedPanel.after_select = 0;

        gameEnd();

    }
    if (isSpeedGame && (new Date().getTime() - startTime) > 60) {
        speedGame();
    }
}

function gameEnd(reason = "check") {
    if (foundKings.b && !foundKings.w) {
        console.log("Winner is black");
        isPlaying = false;
        canv.hide();
        HideDiv("endScreen");
        EndScreen();
    } else if (foundKings.w && !foundKings.b) {
        console.log("Winner is white");
        isPlaying = false;
        canv.hide();
        HideDiv("endScreen");
        EndScreen();
    } else {
        foundKings = {w: checkCheckMate(chessBoard, "w"), b: checkCheckMate(chessBoard, "b")};

        /*for (let i = 0; i < chessBoard.length; i++) {
            if (chessBoard[i].includes("kw")) {
                foundKings.w = true;
            }
            if (chessBoard[i].includes("kb")) {
                foundKings.b = true;
            }
        }*/

    }
    if (reason == "time") {
        console.log("Winner is black, cause white is out of time ");
        isPlaying = false;
        canv.hide();
        HideDiv("endScreen");
        EndScreen();
    }

}

function animateMove(oldPos, newPos, time) {


}

function speedGame() {

    let timeLeft = calcSpeedTime();
    if (timeLeft.m === -1) {
        gameEnd("time")
    }
    document.getElementById("inGameText").innerText = "Time Left:  " + timeLeft.m + " : " + timeLeft.s;

}

function ai(thisTurnColor) {
    baa = 0;
    setTimeout(() => {
        let ai_move = maxi(chessBoard, thisTurnColor, 2);
        chessBoard = setMove(ai_move.OldPos, {x: ai_move.x, y: ai_move.y}, chessBoard)
        console.log(ai_move);

    }, 30)

    console.log("nd")
}

function getMovesAndFigureValues(tmpGamefield, color, layer) {
    let allmoves = []
    //get all moves
    for (let i = 0; i < tmpGamefield.length; i++) {
        for (let j = 0; j < tmpGamefield[i].length; j++) {
            if (tmpGamefield[i][j][1] === color) {
                allmoves.push(getPossibleMoves(j, i, tmpGamefield, layer));
            }
        }
    }
    for (let i = 0; i < allmoves.length; i++) {
        for (let j = 0; j < allmoves[i].length; j++) {
            if (tmpGamefield[allmoves[i][j].y][allmoves[i][j].x] !== 0) {
                allmoves[i][j].value = getFigureValue(tmpGamefield[allmoves[i][j].y][allmoves[i][j].x])
            }
        }
    }

    return allmoves;
}

function getFigureValue(figure) {
    let value = 0;
    switch (figure[0]) {
        case "p":
            value = FIGUREVALUES.p;
            break;
        case "b":
            value = FIGUREVALUES.b;
            break;
        case "h":
            value = FIGUREVALUES.h;
            break;
        case "r":
            value = FIGUREVALUES.r;
            break;
        case "q":
            value = FIGUREVALUES.q;
            break;
        case "k":
            value = FIGUREVALUES.k;
            break;

    }
    return value;
}

//setMove({x:0,y:0}, {x: 0, y: 1}, ChessBoard)


function generateMoves(currentGameField, color, layer = 0) {

    let allmoves = getMovesAndFigureValues(currentGameField, color, layer);
    let gameFields = [];
    let flatAllMoves = []


    for (let i = 0; i < allmoves.length; i++) {
        for (let j = 0; j < allmoves[i].length; j++) {
            flatAllMoves.push(allmoves[i][j])
            gameFields.push(setMove(allmoves[i][j].OldPos, {
                x: allmoves[i][j].x,
                y: allmoves[i][j].y
            }, currentGameField));
        }
    }

    return [gameFields, flatAllMoves]
}


function checkCheck(board, color, layer) {
    //horizontal  check


    let kingPos = {x: 0, y: 0}
    for (let i = 0; i < board.length; i++) {
        let xPos = board[i].indexOf("k" + color);
        if (xPos !== -1) {
            kingPos = {x: xPos, y: i}
        }
    }
    let enemyMoves = getMovesAndFigureValues(board, changeColor(color), 1)
    let flatEnemyMoves = [];
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
    return enemyCheckMoves;
}

function checkCheckMate(board, color) {
    let moves = getMovesAndFigureValues(board, color, 0);
    let flatMoves = [];
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < moves[i].length; j++) {
            flatMoves.push(moves[i][j])
        }
    }
    return !Boolean(flatMoves.length)

}

function preventCheck(board, color, enemyMoves, moves) {
    let boards = [];
    let preventCheckMoves = [];
    for (let i = 0; i < moves.length; i++) {
        boards.push(setMove(moves[i].OldPos, {x: moves[i].x, y: moves[i].y}, board))
    }
    for (let i = 0; i < boards.length; i++) {
        if (checkCheck(boards[i], color, 0).length === 0) {
            preventCheckMoves.push(moves[i]);
        }
    }
    return preventCheckMoves;
}

/*
  __  __   _           _     __  __                               _
 |  \/  | (_)         (_)   |  \/  |                      /\     | |
 | \  / |  _   _ __    _    | \  / |   __ _  __  __      /  \    | |   __ _    ___
 | |\/| | | | | '_ \  | |   | |\/| |  / _` | \ \/ /     / /\ \   | |  / _` |  / _ \
 | |  | | | | | | | | | |   | |  | | | (_| |  >  <     / ____ \  | | | (_| | | (_) |
 |_|  |_| |_| |_| |_| |_|   |_|  |_|  \__,_| /_/\_\   /_/    \_\ |_|  \__, |  \___/
                                                                       __/ |
                                                                      |___/
 */


function calcBoardValue(board, color) {
    let value = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j][1] == color) {
                value += getFigureValue(board[i][j])
            } else {
                value -= getFigureValue(board[i][j])
            }
        }
    }

    return value;
}

/*
function maxi(currentGameBoard, color, depth) {
    if (depth === 0) {
        return {value:-calcBoardValue(currentGameBoard, color)}
    }

    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color, 0);
    let bestMove = {value: -1000000}
    for (let i = 0; i < moves.length; i++) {
        if (!checkCheckMate(boards[i], color)) {
            let miniMove = mini(boards[i], changeColor(color), depth - 1);
            if(i==0){console.log(miniMove)}
            if (miniMove.value > bestMove.value) {
                bestMove = moves[i];
                bestMove.value=miniMove.value;
            }
        }
    }
    if (bestMove == {value: -1000000}) {
        console.log("err checkmate")
    } else {
        return bestMove
    }
}

function mini(currentGameBoard, color, depth) {
    if (depth === 0) {
        return {value: calcBoardValue(currentGameBoard, color)}
    }
    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color, 0);

    let bestMove = {value: 1000000}
    for (let i = 0; i < moves.length; i++) {
        if (!checkCheckMate(boards[i], color)) {
            let maxiMove = maxi(boards[i], changeColor(color), depth - 1);
            if(i==0){console.log(maxiMove)}
            if (maxiMove.value < bestMove.value) {
                bestMove = moves[i];
                bestMove.value = -maxiMove.value
            }

        }

    }
    if (bestMove == {value: -1000000}) {
        console.log("err checkamte")
    } else {

        return bestMove
    }

}
*/

function maxi(currentGameBoard, color, depth) {

    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color, 0);
    if (depth === 0) { // calculate  outcome after depth moves
        let currentBestMoves = [{value: Infinity}];
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].value > currentBestMoves[currentBestMoves.length - 1].value) {
                currentBestMoves.length = 0;
                currentBestMoves.push(moves[i]);
            } else if (moves[i].value === currentBestMoves[currentBestMoves.length - 1].value) {
                currentBestMoves.push(moves[i]);
            }
        }

        return currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    } else if (depth > 0) {
        let currentBestMoves = [{value: -Infinity}];
        for (let i = 0; i < moves.length; i++) {
            if (!checkCheckMate(moves[i], changeColor(color))) {
                let miniMove = mini(boards[i], changeColor(color), depth - 1)

                if (miniMove.value > currentBestMoves[0].value) {
                    currentBestMoves.length = 0;
                    currentBestMoves.push(moves[i]);
                    currentBestMoves[currentBestMoves.length - 1].value = miniMove.value;
                } else if (miniMove.value === currentBestMoves[currentBestMoves.length - 1].value) {
                    currentBestMoves.push(moves[i]);
                    currentBestMoves[currentBestMoves.length - 1].value = miniMove.value
                }
            } else {
                return moves[i];
            }
        }
        return currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    }

}


function mini(currentGameBoard, color, depth) {
    //returns all moves and bords where the moves where set
    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color, 0);

    if (depth === 0) { // calculate  outcome after depth moves
        let currentBestMoves = [{value: Infinity}];
        for (let i = 0; i < moves.length; i++) {
            if (-moves[i].value < currentBestMoves[currentBestMoves.length - 1].value) {
                currentBestMoves.length = 0
                currentBestMoves.push(moves[i]);
                currentBestMoves[0].value = -currentBestMoves[0].value;
            } else if (-moves[i].value === currentBestMoves[currentBestMoves.length - 1].value) {
                currentBestMoves.push(moves[i]);
                currentBestMoves[currentBestMoves.length - 1].value = -currentBestMoves[currentBestMoves.length - 1].value;
            }
        }
        return currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    } else if (depth > 0) {
        let currentBestMoves = [{value: Infinity}];
        for (let i = 0; i < moves.length; i++) {
            if (!checkCheckMate(boards[i], changeColor(color))) {
                //calls js for the next step
                let maxiMove = maxi(boards[i], changeColor(color), depth - 1);
                if (-maxiMove.value < currentBestMoves[0].value) {
                    currentBestMoves.length = 0;
                    currentBestMoves.push(moves[i]);
                    currentBestMoves[currentBestMoves.length - 1].value = -maxiMove.value;
                } else if (-maxiMove.value === currentBestMoves[currentBestMoves.length - 1].value) {
                    currentBestMoves.push(moves[i]);
                    currentBestMoves[currentBestMoves.length - 1].value = -maxiMove.value
                }
            }else {
                return moves[i]
            }
        }
        return currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    }
}

