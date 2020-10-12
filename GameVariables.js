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
let initialGameBoard=[
    ["rb", "hb", "bb", "kb", "qb", "bb", "hb", "rb"],
    ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw"],
    ["rw", "hw", "bw", "kw", "qw", "bw", "hw", "rw"]
];
let ChessBoard = [];
let SelectedPanel = {
    state: false,
    piece_index: {
        x: 0,
        y: 0
    },
    after_select: 0 //cooldown
};
let FigurePictures;
let FigureValues = {
    p: 10,
    h: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900
};
let mouse = {
    x: 0,
    y: 0,
    PanelX: 0,
    PanelY: 0
};
let allowableMoves;
let currentPlayer = "w";// w for white and b for black

let newGame=false;
let isPlaying=false;
let miniMaxDepth=1;

/*
___  ___                                       _       _     _
|  \/  |                                      (_)     | |   | |
| .  . | ___ _ __  _   _      __   ____ _ _ __ _  __ _| |__ | | ___  ___
| |\/| |/ _ \ '_ \| | | |     \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
| |  | |  __/ | | | |_| |      \ V / (_| | |  | | (_| | |_) | |  __/\__ \
\_|  |_/\___|_| |_|\__,_|       \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
 */
