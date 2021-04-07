export default class Players {
    constructor (players) {
        this._current_n = 0;
        this.players = players;
    }
    
    get current () {
        return this.players[this._current_n];
    }
    
    next () {
        this._current_n = 1 - this._current_n;
    }
}