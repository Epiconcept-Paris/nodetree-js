
jest.autoMockOff()

var Node                         = require('../node')

describe('creation', function() {
    it('should be possible to create a node without arguments', function() {
        var oNode                = new Node()
        expect( oNode ).toBeDefined()
    })
    it('should be possible to create and use an id as argument', function() {
        var sId                  = 'id'
        var oNode                = new Node( sId )
        expect( oNode ).toBeDefined()
        expect( oNode.sId ).toBe( sId )
    })
    it('should be possible to create and use an id and attributes as arguments', function() {
        var sId                  = 'id'
        var oAttributes          = {name: 'value'}
        var oNode                = new Node( sId, oAttributes )
        expect( oNode ).toBeDefined()
        expect( oNode.sId ).toBe( sId )
        expect( JSON.stringify(oNode.oAttributes) ).toBe( JSON.stringify(oAttributes) )
    })
})

describe('serialize', function() {
    // setup
    var oNodeParent              = new Node( 'id_parent' )

    it('should be possible to serialize the node as a string', function() {
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
    })
    it('should be possible to serialize the node as a json', function() {
        var oJson                = oNodeParent.toJson()
        var oJsonSerialize       = oNodeParent.serialize()

        // should be the same json
        expect( JSON.stringify(oJson) ).toBe( JSON.stringify(oJsonSerialize) )

        // should be this one
        var oExpectedJson        = {id:"id_parent",attrs:{},child:[]}
        expect( JSON.stringify(oJson) ).toBe( JSON.stringify(oExpectedJson) )
        expect( JSON.stringify(oJsonSerialize) ).toBe( JSON.stringify(oExpectedJson) )
    })
    it('should be possible to generate a hashcode from the node', function() {
        expect( oNodeParent.hashcode() ).toBe( -1918605369 )
    })
})

describe('insert', function() {
    // setup
    var oNodeParent              = new Node( 'id_parent' )
    var oNodeChild               = new Node( 'id_child' )
    var oNodeChild2              = new Node( 'id_child2' )
    var oNodeChild3              = new Node( 'id_child3' )

    it('should be possible to insert a node at a position', function() {
        oNodeParent.insertAtPosition( oNodeChild )
        oNodeParent.insertAtPosition( oNodeChild2 )
        oNodeParent.insertAtPosition( oNodeChild3, 1 )

        var oExpectedJson        = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child",attrs:{},child:[]},
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })

    it('should be possible to insert a node before another one', function() {
        oNodeParent.insertBefore( new Node('id_child4'), oNodeChild3 )

        var oExpectedJson        = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child",attrs:{},child:[]},
                {id:"id_child4",attrs:{},child:[]},
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]}
        ]}

        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })

    it('should be possible to insert a node after another one', function() {
        oNodeParent.insertAfter( new Node('id_child5'), oNodeChild3 )

        var oExpectedJson        = { id:"id_parent", attrs:{},
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
    // setup
    var oNodeParent              = new Node( 'id_parent' )
    var oNodeChild               = new Node( 'id_child' )
    var oNodeChild2              = new Node( 'id_child2' )

    it('should be possible to append a node', function() {
        // appendChild
        oNodeParent.appendChild( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}' )

        // append
        oNodeChild.append( oNodeChild2 )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}]}' )
    })
})

describe('prepend', function() {
    // setup
    var oNodeParent              = new Node( 'id_parent' )
    var oNodeChild               = new Node( 'id_child' )
    var oNodeChild2              = new Node( 'id_child2' )
    var oNodeChild3              = new Node( 'id_child3' )
    oNodeParent.appendChild( oNodeChild )

    it('should be possible to prepend a node', function() {
        // prependChild
        oNodeParent.prependChild( oNodeChild2 )
        var oExpectedJson        = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child2",attrs:{},child:[]},
                {id:"id_child",attrs:{},child:[]}
        ]}
        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )

        // prepend
        oNodeParent.prepend( oNodeChild3 )
        var oExpectedJson        = { id:"id_parent", attrs:{},
            child:[
                {id:"id_child3",attrs:{},child:[]},
                {id:"id_child2",attrs:{},child:[]},
                {id:"id_child",attrs:{},child:[]}
        ]}
        expect( oNodeParent.toString() ).toBe( JSON.stringify(oExpectedJson) )
    })
})

describe('remove', function() {
    // setup
    var oNodeParent              = new Node( 'id_parent' )
    var oNodeChild               = new Node( 'id_child' )
    var oNodeChild2              = new Node( 'id_child2' )
    oNodeParent.appendChild( oNodeChild )
    oNodeChild.append( oNodeChild2 )

    it('should be possible to remove a child node', function() {
        // removeChild
        oNodeParent.removeChild( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
        expect( oNodeChild.toString() ).toBe( '{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}' )

        // remove
        oNodeChild.remove( oNodeChild2 )
        expect( oNodeChild.toString() ).toBe( '{"id":"id_child","attrs":{},"child":[]}' )
    })
    it('should be possible to remove a node as a child', function() {
        // setup, add a child
        oNodeParent.append( oNodeChild )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}' )
        // remove using the child
        oNodeChild.removeFromParent( oNodeParent )
        expect( oNodeParent.toString() ).toBe( '{"id":"id_parent","attrs":{},"child":[]}' )
    })
})

describe('getElementById', function() {
    // setup
    var oNodeParent              = new Node( 'id_parent' )
    var oNodeChild               = new Node( 'id_child' )
    var oNodeChild2              = new Node( 'id_child2' )
    oNodeParent.append( oNodeChild )
    oNodeChild.append( oNodeChild2 )

    it('should be possible to get a node using id', function() {
        var oExpectedNode_Parent = oNodeParent.getElementById( 'id_parent' )
        var oExpectedNode_Child  = oNodeParent.getElementById( 'id_child' )
        var oExpectedNode_Child2 = oNodeParent.getElementById( 'id_child2' )

        expect( oExpectedNode_Parent.toString() ).toBe( oNodeParent.toString() )
        expect( oExpectedNode_Child.toString() ).toBe( oNodeChild.toString() )
        expect( oExpectedNode_Child2.toString() ).toBe( oNodeChild2.toString() )
    })
})

describe('attribute', function() {
    // setup
    var oNode                    = new Node( 'id_parent', {attribute_1: "value_1"} )

    it('should be possible to set the value of an attribute', function() {
        oNode.setAttribute( 'attribute_2', 'value_2' )
        expect( oNode.toString() ).toBe( '{"id":"id_parent","attrs":{"attribute_1":"value_1","attribute_2":"value_2"},"child":[]}' )
        oNode.setAttribute( 'attribute_1', 'new_value_1' )
        expect( oNode.toString() ).toBe( '{"id":"id_parent","attrs":{"attribute_1":"new_value_1","attribute_2":"value_2"},"child":[]}' )
    })
    it('should be possible to retrieve the value of an attribute', function() {
        var sValueAttribute      = oNode.getAttribute( 'attribute_2' )
        expect( sValueAttribute ).toBe( 'value_2' )
    })
})
