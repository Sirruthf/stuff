class W_Generic  {
    constructor (element) {
        this.element = element;
        let self = this;
        
        this.proxy = new Proxy ({}, {
            get (_, property) {
                return self.demand(property);
            },
            
            set (_, property, value) {
                try {
                    if (typeof self.element[property] != "undefined")
                        self.element[property] = value;
                    else
                        self[property] = value;
                } catch (error) {
                    console.log(error);
                }
                
                return true;
            }
        });
    }
    
    demand (property) {
        if (property == "toString" || property == Symbol.toPrimitive)
            return () => this.element.toString();
        
        if (typeof this.element[property] != "undefined")
            if (typeof this.element[property] == "function")
                return this.element[property].bind(this.element);
            else
                return this.element[property];
        
        if (typeof this[property] != "undefined")
            return this[property];
        
        throw new Error ("Request of non-existant property: " + this.constructor.name + ":" + property.toString());
    }
}

class W_SinExt extends W_Generic {
    constructor (element, receivedBy) {
        super(element);
        this.receivedBy = receivedBy;
    }
    
    get raw () {
        return this.element;
    }
    
    /* altering */
    
    on (type, callback) { this.element.addEventListener(type, (...args) => callback.call(this, ...args)); return this.proxy; }
    content (value) { this.element.innerHTML = value; return this.proxy; }
    class (_class, positive = true) { positive ? this.element.classList.add(_class) : this.element.classList.remove(_class); return this.proxy; }
    hasClass (_class) { return this.element.classList.contains(_class); }
    
    /* creational */
    
    child () { return (new W_SinExt(this.element.firstElementChild)).proxy; }
    to (css, m) { return Q(css, m, this.element, this.receivedBy); }
    near (selector) { return Q(this.element.parentElement).to(selector, true).find(item => item.raw != this.raw); }
    
    from (selector) {
        if (this.element.parentElement == null) throw new Error("Parent list does not include element(s) matching provided selector: " + selector);
        let parent = Q(this.element.parentElement);
        
        if (parent.matches(selector) || !selector)
            return parent;
        else
            return parent.from(selector);
    }
}

class W_ListExt extends W_Generic {
    constructor (list) {
        super(list);
        this.list = list;
    }
    
    /* altering */
    
    on (...args) { this.list.forEach(element => element.on(...args)); return this.proxy; }
    remove () { this.list.forEach(element => element.remove()); return this.proxy; }
    content (value) { this.list.forEach(element => element.content(value)); return this.proxy; }
    
    /* creational */
    
    to (selector) { return new W_ListExt(this.list.map(element => element.to(selector))); }
    near (selector) { return new W_ListExt(this.list.map(element => element.near(selector))); } 
    child () { return new W_ListExt(this.list.map(element => element.child())); }
    from (selector) { return new W_ListExt(this.list.map(element => element.from(selector))); }
}


function Q (input, m, parent = document, parentClass = "") {
    let source = null;
    
    if (input instanceof HTMLElement || input instanceof SVGElement || Array.isArray(input)) {
        source = input;
    } else if (typeof input == "string") {
        input = input.replace("&", parentClass);
        source = m ? [...parent.querySelectorAll(input)] : parent.querySelector(input);
    } else {
        throw new Error("Unrecognizable input type: \"" + input + "\"");
    }
    
    if (!source) return null;
    
    let wrapper;
    
    if (Array.isArray(source))
        wrapper = new W_ListExt(source.map(item => (new W_SinExt(item, input.toString())).proxy));
    else
        wrapper = new W_SinExt(source, input.toString());
    
    return wrapper.proxy;
}

export default new class extends Function {
    constructor () {
        super("...args", "return this.search(...args);");
        return this.bind(this);
    }
    
    search (...args) { return Q(...args); }
    
    tmplt (target) {
        try {
            if (typeof target == "string") target = Q(target);
            return Q(target.content.firstElementChild.cloneNode(true))
        } catch (err) {
            console.log(target);
            throw err;
        }
    }
}();
