export default class Player {
    constructor(side) {
        this.side = side;
        this.score = 0;
        this.incEvreg = [];
    }
    
    increment () {
        this.score++;
        this.incEvreg.forEach(item => item.call(this, this.side - 1, this.score));
    }
    
    addIncListener (callback) {
        this.incEvreg.push(callback);
    }
}