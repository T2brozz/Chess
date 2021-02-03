//hid a defiend html element and show another
function HideDiv(divToShow, divToHide = "mainMenu") {
    let mainMenu = document.getElementById(divToHide);
    let newDiv = document.getElementById(divToShow);
    mainMenu.style.display = "none";
    newDiv.style.display = "inline-block";

}

// clac time between start of the game and call of function
function calcTime() {
    let timeNeeded = {unix: 0, h: 0, m: 0, s: 0};
    timeNeeded.unix = new Date(new Date().getTime() - startTime);
    timeNeeded.h = timeNeeded.unix.getHours() - 1;
    timeNeeded.m = timeNeeded.unix.getMinutes();
    timeNeeded.s = timeNeeded.unix.getSeconds();
    return timeNeeded
}

//clac time every seconf for the speed chess timer
function calcSpeedTime() {
    let time = new Date((startTime + thinkTime * 60) - new Date().getTime());
    return {m: time.getMinutes() - (60 - thinkTime), s: time.getSeconds()}

}


//show the endscreen (who had guessed it ¯\_(ツ)_/¯    )
function showEndScreen(winner) {
    let time = calcTime();
    document.getElementsByTagName("html")[0].style = 'background-image: url("background.png");' // show background

    HideDiv('endScreen', 'inGame')
    document.getElementById('endTitle').innerHTML = winner + " WON "
    document.getElementById("statsTime").innerHTML = time.h + ":" + time.m + ":" + time.s;
    let whiteLeft = 0;
    let blackleft = 0;
    // count left pieces
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j][1] === "w") {
                whiteLeft++
            } else if (chessBoard[i][j][1] === "b") {
                blackleft++
            }
        }
    }
    //displays left pieces
    document.getElementById("whiteLeft").innerHTML = String(whiteLeft);
    document.getElementById("blackLeft").innerHTML = String(blackleft);

    newSrc=canv.elt.toDataURL("image/png")
    document.getElementById("endScreenCanvas").src=newSrc
}

//end game when quit is pressed
function quit() {

    gameEnd("giveUp");
}

// starts game at a given difficulty
function startGame(difficulty) {
    //parameter for normal game
    localMultiPlayer = false
    thinkTime = 0;
    isSpeedGame = false;
    miniMaxDepth = difficulty;
    newGame = true;
    document.getElementById("playMenu").style.display = "none";

}

// starts local multiplayer
function playLocal() {
    //sets parameter for it
    thinkTime = 0;
    newGame = true;
    localMultiPlayer = true;
    document.getElementById("playMainMenu").style.display = "none";

}

// starts speed game
function startSpeedGame(time) {

    //sets parameter
    localMultiPlayer = false
    thinkTime = time;
    isSpeedGame = true;
    newGame = true;
    miniMaxDepth = 2;
    document.getElementById("speedChessMenu").style.display = "none";
}