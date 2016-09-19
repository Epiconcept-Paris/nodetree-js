'use strict';

jest.autoMockOff();

var Index = require('../index');

describe('creation', function () {
    it('should be possible to create a node without arguments', function () {
        var oNode = Index.createNode();
        expect(oNode).toBeDefined();
    });
    it('should be possible to create and use an id as argument', function () {
        var sId = 'id';
        var oNode = Index.createNode(sId);
        expect(oNode).toBeDefined();
        expect(oNode.sId).toBe(sId);
    });
    it('should be possible to create and use an id and attributes as arguments', function () {
        var sId = 'id';
        var oAttributes = { name: 'value' };
        var oNode = Index.createNode(sId, oAttributes);
        expect(oNode).toBeDefined();
        expect(oNode.sId).toBe(sId);
        expect(JSON.stringify(oNode.oAttributes)).toBe(JSON.stringify(oAttributes));
    });
});

describe('loading existing node', function () {
    // setup
    var oReferenceJson = {
        id: "id",
        attrs: {
            first_one: 'value_first'
        },
        child: [{
            id: "id_child",
            attrs: {
                second_one: 'value_second'
            },
            child: []
        }, { id: "id_child2", attrs: {}, child: [{ id: "id_child4", attrs: {}, child: [] }] }, { id: "id_child3", attrs: {}, child: [] }]
    };
    var sReferenceString = JSON.stringify(oReferenceJson);

    it('shoud be possible to load an entiere tree architecture from a string', function () {
        var oNode = Index.loadFromString(sReferenceString);
        expect(oNode.toString()).toBe(sReferenceString);
    });
    it('shoud be possible to load an entiere tree architecture from a json', function () {
        var oNode = Index.loadFromJson(oReferenceJson);
        expect(oNode.toString()).toBe(sReferenceString);
    });
});