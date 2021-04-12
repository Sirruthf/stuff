export default class Table {
    // interactive panel proxy -- contains stock info
    
    constructor (raw, init) {
        this.data = JSON.parse(raw);
        
        this._type = init.type;
        this._size = init.size;
        this._color = init.color;
        this.select();
    }
    
    set type (_nval) {
        this._type = _nval;
        this.select();
    }
    
    get type () { return this._type; }
    
    set size (_nval) {
        this._size = _nval;
        this.select();
    }
    
    get size () { return this._size; }
    
    set color (_nval) {
        this._color = _nval;
        this.select();
    }
    
    get color () { return this._color; }
    
    get max () { return this.selected.quantity ?? 0; }
    
    select (type = this.type, size = this.size, color = this.color) {
        this.selected = this.data.find(entry =>
            entry.type == type && entry.size == size && entry.color == color
        ) || {};
    }
}