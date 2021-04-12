import CatalogueRow from '/projects/shirt/manage/js/CatalogueRow.js';
import CatalogueState from '/projects/shirt/manage/js/CatalogueState.js';
import Q from '/projects/for_short.js';


export default class CataloguePageManager {
    constructor ({
        state, url, checkbox, rows = []
    }) {
        this.currentURL = url;
        this.checkbox = new ThreeStateCheckbox(checkbox);
        this.state = new CatalogueState();
        
        this.shirts = rows.map(row => 
            new CatalogueRow({
                element: row,
                state: this.state,
                imgTemplate: Q(".image-block-template"),
            })
        );
        
        this.shirts.forEach(shirt => shirt.addListener(() => this._checkUp()));
        
        Q(".control-all__input").on("change", () => this._checkDown());
        Q(".add-button").on("click", () => this.add());
        Q(".control-del-button").on("click", () => this.remove());
    }
    
    add () {
        let newRow = Q.tmplt(".shirt-row-template");
        
        newRow.to(".id-input").value = guidGenerator();
        newRow.to(".cat-id-input").value = this.currentURL;
        
        let shirt = new CatalogueRow({
            element: newRow,
            state: this.state,
            imgTemplate: Q(".image-block-template"),
            isNew: true,
        });
        
        Q(".shirt-block").prepend(newRow.raw);
        
        this.state.add({
            type: CatalogueState.CRUD.CREATE,
            ...shirt.serialize(),
        });
    }
    
    remove () {
        this.shirts.filter(shirt => shirt.checked).forEach(shirt => {
            shirt.remove();
            this.state.remove(shirt.serialize());
        });
        this.checkbox.setUnchecked();
    }
    
    _checkUp () {
        if (this.shirts.every(shirt => shirt.checked))
            this.checkbox.setChecked();
        else if (this.shirts.some(shirt => shirt.checked))
            this.checkbox.setIndet();
        else
            this.checkbox.setUnchecked();
    }
    
    _checkDown (state) {
        this.shirts.forEach(shirt => shirt.checked = Q(".control-all__input").checked);
    }
}