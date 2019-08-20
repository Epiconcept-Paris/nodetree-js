# nodetree-js
------
Library for node tree building, navigation and serialization

### Installation
To start using Nodetree-JS in your website, simply install it as a Node.js module:
```
$ npm install --save nodetree-js
```

### Using Nodetree-JS
In the browser, getting started is as simple as:
```javascript
const oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } );
```
In Node.js, you'll need to require() it first:
```javascript
const Nodetree = require( 'nodetree-js' )
const oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } );
```

### Usage
```javascript
const oNodeBase = Nodetree.createNode( 'id_myNode_base', { some_attribute: 'base' } );

const oNodeChild_1 = Nodetree.createNode( 'id_myNode_child_1' );
const oNodeChild_2 = Nodetree.createNode( 'id_myNode_child_2' );
const oNodeChild_3 = Nodetree.createNode( 'id_myNode_child_3' );
const oNodeChild_4 = Nodetree.createNode( 'id_myNode_child_4' );

oNodeBase.append( oNodeChild_1 );
oNodeBase.prepend( oNodeChild_2 );
oNodeBase.insertAtPosition( oNodeChild_3, 1);

oNodeChild_1.append( oNodeChild_4 );

// serialize
const sSerialized = oNodeBase.toString();
// get hashcode of the node tree
const sHashCode = oNodeBase.hashcode();
// create a new node tree from a serialized one
const oNewNodeTree = Nodetree.loadFromString( sSerialized );

// get a node inside the tree with the id
oNodeChild_4 = oNewNodeTree.getElementById( 'id_myNode_child_4' );
```
