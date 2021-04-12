import State from '/projects/shirt/manage/js/State.js';


export default class CatalogueState extends State {
    static CRUD = { CREATE: "to_add", UPDATE: "to_update", DELETE: "to_del", IMGADD: "img_to_add", IMGDEL: "img_to_del" };
    
    
    constructor () {
        super();
        
        this.images = {};
    }
    
    serialize () {
        console.log(this.contents);
        
        return {
            data: JSON.stringify(this.contents),
            ...this.images
        };
    }
    
    addImage (tid, imgid, blob) {
        this.contents.push({
            type: CatalogueState.CRUD.IMGADD,
            id: imgid,
        });
        this.images[imgid] = blob;
    }
    
    removeImage (_nval, equal = State._compDefault) {
        if (this.contents.find(item => equal(item, _nval)))
            this.contents = this.contents.filter(item => !equal(item, _nval));
        else this.contents.push({
            type: CatalogueState.CRUD.IMGDEL,
            imgid: _nval.id,
            tid: _nval.tid
        });
    }
}