export default class CImage {
    constructor (data, {
        left = 0,
        top = 0,
        container = document,
        button = null
    } = {}) {
        this.id = null;
        
        this.img = document.createElement("div");
        this.img.classList.add("user-img");
        this.img.setAttribute("draggable", true);
        button.className = "user-img__button";
        button.addEventListener("mousedown", event => this.startResize(event));
        this.img.appendChild(button);
        
        
        container.appendChild(this.img);
        
        
        this.img.addEventListener("dragstart", event => this.start(event));
        
        this.left = left;
        this.top = top;
        this.container = container;
        this.observer = {};
        this.observer.mouseup = event => this.stop(event);
        this.MAX_WIDTH = 200;
        this.CON_WIDTH = container.offsetWidth;
        this.CON_HEIGHT = container.offsetHeight;
        this.MIN_WIDTH = 100;
        this.MIN_HEIGHT = 100;
        
        
        this._setup(data);
    }
    
    // image needs forced sync
    async _setup (data) {
        let tmp = new Image();
        let [width, height] = await this.loadImg(tmp, URL.createObjectURL(data)); // <--
        
        if (width > this.MAX_WIDTH) {
            height = Math.round(height * this.MAX_WIDTH / width);
            width = this.MAX_WIDTH;
        }
        
        this.img.addEventListener("transitionend", () => this.img.style.transition = "none");
        
        this.factor = height / width;
        this.img.style.background = "url(" + tmp.src + ") 0 0";
        this.width = width;
        this.height = height;
        this.left = (this.CON_WIDTH - this.width) / 2;
        this.top = (this.CON_HEIGHT - this.height) / 2;
    }
    
    async loadImg (img, url) {
        img.src = url;
        return await (() => new Promise(resolve => {
            img.onload = () => resolve([img.width, img.height]);
        }))();
    }
    
    start (ev) {
        this.stop(); // in case already dragging
        
        let fromY = ev.pageY - this.top, fromX = ev.pageX - this.left;
        
        this.observer.mousemove = event => {
            this.top = event.pageY - fromY;
            this.left = event.pageX - fromX;
        };
        
        document.addEventListener("mousemove", this.observer.mousemove);
        document.addEventListener("mouseup", this.observer.mouseup);
        
        ev.preventDefault();
    }
    
    startResize (ev) {
        this.stop(); // in case already dragging
        
        let fromY = ev.pageY - this.height, fromX = ev.pageX - this.width;
        
        this.observer.mousemove = event => {
            this.size(event.pageX - fromX, event.pageY - fromY);
        };
        
        document.addEventListener("mousemove", this.observer.mousemove);
        document.addEventListener("mouseup", this.observer.mouseup);
        
        ev.preventDefault();
        ev.stopPropagation(); // to prevent drag from firing
    }
    
    stop (ev) {
        document.removeEventListener("mousemove", this.observer.mousemove);
        document.removeEventListener("mouseup", this.observer.mouseup);
        delete this.observer.mousemove;
    }
    
    size (width, height) {
        this.height = height;
        this.width = this.height / this.factor;
    }
    
    
    set left (_new) {
        this._left = _new;
        this.img.style.left = _new + "px";
    }
    
    get left () {
        return this._left;
    }
    
    set top (_new) {
        this._top = _new;
        this.img.style.top = _new + "px";
    }
    
    get top () {
        return this._top;
    }
    
    set width (_new) {
        if (_new < this.MIN_WIDTH) _new = this.MIN_WIDTH;
        this._width = parseInt(_new);
        this.img.style.width = _new + "px";
        this.img.style.backgroundSize = this.width + "px " + this.height + "px";
    }
    
    get width () {
        return this._width;
    }
    
    set height (_new) {
        if (_new < this.MIN_HEIGHT) _new = this.MIN_HEIGHT;
        this._height = parseInt(_new);
        this.img.style.height = _new + "px";
        this.img.style.backgroundSize = this.width + "px " + this.height + "px";
    }
    
    get height () {
        return this._height;
    }
    
    destructor () {
        this.stop();
        this.img.remove();
    }
}