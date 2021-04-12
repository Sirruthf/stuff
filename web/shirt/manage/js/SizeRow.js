import TypeState from '/projects/shirt/manage/js/TypeState.js';


export default class SizeRow {
    constructor (row, state) {
        this.row = row;
        this.id = row.to(".size-id-input").value;
        this.state = state;
        
        row.to(".sendable", true).on("change", () => state.add(this.serialize()));
        row.to(".type-del-button").on("click", () => this.remove());
    }
    
    static copy (row, ex, state) {
        let _new = new SizeRow(row, state);
        
        _new.type = TypeState.CRUD.CREATE;
        
        row.to(".size-num-input").value = ex.to(".size-num-input").value;
        row.to(".size-name-input").value = ex.to(".size-name-input").value;
        
        state.add(_new.serialize());
        
        return _new;
    }
    
    serialize () {
        return {
            type: this.type,
            queue: TypeState.Queues.SIZE,
            id: this.id,
            num: this.row.to(".size-num-input").value,
            name: this.row.to(".size-name-input").value,
            active: this.row.to(".checkbox__true-box").checked,
        };
    }
    
    remove () {
        this.row.remove();
        this.state.remove(this.serialize());
    }
}