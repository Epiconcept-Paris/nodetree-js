
jest.dontMock( '../node' )

var Node = require('../node')

describe('creation', function() {
    it('simple creation', function() {
        new Node()
    })
    it('creation with id', function() {
        var oNode = new Node( 'id' )
        expect( oNode.toString() ).toBe( '{"id":"id","attrs":{},"child":[]}' )
    })
    it('creation with id and attributes', function() {
        var oNode = new Node( 'id', {name: 'value'} )
        expect( oNode.toString() ).toBe( '{"id":"id","attrs":{"name":"value"},"child":[]}' )
    })
})

describe('serialize', function() {
    var oNodeParent = new Node( 'id_parent' )

    it('toString', function() {
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
    })
    it('serialize', function() {
        var oJson = oNodeParent.serialize()
        var oExpectedJson = {id:"id_parent",attrs:{},child:[]}

        expect( JSON.stringify(oJson) ).toBe( JSON.stringify(oExpectedJson) )
    })
    it('toJson', function() {
        var oJson = oNodeParent.toJson()
        var oExpectedJson = {id:"id_parent",attrs:{},child:[]}

        expect( JSON.stringify(oJson) ).toBe( JSON.stringify(oExpectedJson) )
    })
    it('hashcode', function() {
        expect( oNodeParent.hashcode() ).toBe( -1918605369 )
    })
})


describe('append', function() {
    var oNodeParent = new Node( 'id_parent' )
    var oNodeChild = new Node( 'id_child' )
    var oNodeChild2 = new Node( 'id_child2' )

    it('appendChild', function() {
        oNodeParent.appendChild( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}' )
    })
    it('append', function() {
        oNodeChild.append( oNodeChild2 )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}]}' )
    })
})

describe('remove', function() {
    var oNodeParent = new Node( 'id_parent' )
    var oNodeChild = new Node( 'id_child' )
    var oNodeChild2 = new Node( 'id_child2' )

    oNodeParent.appendChild( oNodeChild )
    oNodeChild.append( oNodeChild2 )

    it('removeChild', function() {
        oNodeParent.removeChild( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
        expect( oNodeChild.toString() ).toBe( '{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}' )
    })
    it('remove', function() {
        oNodeChild.remove( oNodeChild2 )
        expect( oNodeChild.toString() ).toBe( '{"id":"id_child","attrs":{},"child":[]}' )
    })
})
