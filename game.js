let canv;

function preload() {
    FigurePictures = loadImage("https://i.imgur.com/rl1be8q.png"); // get Image from Source
}

function setup() {
    canv = createCanvas(800, 800);
    canv.hide();
}

function draw() {
    if (newGame) {
        ChessBoard = deepCopy(initialGameBoard);
        SelectedPanel = {
            state: false, piece_index: {x: 0, y: 0}, after_select: 0
        };
        mouse = {x: 0, y: 0, PanelX: 0, PanelY: 0}
        currentPlayer = "w";
        allowableMoves = [];

        newGame = false;
        isPlaying = true;
    }
    if (isPlaying) {
        canv.show()
        game();
    }
}

function game() {
    drawBackground();
    updateMouse();

    if (ChessBoard[mouse.PanelY][mouse.PanelX] !== 0 && mouseIsPressed && SelectedPanel.state === false && mouseButton == LEFT) {
        if (ChessBoard[mouse.PanelY][mouse.PanelX][1] === currentPlayer) {
            SelectedPanel.state = true;
            SelectedPanel.piece_index.x = mouse.PanelX;
            SelectedPanel.piece_index.y = mouse.PanelY;
            allowableMoves = getPossibleMoves(SelectedPanel.piece_index.x, SelectedPanel.piece_index.y, ChessBoard);
        }
    } else if (mouseIsPressed && mouseButton === RIGHT) {
        SelectedPanel.state = false;
    } else if (mouseIsPressed && mouseButton === LEFT && SelectedPanel.state && SelectedPanel.after_select > 30) {
        if ((allowableMoves.find(value => value.x === mouse.PanelX && value.y === mouse.PanelY)) !== undefined) {
            //find valid move from x, y pos of mouse ; else return undefined;

            let type = ChessBoard[SelectedPanel.piece_index.y][SelectedPanel.piece_index.x];
            ChessBoard[SelectedPanel.piece_index.y][SelectedPanel.piece_index.x] = 0;

            ChessBoard[mouse.PanelY][mouse.PanelX] = type;
            SelectedPanel.state = false;
            SelectedPanel.after_select = 0;
            currentPlayer = ChangeColor(currentPlayer)
        }
    }

    if (SelectedPanel.state) {
        for (let i = 0; i < allowableMoves.length; i++) {
            fill("yellow");
            rect(allowableMoves[i].x * 100, allowableMoves[i].y * 100, 100, 100)
        }

        fill("blue");
        rect(SelectedPanel.piece_index.x * 100, SelectedPanel.piece_index.y * 100, 100, 100)
        SelectedPanel.after_select++;
    }

    for (let i = 0; i < ChessBoard.length; i++) { // draw figures
        for (let j = 0; j < ChessBoard[i].length; j++) {
            if (ChessBoard[i][j] !== 0) {
                drawpiece(j, i, ChessBoard[i][j]);
            }
        }
    }

    if (currentPlayer === "b") {
        ai("b");
        currentPlayer = ChangeColor("b")
    }
}

function drawBackground() {
    for (let i = 0; i < 8; i += 2) {
        for (let j = 0; j < 8; j++) {
            if (j % 2 === 0) {
                fill("white");
            } else {
                fill("#363636");
            }
            rect(j * 100, i * 100, 100, 100);
            if (j % 2 === 0) {
                fill("#363636");
            } else {
                fill("white");
            }
            rect(j * 100, (i + 1) * 100, 100, 100);
        }
    }
}

function drawpiece(x, y, pieceId) {
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
        dy = 100
    } else {
        dy = 0;
    }
    // noinspection JSCheckFunctionSignatures
    image(FigurePictures, x * 100, y * 100, 100, 100, dx, dy, 100, 100);

}

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

function gameOver() {


}

function getPossibleMoves(x, y, tmpgamefield) {
    let posX = x;
    let posY = y;
    let type, color;
    [type, color] = tmpgamefield[y][x];
    let allowedMoves = [];

    function Pawn() {
        let moves = [];

        if (color === "b" && posY + 1 < 8) {
            if (tmpgamefield[posY + 1][posX + 1] !== 0) {
                moves.push({x: posX + 1, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}})
            }
            if (tmpgamefield[posY + 1][posX - 1] !== 0) {
                moves.push({x: posX - 1, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}})
            }

            if (tmpgamefield[posY + 1][posX] === 0) {
                moves.push({x: posX, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}})
                if (posY === 1 && tmpgamefield[posY + 2][posX] === 0) {
                    moves.push({x: posX, y: posY + 2, value: 0, OldPos: {x: posX, y: posY}})
                }
            }
        } else if (color === "w" && posY - 1 >= 0) {
            if (tmpgamefield[posY - 1][posX + 1] !== 0) {
                moves.push({x: posX + 1, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}})
            }
            if (tmpgamefield[posY - 1][posX - 1] !== 0) {
                moves.push({x: posX - 1, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}})
            }

            if (tmpgamefield[posY - 1][posX] === 0) {
                moves.push({x: posX, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}})
                if (posY === 6 && tmpgamefield[posY - 2][posX] === 0) {
                    moves.push({x: posX, y: posY - 2, value: 0, OldPos: {x: posX, y: posY}})
                }
            }
        }
        return moves;
    }

    function King() {
        let moves = [];

        function mini(depth, currentGameField, color) {
            let allmoves = generateMoves(currentGameField, color)
            let gamefields = allmoves[0]
            let FigurValues = allmoves[1]
            let minValue = Infinity;
            let bestMove;
            if (depth === 0) {
                for (let i = 0; i < FigurValues.length; i++) {
                    if (-FigurValues[i].value < minValue) {
                        bestMove = FigurValues[i];
                        bestMove.value = -bestMove.value;
                        minValue = bestMove.value;
                    }
                }
            } else if (depth > 0) {
                for (let i = 0; i < gamefields.length; i++) {
                    let score = maxi(depth - 1, gamefields[i], ChangeColor(color));
                    if (-score.value < minValue) {
                        bestMove = FigurValues[i];
                        minValue = -score.value;
                    }
                }

            }
            return bestMove
        }

        moves.push(
            {x: posX - 1, y: posY, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}}
        )
        return moves;
    }

    function Bishop() {
        let moves = [];
        for (let i = posY + 1; i <= 7; i++) {
            if (tmpgamefield[i][posX + (posY - i)] === 0) {
                moves.push({x: posX + (posY - i), y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX + (posY - i), y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posY + 1; i <= 7; i++) {
            if (tmpgamefield[i][posX + (i - posY)] === 0) {
                moves.push({x: posX + (i - posY), y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX + (i - posY), y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (tmpgamefield[i][posX + (posY - i)] === 0) {
                moves.push({x: posX + (posY - i), y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX + (posY - i), y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (tmpgamefield[i][posX + (i - posY)] === 0) {
                moves.push({x: posX + (i - posY), y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX + (i - posY), y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        return moves;
    }

    function Horse() {
        let moves = [];
        moves.push(
            {x: posX + 1, y: posY - 2, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 1, y: posY + 2, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY - 2, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 1, y: posY + 2, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 2, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 2, y: posY - 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX + 2, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}},
            {x: posX - 2, y: posY + 1, value: 0, OldPos: {x: posX, y: posY}}
        )
        return moves;
    }

    function Rook() {
        let moves = []
        for (let i = posX - 1; i >= 0; i--) {

            if (tmpgamefield[posY][i] === 0) {
                moves.push({x: i, y: posY, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: i, y: posY, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posX + 1; i <= 7; i++) {

            if (tmpgamefield[posY][i] === 0) {
                moves.push({x: i, y: posY, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: i, y: posY, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posY - 1; i >= 0; i--) {
            if (tmpgamefield[i][posX] === 0) {
                moves.push({x: posX, y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX, y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }
        for (let i = posY + 1; i <= 7; i++) {
            if (tmpgamefield[i][posX] === 0) {
                moves.push({x: posX, y: i, value: 0, OldPos: {x: posX, y: posY}})
            } else {
                moves.push({x: posX, y: i, value: 0, OldPos: {x: posX, y: posY}})
                break;
            }
        }

        function mini(depth, currentGameField, color) {
            let allmoves = generateMoves(currentGameField, color)
            let gamefields = allmoves[0]
            let FigurValues = allmoves[1]
            let minValue = Infinity;
            let bestMove;
            if (depth === 0) {
                for (let i = 0; i < FigurValues.length; i++) {
                    if (-FigurValues[i].value < minValue) {
                        bestMove = FigurValues[i];
                        bestMove.value = -bestMove.value;
                        minValue = bestMove.value;
                    }
                }
            } else if (depth > 0) {
                for (let i = 0; i < gamefields.length; i++) {
                    let score = maxi(depth - 1, gamefields[i], ChangeColor(color));
                    if (-score.value < minValue) {
                        bestMove = FigurValues[i];
                        minValue = -score.value;
                    }
                }

            }
            return bestMove
        }

        return moves
    }

    switch (type) {
        case "k":
            allowedMoves = allowedMoves.concat(King())
            break;
        case "h":
            allowedMoves = allowedMoves.concat(Horse())
            break;
        case "p":
            allowedMoves = allowedMoves.concat(Pawn())
            break;
        case "r":
            allowedMoves = allowedMoves.concat(Rook())
            break;
        case "b":
            allowedMoves = allowedMoves.concat(Bishop())
            break;
        case "q":
            allowedMoves = allowedMoves.concat(Rook(), Bishop())
            break;
    }
    for (let i = 0; i < allowedMoves.length; i++) { //delete all double moves
        if (allowedMoves[i].x > 7 || allowedMoves[i].x < 0 || allowedMoves[i].y > 7 || allowedMoves[i].y < 0) {
            allowedMoves.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < allowedMoves.length; i++) { // delete all moves which would kill own Figure
        if (tmpgamefield[allowedMoves[i].y][allowedMoves[i].x][1] === color) {
            allowedMoves.splice(i, 1);
            i--;
        }
        if (allowedMoves.length <= 0) {
            break;
        }
    }

    return allowedMoves;
}

function ai(thisTurnColor) {
    let ai_move = Maxi(ChessBoard, thisTurnColor, 1);
    console.log(ai_move);
    ChessBoard = setMove(ai_move.OldPos, {x: ai_move.x, y: ai_move.y}, ChessBoard)
    console.log("nd")
}

function getMovesAndFigurValues(tmpGamefield, color) {
    let allmoves = []
    //get all moves
    for (let i = 0; i < tmpGamefield.length; i++) {
        for (let j = 0; j < tmpGamefield[i].length; j++) {
            if (tmpGamefield[i][j][1] === color) {
                allmoves.push(getPossibleMoves(j, i, tmpGamefield));
            }
        }
    }

    for (let i = 0; i < allmoves.length; i++) {
        for (let j = 0; j < allmoves[i].length; j++) {
            if (tmpGamefield[allmoves[i][j].y][allmoves[i][j].x] !== 0) {
                switch (tmpGamefield[allmoves[i][j].y][allmoves[i][j].x][0]) {
                    case "p":
                        allmoves[i][j].value = FigureValues.p;
                        break;
                    case "b":
                        allmoves[i][j].value = FigureValues.b;
                        break;
                    case "h":
                        allmoves[i][j].value = FigureValues.h;
                        break;
                    case "r":
                        allmoves[i][j].value = FigureValues.r;
                        break;
                    case "q":
                        allmoves[i][j].value = FigureValues.q;
                        break;
                    case "k":
                        allmoves[i][j].value = FigureValues.k;
                        break;

                }
            }
        }
    }
    return allmoves;
}

function setMove(oldPos, newPos, gameField) {
    let CopiedGameboard = deepCopy(gameField)
    let type = CopiedGameboard[oldPos.y][oldPos.x];
    CopiedGameboard[oldPos.y][oldPos.x] = 0;
    CopiedGameboard[newPos.y][newPos.x] = type;
    return CopiedGameboard;
}

//setMove({x:0,y:0}, {x: 0, y: 1}, ChessBoard)

const deepCopy = (arr) => { // need this to copy array without reference
    //https://medium.com/@ziyoshams/deep-copying-javascript-arrays-4d5fc45a6e3e
    let copy = [];
    arr.forEach(elem => {
        if (Array.isArray(elem)) {
            copy.push(deepCopy(elem))
        } else {
            copy.push(elem)
        }
    });
    return copy;
}

function generateMoves(currentGameField, color) {
    let allmoves = getMovesAndFigurValues(currentGameField, color);
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

function ChangeColor(color) {
    let newColor = "";
    if (color === "w") {
        newColor = "b"
    } else {
        newColor = "w"
    }
    return newColor;
}

function Maxi(currentGameBoard, color, depth) {
    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color);
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
            let miniMove = Mini(boards[i], ChangeColor(color), depth - 1)
            if (miniMove.value > currentBestMoves[0].value) {
                currentBestMoves.length = 0;
                currentBestMoves.push(moves[i]);
                currentBestMoves[currentBestMoves.length - 1].value = miniMove.value;
            } else if (miniMove.value === currentBestMoves[currentBestMoves.length - 1].value) {
                currentBestMoves.push(moves[i]);
                currentBestMoves[currentBestMoves.length - 1].value = miniMove.value
            }
        }
        return currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)];
    }

}

function Mini(currentGameBoard, color, depth) {
    let boards, moves;
    [boards, moves] = generateMoves(currentGameBoard, color);
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
    }
}

/*
function maxi(depth, currentGameField, color) {

    let allmoves = generateMoves(currentGameField, color)
    let Boards = allmoves[0]
    let FigurValues = allmoves[1]
    let maxValue = -Infinity;
    let bestMove;
    if (depth === 1) {
        for (let i = 0; i < FigurValues.length; i++) {
            if (FigurValues[i].value > maxValue) {
                bestMove = FigurValues[i];
                maxValue = FigurValues[i].value;
            }
        }
    } else if (depth > 1) {
        for (let i = 0; i < Boards.length; i++) {
            let score = mini(depth - 1, Boards[i], ChangeColor(color));
            if (score.value > maxValue) {
                if (currentGameField[score.y][score.x][1] !== color) {
                    bestMove = FigurValues[i];
                    maxValue = score.value
                }
            }
        }

    }
    return bestMove
}

function mini(depth, currentGameField, color) {
    let allmoves = generateMoves(currentGameField, color)
    let gamefields = allmoves[0]
    let FigurValues = allmoves[1]
    let minValue = Infinity;
    let bestMove;
    if (depth === 1) {
        for (let i = 0; i < FigurValues.length; i++) {
            if (-FigurValues[i].value < minValue) {
                bestMove = FigurValues[i];
                bestMove.value = -bestMove.value;
                minValue = bestMove.value;
            }
        }
    } else if (depth > 0) {
        for (let i = 0; i < gamefields.length; i++) {
            let score = maxi(depth - 1, gamefields[i], ChangeColor(color));
            if (-score.value < minValue) {
                bestMove = FigurValues[i];
                minValue = -score.value;
            }
        }

    }
    return bestMove
}
*/