import State from '/projects/shirt/manage/js/State.js';


export default class TypeState extends State {
    static Queues = { TYPE: "type", SIZE: "size", COLOR: "color" };
    
    remove (_nval, equal = State._compDefault) {
        if (this.contents.find(item => equal(item, _nval)))
            this.contents = this.contents.filter(item => !equal(item, _nval));
        else this.contents.push({
            type: State.CRUD.DELETE,
            queue: _nval.queue,
            id: _nval.id
        });
    }
}