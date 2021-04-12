import Q from '/projects/for_short.js';
import CatalogueState from '/projects/shirt/manage/js/CatalogueState.js';


class CImage {
    constructor (element, parent) {
        this.element = element;
        this.parent = parent;
        
        this.id = this.element.to(".name-input").value;
        this.src = this.element.to(".shirt__foto").src;
        
        this.element.to(".image-del-button").on("click", () => parent.deleteImage(this));
        this.element.to(".image-mark-button").on("click", () => parent.promoteImage(this));
    }
    
    static async create ({ file, parent, template }) {
        let stream = new FileReader();
        
        stream.readAsDataURL(file);
        
        let obj = new CImage(Q.tmplt(template), parent);
        obj.id = guidGenerator();
        
        await new Promise(resolve => stream.onload = resolve);
        
        obj.src = obj.element.to(".shirt__foto").src = stream.result;
        
        return obj;
    }
    
    class (...args) {
        this.element.class(...args);
    }
    
    remove () {
        this.element.remove();
    }
}


export default class CatalogueRow {
    constructor ({ element, state, imgTemplate, isNew = false }) {
        this.element = element;
        this.imgTemplate = imgTemplate;
        this.state = state;
        this.new = isNew;
        
        this.id = element.to(".id-input").value;
        this.img_ref = [];
        
        this.dropOverlay = element.to(".drop-overlay");
        
        element.to(".sendable", true).on("change", () => this.stageData());
        element.to(".foto-cont", true).forEach(cont => new CImage(cont, this));
        element.to(".image-input").on("change", () => this.addImage(element.to(".image-input").files));
        
        
        element.on("dragstart", event => event.preventDefault() )
            .on("dragover", event => event.preventDefault() )
            .on("dragenter", () => this.showOverlay() );
        
        this.dropOverlay.on("dragleave", () => this.showOverlay).on("drop", event => {
            this.addImage(event.dataTransfer.files);
            this.hideOverlay();
            event.preventDefault();
        });
    }
    
    set checked (state) {
        this.element.to(".shirt-checkbox").checked = state;
        this.element.class("shirt_selected", state);
    }
    
    get checked () {
        return this.element.to(".shirt-checkbox").checked;
    }
    
    addListener (_callback) {
        this.element.to(".shirt-checkbox").addEventListener("click", _callback);
    }
    
    showOverlay () {
        this.dropOverlay.style.display = "block";
        window.requestAnimationFrame(() => this.dropOverlay.style.opacity = 1);
    }
    
    hideOverlay () {
        this.dropOverlay.style.opacity = 0;
        setTimeout(() => this.dropOverlay.style.display = "none", 70);
    }
    
    promoteImage (image) {
        let current = this.element.to(".preview-pic");
        if (current) current.class("preview-pic", false);
        
        image.class("preview-pic");
        
        this.element.to(".shirt-main-pic").src = image.src;
        this.element.to(".preview-input").value = image.id;
        
        this.stageData();
    }
    
    async addImage (blobList) {
        for (let i = 0; i < blobList.length; i++) {
            let file = blobList[i];
            
            let _new = await CImage.create({
                file: file, parent: this, template: this.imgTemplate
            });
            
            this.element.to(".foto-list").append(_new.element.raw);
            
            this.img_ref.push(_new.id);
            
            this.state.add(this.serialize());
            this.state.addImage(this.id, _new.id, file);
        }
        
        this.stageData();
    }
    
    deleteImage (container) {
        if (container.element.classList.contains("preview-pic")) {
            this.element.to(".preview-input").value = "default.png";
            this.element.to(".shirt-main-pic").src = "/projects/shirt/img/default.png";
        }
        
        this.state.removeImage({
            id: container.id,
            tid: this.id
        });
        
        container.remove();
        
        this.stageData();
    }
    
    serialize () {
        return {
            type: this.new ? CatalogueState.CRUD.CREATE : CatalogueState.CRUD.UPDATE,
            id: this.id,
            catId: this.element.to(".cat-id-input").value,
            name: this.element.to(".shirt-name-input").value,
            price: this.element.to(".shirt-price-input").value.replace(" ", ""),
            discount: this.element.to(".shirt-discount-input").value,
            comment: this.element.to(".shirt-comm-input").value,
            preview: this.element.to(".preview-input").value,
            img_ref: this.img_ref
        };
    }
    
    stageData () {
        this.state.add(this.serialize());
    }
    
    remove () {
        this.element.remove();
    }
}

