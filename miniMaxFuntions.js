
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

/*
calculates a score for a given board
 */
function calcBoardValue(board) {
    let value = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j][1] == "b") {
                value += getFigureValue(board[i][j])
            } else {
                value -= getFigureValue(board[i][j])
            }
        }
    }

    return value;
}

//black is maxi
function maxi(board, color, depth) {
    //evaluate board
    if (depth === 0) {
        return [null, calcBoardValue(board)]
    }
    //get all boards
    let boards, moves;
    [boards, moves] = getBoardsMoves(board, color, 0);
    let bestMoves = []
    let score = -1000000;

    for (let i = 0; i < boards.length; i++) {
        if (!checkCheckMate(boards[i], changeColor(color))) {
            let miniMove, miniScore;
            [miniMove, miniScore] = mini(boards[i], changeColor(color), depth - 1);
            if (miniScore > score) {
                bestMoves.length = 0
                bestMoves.push(moves[i]);
                score = miniScore;
                //add also moves with the same score
            } else if (miniScore === score) {
                bestMoves.push(moves[i]);
            }
        } else {
            //if move can leed to checkmade return highest score
            bestMoves.length = 0
            bestMoves.push(moves[i]);
            score = 1000000;//1.000.000
        }
    }
    //return score and bestmove
    return [bestMoves[Math.floor(Math.random() * bestMoves.length)], score]

}
// mini is white
// is the same as maxi only some values are inverted
function mini(currentGameBoard, color, depth) {
    if (depth === 0) {
        return [null, -calcBoardValue(currentGameBoard)]
    }
    let boards, moves;
    [boards, moves] = getBoardsMoves(currentGameBoard, color, 0);

    let bestMoves = [];
    //inverted
    let score = 1000000;
    for (let i = 0; i < moves.length; i++) {
        if (!checkCheckMate(boards[i], changeColor(color))) {
            let maxiMove, maxiScore;
            [maxiMove, maxiScore] = maxi(boards[i], changeColor(color), depth - 1);

            if (maxiScore < score) {
                bestMoves.length = 0;
                bestMoves.push(moves[i]);
                score = maxiScore;
            } else if (maxiScore === score) {
                bestMoves.push(moves[i]);
            }

        } else {
            bestMoves.length = 0;
            bestMoves.push(moves[i]);
            //inverted
            score = -1000000; //1.000.000
        }

    }

    return [bestMoves[Math.floor(Math.random() * bestMoves.length)], score]
}