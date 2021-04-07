import BaseGraphicalObject from './../BaseGraphicalObject.js';


export default class Move extends BaseGraphicalObject {
    constructor ({
        outerWidth = 80,
        outerShift = 5,
        stColor = "#d9d507",
        lineWidth = 3,
        mode = "stroke",
        grid = [0, 0],
        ...option
    }) {
        super(option);
        
        this.outerWidth = outerWidth;
        this.outerShift = outerShift;
        this.stColor = stColor;
        this.lineWidth = lineWidth;
        this.mode = mode;
        this.grid = grid;
    }
    
    draw (ctx) {
        ctx.drawCircle(this.left + this.outerShift, this.top + this.outerShift, this.width / 2, {
            strokeColor: this.stColor,
            lineWidth: this.lineWidth,
            mode: this.mode,
        });
    }
}