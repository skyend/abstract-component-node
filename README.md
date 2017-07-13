# virtual-component-node

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url] 



```bash
npm install abstract-component-node
```

# Provides Classes

## ComponentNode <default>

ComponentNode follows Vue's element creation field structure

## MetaNode

The MetaNode does not follow any structure.

The structure of the data structure and its fields is your freedom

However, you should be aware that the children field is created as a child of Node.

And of the JSON fields

```
__children
__initialKeys
__location
__parent

_children
_initialKeys
_location
_parent
```

These eight are reserved, so avoid using them as JSON fields.

## Directive 

I think this may be useless to you.


# Examples

```javascript
// ComponentNode
import ComponentNode from 'abstract-component-node';

let node = ComponentNode.importFromJSON(JSON, NodeLocationString = '0', ParentNode = null)
```

```javascript
// MetaNode
import {MetaNode} from 'abstract-component-node';

let node = MetaNode.importFromJSON(JSON, NodeLocationString = '0', ParentNode = null)
```

# API 

## ComponentNode
 
### static importFromJSON(JSONObject, NodeLocationString = '0', ParentNode = null) : Node
 
 Deep copy 
 
### static importFromHTMLElementNode(HTMLElement, NodeLocationString = '0', ParentNode = null) : Node
 
### static exportToJSON() : JSONObject

 Deep copied

### getLinealDescentList() : Array

### findByLocation(Location) : Node

### visit(function) : Node 

Stop visiting and return that node if returned true.

### visitRecursive(function) : Node

Stop visiting and return that node if returned true.

include self to visit target.

### appendChild(Node || JSON)

### prependChild(Node || JSON)

### updateLocationFromMe()

### appendChildBefore(Int childIndex, Node || JSON)
 
### appendChildAfter(Int childIndex, Node || JSON) 

### removeChild(String location) : bool

### get location : location string

### get parent : parentNode

### get children : Node Array

 

> Info : importFromJSON (deep copy)
> Info : exportToJSON (deep copy)

## MetaNode
 
### static importFromJSON(JSONObject, NodeLocationString = '0', ParentNode = null) : Node
 
 Deep Copy 
 
### static exportToJSON() : JSONObject

Deep copied

### getLinealDescentList() : Array

### findByLocation(Location) : Node

### visit(function(Node)) : Node 

Stop visiting and return that node if returned true.

### visitRecursive(function(Node)) : Node

Stop visiting and return that node if returned true.

include self to visit target.

### appendChild(Node || JSON)

### prependChild(Node || JSON)

### updateLocationFromMe()

### setData(key, data)

### appendChildBefore(Int childIndex, Node || JSON)
 
### appendChildAfter(Int childIndex, Node || JSON) 

### removeChild(String location) : bool

### get _location : location string

### get _parent : location string

### get _children : Node Array

  

## ComponentNode JSON Properties 

    tag : String
    children : [JSONObject...]

    classes : { className... : true }
    style : { styleName : ... }
    attrs,
    props,
    domProps,
    on,
    nativeOn,
    directives,
    scopedSlots,
    slot,
    nodeValue,

    key,
    ref,
    
    

## ComponentNode JSON Sample

```json

{
  "tag" : "_system-grid_",
  "classes" : {
    "test":true
  },
  "props" : {

  },
  "children" : [
    {
      "tag" : "_system-row_",
      "props" : {

      },
      "children" : [
        {
          "tag" : "_system-column_",
          "props": {
            "xs" : 6,
            "sm" : 4
          },
          "classes" : {

          },
          "children" : [

          ]
        },

        {
          "tag" : "_system-column_",
          "props": {
            "xs" : 6,
            "sm" : 8
          },
          "children" : [

          ]
        },

        {
          "tag" : "_system-layer_",
          "props" : {

          },
          "children" : [

          ]
        }
      ]
    },
    {
      "tag" : "_system-row_",
      "props" : {

      },
      "children" : [
        {
          "tag" : "_system-column_",
          "props": {
            "xs" : 12,
            "sm" : 6
          },
          "classes" : {

          },
          "children" : [

          ]
        },

        {
          "tag" : "_system-column_",
          "props": {
            "xs" : 12,
            "sm" : 6
          },
          "children" : [

          ]
        }
      ]
    },

    {
      "tag" : "_system-row_",
      "props" : {

      },
      "children" : [

      ]
    },

    {
      "tag" : "div",
      "props" : {

      },
      "children" : [

      ]
    }
  ]
}

```

# Author

Jinwoong Han ( theskyend0@gmail.com )


# License
[MIT](LICENSE)



[npm-image]: https://img.shields.io/npm/v/abstract-component-node.svg
[npm-url]: https://npmjs.org/package/abstract-component-node
[downloads-image]: https://img.shields.io/npm/dm/abstract-component-node.svg
[downloads-url]: https://npmjs.org/package/abstract-component-node

