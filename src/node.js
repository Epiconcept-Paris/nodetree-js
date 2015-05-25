
/**
 * @method  Node
 * @param   {string}    sId
 * @param   {object}    oAttributes
 * @param   {array}     aChildNodes
 */
var Node = function( sId, oAttributes, aChildNodes )
{
    this.sId         = ( sId != undefined ) ? sId : "uniqId"
    this.oAttributes = ( oAttributes != undefined ) ? oAttributes : {}
    this.aChildNodes = ( aChildNodes != undefined ) ? aChildNodes : []
    this.oParentNode = undefined
}

/**
 * Assign a new parent node if given
 * Return the parent node
 *
 * @method  parentNode
 * @param   {Node}   oParentNode
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
 * Alias for appendChild
 * Add a node as a child of this node
 *
 * @method  append
 * @param   {Node}    oNode
 */
Node.prototype.append =
/**
 * Add a node as a child of this node
 *
 * @method  appendChild
 * @param   {Node}    oNode
 */
Node.prototype.appendChild = function ( oNode )
{

    this.insertAtPosition( oNode, this.aChildNodes.length )

}

/**
 * Alias for prependChild
 * Insert a node as the first child of this node
 *
 * @method  prepend
 * @param   {Node}    oNode
 */
Node.prototype.prepend =
/**
* Insert a node as the first child of this node
*
* @method   prependChild
* @param    {Node}    oNode
*/
Node.prototype.prependChild = function ( oNode )
{
    this.insertAtPosition( oNode, 0 )
}

/**
 * Insert a node at a position in this node
 * @method  insertAtPosition
 * @param   {Node}      oNode
 * @param   {integer}   iPosition
 */
Node.prototype.insertAtPosition = function ( oNode, iPosition )
{

    if ( iPosition == undefined || iPosition < 0 || iPosition > this.aChildNodes.length ) {
        iPosition = 0
    }

    this.aChildNodes.splice( iPosition, 0, oNode )
    // assign the parent node
    oNode.parentNode( this )

}

/**
 * Return the node with this id inside the scope of this node (him and child, no parents)
 *
 * @method  getElementById
 * @param   {string}       sId
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
 */
Node.prototype.insertBefore = function ( oNewNode, oReferenceNode )
{
    this.insertAtPosition( oNewNode, this.aChildNodes.indexOf( oReferenceNode ) )
}

/**
 * Insert a node just after the ref node among childs of this node
 *
 * @method  insertAfter
 * @param   {Node}     oNewNode
 * @param   {Node}     oReferenceNode
 */
Node.prototype.insertAfter = function ( oNewNode, oReferenceNode )
{
    this.insertAtPosition( oNewNode, this.aChildNodes.indexOf( oReferenceNode ) + 1 )
}

/**
 * @method  setAttribute
 * @param   {string}     sAttributeName
 * @param   {object}     oValue
 */
Node.prototype.setAttribute = function ( sAttributeName, oValue )
{
    this.oAttributes[ sAttributeName ] = oValue
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
 * Alias for toJson
 * Return the node and childs as a JSON (serialized)
 *
 * @method  serialize
 */
Node.prototype.serialize =
/**
 * Return the node and childs as a JSON (serialized)
 *
 * @method  toJson
 */
Node.prototype.toJson = function ()
{
    var oJson = {
        id: this.sId,
        attrs: this.oAttributes,
        child: []
    }

    for ( var i = 0; i < this.aChildNodes.length; i++ ) {
        var oChildNode = this.aChildNodes[ i ]
        oJson.child.push( oChildNode.toJson() )
    }

    return oJson
}

/**
 * Return the node and childs as a String (serialized)
 *
 * @method  toString
 */
Node.prototype.toString = function ()
{
    return JSON.stringify( this.toJson() )
}

/**
 * Return a hashcode of the node and childs
 *
 * @method  hashcode
 * @return  {Number}
 */
Node.prototype.hashcode = function ()
{
    var sNodeString = this.toString()
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
