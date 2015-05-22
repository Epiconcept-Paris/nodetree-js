# nodetree-js
Library for node tree building, navigation and serialization

```javascript
var Tree = require( './libs/nodetree-js' )

var oNodeBase = Tree.createNode( 'id_myNode_base', { some_attribute: 'base' } )

var oNodeChild_1 = Tree.createNode( 'id_myNode_child_1' )
var oNodeChild_2 = Tree.createNode( 'id_myNode_child_2' )
var oNodeChild_3 = Tree.createNode( 'id_myNode_child_3' )
var oNodeChild_4 = Tree.createNode( 'id_myNode_child_4' )

oNodeBase.append( oNodeChild_1 )
oNodeBase.prepend( oNodeChild_2 )
oNodeBase.insertAtPosition( oNodeChild_3, 1)

oNodeChild_1.append( oNodeChild_4 )

// serialize
var sSerialized = oNodeBase.toString()
// get hashcode of the node tree
var sHashCode = oNodeBase.hashcode()
// create a new node tree from a serialized one
var oNewNodeTree = Tree.loadFromString( sSerialized )

// get a node inside the tree with the id
oNodeChild_4 = oNewNodeTree.getElementById( 'id_myNode_child_4' )
```
