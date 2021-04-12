import TypeState from '/projects/shirt/manage/js/TypeState.js';


export default class ColorRow {
    constructor (row, state) {
        this.row = row;
        this.id = row.to(".color-id-input").value;
        this.state = state;
        
        row.to(".color-color-input").on("change", input => this.changeColor(input.value));
        row.to(".sendable", true).on("change", () => state.add(this.serialize()));
        row.to(".del-button").on("click", () => this.remove());
    }
    
    static copy (row, ex, state) {
        let _new = new ColorRow(row, state);
        
        _new.to(".color-name-input").value = ex.to(".color-name-input").value;
        _new.to(".color-color-input").value = ex.to(".color-color-input").value;
        _new.to(".color-preview").style.background = ex.to(".color-color-input").value;
        
        state.add(this.serialize());
        
        return _new;
    }
    
    serialize () {
        return {
            type: this.type,
            queue: TypeState.Queues.COLOR,
            id: this.id,
            name: this.row.to(".color-name-input").value,
            hex: this.row.to(".color-color-input").value,
            active: this.row.to(".checkbox__true-box", true)[0].checked,
            bright: this.row.to(".checkbox__true-box", true)[1].checked,
            dark: this.row.to(".checkbox__true-box", true)[2].checked
        };
    }
    
    changeColor (_nval) {
        this.row.to(".color-preview").style.background = _nval;
    }
    
    remove () {
        this.row.remove();
        this.state.remove(this.serialize());
    }
}