class StockState extends State {
    repop () {
        for (let key in this.computed) delete this.computed[key];
        
        this.queue[UPD_KEY].forEach((item, i) => {
            this.computed[UPD_KEY + "[" + i + "][id]"] = item.id;
            this.computed[UPD_KEY + "[" + i + "][quantity]"] = item.quantity;
        });
        
        this.queue[ADD_KEY].forEach((item, i) => {
            this.computed[ADD_KEY + "[" + i + "][quantity]"] = item.quantity;
            this.computed[ADD_KEY + "[" + i + "][type]"] = item.type;
            this.computed[ADD_KEY + "[" + i + "][size]"] = item.size;
            this.computed[ADD_KEY + "[" + i + "][color]"] = item.color;
        });
        
        this.queue[DEL_KEY].forEach((item, i) => {
            this.computed[DEL_KEY + "[" + i + "]"] = item.id;
        });
        
        return this.computed;
    }
}