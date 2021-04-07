import Canvas from './Canvas.js';

export default class Graphix {
    constructor (elem) {
        this.canvas = new Canvas(elem);
        this.rended = [];
        
        window.onresize = () => {
            this.render();
        };
        
        this.hovered = null;
        this.focused = null;
        
        document.onmousemove = event => this.hover(event);
        document.onmousedown = event => this.hovered ? this.hovered.fireEvent("mousedown", event) : false; 
        document.onmouseup = event => this.hovered ? this.hovered.fireEvent("mouseup", event) : false; 
        document.onclick = event => {
            if (this.focused && this.focused != this.hovered) {
                this.focused.fireEvent("blur", event);
                this.focused = null;
            }
            
            if (this.hovered) {
                event.item = this.hovered;
                this.hovered.fireEvent("click", event);
                this.focused = this.hovered;
                this.focused.fireEvent("focus", this);
            }
            
            this.render();
        };
    }
    
    push(item) {
        try {
            item.addListener("hover", () => this.render());
            item.addListener("leave", () => this.render());
            item.addListener("mousedown", () => this.render());
            item.addListener("mouseup", () => this.render());
            item.addListener("click", () => this.render());
            item.id = this.rended.length;
        } catch (err) {
            console.error(err);
        }
        
        this.rended.push(item);
        
        return item;
    }
    
    pop(mark) {
        if (!mark)
            return this.rended.pop();
        
        this.rended = this.rended.filter(item => item.mark != mark);
    }
    
    shift(item) {
        try {
            item.addListener("hover", () => this.render());
            item.addListener("leave", () => this.render());
            item.addListener("mousedown", () => this.render());
            item.addListener("mouseup", () => this.render());
        } catch (err) {
            console.error(err);
        }
        
        this.rended.shift(item);
    }
    
    unshift() {
        return this.rended.unshift();
    }
    
    priority(j = this.rended.length - 1) {
        let rend = this.rended.slice();
        
        this.rended[0] = rend[j];
        for (let i = 1; i < this.rended.length; i++) {
            if (i <= j)
                this.rended[i] = rend[i - 1];
            else
                this.rended[i] = rend[i];
        }
    }
    
    render () {
        this.canvas.clearAll();
        this._render_r(this.rended);
    }
    
    _render_r (arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].draw(this.canvas);
            if (arr[i].dependencies && arr[i].dependencies.length) this._render_r(arr[i].dependencies);
        }
    }
    
    hover (event) {
        let temp = this.lookForHover(event, this.rended);
        
        if (temp && temp != this.hovered) {
            temp.fireEvent("hover", event);
        }
        
        if (this.hovered != temp) {
            if (this.hovered)
                this.hovered.fireEvent("leave");
            this.hovered = temp;
        }
        
        return temp;
    }
    
    lookForHover (event, arr) {
        let result = null;
        for (let i = 0, temp = null; i < arr.length; i++, temp = null) {
            if (event.pageX > arr[i].left && event.pageX < arr[i].left + arr[i].width
             && event.pageY > arr[i].top  && event.pageY < arr[i].top  + arr[i].height)
                result = arr[i];
            if (arr[i].dependencies && arr[i].dependencies.length) temp = this.lookForHover(event, arr[i].dependencies);
            if (temp) result = temp;
        }
        return result;
    }
    
    iget (id) {
        return this.rended.filter(item => item.id == id)[0];
    }
}