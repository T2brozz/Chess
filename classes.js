class Piece {
    constructor(x, y, id, color) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.color = color;
        this.piece_points = 0;
        this.allowed_moves = [];
        pieces.push(this);
        this.calc_point();
    }


    calc_point() {
        switch (this.id) {

            case "B":
                this.piece_points = values.B
                break;
            case "S":
                this.piece_points = values.S
                break;
            case "L":
                this.piece_points = values.L
                break;
            case "T":
                this.piece_points = values.T
                break;
            case "D":
                this.piece_points = values.D
                break;
            case "K":
                this.piece_points = values.K;
                break;
        }

    }

    draw() {

    }

    possible_moves() {
        this.allowed_moves = getPossibleMoves(this.x, this.y, this.id, this.color)
        fill("yellow")
        for (let i = 0; i < this.allowed_moves.length; i++) {
            rect(this.allowed_moves[i].x * 100, this.allowed_moves[i].y * 100, 100, 100)
        }
    }
}
