
var Utils = require( './utils' )

/**
 * @method  Node
 * @param   {string}    sId
 * @param   {object}    oAttributes
 * @param   {array}     aChildNodes
 */
var Node = function( sId, oAttributes, aChildNodes )
{
    this.sId         = ( sId != undefined ) ? sId : Utils.uniqId()
    this.oAttributes = ( oAttributes != undefined ) ? oAttributes : {}
    this.aChildNodes = []
    this.oParentNode = undefined

    if ( aChildNodes != undefined && Array.isArray( aChildNodes ) ) {
        for (var i = 0; i < aChildNodes.length; i++) {
            this.append( aChildNodes[i] )
        }
    }
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
 * @return  {boolean}
 */
Node.prototype.appendChild = function ( oNode )
{
    return this.insertAtPosition( oNode, this.aChildNodes.length )
}

/**
 * Alias for removeChild
 * Remove a Node child from this Node
 *
 * @method  remove
 * @param   {Node}  oNode
 * @return  {boolean}
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
 * Alias for prependChild
 * Insert a node as the first child of this node
 *
 * @method  prepend
 * @param   {Node}    oNode
 * @return  {boolean}
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
 * @method  insertAtPosition
 * @param   {Node}      oNode
 * @param   {integer}   iPosition
 * @return  {boolean}
 */
Node.prototype.insertAtPosition = function ( oNode, iPosition )
{
    if ( ( oNode instanceof Node ) == false ) {
        Utils.error_log( new Error( 'Can\'t append this object. Wrong type, we are supposed to only have Node.' ) )
        return false
    }

    if ( iPosition == undefined || iPosition < 0 || iPosition > this.aChildNodes.length ) {
        iPosition = 0
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
 * Alias for toJson
 * Return the node and childs as a JSON (serialized)
 *
 * @method  serialize
 * @return  {object}
 */
Node.prototype.serialize =
/**
 * Return the node and childs as a JSON (serialized)
 *
 * @method  toJson
 * @return  {object}
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
 * @return  {string}
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
