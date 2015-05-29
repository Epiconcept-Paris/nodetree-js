
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

describe('insert', function() {
    var oNodeParent = new Node( 'id_parent' )
    var oNodeChild = new Node( 'id_child' )
    var oNodeChild2 = new Node( 'id_child2' )
    var oNodeChild3 = new Node( 'id_child3' )

    it('insertAtPosition', function() {
        oNodeParent.insertAtPosition( oNodeChild )
        oNodeParent.insertAtPosition( oNodeChild2 )
        oNodeParent.insertAtPosition( oNodeChild3, 1 )

        var oExpectedJson = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child",attrs:{},child:[]},
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })

    it('insertBefore', function() {
        oNodeParent.insertBefore( new Node('id_child4'), oNodeChild3 )

        var oExpectedJson = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child",attrs:{},child:[]},
                {id:"id_child4",attrs:{},child:[]},
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })

    it('insertAfter', function() {
        oNodeParent.insertAfter( new Node('id_child5'), oNodeChild3 )

        var oExpectedJson = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child",attrs:{},child:[]},
                {id:"id_child4",attrs:{},child:[]},
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child5",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
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

describe('prepend', function() {
    var oNodeParent = new Node( 'id_parent' )
    var oNodeChild = new Node( 'id_child' )
    var oNodeChild2 = new Node( 'id_child2' )
    var oNodeChild3 = new Node( 'id_child3' )

    it('prependChild', function() {
        oNodeParent.appendChild( oNodeChild )
        oNodeParent.prependChild( oNodeChild2 )

        var oExpectedJson = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child2",attrs:{},child:[]},
                {id:"id_child",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })
    it('prepend', function() {
        oNodeParent.prepend( oNodeChild3 )

        var oExpectedJson = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]},
                {id:"id_child",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
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
    it('removeFromParent', function() {
        oNodeParent.append( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}' )
        oNodeChild.removeFromParent( oNodeParent )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
    })
})

describe('getElementById', function() {
    var oNodeParent = new Node( 'id_parent' )
    var oNodeChild = new Node( 'id_child' )
    var oNodeChild2 = new Node( 'id_child2' )

    it('getElementById', function() {
        oNodeParent.append( oNodeChild )
        oNodeChild.append( oNodeChild2 )

        var oExpectedNode = oNodeParent.getElementById( 'id_child2' )
        expect( oExpectedNode.toString() ).toBe( oNodeChild2.toString() )
    })
})

describe('attribute', function() {
    var oNode = new Node( 'id_parent', {attribute_1: "value_1"} )

    it('setAttribute', function() {
        oNode.setAttribute( 'attribute_2', 'value_2' )
        expect( oNode.toString() ).toBe( '{"id":"id_parent","attrs":{"attribute_1":"value_1","attribute_2":"value_2"},"child":[]}' )
        oNode.setAttribute( 'attribute_1', 'new_value_1' )
        expect( oNode.toString() ).toBe( '{"id":"id_parent","attrs":{"attribute_1":"new_value_1","attribute_2":"value_2"},"child":[]}' )
    })
    it('getAttribute', function() {
        var sValueAttribute = oNode.getAttribute( 'attribute_2' )
        expect( sValueAttribute ).toBe( 'value_2' )
    })
})
