import BaseGraphicalObject from './../BaseGraphicalObject.js';


export default class Board extends BaseGraphicalObject {
    constructor ({
        selfWidth = 8,
        selfHeight = 8,
        cellWidth = 80,
        cellHeight = 80,
        borderWidth = 1,
        left = 50,
        top = 50,
        checkers = [],
        ...option
    }) {
        super(option);
        
        this.selfWidth = selfWidth;
        this.selfHeight = selfHeight;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.borderWidth = borderWidth;
        this.top = top;
        this.left = left;
        this.width = selfWidth * cellWidth;
        this.height = selfHeight * cellHeight;
        
        this.board = "forceful".split("").map(item => "sandwich".split("").map(() => this.VOID));
        
        for (let i = 0; i < selfHeight; i++) {
            for (let j = 0; j < selfWidth; j++) {
                if ((i + j) % 2) continue;
                this.board[i][j] = this.EMPTY;
            }
        }
        
        this.dependencies = [];
        console.log(this.board);
    }
    
    at (x, y) {
        return this.board[y][x];
    }
    
    remove (x, y) {
        this.board[y][x].remove();
        this.board[y][x] = this.EMPTY;
        
        this.dependencies = this.dependencies.filter(item => item.grid[0] != x || item.grid[1] != y);
    }
    
    feed (stream) {
        this.dependencies = stream;
        
        for (let i = 0, u = 0; i < this.selfHeight; i++) {
            for (let j = 0; j < this.selfWidth; j++) {
                if ((i + j) % 2) continue;
                this.board[i][j] = this.EMPTY;
                
                if (i * this.selfHeight + j < 24)  { stream[u].grid = [j , i]; stream[u].recapitulate(); this.board[i][j] = stream[u++]; }
                if (i * this.selfHeight + j >= 40) { stream[u].grid = [j , i]; stream[u].recapitulate(); this.board[i][j] = stream[u++]; }
            }
        }
    }
    
    draw (ctx) {
        ctx.drawLine(this.left, this.top, this.left,  this.top + this.selfWidth * this.cellHeight, {lineWidth: this.borderWidth});
        ctx.drawLine(this.left, this.top, this.left + this.selfHeight * this.cellWidth,  this.top, {lineWidth: this.borderWidth});
        ctx.drawLine(this.left, this.top + this.selfWidth * this.cellHeight, this.left + this.cellWidth * this.selfWidth,  this.top + this.selfWidth * this.cellHeight, {lineWidth: this.borderWidth});
        ctx.drawLine(this.left + this.selfHeight * this.cellWidth, this.top, this.left + this.selfHeight * this.cellWidth,  this.top + this.selfHeight * this.cellHeight, {lineWidth: this.borderWidth});
        
        for (let i = 0; i < this.selfHeight; i++)
            for (let j = 0; j < this.selfWidth; j++)
                if ((i + j) % 2 === 0)
                    ctx.drawRect(this.left + j * this.cellWidth, this.top + i * this.cellHeight, this.cellWidth, this.cellHeight);
    }
    
    get EMPTY () {
        return 0;
    }
    
    get VOID () {
        return -1;
    }
    
    get ALLIE () {
        return 1;
    }
    
    get ENEMY () {
        return 2;
    }
    
    get WIDTH () {
        return 8;
    }
}