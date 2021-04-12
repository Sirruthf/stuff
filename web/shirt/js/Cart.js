export default class Cart {
    static Keys = { CKEY: "cart", CKEY_CUSTOM: "cart_custom" };
    static CKEY_ACCESS = "cckey";
    
    _contents = { [Cart.Keys.CKEY]: [], [Cart.Keys.CKEY_CUSTOM]: [] }; // Signature memento
    accessKey = "";
    
    
    constructor (contents) {
        this._contents = JSON.parse(contents); //&& contents.cart ? JSON.parse(contents) : this._contents;
        this.accessKey = document.cookie.split("; ").find(item => item.includes(Cart.CKEY_ACCESS));
        
        let midnight = new Date (); midnight.setHours(48, 0, 0);
        
        if (!this.accessKey) {
            this.accessKey = "000000".replace(/0/g, () => (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1));
            document.cookie = Cart.CKEY_ACCESS + "=" + this.accessKey + "; path=/; expires=" + midnight.toUTCString();
        } else {
            this.accessKey = this.accessKey.replace(Cart.CKEY_ACCESS + "=", "");
        }
    }
    
    get contents () {
        return this._contents[Cart.Keys.CKEY];
    }
    
    set contents (_nval) {
        this._contents[Cart.Keys.CKEY] = _nval; return true;
    }
    
    get contents_custom () {
        return this._contents[Cart.Keys.CKEY_CUSTOM];
    }
    
    set contents_custom (_nval) {
        this._contents[Cart.Keys.CKEY_CUSTOM]; return true;
    }
    
    async commit () {
        let data = new FormData ();
        
        data.append("cckey", this.accessKey);
        data.append("data", JSON.stringify(this._contents));
        
        let resp = await fetch("/projects/shirt/commit/", {
            method: "POST",
            body: data,
        }).then(response => response.text());
    }
    
    
    add (_new) {
        let target = this.contents.filter(item => item.tid == _new.tid && item.cid == _new.cid);
        
        if (target[0])
            target[0].quantity = _new.quantity;
        else
            this.contents.push(_new);
        
        this.commit();
    }
    
    remove (tid, cid) {
        this.contents = this.contents.filter(item => item.tid != tid || item.cid != cid);
        
        this.commit();
    }
    
    addCustom (args) {
        let target = this.contents_custom.filter(item => item.iid == args.iid);
        
        if (target[0]) 
            target[0].quantity = args.quantity;
        else
            this.contents_custom.push(args);
        
        this.commit();
    }
    
    removeCustom (iid) {
        this.contents_custom = this.contents_custom.filter(item => item.iid != iid);
        
        this.commit();
    }
}
