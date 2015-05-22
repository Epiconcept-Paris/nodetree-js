
var Node = require( './node' )

module.exports = {

    /**
     * Return a new Node object
     *
     * @method createNode
     * @param  {string}   sId
     * @param  {object}   oAttributes
     * @param  {array}   aChildNodes
     */
    createNode: function( sId, oAttributes, aChildNodes ) {
        return new Node( sId, oAttributes, aChildNodes )
    },

    /**
     * Return the Node object described by the string (and it's childs)
     *
     * @method loadFromString
     * @param  {string}       sJson
     */
    loadFromString: function( sJson ) {
        var oJson = JSON.parse( sJson )
        return this.loadFromJson( oJson )
    },

    /**
     * Return the Node object described by the json (and it's childs)
     *
     * @method loadFromJson
     * @param  {object}     oJson
     */
    loadFromJson: function( oJson ) {
        var oNode = new Node( oJson.id, oJson.attrs )

        for ( var i = 0; i < oJson.child.length; i++ ) {
            oNode.append( this.loadFromJson( oJson.child[ i ] ) )
        }

        return oNode
    }

}
