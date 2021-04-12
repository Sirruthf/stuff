import Q from '/projects/for_short.js';


class Card {
    constructor (element, manager) {
        this.element = element;
        this.quantity = parseInt(this.element.to(".card-quantity").value);
        
        this.manager = manager;
        
        element.to(".delete-button").on("click", () => this.remove());
        
        element.to(".quantity-unit__minus-button").on("click", () => this.setQuantity(this.quantity - 1));
        element.to(".quantity-unit__plus-button").on("click", () => this.setQuantity(this.quantity + 1));
        element.to(".quantity-unit__input").on("input", event => this.setQuantity(+event.target.value));
    }
    
    get price () { return +this.element.to(".card-price").value; }
    get type () { return +this.element.to(".card-type-id").value; }
    
    // @abstract
    remove () { throw new Error("Abstract method not implemented"); }
    
    // @abstract
    setQuantity () { throw new Error("Abstract method not implemented"); }
    
    // @abstract
    serialize () { throw new Error("Abstract method not implemented"); }
}

class CardCommon extends Card {
    remove () {
        this.element.remove();
        this.manager.remove(this);
    }
    
    setQuantity (qnt) {
        qnt = parseInt(qnt);
        if (qnt < 0) qnt = 0;
        
        this.quantity = qnt;
        this.element.to(".card-quantity").value = qnt;
        
        this.manager.update(this);
    }
    
    serialize () {
        return {
            tid: this.element.to(".card-tid").value,
            cid: this.element.to(".card-cid").value,
            quantity: this.element.to(".card-quantity").value,
        };
    }
}

class CardCustom extends Card {
    remove () {
        this.element.remove();
        this.manager.removeCustom(this);
    }
    
    setQuantity (qnt) {
        qnt = parseInt(qnt);
        if (qnt < 0) qnt = 0;
        
        this.quantity = qnt;
        this.element.to(".card-quantity").value = qnt;
        
        this.manager.updateCustom(this);
    }
    
    serialize () {
        return {
            id: this.element.to(".card-id").value,
            type: this.element.to(".card-type-id").value,
            size: this.element.to(".card-size-id").value,
            color: this.element.to(".card-color-id").value,
            left: this.element.to(".card-left-input").value,
            top: this.element.to(".card-top-input").value,
            width: this.element.to(".card-width-input").value,
            height: this.element.to(".card-height-input").value,
            quantity: this.element.to(".card-quantity").value
        };
    }
}


export default class CartPageManager {
    static RIGHT_MENU_EMPTY = "—"
    static DESC_DEFAULT = " с рисунком";
    static DESC_CUSTOM = " с вашим дизайном"
    
    static BUTTON_DISABLED_CLASS = "button_disabled";
    static REMOTE_URL = "/projects/shirt/sql/place_order.php";
    
    
    constructor (cart) {
        this.cart = cart;
        
        this.priceSlot = Q(".right-block__price");
        this.shortList = Q(".right-block__short-list");
        this.mainButton = Q(".open-overlay-button");
        this.typeForms = JSON.parse(Q(".types-input").value);
        
        this.list = Q(".card_trusted", true).map(card => new CardCommon(card, this));
        this.list_custom = Q(".card_custom", true).map(card => new CardCustom(card, this));
        
        console.log(this);
        
        Q(".open-overlay-button").on("click", () => this.openOverlay());
        Q(".close-button, .black-overlay", true).on("click", () => this.closeOverlay());
        
        Q(".final-button").on("click", () => this.sendOrder());
    }
    
    async sendOrder () {
        let form = new FormData();
        
        form.append("order", this.cart.accessKey);
        form.append("name", Q(".final-name-input").value);
        form.append("phone", Q(".final-phone-input").value);
        form.append("email", Q(".final-email-input").value);
        
        let text = await fetch(CartPageManager.REMOTE_URL, {
            method: "POST",
            body: form
        }).then(response => response.text());
        
        // console.log(text);
    }
    
    openOverlay () {
        Q(".black-overlay").style.display = "block";
        setTimeout(() => Q(".black-overlay").style.opacity = 1, 0);
        Q(".final-form").style.display = "flex";
        setTimeout(() => Q(".final-form").style.opacity = 1, 0);
    }
    
    closeOverlay () {
        Q(".black-overlay").style.opacity = 0;
        setTimeout(() => Q(".black-overlay").style.display = "none", 300);
        Q(".final-form").style.opacity = 0;
        setTimeout(() => Q(".final-form").style.display = "none", 300);
    }
    
    recalc () {
        let price = [...this.list, ...this.list_custom].reduce((total, card) => total + card.price * card.quantity, 0);
        
        this.priceSlot.innerHTML = formatPrice(price);
        
        if (price) {
            let content = "";
            
            content += this._calc(this.list, CartPageManager.DESC_DEFAULT);
            content += this._calc(this.list_custom, CartPageManager.DESC_CUSTOM);
            
            this.shortList.innerHTML = content;
        } else {
            this.shortList.innerHTML = CartPageManager.RIGHT_MENU_EMPTY;
        }
        
        this.mainButton.enabled = price;
        this.mainButton.class(CartPageManager.BUTTON_DISABLED_CLASS, !price);
    }
    
    _calc (list, name) {
        let typed = list.reduce((total, card) => 
            (total[card.type] ?
            total[card.type] += card.quantity :
            total[card.type] = card.quantity) && total,
        {});
        
        let content = "";
        
        for (let type in typed) content += "<li>" + typed[type] + " " + this.typeForms[type][getLCClass(typed[type])] + " " + name + "</li>";
        
        console.log(typed);
        
        return content;
    }
    
    remove (card) {
        this.list = this.list.filter(item => item != card);
        this.cart.remove(card.tid, card.cid);
        this.recalc();
    }
    
    removeCustom (card) {
        this.list_custom = this.list.filter(item => item != card);
        this.cart.remove(card.tid, card.cid);
        this.recalc();
    }
    
    update (card) {
        this.cart.add(card.serialize());
        this.recalc();
    }
    
    updateCustom (card) {
        this.cart.addCustom(card.serialize());
        this.recalc();
    }
}


function getLCClass (num) {
    if (num % 100 > 10 && num % 100 < 21)
        return 2;
    
    if (num % 10 == 1)
        return 0;
    else if (num % 10 > 4)
        return 2;
    else return 1;
}

function formatPrice (price) {
    price = price.toString();
    
    if (price.length > 3) {
        return price.slice(0, -3) + "&nbsp;" + price.slice(-3) + "&nbsp;₽";
    }
    
    return price;
}

