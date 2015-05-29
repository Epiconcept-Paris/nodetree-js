# nodetree-js
------
Library for node tree building, navigation and serialization

### Installation
To start using Nodetree-JS in your website, simply download it and include it in your page:
```html
<script src="nodetree-js.js"></script>
```
Or install it as a Node.js module:
```
$ npm install --save git+https://github.com/Epiconcept-Paris/nodetree-js.git
```
### Using Nodetree-JS
In the browser, getting started is as simple as:
```javascript
var oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } )
```
In Node.js, you'll need to require() it first:
```javascript
var Nodetree = require( 'nodetree-js' )
var oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } )
```

### Usage
```javascript
var oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } )

var oNodeChild_1 = Nodetree.createNode( 'id_myNode_child_1' )
var oNodeChild_2 = Nodetree.createNode( 'id_myNode_child_2' )
var oNodeChild_3 = Nodetree.createNode( 'id_myNode_child_3' )
var oNodeChild_4 = Nodetree.createNode( 'id_myNode_child_4' )

oNodeBase.append( oNodeChild_1 )
oNodeBase.prepend( oNodeChild_2 )
oNodeBase.insertAtPosition( oNodeChild_3, 1)

oNodeChild_1.append( oNodeChild_4 )

// serialize
var sSerialized = oNodeBase.toString()
// get hashcode of the node tree
var sHashCode = oNodeBase.hashcode()
// create a new node tree from a serialized one
var oNewNodeTree = Nodetree.loadFromString( sSerialized )

// get a node inside the tree with the id
oNodeChild_4 = oNewNodeTree.getElementById( 'id_myNode_child_4' )
```
