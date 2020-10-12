function HideMainMenu(divToShow) {
    let mainMenu = document.getElementById("mainMenu");
    let newDiv = document.getElementById(divToShow);
    mainMenu.style.display = "none";
    newDiv.style.display = "block";
}

function ShowMainMenu(divToHide) {
    let mainMenu = document.getElementById("mainMenu");
    let oldDiv = document.getElementById(divToHide);
    mainMenu.style.display = "block";
    oldDiv.style.display = "none";
}

function StartGame(difficulty) {
    miniMaxDepth = difficulty;
    newGame = true;
    document.getElementById("playMenu").style.display = "none";
}