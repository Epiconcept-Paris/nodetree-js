import { describe, it } from 'mocha';
import { expect } from 'chai';

import Nodetree from '../lib';

const expectToNotBeUndefined = oItem => expect(oItem).to.not.be.an('undefined');

describe('creation', () => {
  it('should be possible to create a node without arguments', () => {
    const oNode = Nodetree.createNode();
    expectToNotBeUndefined(oNode);
  });
  it('should be possible to create and use an id as argument', () => {
    const sId = 'id';
    const oNode = Nodetree.createNode(sId);
    expectToNotBeUndefined(oNode);
    expect(oNode.getId()).to.be.equal(sId);
  });
  it('should be possible to create and use an id and attributes as arguments', () => {
    const sId = 'id';
    const oAttributes = { name: 'value' };
    const oNode = Nodetree.createNode(sId, oAttributes);
    expectToNotBeUndefined(oNode);
    expect(oNode.getId()).to.be.equal(sId);
    expect(JSON.stringify(oNode.getAttributes())).to.be.equal(JSON.stringify(oAttributes));
  });
});

describe('loading existing node', () => {
  // setup
  const oReferenceJson = {
    id: 'id',
    attrs: {
      firstOne: 'value_first',
    },
    child: [
      {
        id: 'id_child',
        attrs: {
          secondOne: 'value_second',
        },
        child: [],
      },
      { id: 'id_child2', attrs: {}, child: [{ id: 'id_child4', attrs: {}, child: [] }] },
      { id: 'id_child3', attrs: {}, child: [] },
    ],
  };
  const sReferenceString = JSON.stringify(oReferenceJson);

  it('shoud be possible to load an entiere tree architecture from a string', () => {
    const oNode = Nodetree.loadFromString(sReferenceString);
    expect(oNode.toString()).to.be.equal(sReferenceString);
  });
  it('shoud be possible to load an entiere tree architecture from a json', () => {
    const oNode = Nodetree.loadFromJson(oReferenceJson);
    expect(oNode.toString()).to.be.equal(sReferenceString);
  });
});
