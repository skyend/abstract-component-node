import cloneDeep from 'lodash/cloneDeep';

export default class MetaNode {

    children;
    __initialKeys;

    __location;
    __parent;

    constructor(JSONReference, __location, _parent) {
        let keys = Object.keys(JSONReference);
        this.__initialKeys = keys;
        for(let i =0; i < keys.length;i++){
            this[keys[i]] = JSONReference[keys[i]];
        }

        this.__location = __location;
        this._parent = _parent;
    }


    set _location(_location){
        this.__location = _location;
    }

    get _location(){
        return this.__location;
    }

    set _parent(parent){
        this.__parent = parent;
    }

    get _parent(){
        return this.__parent;
    }


    set _initialKeys(__initialKeys){
        this.__initialKeys = __initialKeys;
    }

    get _initialKeys(){
        return this.__initialKeys;
    }

    strideUpBloodLine(func){
        let node = this;
        while(node){
            func(node);
            node = node.__parent;
        }
    }

    visitChildren(func){
        if( typeof func !== 'function' ){
            throw new Error('first arguments must be function');
        }

        if( !Array.isArray(this.children) ){
            return null;
        }

        for(let i = 0; i < this.children.length; i++ ){
            if( func(this.children[i]) === true ){
                return this.children[i];
            }
        }

        return null;
    }

    visitRecursive(func){
        if( typeof func !== 'function' ){
            throw new Error('First arguments must be function.');
        }

        if( func(this) === true ){
            return true;
        }

        if( !Array.isArray(this.children) ){
            return false;
        }

        let recursiveResult;
        for(let i = 0; i < this.children.length; i++ ){

            recursiveResult = this.children[i].visitRecursive(func);

            if( recursiveResult === true ){
                return true;
            }
        }

        return false;
    }

    updateLocationFromMe(){
        if( this.children ){
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i]._updateLoc(this.__location + '.' + i);
            }
        }
    }

    _updateLoc(__location){
        this.__location = __location;

        if( this.children ){
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i]._updateLoc(this.__location + '.' + i);
            }
        }
    }

    prependChild(nodeInstanceOrJSON){
        this.children = this.children || [];

        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof (this.getClass()) ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new (this.getClass())(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            this.children.unshift(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChild(nodeInstanceOrJSON){
        this.children = this.children || [];

        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof (this.getClass()) ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new (this.getClass())(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            this.children.push(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChildAfter(childIdx, nodeInstanceOrJSON){
        this.children = this.children || [];

        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof (this.getClass()) ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new (this.getClass())(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            if( childIdx >= 0  ){
                this.children = [
                    ...this.children.slice(0,childIdx+1),
                    newChild,
                    ...this.children.slice(childIdx+1),
                ];
            } else {
                this.children.push(newChild);
            }


            this.updateLocationFromMe();
        } else {
            throw new Error("error : Second argument must be Node or JSON.");
        }
    }

    appendChildBefore(childIdx, nodeInstanceOrJSON){
        this.children = this.children || [];

        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof (this.getClass()) ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new (this.getClass())(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            if( childIdx >= 0  ) {
                this.children = [
                    ...this.children.slice(0, childIdx),
                    newChild,
                    ...this.children.slice(childIdx),
                ];
            } else {
                this.children.unshift(newChild);
            }

            this.updateLocationFromMe();
        } else {
            throw new Error("error : Second argument must be Node or JSON.");
        }
    }

    removeChild(location){
        let prevLength= this.children.length;
        this.children = this.children.filter((childNode)=> childNode.__location !== location);
        this.updateLocationFromMe();

        return prevLength !== this.children.length;
    }

    getLinealDescentList() {
        let des = [];

        let node = this;

        while (node) {
            des.unshift(node);
            node = node._parent;
        }

        return des;
    }


    findByLocation(_loc) {
        if( _loc.indexOf(this.__location) !== 0 ){
            throw new Error(`Invalid location. loc:${_loc}, current node location:${this.__location}.`);
        }

        var myPosTokens = this.__location.split('.');
        var __locationTokens = _loc.split('.');
        __locationTokens = __locationTokens.splice(myPosTokens.length - 1);

        if (__locationTokens.length === 1) return this;

        let node = this;

        for (let i = 1; i < __locationTokens.length; i++) {
            if (!node.children) return null;

            node = node.children[parseInt(__locationTokens[i])];

            if (!node) return null;
        }

        return node;
    }

    setData(key, data){
        if( this.__initialKeys.indexOf(key) == -1 ){
            this.__initialKeys.push(key);
        }

        this[key] = data;
    }

    getClass(){
        return this.__proto__.constructor;
    }

    static importFromJSON(JSONReference, __location = '0', _parent = null) {

        let node = new (this)(cloneDeep(JSONReference), __location, _parent);

        if (node.children) {
            node.children = node.children.map((json, i) => (this).importFromJSON(json, [__location, i].join('.'), node));
        }

        return node;
    }


    exportToJSONExt({ checkChildrenEmpty, extendFields = {}, renames, deletes }){
        let json = {};
        let keys = this.__initialKeys, key;
        for( let i = 0; i < keys.length; i++ ){
            if( keys[i] === 'children' ){
                continue;
            }
            key = keys[i];

            json[key] = cloneDeep(this[key]);


        }


        if( extendFields ){
            let extendKeys = Object.keys(extendFields);

            for(let i =0; i < extendKeys.length ; i++ ){
                json[extendKeys[i]] = this[extendFields[extendKeys[i]]];
            }
        }

        if( deletes ){
            for(let i = 0; i < deletes.length; i++ ){
                delete json[deletes[i]];
            }
        }

        if( renames ){
            let renameKeys = Object.key(renames )

            for(let i = 0 ; i < renameKeys.length; i++ ){
                json[renameKeys[i]] = json[renames[renameKeys[i]]];
                delete json[renames[renameKeys[i]]];
            }
        }

        if (this.children) {
            json.children = this.children.map((childNode) => childNode.exportToJSONExt({ checkChildrenEmpty, extendFields, renames, deletes }));

            if( checkChildrenEmpty && json.children.length  <  1 ) {
                delete json.children;
            }
        }


        return json;
    }

    exportToJSON() {
        let json = {};
        let keys = this.__initialKeys, key;
        for( let i = 0; i < keys.length; i++ ){
            if( keys[i] === 'children' ){
                continue;
            }
            key = keys[i];

            json[key] = cloneDeep(this[key]);
        }

        if (this.children) {
            json.children = this.children.map((childNode) => childNode.exportToJSON());
        }

        return json;
    }
}
