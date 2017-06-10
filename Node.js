import cloneDeep from 'lodash/cloneDeep';

export default class DirectiveNode {

  // basic
  tag;
  children;


  // data
  class;
  style;
  attrs;
  props;
  domProps;
  on;
  nativeOn;
  directives;
  scopedSlots;
  slot;

  key;
  ref;


  // Helper
  parent;

  //
  pos;
  type;
  constructor({
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

    key,
    ref,
  }, pos, parent){
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.style = style;

    this.parent = parent;
    this.pos = pos;


    switch( tag ){
      case "_system-grid_":
        this.type = 'grid';
        break;
      case "_system-row_":
        this.type = 'row';
        break;
      case "_system-column_":
        this.type = 'column';
        break;
      case "_system-layer_":
        this.type = 'layer';
        break;
    }
  }

  static importFromJSON({tag, props, children, style }, pos = '0', parent = null ){

    let node = new DirectiveNode({tag, props, style }, pos, parent);

    if( children ){
      node.children = children.map((json, i)=> DirectiveNode.importFromJSON(json, [pos,i].join('.'), node));
    }

    return node;
  }

  exportToJSON(){
    let json = {
      tag : this.tag,
      props : cloneDeep(this.props),
      style : cloneDeep(this.style),
    };

    if( this.children ){
      json.children = this.children.map((childNode)=>childNode.exportToJSON());
    }

    return json;
  }
}
