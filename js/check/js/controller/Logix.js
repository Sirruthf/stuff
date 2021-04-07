export default class Logix {
    constructor (board, players) {
        this.board = board;
        this.players = players;
        this.moved = null;
    }
    
    get current () {
        return this.players.current;
    }
    
    getMoves (side, x, y, jumpsOnly = Boolean(this.moved)) {
        let result = [];
        
        if (side == this.board.ALLIE) {
            if (y > 0 && jumpsOnly === false) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y - 1][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 1) {
                        result.push([i, y - 1]);
                    }
                }
            }
            if (y > 1) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y - 2][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 2 && this.board.board[y - 1][(x + i) / 2].side == this.board.ENEMY) {
                        result.push([i, y - 2]);
                    }
                }
            }
            if (y < 6) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y + 2][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 2 && this.board.board[y + 1][(x + i) / 2].side == this.board.ENEMY) {
                        result.push([i, y + 2]);
                    }
                }
            }
        } else {
            if (y < 7 && jumpsOnly === false) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y + 1][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 1) {
                        result.push([i, y + 1]);
                    }
                }
            }
            if (y < 6) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y + 2][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 2 && this.board.board[y + 1][(x + i) / 2].side == this.board.ALLIE) {
                        result.push([i, y + 2]);
                    }
                }
            }
            if (y > 1) {
                for (let i = 0; i < this.board.WIDTH; i++) {
                    if (this.board.board[y - 2][i] != this.board.EMPTY) continue;
                    
                    if (Math.abs(i - x) == 2 && this.board.board[y - 1][(x + i) / 2].side == this.board.ALLIE) {
                        result.push([i, y - 2]);
                    }
                }
            }
        }
        
        return result;
    }
    
    move (ax, ay, bx, by) {
        if (this.board.board[ay][ax].side != this.board.ALLIE && this.board.board[ay][ax].side != this.board.ENEMY) {
            console.log(this.board.board[ay][ax]);
            throw new Error("Empty or unexistant cell to move: " + ax + ", " + ay);
        }
        
        if (Math.abs(ax - bx) > 1) {
            this.board.remove((ax + bx) / 2, (ay + by) / 2);
            this.players.current.increment();
            
            if (this.getMoves(this.current.side, bx, by, true).length < 1) 
                { this.players.next(); this.moved = null; }
            else
                this.moved = this.board.at(ax, ay);
        } else
            this.players.next();
        
        this.board.board[by][bx] = this.board.board[ay][ax];
        this.board.board[ay][ax] = this.board.EMPTY;
    }
}