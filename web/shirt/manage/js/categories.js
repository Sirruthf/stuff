import Q from '/projects/for_short.js';
import State from '/projects/shirt/manage/js/State.js';


const STATES = { IDLE: 0, ACTIVE: 1 };

export class Row {
    constructor (element, globalState, isNew = false) {
        this.state = STATES.IDLE;
        this.globalState = globalState;
        
        this.element = element;
        this.nameInput = element.to(".cat-name-input");
        this.urlInput = element.to(".cat-url-input");
        
        let pu = element.from(".cat-group-root").dataset.url;
        
        this.data = {
            type: isNew ? State.CRUD.CREATE : State.CRUD.UPDATE,
            id: element.to(".id-input").value,
            name: element.to(".cat-name-input").value,
            url: pu + element.to(".cat-url-input").value,
            parent: element.from(".cat-group-root").dataset.assoc,
            parentURL: pu,
        };
        
        document.addEventListener("click", event => event.path.includes(element.raw) || this.state == STATES.IDLE ? "" : this.commit());
        
        element.to(".rename-button").on("click", () => this.activate());
        element.to(".del-button").on("click", () => this.remove());
        
        this.nameInput.on("input", () => this.data.name = this.nameInput.value);
        this.urlInput.on("input", () => {
            this.validateURL();
            this.data.url = this.data.parentURL + this.urlInput.value;
        });
        
        this.listeners = [];
    }
    
    addListener (type, callback) {
        this.listeners[type] ? this.listeners[type].push(callback) : this.listeners[type] = [callback];
    }
    
    fireEvent (type, event) {
        this.listeners[type].forEach(callback => callback(event));
    }
    
    updateParentURL (url) {
        this.data.parentURL = url;
        this.data.url = url + this.urlInput.value;
        this.element.to(".cat-url-prep").textContent = url;
        
        this.commit();
    }
    
    activate () {
        this.element.classList.add("row_active");
        
        this.nameInput.disabled = false;
        this.urlInput.disabled = false;
        
        this.state = STATES.ACTIVE;
    }
    
    commit () {
        this.element.classList.remove("row_active");
        
        this.nameInput.disabled = true;
        this.urlInput.disabled = true;
        
        this.globalState.add(this.data);
        
        this.state = STATES.IDLE;
    }
    
    validateURL () {
        if (this.urlInput.value.includes(" ")) {
            this.urlInput.setCustomValidity("Illegal URL character: ' '");
            this.element.classList.add("row_invalid");
        } else {
            this.urlInput.setCustomValidity("");
            this.element.classList.remove("row_invalid");
        }
        
        this.urlInput.reportValidity();
    }
    
    remove () {
        this.globalState.remove(this.data);
        this.element.remove();
    }
    
    drop () {
        this.element.remove();
    }
}


export class TitleRow extends Row {
    constructor (element, globalState) {
        super(element, globalState);
        
        this.t_dub = element.to(".cat-url-doubler");
        this.slash = element.to(".cat-url-after");
        this.button = element.to(".cat-name-button");
        this.assoc = element.to(".id-input").value;
        
        this.adjustSlash();
        
        this.urlInput.on("input", () => this.adjustSlash() || this.fireEvent("URLupdate", { data: this.data.url }));
        this.button.on("click", () => this.fireEvent("select"));
    }
    
    adjustSlash () {
        this.t_dub.textContent = this.data.url;
        this.slash.style.left = this.t_dub.offsetWidth + "px";
    }
    
    select () {
        this.button.classList.add("cat-name-button_selected");
    }
    
    deselect () {
        this.button.classList.remove("cat-name-button_selected");
    }
}


export class Page {
    constructor (element, rows, option) {
        this.element = element;
        this.rows = rows;
        this.assoc = option.assoc;
        this.url = option.url;
    }
    
    setParentURL (url) {
        this.url = url;
        this.rows.forEach(row => row.updateParentURL(url));
    }
    
    push (row) {
        this.rows.push(row);
    }
    
    select () {
        this.element.classList.add("sub-cat-block__page_visible");
    }
    
    deselect () {
        this.element.classList.remove("sub-cat-block__page_visible");
    }
    
    drop () {
        this.element.remove();
    }
}


export class PageList {
    constructor (pages = []) {
        this.pages = pages;
        pages.length ? this.selected = pages[0] : this.selected = null;
    }
    
    push (page) {
        this.pages.push(page);
        if (this.selected === null) this.selected = page;
    }
    
    select (assoc) {
        this.selected ? this.selected.deselect() : "";
        this.selected = this.getPage(assoc);
        this.selected.select();
    }
    
    getPage (assoc) {
        return this.pages.find(page => page.assoc == assoc);
    }
    
    reset() {
        this.pages.forEach(page => page.drop());
        this.pages = [];
        this.selected = null;
    }
}


export class RowManager {
    constructor (rows = [], pages = []) {
        this.pageList = new PageList(pages);
        
        this.rows = rows;
        rows.length ? this.selected = rows[0] : this.selected = null;
        
        this.rows.forEach(row => {
            row.addListener("URLupdate", event => this.updatePageURL(row.assoc, event.data));
            row.addListener("select", () => this.select(row.assoc));
        });
    }
    
    push (row, page) {
        this.pageList.push(page);
        
        this.rows.push(row);
        if (this.selected === null) this.selected = row;
        
        row.addListener("URLupdate", event => this.updatePageURL(row.assoc, event.data));
        row.addListener("select", () => this.select(row.assoc));
    }
    
    expandPage (assoc, row) {
        this.pageList.getPage(assoc).push(row);
    }
    
    select (assoc) {
        this.pageList.select(assoc);
        
        this.selected ? this.selected.deselect() : "";
        this.selected = this.getRow(assoc);
        this.selected.select();
    }
    
    updatePageURL (assoc, url) {
        this.pageList.getPage(assoc).setParentURL(url);
    } 
    
    getRow (assoc) {
        return this.rows.find(row => row.assoc == assoc);
    }
    
    getSelectedAssoc () {
        return this.selected.assoc;
    }
    
    reset () {
        this.rows.forEach(row => row.drop());
        this.rows = [];
        this.selected = null;
        this.pageList.reset();
    }
}


export function addCat (template, rowManager, source) {
    let pageElement = Q.tmplt(".page-template");
    
    pageElement.dataset.assoc = source.assoc;
    pageElement.dataset.url = source.url;
    pageElement.to(".cat-title").textContent = source.name;
    
    source.pageTarget.before(pageElement.raw);

    let newPage = new Page(pageElement, [], {
        assoc: source.assoc,
        url: source.url,
    });
    
    let newRow = Q.tmplt(template);
    
    newRow.to(".id-input").value = source.assoc;
    newRow.to(".cat-name-input").value = source.name;
    newRow.to(".cat-url-input").value = source.url;
    
    source.target.append(newRow.raw);
    
    rowManager.push(new TitleRow(newRow, source.state), newPage);
    rowManager.select(source.assoc);
    
    source.state.add({
        type: State.CRUD.CREATE,
        id: source.assoc,
        name: source.name,
        url: source.url,
        parent: 0
    });
}

export function addSubCat (template, rowManager, source) {
    let newRow = Q.tmplt(template);
    
    newRow.to(".id-input").value = source.assoc;
    newRow.to(".cat-name-input").value = source.name;
    newRow.to(".cat-url-prep").textContent = source.urlPrep;
    newRow.to(".cat-url-input").value = source.url;
    
    source.target.append(newRow.raw);
    
    rowManager.expandPage(source.parentAssoc, new Row(newRow, source.state, true));
    
    source.state.add({
        type: State.CRUD.CREATE,
        id: source.assoc,
        name: source.name,
        url: source.urlPrep + source.url,
        parent: source.parentAssoc,
    });
}


