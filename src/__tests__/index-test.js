
jest.dontMock( '../index' )
jest.dontMock( '../node' )

var Index = require( '../index' )

describe('creation', function() {
    it('simple creation', function() {
        var oNode = Index.createNode()
    })
    it('creation with id', function() {
        var oNode = Index.createNode( 'id' )
        expect( oNode.toString() ).toBe( '{"id":"id","attrs":{},"child":[]}' )
    })
    it('creation with id and attributes', function() {
        var oNode = Index.createNode( 'id', {name: 'value'} )
        expect( oNode.toString() ).toBe( '{"id":"id","attrs":{"name":"value"},"child":[]}' )
    })
})

describe('loading existing node', function() {
    var oReferenceJson = {
        id:"id",
        attrs:{
            first_one: 'value_first'
        },
        child:[
            {
                id:"id_child",
                attrs:{
                    second_one: 'value_second'
                },
                child:[]
            },
            { id:"id_child2", attrs:{}, child:[ { id:"id_child4", attrs:{}, child:[] } ] },
            { id:"id_child3", attrs:{}, child:[] }
        ]
    }
    var sReferenceString = JSON.stringify( oReferenceJson )

    it('loadFromString', function() {
        var oNode = Index.loadFromString( sReferenceString )
        expect( oNode.toString() ).toBe( sReferenceString )
    })
    it('loadFromJson', function() {
        var oNode = Index.loadFromJson( oReferenceJson )
        expect( oNode.toString() ).toBe( sReferenceString )
    })
})
