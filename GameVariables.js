/*
 _____                                            _       _     _
|  __ \                                          (_)     | |   | |
| |  \/ __ _ _ __ ___   ___      __   ____ _ _ __ _  __ _| |__ | | ___  ___
| | __ / _` | '_ ` _ \ / _ \     \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
| |_\ \ (_| | | | | | |  __/      \ V / (_| | |  | | (_| | |_) | |  __/\__ \
 \____/\__,_|_| |_| |_|\___|       \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
 */

// second Char = color
// first Char = figure label
const INITIALGAMBOARD=[
    ["rb", "hb", "bb", "qb", "kb", "bb", "hb", "rb"],
    ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw"],
    ["rw", "hw", "bw", "qw", "kw", "bw", "hw", "rw"]
];
//inital will be copied to chessboard
let chessBoard = [];
//infomation about the selected Panel
let selectedPanel = {
    state: false,
    piece_index: {
        x: 0,
        y: 0
    },
    after_select: 0 //cooldown
};
//picture of figures
let figurePictures;
let placeSound;
//values for each type of Figure
const FIGUREVALUES = {
    p: 10,
    h: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900
};
//mouse infomations
let mouse = {
    x: 0,
    y: 0,
    PanelX: 0,
    PanelY: 0
};
// array about
let allowableMoves;
let currentPlayer = "w";// w for white and b for black

//stuff for beginning
let newGame=false;
let isPlaying=false;
let miniMaxDepth=1;
let wins = {w: false, b: false};
let isSpeedGame=false;
let thinkTime=0;
let timeStop=false;
let isMuted=false;

let startTime;
let localMultiPlayer=false

