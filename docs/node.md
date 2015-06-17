# Global





* * *

## Class: Node


**sId**: `string` , The id of the node
**oAttributes**: `object` , Attributes of the node (useful to store informations like the name of the node or anything else not related to the tree structure)
**aChildNodes**: `array` , List of all children of this node
**oParentNode**: `Node` , Parent of this node
### Node.getId() 

Return the identifier of the Node

**Returns**: `string`

### Node.parentNode(oParentNode) 

Assign a new parent node if given
Return the parent node

**Parameters**

**oParentNode**: `Node`, (optional)

**Returns**: `Node`

### Node.append  - see appendChild() 


### Node.appendChild(oNode) 

Add a node as a child of this node

**Parameters**

**oNode**: `Node`, Add a node as a child of this node

**Returns**: `boolean`

### Node.remove  - see removeChild() 


### Node.removeChild(oNode) 

Remove a Node child from this Node

**Parameters**

**oNode**: `Node`, Remove a Node child from this Node

**Returns**: `boolean`

### Node.removeFromParent(oNode) 

Remove the Node from its Node parent

**Parameters**

**oNode**: `Node`, Remove the Node from its Node parent

**Returns**: `boolean`

### Node.prepend - see prependChild() 


### Node.prependChild(oNode) 

Insert a node as the first child of this node

**Parameters**

**oNode**: `Node`, Insert a node as the first child of this node

**Returns**: `boolean`

### Node.insertAtPosition(oNode, iPosition) 

Insert a node at a position in this node
If no position is given, push to the end of the list

**Parameters**

**oNode**: `Node`, Insert a node at a position in this node
If no position is given, push to the end of the list

**iPosition**: `integer`, (optional)

**Returns**: `boolean`

### Node.getElementById(sId) 

Return the node with this id inside the scope of this node (him and child, no parents)

**Parameters**

**sId**: `string`, Return the node with this id inside the scope of this node (him and child, no parents)

**Returns**: `Node`

### Node.insertBefore(oNewNode, oReferenceNode) 

Insert a node just before the ref node among childs of this node

**Parameters**

**oNewNode**: `Node`, Insert a node just before the ref node among childs of this node

**oReferenceNode**: `Node`, Insert a node just before the ref node among childs of this node

**Returns**: `boolean`

### Node.insertAfter(oNewNode, oReferenceNode) 

Insert a node just after the ref node among childs of this node

**Parameters**

**oNewNode**: `Node`, Insert a node just after the ref node among childs of this node

**oReferenceNode**: `Node`, Insert a node just after the ref node among childs of this node

**Returns**: `boolean`

### Node.setAttribute(sAttributeName, oValue) 

**Parameters**

**sAttributeName**: `string`

**oValue**: `object`

**Returns**: `boolean`

### Node.getAttribute(sAttributeName) 

**Parameters**

**sAttributeName**: `string`

**Returns**: `object`

### Node.getChildren() 

Return children of this node

**Returns**: `array`, - array of Node

### Node.serialize   - see toJson() 


### Node.toJson() 

Return the node and childs as a JSON (serialized)

**Returns**: `object`

### Node.toString() 

Return the node and childs as a String (serialized)

**Returns**: `string`

### Node.hashcode() 

Return a hashcode of the node and childs

**Returns**: `Number`



* * *










