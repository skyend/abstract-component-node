import DirectiveNode from './Node';

export default class Directive {
  directiveName;

  rootNode;
  constructor(directiveName, json){
    this.directiveName = directiveName;
    this.rootNode = DirectiveNode.importFromJSON(json);
  }

}
