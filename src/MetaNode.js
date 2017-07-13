import cloneDeep from 'lodash/cloneDeep';

export default class MetaNode {

    __children;
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

    set _children(_children){
        this._children = _children;
    }

    get _children(){
        return this.__children;
    }

    set _initialKeys(__initialKeys){
        this.__initialKeys = __initialKeys;
    }

    get _initialKeys(){
        return this.__initialKeys;
    }

    visitChildren(func){
        if( typeof func !== 'function' ){
            throw new Error('first arguments must be function');
        }

        if( !Array.isArray(this.__children) ){
            return null;
        }

        for(let i = 0; i < this.__children.length; i++ ){
            if( func(this.__children[i]) === true ){
                return this.__children[i];
            }
        }

        return null;
    }

    visitRecursive(func, depth = 0){
        if( typeof func !== 'function' ){
            throw new Error('first arguments must be function');
        }

        if( depth === 0 ){
            if( func(this) === true ){
                return this;
            }
        }

        if( !Array.isArray(this.children) ){
            return null;
        }

        let recursiveResult;
        for(let i = 0; i < this.__children.length; i++ ){

            if( func(this.__children[i]) === true ){
                return this.__children[i];
            }

            recursiveResult = this.__children[i].visitRecursive(func, depth +1);

            if( recursiveResult ){
                return recursiveResult;
            }
        }

        return null;
    }

    updateLocationFromMe(){
        if( this.__children ){
            for( let i = 0; i < this.__children.length; i++ ){
                this.__children[i]._updateLoc(this.__location + '.' + i);
            }
        }
    }

    _updateLoc(__location){
        this.__location = __location;

        if( this.__children ){
            for( let i = 0; i < this.__children.length; i++ ){
                this.__children[i]._updateLoc(this.__location + '.' + i);
            }
        }
    }

    prependChild(nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.__children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof MetaNode ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new MetaNode(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            this.__children.unshift(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChild(nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.__children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof MetaNode ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new MetaNode(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            this.__children.push(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChildAfter(childIdx, nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.__children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof MetaNode ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new MetaNode(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            if( childIdx >= 0  ){
                this.__children = [
                    ...this.__children.slice(0,childIdx+1),
                    newChild,
                    ...this.__children.slice(childIdx+1),
                ];
            } else {
                this.__children.push(newChild);
            }


            this.updateLocationFromMe();
        } else {
            throw new Error("error : Second argument must be Node or JSON.");
        }
    }

    appendChildBefore(childIdx, nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.__children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof MetaNode ){
                nodeInstanceOrJSON._updateLoc(this.__location + '.' + nextChildIndex);
                nodeInstanceOrJSON._parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new MetaNode(nodeInstanceOrJSON, this.__location + '.' + nextChildIndex, this);
            }

            if( childIdx >= 0  ) {
                this.__children = [
                    ...this.__children.slice(0, childIdx),
                    newChild,
                    ...this.__children.slice(childIdx),
                ];
            } else {
                this.__children.unshift(newChild);
            }

            this.updateLocationFromMe();
        } else {
            throw new Error("error : Second argument must be Node or JSON.");
        }
    }

    removeChild(location){
        let prevLength= this.__children.length;
        this.__children = this.__children.filter((childNode)=> childNode.__location !== location);
        this.updateLocationFromMe();

        return prevLength !== this.__children.length;
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
            if (!node.__children) return null;

            node = node.__children[parseInt(__locationTokens[i])];

            if (!node) return null;
        }

        return node;
    }

    setData(key, data){
        if( this.__initialKeys.findIndex(key) == -1 ){
            this.__initialKeys.push(key);
        }

        this[key] = data;
    }

    static importFromJSON(JSONReference, __location = '0', _parent = null) {

        let node = new MetaNode(cloneDeep(JSONReference), __location, _parent);

        if (node.children) {
            node.__children = node.children.map((json, i) => MetaNode.importFromJSON(json, [__location, i].join('.'), node));
        }

        return node;
    }


    exportToJSON() {
        let json = {};
        let keys = this.__initialKeys;
        for( let i = 0; i < keys.length; i++ ){
            if( keys[i] === 'children' ){
                continue;
            }
            json[keys[i]] = cloneDeep(this[keys[i]]);
        }

        if (this.__children) {
            json.children = this.__children.map((childNode) => childNode.exportToJSON());
        }

        return json;
    }
}