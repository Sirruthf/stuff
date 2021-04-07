import BaseGraphicalObject from './../BaseGraphicalObject.js';
import Move from './Move.js';


export default class Checker extends BaseGraphicalObject {
    constructor ({
        outerWidth = 80,
        outerShift = 5,
        side = -1,
        grid = [0, 0],
        convert = () => {},
        logix = null,
        ...option
    }) {
        super(option);
        
        this.logix = logix;
        this.outerWidth = outerWidth;
        this.outerShift = outerShift;
        this.selected = false;
        this.side = side;
        this.grid = grid;
        this.left = convert(grid).left;
        this.top = convert(grid).top;
        this.convert = convert;
        this.dependencies = [];
    }
    
    focus () {
        if (this.logix.current.side != this.side) return;
        
        this.selected = true;
        this.showMoves();
    }
    
    blur () {
        this.selected = false;
        this.hideMoves();
    }
    
    move (x, y) {
        this.logix.move(this.grid[0], this.grid[1], x, y);
        
        this.grid = [x, y];
        this.left = this.convert(this.grid).left;
        this.top = this.convert(this.grid).top;
    }
    
    recapitulate () {
        this.left = this.convert(this.grid).left;
        this.top = this.convert(this.grid).top;
    }
    
    remove () {
        console.log("animation shall be here");
    }
    
    showMoves (logix, graph) {
        let move = null;
        let move_coords = this.logix.getMoves(this.side, this.grid[0], this.grid[1]);
        
        for (let i = 0; i < move_coords.length; i++) {
            move = new Move({
                left: this.convert(move_coords[i]).left,
                top: this.convert(move_coords[i]).top,
                width: 70,
                mark: "move",
                grid: [move_coords[i].top, move_coords[i].left],
            }).addListener("click", () => {
                this.move(move_coords[i][0], move_coords[i][1]);
            });
            this.dependencies.push(move);
        }
    }
    
    hideMoves () {
        this.dependencies = [];
    }
    
    draw (ctx) {
        ctx.drawCircle(this.left + this.outerShift, this.top + this.outerShift, this.width / 2, {
            fillColor: this.bgColor,
            strokeColor: this.stColor,
            lineWidth: this.lineWidth,
            mode: this.mode,
        });
        
        this.dependencies.forEach(item => item.draw(ctx));
        
        if (this.selected) {
            ctx.drawRect(this.left, this.top, this.outerWidth, this.outerWidth, {
                strokeColor: "#d9d507",
                mode: "stroke",
                lineWidth: 4
            });
        }
    }
}