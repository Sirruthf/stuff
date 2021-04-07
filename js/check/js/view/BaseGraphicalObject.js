export default class BaseGraphicalObject {
    constructor({
        top = 100,
        left = 100,
        width = 100,
        height = 100,
        bgColor = "#666666",
        stColor = "#666666",
        mode = "fill",
        draw,
        mark
    }) {
        this.top = top;
        this.left = left;
        
        this.width = width;
        this.height = height;
        
        this.bgColor = bgColor;
        this.stColor = stColor;
        this.mode = mode;
        
        this.draw = draw || this.draw;
        this.mark = mark;
        
        this.evreg = {};
        
        this.addListener("focus", this.focus);
        this.addListener("blur", this.blur);
    }
    
    focus () { }
    
    blur () { }
    
    draw(ctx) {
        ctx.drawRect(this.left, this.top, this.width, this.height, {
            fillColor: this.bgColor,
            strokeColor: this.stColor,
            mode: this.mode,
            lineWidth: this.lineWidth
        });
    }
    
    fireEvent(type, params) {
        let event = params;
        if (this.evreg[type])
            this.evreg[type].forEach(item => item.call(this, event));
    }
    
    addListener(type, callback) {
        this.evreg[type] ? this.evreg[type].push(callback) : this.evreg[type] = [callback,];
        return this;
    }
    
    removeListener(type, callback) {
        this.evreg[type].forEach((item, i) => {
            if (item == callback)
                delete this.evreg[type][i];
        });
    }
}