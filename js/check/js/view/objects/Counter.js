import BaseGraphicalObject from './../BaseGraphicalObject.js';
import Move from './Move.js';


export default class Counter extends BaseGraphicalObject {
    constructor (option) {
        option.width = 150;
        super(option);
        this.numbs = [0, 0];
    }
    
    update ([side, num]) {
        this.numbs[side] = num;
    }
    
    draw(ctx) {
        ctx.drawRect(this.left, this.top, this.width, this.height, {
            fillColor: this.bgColor,
            strokeColor: this.stColor,
            mode: this.mode,
            lineWidth: this.lineWidth
        });
        ctx.drawText(this.numbs[0] + " : " + this.numbs[1], this.left + this.width / 2, this.top + this.height / 2, {
            fillColor: "#EEE",
            fontSize: 60,
            textAlign: "center",
            textBaseline: "middle",
        });
    }
}