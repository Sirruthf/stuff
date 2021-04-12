const STATE_ENUM = { HIDDEN: 0, SHOWN: 1 };


class DropdownMenu {
    constructor ({
        select, dropdown, callback = () => {}, duration = 200
    }) {
        this.TRIM_LENGTH = 6;
        
        this._select = select;
        this._dropdown = dropdown;
        this._options = [...this._dropdown.firstElementChild.children];
        this._callback = callback;
        
        this._selected = -1;
        this._selectedValue = null;
        
        this._state = STATE_ENUM.HIDDEN;
        
        this._as = 0;
        
        this._options.forEach(item => item.textContent = this._trim(item.textContent));
        
        this._select.addEventListener("click", event => {
            if (this._state == STATE_ENUM.SHOWN) this.hide(); else
            if (this._state == STATE_ENUM.HIDDEN) this.show();
            
            event.stopPropagation();
        });
        
        this._options.forEach((item, i) => item.addEventListener("click", () => {
            this.select(i);
            this.hide();
        }));
        
        document.addEventListener("click", event => {
            if (this._state == STATE_ENUM.SHOWN) this.hide();
        });
        
        this._dropdown.addEventListener("click", event => event.stopPropagation());
    }
    
    get selectboxState () {
        return this._as + 1;
    }
    
    set selectboxState (value) {
        this._as = (value - 1) % 6;
    }
    
    _trim (word) {
        let parts = word.split(" ");
        let len = 0;
        
        for (let i = 0; i < parts.length; i++) {
            if (len > this.TRIM_LENGTH) {
                return parts.slice(0, i).join(" ") + "...";
            }
            
            len += parts[i].length;
        }
        
        return word;
    }
    
    _updSelect (desirable) {
        if (this._state == desirable) return;
        
        this._select.querySelector(".to" + this.selectboxState).beginElement();
        this.selectboxState++;
    }
    
    select (i) {
        this._selected = this._options[i];
        this._selectedValue = this._select.dataset.selected = this._options[i].dataset.corresp;
        this._select.to("&__text").textContent = this._options[i].textContent;
        
        this._callback(this._selectedValue);
    }
    
    show () {
        this._dropdown.style.display = "block";
        requestAnimationFrame(() => this._dropdown.style.opacity = 1);
        
        this._updSelect(STATE_ENUM.SHOWN);
        this._state = STATE_ENUM.SHOWN;
    }
    
    hide () {
        this._dropdown.style.opacity = 0;
        setTimeout(() => this._dropdown.style.display = "none", this._duration);
        
        this._updSelect(STATE_ENUM.HIDDEN);
        this._state = STATE_ENUM.HIDDEN;
    }
}


class ThreeStateCheckbox {
    constructor (element) {
        this._element = element;
    }
    
    setChecked () {
        this._element.indeterminate = false;
        this._element.checked = true;
    }
    
    setIndet () {
        this._element.indeterminate = true;
        this._element.checked = false;
    }
    
    setUnchecked () {
        this._element.indeterminate = false;
        this._element.checked = false;
    }
}
