
var Utils = require( './utils' )

/**
 * @class  Node
 * @param   {string}    sId
 * @param   {object}    oAttributes
 * @param   {array}     aChildNodes
 */
var Node = function( sId, oAttributes, aChildNodes )
{
    /**
     * @member  {string}    sId             - The id of the node
     */
    this.sId         = ( sId != undefined ) ? sId : Utils.uniqId()

    /**
     * @member  {object}    oAttributes     - Attributes of the node (useful to store informations like the name of the node or anything else not related to the tree structure)
     */
    this.oAttributes = ( oAttributes != undefined ) ? oAttributes : {}

    /**
     * @member  {array}     aChildNodes     - List of all children of this node
     */
    this.aChildNodes = []

    /**
     * @member  {Node}      oParentNode     - Parent of this node
     */
    this.oParentNode = undefined

    if ( aChildNodes != undefined && Array.isArray( aChildNodes ) ) {
        for (var i = 0; i < aChildNodes.length; i++) {
            this.append( aChildNodes[i] )
        }
    }
}

/**
 * Return the identifier of the Node
 *
 * @method  getId
 * @return  {string}
 */
Node.prototype.getId = function ()
{
    return this.sId
}

/**
 * Assign a new parent node if given
 * Return the parent node
 *
 * @method  parentNode
 * @param   {Node}   oParentNode    - (optional)
 * @return  {Node}
 */
Node.prototype.parentNode = function ( oParentNode )
{
    if ( oParentNode != undefined ) {
        // assign new parent node
        this.oParentNode = oParentNode
    }
    return this.oParentNode
}

/**
 * @method  append  - see appendChild
 */
Node.prototype.append =
/**
 * Add a node as a child of this node
 *
 * @method  appendChild
 * @param   {Node}    oNode
 * @return  {boolean}
 */
Node.prototype.appendChild = function ( oNode )
{
    return this.insertAtPosition( oNode, this.aChildNodes.length )
}

/**
 * @method  remove  - see removeChild
 */
Node.prototype.remove =
/**
 * Remove a Node child from this Node
 *
 * @method  removeChild
 * @param   {Node}  oNode
 * @return  {boolean}
 */
Node.prototype.removeChild = function ( oNode )
{
    var iPosition = this.aChildNodes.indexOf( oNode )
    if ( iPosition > -1 ) {
        oNode.oParentNode = undefined
        this.aChildNodes.splice( iPosition, 1 )
        return true
    }
    return false
}

/**
 * Remove the Node from its Node parent
 *
 * @method  removeFromParent
 * @param   {Node}  oNode
 * @return  {boolean}
 */
Node.prototype.removeFromParent = function ()
{
    if ( this.parentNode() != undefined ) {
        return this.parentNode().removeChild( this )
    }
    return false
}

/**
 * @method  prepend - see prependChild
 */
Node.prototype.prepend =
/**
* Insert a node as the first child of this node
*
* @method   prependChild
* @param    {Node}    oNode
* @return  {boolean}
*/
Node.prototype.prependChild = function ( oNode )
{
    return this.insertAtPosition( oNode, 0 )
}

/**
 * Insert a node at a position in this node
 * If no position is given, push to the end of the list
 *
 * @method  insertAtPosition
 * @param   {Node}      oNode
 * @param   {integer}   iPosition   - (optional)
 * @return  {boolean}
 */
Node.prototype.insertAtPosition = function ( oNode, iPosition )
{
    if ( ( oNode instanceof Node ) == false ) {
        Utils.error_log( new Error( 'Can\'t append this object. Wrong type, we are supposed to only have Node.' ) )
        return false
    }

    if ( iPosition == undefined || iPosition < 0 || iPosition > this.aChildNodes.length ) {
        iPosition = this.aChildNodes.length
    }

    this.aChildNodes.splice( iPosition, 0, oNode )
    // assign the parent node
    oNode.parentNode( this )

    return true
}

/**
 * Return the node with this id inside the scope of this node (him and child, no parents)
 *
 * @method  getElementById
 * @param   {string}       sId
 * @return  {Node}
 */
Node.prototype.getElementById = function ( sId )
{
    if ( this.sId == sId ) {
        return this
    }

    for ( var i = 0; i < this.aChildNodes.length; i++ ) {
        var oChildNode = this.aChildNodes[ i ]
        var oSearchedNode = oChildNode.getElementById( sId )
        if ( oSearchedNode != undefined ) {
            return oSearchedNode
        }
    }

    // there is no element with this id (at least when searching from this node)
    return undefined
}

/**
 * Insert a node just before the ref node among childs of this node
 *
 * @method  insertBefore
 * @param   {Node}     oNewNode
 * @param   {Node}     oReferenceNode
 * @return  {boolean}
 */
Node.prototype.insertBefore = function ( oNewNode, oReferenceNode )
{
    return this.insertAtPosition( oNewNode, this.aChildNodes.indexOf( oReferenceNode ) )
}

/**
 * Insert a node just after the ref node among childs of this node
 *
 * @method  insertAfter
 * @param   {Node}     oNewNode
 * @param   {Node}     oReferenceNode
 * @return  {boolean}
 */
Node.prototype.insertAfter = function ( oNewNode, oReferenceNode )
{
    return this.insertAtPosition( oNewNode, this.aChildNodes.indexOf( oReferenceNode ) + 1 )
}

/**
 * @method  setAttribute
 * @param   {string}     sAttributeName
 * @param   {object}     oValue
 * @return  {boolean}
 */
Node.prototype.setAttribute = function ( sAttributeName, oValue )
{
    this.oAttributes[ sAttributeName ] = oValue
    return true
}

/**
 * @method  getAttribute
 * @param   {string}     sAttributeName
 * @return  {object}
 */
Node.prototype.getAttribute = function ( sAttributeName )
{
    return this.oAttributes[ sAttributeName ]
}

/**
 * @method  getAttributes
 * @return  {object}
 */
Node.prototype.getAttributes = function ()
{
    return this.oAttributes
}

/**
 * Return children of this node
 *
 * @method  getChildren
 * @return  {array}     - array of Node
 */
Node.prototype.getChildren = function ()
{
    return this.aChildNodes
}

/**
 * @method  serialize   - see toJson
 */
Node.prototype.serialize =
/**
 * Return the node and childs as a JSON (serialized)
 *
 * @method  toJson
 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
 * @return  {object}
 */
Node.prototype.toJson = function ( bImmediateScope )
{
    var oJson = {
        id: this.sId,
        attrs: this.oAttributes,
        child: []
    }

    for ( var i = 0; i < this.aChildNodes.length; i++ ) {
        var oChildNode = this.aChildNodes[ i ]
        if ( bImmediateScope == true ) {
            oJson.child.push( oChildNode.getId() )
        } else {
            oJson.child.push( oChildNode.toJson() )
        }
    }

    return oJson
}

/**
 * Return the node and childs as a String (serialized)
 *
 * @method  toString
 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
 * @return  {string}
 */
Node.prototype.toString = function ( bImmediateScope )
{
    return JSON.stringify( this.toJson( bImmediateScope ) )
}

/**
 * Return a hashcode of the node and childs
 *
 * @method  hashcode
 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the hashcode to the node only (not all its children)
 * @return  {Number}
 */
Node.prototype.hashcode = function ( bImmediateScope )
{
    var sNodeString = this.toString( bImmediateScope )
    var iHash = 0
    var iStringLength = sNodeString.length

    if ( iStringLength == 0 ) return iHash

    for ( var i = 0; i < iStringLength; i++ ) {
        var sCharacter = sNodeString.charCodeAt( i )
        iHash = ( (iHash << 5) - iHash ) + sCharacter
        iHash = iHash & iHash // Convert to 32bit integer
    }

    return iHash
}

module.exports = Node
