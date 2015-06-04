# Global





* * *

### Node(sId, oAttributes, aChildNodes) 

**Parameters**

**sId**: `string`

**oAttributes**: `object`

**aChildNodes**: `array`



### parentNode(oParentNode) 

Assign a new parent node if given
Return the parent node

**Parameters**

**oParentNode**: `Node`, (optional)

**Returns**: `Node`


### append(oNode) 

Alias for appendChild
Add a node as a child of this node

**Parameters**

**oNode**: `Node`, Alias for appendChild
Add a node as a child of this node



### appendChild(oNode) 

Add a node as a child of this node

**Parameters**

**oNode**: `Node`, Add a node as a child of this node

**Returns**: `boolean`


### remove(oNode) 

Alias for removeChild
Remove a Node child from this Node

**Parameters**

**oNode**: `Node`, Alias for removeChild
Remove a Node child from this Node

**Returns**: `boolean`


### removeChild(oNode) 

Remove a Node child from this Node

**Parameters**

**oNode**: `Node`, Remove a Node child from this Node

**Returns**: `boolean`


### removeFromParent(oNode) 

Remove the Node from its Node parent

**Parameters**

**oNode**: `Node`, Remove the Node from its Node parent

**Returns**: `boolean`


### prepend(oNode) 

Alias for prependChild
Insert a node as the first child of this node

**Parameters**

**oNode**: `Node`, Alias for prependChild
Insert a node as the first child of this node

**Returns**: `boolean`


### prependChild(oNode) 

Insert a node as the first child of this node

**Parameters**

**oNode**: `Node`, Insert a node as the first child of this node

**Returns**: `boolean`


### insertAtPosition(oNode, iPosition) 

Insert a node at a position in this node
If no position is given, push to the end of the list

**Parameters**

**oNode**: `Node`, Insert a node at a position in this node
If no position is given, push to the end of the list

**iPosition**: `integer`, (optional)

**Returns**: `boolean`


### getElementById(sId) 

Return the node with this id inside the scope of this node (him and child, no parents)

**Parameters**

**sId**: `string`, Return the node with this id inside the scope of this node (him and child, no parents)

**Returns**: `Node`


### insertBefore(oNewNode, oReferenceNode) 

Insert a node just before the ref node among childs of this node

**Parameters**

**oNewNode**: `Node`, Insert a node just before the ref node among childs of this node

**oReferenceNode**: `Node`, Insert a node just before the ref node among childs of this node

**Returns**: `boolean`


### insertAfter(oNewNode, oReferenceNode) 

Insert a node just after the ref node among childs of this node

**Parameters**

**oNewNode**: `Node`, Insert a node just after the ref node among childs of this node

**oReferenceNode**: `Node`, Insert a node just after the ref node among childs of this node

**Returns**: `boolean`


### setAttribute(sAttributeName, oValue) 

**Parameters**

**sAttributeName**: `string`

**oValue**: `object`

**Returns**: `boolean`


### getAttribute(sAttributeName) 

**Parameters**

**sAttributeName**: `string`

**Returns**: `object`


### serialize() 

Alias for toJson
Return the node and childs as a JSON (serialized)

**Returns**: `object`


### toJson() 

Return the node and childs as a JSON (serialized)

**Returns**: `object`


### toString() 

Return the node and childs as a String (serialized)

**Returns**: `string`


### hashcode() 

Return a hashcode of the node and childs

**Returns**: `Number`



* * *










