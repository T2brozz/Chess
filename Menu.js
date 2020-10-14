function HideDiv(divToShow, divToHide="mainMenu") {
    let mainMenu = document.getElementById(divToHide);
    let newDiv = document.getElementById(divToShow);
    mainMenu.style.display = "none";
    newDiv.style.display = "flex";
}

function ShowMainMenu(divToHide) {
    let mainMenu = document.getElementById("mainMenu");
    let oldDiv = document.getElementById(divToHide);
    mainMenu.style.display = "flex";
    oldDiv.style.display = "none";
}

function startGame(difficulty) {
    thinkTime=0;
    isSpeedGame=false;
    miniMaxDepth = difficulty;
    newGame = true;
    document.getElementById("playMenu").style.display = "none";
}
function startSpeedGame(time){
    thinkTime=time;
    isSpeedGame=true;
    newGame = true;
    document.getElementById("speedChessMenu").style.display = "none";
}
function calcTime() {
    let timeNeeded = {unix: 0, h: 0, m: 0, s: 0};
    timeNeeded.unix = new Date(new Date().getTime() - startTime);
    timeNeeded.h = timeNeeded.unix.getHours() - 1;
    timeNeeded.m = timeNeeded.unix.getMinutes();
    timeNeeded.s = timeNeeded.unix.getSeconds();
    return timeNeeded
}
function calcSpeedTime(){
    let time=new Date((startTime+thinkTime*60)-new Date().getTime());
    return {m:time.getMinutes()-(60-thinkTime),s:time.getSeconds()}
}
function EndScreen() {
    let time = calcTime();
    document.getElementById("inGame").style.display="none";
    document.getElementById("statsTime").innerHTML = time.h + ":" + time.m + ":" + time.s;
    let whiteLeft=0;
    let blackleft=0;
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j][1] === "w") {
                whiteLeft++
            } else if (chessBoard[i][j][1] === "b") {
                blackleft++
            }
        }
    }
    document.getElementById("whiteLeft").innerHTML = String(whiteLeft);
    document.getElementById("blackLeft").innerHTML = String(blackleft);
}