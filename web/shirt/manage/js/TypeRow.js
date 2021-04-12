import TypeState from '/projects/shirt/manage/js/TypeState.js';


export default class TypeRow {
    constructor (row, state) {
        this.type = TypeState.CRUD.UPDATE;
        
        this.id = row.to(".type-id-input").value;
        this.row = row;
        this.state = state;
        
        row.to(".type-icon-input").on("change", () => this.loadIcon());
        row.to(".sendable", true).on("change", () => this.stageData());
        row.to(".del-button").on("click", () => this.remove());
    }
    
    static copy (row, ex, state) {
        let _new = new TypeRow(row, state);
        
        _new.type = TypeState.CRUD.CREATE;
        
        row.to(".type-name-input").value = ex.to(".type-name-input").value;
        row.to(".type-nf-a-input").value = ex.to(".type-nf-a-input").value;
        row.to(".type-nf-b-input").value = ex.to(".type-nf-b-input").value;
        row.to(".type-nf-c-input").value = ex.to(".type-nf-c-input").value;
        
        state.add(_new.serialize());
        
        return _new;
    }
    
    async loadIcon () {
        let stream = new FileReader();
        let file = this.files[0];
        
        stream.readAsText(file);
        
        await new Promise(resolve => stream.onload = resolve);
        
        let tmp = document.createElement("div");
        tmp.innerHTML = stream.result;
        tmp = tmp.firstElementChild;
        tmp.removeAttribute("width"); tmp.removeAttribute("height");
        tmp.classList.add("type-list__icon");
        this.row.to(".type-list__icon").replaceWith(tmp);
        
        
        this.state.add(this.serialize());
    }
    
    serialize () {
        return {
            type: this.type,
            queue: TypeState.Queues.TYPE,
            id: this.id,
            name: this.row.to(".type-name-input").value,
            lc_names: "[\"" + 
                this.row.to(".type-nf-a-input").value + "\", \"" + 
                this.row.to(".type-nf-b-input").value + "\", \"" + 
                this.row.to(".type-nf-c-input").value + 
            "\"]",
            active: this.row.to(".checkbox__true-box").checked ? 1 : 0,
        };
    }
    
    stageData () {
        this.state.add(this.serialize());
    }
    
    remove () {
        this.state.remove(this.serialize());
        this.row.remove();
    }
}

