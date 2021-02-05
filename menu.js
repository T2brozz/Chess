/*
*hide a defined html element and show another
* @param divToShow - the element to show
* @param divToHide - the element to hide
*/
function HideDiv(divToShow, divToHide = "mainMenu") {
    let mainMenu = document.getElementById(divToHide);
    let newDiv = document.getElementById(divToShow);
    mainMenu.style.display = "none";
    newDiv.style.display = "inline-block";

}

/*
*calculate time between start of the game and call of function
* @return - object with time difference between start and end of the game
*/
function calcTime() {
    let timeNeeded = {unix: 0, h: 0, m: 0, s: 0};
    timeNeeded.unix = new Date(new Date().getTime() - startTime);
    timeNeeded.h = timeNeeded.unix.getHours() - 1;
    timeNeeded.m = timeNeeded.unix.getMinutes();
    timeNeeded.s = timeNeeded.unix.getSeconds();
    return timeNeeded
}

/*
*calculate time every second for the speed chess timer
* @return - object with time left on the timer
*/
function calcSpeedTime() {
    let time = new Date((startTime + thinkTime * 60) - new Date().getTime());
    return {m: time.getMinutes() - (60 - thinkTime), s: time.getSeconds()}

}


/*
*show the end screen
* @param winner - String with the color who won
*/
function showEndScreen(winner) {
    game(true)//call game ton update selected state
    document.getElementById("endScreenCanvas").src = canv.elt.toDataURL("image/png") //make screenshot of chessboard and put it to img tag
    canv.hide()//hide canvas


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
    document.getElementById("movesMade").innerHTML = String(movesMade);


}

//end game when quit is pressed
function quit() {
    gameEnd("giveUp");
}

/*
*starts game at a given difficulty
*@param difficulty - depth for minimax
*/
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
    //set parameter
    thinkTime = 0;
    newGame = true;
    localMultiPlayer = true;
    document.getElementById("playMainMenu").style.display = "none";

}

/*
*starts speed game
*@param time - time in minutes for the timer
*/
function startSpeedGame(time) {
    //set parameter
    localMultiPlayer = false
    thinkTime = time;
    isSpeedGame = true;
    newGame = true;
    miniMaxDepth = 2;
    document.getElementById("speedChessMenu").style.display = "none";
}