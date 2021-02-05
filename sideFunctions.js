/*
*Updates the mouse position, so that it is in the borders of the chessboard.
*The Panel coordinates are the mousePosition relative to  the Chessboard.
*/
function updateMouse() {
    if (mouseX >= 800) {
        mouse.x = 799;
    } else if (mouseX < 0) {
        mouse.x = 0;
    } else {
        mouse.x = mouseX;
    }
    if (mouseY >= 800) {
        mouse.y = 799;
    } else if (mouseY < 0) {
        mouse.y = 0;
    } else {
        mouse.y = mouseY;
    }
    mouse.PanelX = floor(mouse.x / 100);
    mouse.PanelY = floor(mouse.y / 100);
}

/*
*is drawing the Figure at the defined position
*@param x{int} - x index in chessboard
*@param y{int} - y index in chessboard
*@param pieceId{string} - color and type
*/
function drawPiece(x, y, pieceId) {
    let dx, dy;
    switch (pieceId[0]) {
        case "p":
            dx = 500;
            break;
        case "b":
            dx = 400;
            break;
        case "h":
            dx = 300;
            break;
        case "r":
            dx = 200;
            break;
        case "k":
            dx = 100;
            break;
        case "q":
            dx = 0;
            break;
    }
    if (pieceId[1] === "w") {
        dy = 100;
    } else {
        dy = 0;
    }
    image(figurePictures, x * 100, y * 100, 100, 100, dx, dy, 100, 100);

}

/*
*draws the black and white grid in the background
*/
function drawBackground() {
    for (let i = 0; i < 8; i += 2) {
        for (let j = 0; j < 8; j++) {
            if (j % 2 === 0) {
                fill("#a4a4a4");// white square color
            } else {
                fill("#363636"); //black square color
            }
            rect(j * 100, i * 100, 100, 100);
            if (j % 2 === 0) {
                fill("#363636");
            } else {
                fill("#a4a4a4");
            }
            rect(j * 100, (i + 1) * 100, 100, 100);
        }
    }
}

/*
*draws the letters and numbers on the side
*/
function drawSides() {
    fill("#a4a4a4");
    rect(800, 0, 25, 825);
    rect(0, 800, 825, 30);
    fill("black");
    for (let i = 0; i < 9; i++) {
        textSize(32);
        text(String(9 - i), 804, i * 100 - 35); // number 9 - 1 on the right
        text(String.fromCharCode(65 + i), i * 100 + 42, 826); // 65 = A ; 65+1 = B ...
    }
}

/*
*switches Color shortcut (w->b; b->w)
* @param color{string} - color as one letter
*/
function changeColor(color) {
    if (color === "w") {
        return "b";
    }
    return "w";
}

/*
returns the associated value for a figure
 */
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

/*
is setting a Figure from oldPos to newPos in a given board
 */
function setMove(oldPos, newPos, board) {
    let copiedBoard = deepCopy(board);
    let type = copiedBoard[oldPos.y][oldPos.x];
    copiedBoard[oldPos.y][oldPos.x] = 0;
    copiedBoard[newPos.y][newPos.x] = type;
    return copiedBoard;

}

/*
*opens a menu for the player to promote the pawn
*@param x{int} - xpos on chessboard
*@param y{int} - ypos on chessboard
*@param color{string} - color of player
*/
function pawnChangeMenu(x, y, color = "w") {

    updateMouse();

    fill(45, 76, 79, 50);
    rect(0, 335, width, 125)
    let pieces = ["q", "r", "b", "h"]

    if (mouse.PanelX > 1 && mouse.PanelX < 6 && mouse.y > 335 && mouse.y < 450) {
        fill("yellow");
        rect(mouse.PanelX * 100, 335, 100, 125)
        if (mouseIsPressed && mouseButton === LEFT) {
            chessBoard[y][x] = pieces[mouse.PanelX - 2] + color
        }

    }
    for (let i = 0; i < pieces.length; i++) {
        drawPiece(2 + i, 3.5, pieces[i] + color)
    }

}

/*
*copies a given multidimensional array to avoid a call by reference
*@param arr{array} multidimensional array to copy
* @return {array} - copied array
 */
function deepCopy(arr) { // need this to copy array without reference by:https://medium.com/@ziyoshams/deep-copying-javascript-arrays-4d5fc45a6e3e
    let copy = [];
    arr.forEach(elem => {
        if (Array.isArray(elem)) {
            copy.push(deepCopy(elem));
        } else {
            copy.push(elem);
        }
    });
    return copy;
}

/*
*returns moves and boards which are for a given color possible
*@param board - 2 dimensional array
*@param color - color as string
*@param isRecursion - bool to prevent recursion loop
*@return {array} - array with possible boards and moves
*/
function getBoardsMoves(board, color, isRecursion = false) {

    let allmoves = getAllMoves(board, color, isRecursion);
    let flatAllMoves = []
    let boards = [];
    //generate a board where a move was set
    for (let i = 0; i < allmoves.length; i++) {
        for (let j = 0; j < allmoves[i].length; j++) {
            flatAllMoves.push(allmoves[i][j])
            boards.push(setMove(allmoves[i][j].OldPos, {
                x: allmoves[i][j].x,
                y: allmoves[i][j].y
            }, board));
        }
    }
    return [boards, flatAllMoves]
}


/*
*returns a 2 dimensional array of all moves from a given color in a given chess board
* @param board - 2 dimensional array
* @param color - color as char
* @param isRecursion - bool to prevent recursion
* @return {array} - moves that are allowed
*/
function getAllMoves(board, color, isRecursion) {
    let allmoves = []
    //get all moves
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j][1] === color) {
                allmoves.push(getPossibleMoves(j, i, board, isRecursion));
            }
        }
    }
    return allmoves;
}

/*
*returns an array with all possible moves for one figure
*@param x - x pos of chessboard
*@param y - y pos of chessboard
*@param board - a chess board to work with
*@param isRecursion - bool to prevent recursion
*@return {array} - all possible moves
*/
function getPossibleMoves(x, y, board, isRecursion = false) {
    let posX = x;
    let posY = y;
    let type, color;
    [type, color] = board[y][x]; // get type and color of figure
    let allowedMoves = [];

    /*
    returns all moves for a Pawn figure
     */
    function Pawn() {
        let moves = [];
        // moves for black pawn
        if (color === "b" && posY + 1 < 8) {
            if (board[posY + 1][posX + 1] !== 0) {
                moves.push({x: posX + 1, y: posY + 1, OldPos: {x: posX, y: posY}});
            }
            if (board[posY + 1][posX - 1] !== 0) {
                moves.push({x: posX - 1, y: posY + 1, OldPos: {x: posX, y: posY}});
            }
            if (board[posY + 1][posX] === 0) {
                moves.push({x: posX, y: posY + 1, OldPos: {x: posX, y: posY}});
                if (posY === 1 && board[posY + 2][posX] === 0) {
                    moves.push({x: posX, y: posY + 2, OldPos: {x: posX, y: posY}});
                }
            }
        }
        //moves for white figure
        else if (color === "w" && posY - 1 >= 0) {
            if (board[posY - 1][posX + 1] !== 0) {
                moves.push({x: posX + 1, y: posY - 1, OldPos: {x: posX, y: posY}});
            }
            if (board[posY - 1][posX - 1] !== 0) {
                moves.push({x: posX - 1, y: posY - 1, OldPos: {x: posX, y: posY}});
            }

            if (board[posY - 1][posX] === 0) {
                moves.push({x: posX, y: posY - 1, OldPos: {x: posX, y: posY}});
                if (posY === 6 && board[posY - 2][posX] === 0) {
                    moves.push({x: posX, y: posY - 2, OldPos: {x: posX, y: posY}});
                }
            }
        }
        return moves;
    }

    /*
    returns all moves for the King
     */
    function King() {
        let moves = [];
        moves.push(
            {x: posX - 1, y: posY, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY, OldPos: {x: posX, y: posY}},
            {x: posX, y: posY + 1, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY + 1, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY + 1, OldPos: {x: posX, y: posY}},
            {x: posX, y: posY - 1, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY - 1, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY - 1, OldPos: {x: posX, y: posY}}
        );


        return moves;
    }

    /*
    returns all moves for the Bishop
     */
    function Bishop() {
        let moves = [];
        // each for loop represents 1 of the 4 diagonal directions
        for (let i = posY + 1; i <= 7; i++) {
            if (board[i][posX + (posY - i)] === 0) {
                moves.push({x: posX + (posY - i), y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX + (posY - i), y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posY + 1; i <= 7; i++) {
            if (board[i][posX + (i - posY)] === 0) {
                moves.push({x: posX + (i - posY), y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX + (i - posY), y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (board[i][posX + (posY - i)] === 0) {
                moves.push({x: posX + (posY - i), y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX + (posY - i), y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (board[i][posX + (i - posY)] === 0) {
                moves.push({x: posX + (i - posY), y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX + (i - posY), y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        return moves;
    }

    /*
    returns all moves for the horse
     */
    function Horse() {
        let moves = [];
        moves.push(
            {x: posX + 1, y: posY - 2, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY + 2, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY - 2, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY + 2, OldPos: {x: posX, y: posY}},
            {x: posX + 2, y: posY - 1, OldPos: {x: posX, y: posY}},
            {x: posX - 2, y: posY - 1, OldPos: {x: posX, y: posY}},
            {x: posX + 2, y: posY + 1, OldPos: {x: posX, y: posY}},
            {x: posX - 2, y: posY + 1, OldPos: {x: posX, y: posY}}
        );
        return moves;
    }

    /*
    returns all moves for the rook figure
     */
    function Rook() {
        let moves = []
        /*
        each for loop represents 1 of the 4 directions
         */
        for (let i = posX - 1; i >= 0; i--) {
            if (board[posY][i] === 0) {
                moves.push({x: i, y: posY, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: i, y: posY, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posX + 1; i <= 7; i++) {
            if (board[posY][i] === 0) {
                moves.push({x: i, y: posY, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: i, y: posY, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (board[i][posX] === 0) {
                moves.push({x: posX, y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX, y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        for (let i = posY + 1; i <= 7; i++) {
            if (board[i][posX] === 0) {
                moves.push({x: posX, y: i, OldPos: {x: posX, y: posY}});
            } else {
                moves.push({x: posX, y: i, OldPos: {x: posX, y: posY}});
                break;
            }
        }
        return moves
    }

    /*
    add returned array to allowedMoves array for further calculations
     */
    switch (type) {
        case "k":
            allowedMoves = allowedMoves.concat(King());
            break;
        case "h":
            allowedMoves = allowedMoves.concat(Horse());
            break;
        case "p":
            allowedMoves = allowedMoves.concat(Pawn());
            break;
        case "r":
            allowedMoves = allowedMoves.concat(Rook());
            break;
        case "b":
            allowedMoves = allowedMoves.concat(Bishop());
            break;
        case "q":
            allowedMoves = allowedMoves.concat(Rook(), Bishop());
            break;
    }

    /*
    deletes all , which are out of the board
     */
    for (let i = 0; i < allowedMoves.length; i++) {
        if (allowedMoves[i].x > 7 || allowedMoves[i].x < 0 || allowedMoves[i].y > 7 || allowedMoves[i].y < 0) {
            allowedMoves.splice(i, 1);
            i--;
        }
    }
    /*
    delete all moves, which would hit a same colored figure
     */
    for (let i = 0; i < allowedMoves.length; i++) {
        if (board[allowedMoves[i].y][allowedMoves[i].x][1] === color) {
            allowedMoves.splice(i, 1);
            i--;
        }
        if (allowedMoves.length <= 0) {
            break;
        }
    }
    /*
    if check:
    removes all moves, that is not preventing a check
    isRecursion variable is for recursions
     */
    if (!isRecursion) {
        let movesToCheck = checkCheck(board, color);
        if (movesToCheck.length !== 0) {
            allowedMoves = preventCheck(board, color, movesToCheck, allowedMoves);
        }

        /*
        checks if move is going to set the  king in check
        */
        if (type === "k") {
            for (let i = 0; i < allowedMoves.length; i++) {
                let newpos = {x: allowedMoves[i].x, y: allowedMoves[i].y}
                let boardToTest = setMove(allowedMoves[i].OldPos, newpos, board)
                if (checkCheck(boardToTest, color).length !== 0) {
                    allowedMoves.splice(i, 1);
                    i--;

                }
            }

        }
    }
    return allowedMoves;
}