# virtual-component-node

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url] 



```bash
npm install abstract-component-node
```

# Examples

```javascript
import ComponentNode from 'abstract-component-node';

let node = ComponentNode.importFromJSON(JSON, IndexBaseLocation = '0', ParentNode = null)
```

# API 

## Node

```
static importFromJSON(JSON Object, NodeLocationString, ParentNode) : Node

static importFromHTMLElementNode(HTMLElement, pos = '0', parent = null) : Node

static exportToJSON() : JSONObject

public getLinealDescentList() : Array

public findByLocation(Location) : Node

public appendChild(Node || JSON)

public prependChild(Node || JSON)

public updateLocationFromMe()

get location : location string

public appendChildBefore(Int childIndex, Node || JSON)
 
public appendChildAfter(Int childIndex, Node || JSON) 

```

# JSON 

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
      "tag" : "_system-layer_",
      "props" : {

      },
      "children" : [

      ]
    }
  ]
}

```


## JSON Properties 

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

# Author

Jinwoong Han ( theskyend0@gmail.com )


# License
[MIT](LICENSE)



[npm-image]: https://img.shields.io/npm/v/abstract-component-node.svg
[npm-url]: https://npmjs.org/package/abstract-component-node
[downloads-image]: https://img.shields.io/npm/dm/abstract-component-node.svg
[downloads-url]: https://npmjs.org/package/abstract-component-node

