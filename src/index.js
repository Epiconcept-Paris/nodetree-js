
var Node = require( './node' )

module.exports = {

    /**
     * Return a new Node object
     *
     * @method  createNode
     * @param   {string}   sId
     * @param   {object}   oAttributes
     * @param   {array}   aChildNodes
     * @return  {Node}
     */
    createNode: function( sId, oAttributes, aChildNodes )
    {
        return new Node( sId, oAttributes, aChildNodes )
    },

    /**
     * Return the Node object described by the string (and it's childs)
     *
     * @method  loadFromString
     * @param   {string}       sJson
     * @return  {Node}
     */
    loadFromString: function( sJson )
    {
        var oJson = JSON.parse( sJson )
        return this.loadFromJson( oJson )
    },

    /**
     * Return the Node object described by the json (and it's childs)
     *
     * @method  loadFromJson
     * @param   {object}     oJson
     * @return  {Node}
     */
    loadFromJson: function( oJson )
    {
        var oNode = new Node( oJson.id, oJson.attrs )

        if ( oJson.child != undefined && Array.isArray( oJson.child ) ) {
            for ( var i = 0; i < oJson.child.length; i++ ) {
                oNode.append( this.loadFromJson( oJson.child[ i ] ) )
            }
        }

        return oNode
    },

    clone: function( oNode )
    {
        var oNewNode = new Node()

        if ( oNode != undefined ) {
            var oAttributes = oNode.getAttributes()
            for ( var sAttributeName in oAttributes ) {
                if ( oAttributes.hasOwnProperty( sAttributeName ) ) {
                    oNewNode.setAttribute( sAttributeName, oAttributes[ sAttributeName ] )
                }
            }

            var aChildren = oNode.getChildren()
            for (var i = 0; i < aChildren.length; i++) {
                oNewNode.append(
                    this.clone( aChildren[i] )
                )
            }
        }
        return oNewNode
    },

}
