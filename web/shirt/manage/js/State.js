export default class State {
    static CRUD = { CREATE: "to_add", UPDATE: "to_update", DELETE: "to_delete" };
    
    
    constructor () {
        this.contents = [];
    }
    
    serialize () {
        return { data: JSON.stringify(this.contents) };
    }
    
    static _compDefault (own, foreign) {
        return own.id == foreign.id && foreign.id;
    }
    
    add (_nval, equal = State._compDefault) {
        let own = this.contents.findIndex(item => equal(item, _nval));
        
        if (~own) 
            this.contents[own] = _nval;
        else this.contents.push(_nval);
    }
    
    remove (_nval, equal = State._compDefault) {
        if (this.contents.find(item => equal(item, _nval)))
            this.contents = this.contents.filter(item => !equal(item, _nval));
        else this.contents.push({
            type: State.CRUD.DELETE,
            id: _nval.id
        });
    }
    
    reset () {
        this.contents = [];
    }
}