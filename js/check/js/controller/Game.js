"use strict";

import Graphix from './../view/Graphix.js';
import Board from './../view/objects/Board.js';
import Checker from './../view/objects/Checker.js';
import Move from './../view/objects/Move.js';
import Counter from './../view/objects/Counter.js';
import Logix from './Logix.js';
import Players from './../model/Players.js';
import Player from './../model/Player.js';


export default class Game {
    constructor (elem, param) {
        this.left = 50; this.top = 50; this.CW = 80, this.CH = 80;
        
        let graph = this.graph = new Graphix(elem);
        let board = this.board = new Board({left: this.left, top: this.top, selfWidth: this.NoCH, selfHeight: this.NoCV});
        
        let counter = this.counter = new Counter({left: 700, top: this.top});
        let player_ = [new Player(board.ALLIE), new Player(board.ENEMY)];
            player_.forEach(item => item.addIncListener((...option) => counter.update(option)));
        let players = this.players = new Players(player_);
        
        let logix = this.logix = new Logix(board, players);
        
        board.feed(this.__(this.left, this.top, this.CW, this.CH, this.logix));
        
        this.graph.push(board);
        this.graph.push(counter);
        this.graph.render();
    }
    
    __ (left, top, CW, CH, logix) {
        let feed = [];
        
        for (let i = 0; i < 12; i++) feed.push(new Checker({
            logix: logix,
            bgColor: "#333",
            stColor: "#fff",
            width: 70,
            mode: "stroke",
            side: this.board.ENEMY,
            convert (_grid) {
                return {
                    left: left + _grid[0] * CW,
                    top: top + _grid[1] * CH,
                };
            },
        }));
        for (let i = 0; i < 12; i++) feed.push(new Checker({
            logix: logix,
            bgColor: "#fff",
            stColor: "#333",
            width: 70,
            mode: "fill",
            side: this.board.ALLIE,
            convert (_grid) {
                return {
                    left: left + _grid[0] * CW,
                    top: top + _grid[1] * CH,
                };
            },
        }));
        
        return feed;
    }
    
    get NoCV () {
        return 8;
    }
    
    get NoCH () {
        return 8;
    }
    
    getById (id) {
        return this.graph.iget(id);
    }
}