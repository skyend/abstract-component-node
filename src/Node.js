import cloneDeep from 'lodash/cloneDeep';

export default class DirectiveNode {

    // basic
    tag;
    children;


    // data
    classes = {}; // same to class
    style = {};
    attrs = {};
    props = {};
    domProps = {};
    on;
    nativeOn;
    directives;
    scopedSlots;
    slot;

    key;
    ref;

    nodeValue;

    // Helper
    parent;

    // nuxt
    asyncData;
    fetch;
    head;
    layout;
    middleware;
    scrollToTop;
    transition;
    validate;


    //
    pos;
    type;



    constructor({
        tag,
        children,

        classes,
        style,
        attrs,
        props,
        domProps,
        on,
        nativeOn,
        directives,
        scopedSlots,
        slot,

        // nuxt
        asyncData,
        fetch,
        head,
        layout,
        middleware,
        scrollToTop,
        transition,
        validate,

        key,
        ref,
        nodeValue,
    }, pos, parent) {
        this.tag = tag;

        this.classes = classes;
        this.style = style;
        this.attrs = attrs;
        this.props = props;
        this.domProps = domProps;
        this.on = on;
        this.nativeOn = nativeOn;
        this.directives = directives;
        this.scopedSlots = scopedSlots;
        this.slot = slot;
        this.nodeValue = nodeValue;

        // nuxt
        this.asyncData = asyncData;
        this.fetch = fetch;
        this.head = head;
        this.layout = layout;
        this.middleware = middleware;
        this.scrollToTop = scrollToTop;
        this.transition = transition;
        this.validate = validate;


        this.key = key;
        this.ref = ref;

        this.children = children;

        this.parent = parent;
        this.pos = pos;


        switch (tag) {
            case "core-system-grid":
                this.type = 'grid';
                break;
            case "core-system-row":
                this.type = 'row';
                break;
            case "core-system-column":
                this.type = 'column';
                break;
            case "core-system-layer":
                this.type = 'layer';
                break;
        }
    }

    get location(){
        return this.pos;
    }

    strideUpBloodLine(func){
        let node = this;
        while(node){
            func(node);
            node = node.parent;
        }
    }

    updateLocationFromMe(){
        if( this.children ){
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i]._updateLoc(this.pos + '.' + i);
            }
        }
    }

    _updateLoc(pos){
        this.pos = pos;

        if( this.children ){
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i]._updateLoc(this.pos + '.' + i);
            }
        }
    }

    prependChild(nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof DirectiveNode ){
                nodeInstanceOrJSON._updateLoc(this.pos + '.' + nextChildIndex);
                nodeInstanceOrJSON.parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new DirectiveNode(nodeInstanceOrJSON, this.pos + '.' + nextChildIndex, this);
            }

            this.children.unshift(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChild(nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof DirectiveNode ){
                nodeInstanceOrJSON._updateLoc(this.pos + '.' + nextChildIndex);
                nodeInstanceOrJSON.parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new DirectiveNode(nodeInstanceOrJSON, this.pos + '.' + nextChildIndex, this);
            }

            this.children.push(newChild);
        } else {
            throw new Error("error : First argument must be Node or JSON.");
        }
    }

    appendChildAfter(childIdx, nodeInstanceOrJSON){
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof DirectiveNode ){
                nodeInstanceOrJSON._updateLoc(this.pos + '.' + nextChildIndex);
                nodeInstanceOrJSON.parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new DirectiveNode(nodeInstanceOrJSON, this.pos + '.' + nextChildIndex, this);
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
        if( typeof nodeInstanceOrJSON === 'object' ){
            let nextChildIndex = this.children.length;
            let newChild;
            if( nodeInstanceOrJSON instanceof DirectiveNode ){
                nodeInstanceOrJSON._updateLoc(this.pos + '.' + nextChildIndex);
                nodeInstanceOrJSON.parent = this;

                newChild = nodeInstanceOrJSON;
            } else {
                newChild = new DirectiveNode(nodeInstanceOrJSON, this.pos + '.' + nextChildIndex, this);
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
        this.children = this.children.filter((childNode)=> childNode.pos !== location);
        this.updateLocationFromMe();

        return prevLength !== this.children.length;
    }

    getLinealDescentList() {
        let des = [];

        let node = this;

        while (node) {
            des.unshift(node);
            node = node.parent;
        }

        return des;
    }

    visitChildren(func){
        if( typeof func !== 'function' ){
            throw new Error('first arguments must be function');
        }

        if( !Array.isArray(this.children) ){
            return null;
        }

        for(let i = 0; i < this.children.length; i++ ){
            if( func(this.children[i]) ){
                return this.children[i];
            }
        }

        return null;
    }

    visitRecursive(func){
        if( typeof func !== 'function' ){
            throw new Error('first arguments must be function');
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


    findByLocation(_loc) {
        if( _loc.indexOf(this.pos) !== 0 ){
            throw new Error(`Invalid location. loc:${_loc}, current node location:${this.pos}.`);
        }

        var myPosTokens = this.pos.split('.');
        var posTokens = _loc.split('.');
        posTokens = posTokens.splice(myPosTokens.length - 1);

        if (posTokens.length === 1) return this;

        let node = this;

        for (let i = 1; i < posTokens.length; i++) {
            if (!node.children) return null;

            node = node.children[parseInt(posTokens[i])];

            if (!node) return null;
        }

        return node;
    }

    static importFromJSON({
        tag,
        children = [],

        classes,
        style,
        attrs,
        props,
        domProps,
        on,
        nativeOn,
        directives,
        scopedSlots,
        slot,
        nodeValue,


        // nuxt
          asyncData,
          fetch,
          head,
          layout,
          middleware,
          scrollToTop,
          transition,
          validate,

        key,
        ref,
    }, pos = '0', parent = null) {

        let node = new DirectiveNode({
            tag: tag,

            classes: cloneDeep(classes),
            style: cloneDeep(style),
            attrs: cloneDeep(attrs),
            props: cloneDeep(props),
            domProps: cloneDeep(domProps),
            on: cloneDeep(on),
            nativeOn: cloneDeep(nativeOn),
            directives: cloneDeep(directives),
            scopedSlots: cloneDeep(scopedSlots),
            slot: cloneDeep(slot),
            nodeValue : nodeValue,

            asyncData : cloneDeep(asyncData),
            fetch : cloneDeep(fetch),
            head : cloneDeep(head),
            layout : cloneDeep(layout),
            middleware : cloneDeep(middleware),
            scrollToTop : cloneDeep(scrollToTop),
            transition : cloneDeep(transition),
            validate : cloneDeep(validate),

            key: cloneDeep(key),
            ref: cloneDeep(ref),
        }, pos, parent);

        if (children) {
            node.children = children.map((json, i) => DirectiveNode.importFromJSON(json, [pos, i].join('.'), node));
        }

        return node;
    }

    static importFromHTMLElementNode(dom, pos = '0', parent = null){
        let style = {};
        let attrs = {};
        let classes = {};
        let domProps = {};

        if( dom.attributes ){
            let domAttributes = dom.attributes;
            let attr;
            for( let i = 0; i < domAttributes.length; i++ ){
                attr = domAttributes[i];

                attrs[attr.nodeName] = attr.nodeValue;
            }
        }

        if( dom.classList ){
            let classList = dom.classList;
            let cls;
            for( let i = 0; i < classList.length; i++ ){
                cls = classList[i];

                classes[cls] = true;
            }

            // exclude from attrs
            delete attrs.class;
        }

        if( dom.hasAttribute && dom.hasAttribute('style') ){
            let styles = dom.getAttribute('style').split(';');

            let styleString;
            for(let i = 0; i < styles.length; i++ ){
                styleString = styles[i].trim();
                let styleTokens = styleString.split(':');
                let styleName = styleTokens[0].trim();
                let styleValue = styleTokens[1] && styleTokens[1].trim();
                styleName = styleName.replace(/-([a-z])/g, (_,n)=> n.toUpperCase());

                style[styleName] = styleValue || '';
            }

            // exclude from attrs
            delete attrs.style;
        }


        let node = new DirectiveNode({
            tag: dom.nodeName.toLowerCase(),

            classes: classes,
            style: style,
            attrs: attrs,
            props: {},
            domProps: domProps,
            on: undefined,
            nativeOn: undefined,
            directives: undefined,
            scopedSlots: undefined,
            slot: undefined,
            nodeValue : dom.nodeValue,

            key: undefined,
            ref: undefined,
        }, pos, parent);

        if (dom.childNodes) {
            node.children = Array.prototype.map.call(dom.childNodes,
                (json, i) => DirectiveNode.importFromHTMLElementNode(json, [pos, i].join('.'), node)
            );
        }

        return node;
    }

    exportToJSON() {
        let json = {
            tag: this.tag,

            classes: cloneDeep(this.classes),
            style: cloneDeep(this.style),
            attrs: cloneDeep(this.attrs),
            props: cloneDeep(this.props),
            domProps: cloneDeep(this.domProps),
            on: cloneDeep(this.on),
            nativeOn: cloneDeep(this.nativeOn),
            directives: cloneDeep(this.directives),
            scopedSlots: cloneDeep(this.scopedSlots),
            slot: cloneDeep(this.slot),
            nodeValue : this.nodeValue,

            // nuxt
            asyncData : cloneDeep(this.asyncData),
            fetch : cloneDeep(this.fetch),
            head : cloneDeep(this.head),
            layout : cloneDeep(this.layout),
            middleware : cloneDeep(this.middleware),
            scrollToTop : cloneDeep(this.scrollToTop),
            transition : cloneDeep(this.transition),
            validate : cloneDeep(this.validate),

            key: cloneDeep(this.key),
            ref: cloneDeep(this.ref),
        };

        if (this.children) {
            json.children = this.children.map((childNode) => childNode.exportToJSON());
        }

        return json;
    }
}
