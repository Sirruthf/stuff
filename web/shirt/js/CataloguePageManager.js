import Q from '/projects/for_short.js';


class LeftMenu {
    constructor (element, url) {
        this.element = element;
        this.selected = this.rows.find(item => item.dataset.href == url);
        
        this.links.on("click", (_, event) =>  event.preventDefault());
    }
    
    get links () {
        return this.element.to(".left-menu__item__link", true);
    }
    
    get rows () {
        return this.element.to(".left-menu__item", true);
    }
    
    select (url) {
        this.selected ? this.selected.class("selected", false) : "";
        this.selected = this.rows.find(item => item.dataset.href == url);
        this.selected.class("selected");
    }
}


export default class CataloguePageManager {
    static FADE_GAP = 60;
    static FADE_TIME = 200;
    
    
    constructor (_urlInit, menu, arrCards, shirtBlock) {
        this.url = _urlInit;
        this.cards = arrCards;
        this.menu = new LeftMenu(menu, _urlInit);
        this.shirt_block = shirtBlock;
        
        this.menu.rows.on("click", row => this.go(row.dataset.href, true));
        
        window.addEventListener("popstate", event => {
            if (event && event.state)
                this.go(event.state.url);
        });
    }
    
    async go (_nUrl, trusted = false) {
        this.url = _nUrl;
        
        let form = new FormData();
        form.append("url", _nUrl);
        
        let response = fetch("/projects/shirt/lib/fetch_catalogue.php?" + _nUrl);
        
        let result = await response.then(response => response.text());
        let temp = document.createElement("div");
        temp.innerHTML = result;
        
        this.updatePage({
            counter: temp.querySelector(".counter-input").value,
            title: temp.querySelector(".title-input").value,
            url: _nUrl
        });
        
        
        let newList = [...temp.querySelector(".rows").children];
        let oldList = [...this.shirt_block.children];
        
        let limit = Math.max(oldList.length, newList.length), removeQueue = [];
        
        for (let i = 0; i < limit; i++) {
            
            if (i < oldList.length) {
                oldList[i].classList.add("fade");
                
                if (i < newList.length) {
                    newList[i].classList.add("unfade");
                    setTimeout(() => {
                        oldList[i].replaceWith(newList[i]);
                        newList[i].classList.remove("unfade");
                    }, CataloguePageManager.FADE_TIME);
                } else
                    setTimeout(() => oldList[i].remove(), CataloguePageManager.FADE_TIME);
            } else {
                newList[i].classList.add("unfade");
                this.shirt_block.append(newList[i]);
                setTimeout(() => newList[i].classList.remove("unfade"), CataloguePageManager.FADE_TIME);
            }
            
            await new Promise(resolve => setTimeout(resolve, CataloguePageManager.FADE_GAP));
        }
        
        if (trusted) {
            window.history.pushState({ url: _nUrl }, window.title, "/projects/shirt/catalogue/" + _nUrl);
        }
    }
    
    updatePage (data) {
        Q(".counter").textContent = data.counter + " " + getLCName(data.counter);
        Q(".top_block__title").textContent = data.title;
        this.menu.select(data.url);
    }
}

function getLCName (num) {
    if (num % 100 > 10 && num % 100 < 21)
        return "футболок";
    
    if (num % 10 == 1)
        return "футболка";
    if (num % 10 < 5 && num % 10 > 0)
        return "футболки";
    
    return "футболок";
}