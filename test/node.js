import { describe, it } from 'mocha';
import { expect } from 'chai';

import Nodetree from '../lib';
import Node from '../lib/indexed';

const expectToNotBeUndefined = oItem => expect(oItem).to.not.be.an('undefined');

const stringifiedWithSortedKeys = (oJson) => {
  const aAllKeys = [];
  JSON.stringify(oJson, (key, value) => { aAllKeys.push(key); return value; });
  aAllKeys.sort();
  return JSON.stringify(oJson, aAllKeys);
}

describe('creation', () => {
  it('should be possible to create a node without arguments', () => {
    expectToNotBeUndefined(new Node());
  });
  it('should be possible to create and use an id as argument', () => {
    const sId = 'id';
    const oNode = new Node(sId);
    expectToNotBeUndefined(oNode);
    expect(oNode.sId).to.be.equal(sId);
  });
  it('should be possible to create and use an id and attributes as arguments', () => {
    const sId = 'id';
    const oAttributes = { name: 'value' };
    const oNode = new Node(sId, oAttributes);
    expectToNotBeUndefined(oNode);
    expect(oNode.sId).to.be.equal(sId);
    expect(stringifiedWithSortedKeys(oNode.oAttributes)).to.be.equal(stringifiedWithSortedKeys(oAttributes));
  });
});

describe('serialize', () => {
  // setup
  const oNodeParent = new Node('id_parent');

  it('should be possible to serialize the node as a string', () => {
    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[],"id":"id_parent"}');
  });
  it('should be possible to serialize the node as a json', () => {
    const oJson = oNodeParent.toJson();
    const oJsonSerialize = oNodeParent.serialize();

    // should be the same json
    expect(stringifiedWithSortedKeys(oJson)).to.be.equal(stringifiedWithSortedKeys(oJsonSerialize));

    // should be this one
    const oExpectedJson = { id: 'id_parent', attrs: {}, child: [] };
    expect(stringifiedWithSortedKeys(oJson)).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));
    expect(stringifiedWithSortedKeys(oJsonSerialize)).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));
  });
  it('should be possible to generate a hashcode from the node', () => {
    expect(oNodeParent.hashcode()).to.be.equal(-1718511787);
    // expect(oNodeParent.legacyHashcode()).to.be.equal(-1918605369);
  });
});

describe('insert', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child');
  const oNodeChild2 = new Node('id_child2');
  const oNodeChild3 = new Node('id_child3');

  const oNodeChild4 = new Node('id_child4');
  const oNodeChild5 = new Node('id_child5');
  const oNodeChild6 = new Node('id_child6');

  it('should be possible to insert a node at a position', () => {
    oNodeParent.insertAtPosition(oNodeChild);
    oNodeParent.insertAtPosition(oNodeChild2);
    oNodeParent.insertAtPosition(oNodeChild3, 1);

    oNodeChild3.insertAtPosition(oNodeChild4);
    oNodeChild3.insertAtPosition(oNodeChild5);
    oNodeChild4.insertAtPosition(oNodeChild6);

    const oExpectedJson = {
      id: 'id_parent',
      attrs: {},
      child: [
        { id: 'id_child', attrs: {}, child: [] },
        {
          id: 'id_child3',
          attrs: {},
          child: [
            {
              id: 'id_child4',
              attrs: {},
              child: [
                { id: 'id_child6', attrs: {}, child: [] },
              ],
            },
            { id: 'id_child5', attrs: {}, child: [] },
          ],
        },
        { id: 'id_child2', attrs: {}, child: [] },
      ],
    };

    expect(oNodeParent.toString()).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));
    expect(oNodeParent.getElementById('id_child5')).to.not.be.an('undefined');
    expect(oNodeParent.getElementById('id_child5').getId()).to.be.equal('id_child5');
  });

  it('should be possible to insert a node before another one', () => {
    oNodeParent.insertBefore(new Node('id_child_insert'), oNodeChild3);

    const oExpectedJson = {
      id: 'id_parent',
      attrs: {},
      child: [
        { id: 'id_child', attrs: {}, child: [] },
        { id: 'id_child_insert', attrs: {}, child: [] },
        {
          id: 'id_child3',
          attrs: {},
          child: [
            {
              id: 'id_child4',
              attrs: {},
              child: [
                { id: 'id_child6', attrs: {}, child: [] },
              ],
            },
            { id: 'id_child5', attrs: {}, child: [] },
          ],
        },
        { id: 'id_child2', attrs: {}, child: [] },
      ],
    };

    expect(oNodeParent.toString()).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));

    expect(oNodeParent.getElementById('id_child5')).to.not.be.an('undefined');
    expect(oNodeParent.getElementById('id_child5').getId()).to.be.equal('id_child5');
  });

  it('should be possible to insert a node after another one', () => {
    oNodeParent.insertAfter(new Node('id_child_after'), oNodeChild3);

    const oExpectedJson = {
      id: 'id_parent',
      attrs: {},
      child: [
        { id: 'id_child', attrs: {}, child: [] },
        { id: 'id_child_insert', attrs: {}, child: [] },
        {
          id: 'id_child3',
          attrs: {},
          child: [
            {
              id: 'id_child4',
              attrs: {},
              child: [
                { id: 'id_child6', attrs: {}, child: [] },
              ],
            },
            { id: 'id_child5', attrs: {}, child: [] },
          ],
        },
        { id: 'id_child_after', attrs: {}, child: [] },
        { id: 'id_child2', attrs: {}, child: [] },
      ],
    };

    expect(oNodeParent.toString()).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));

    expect(oNodeParent.getElementById('id_child6')).to.not.be.an('undefined');

    expect(oNodeParent.getElementById('id_child5')).to.not.be.an('undefined');
    expect(oNodeParent.getElementById('id_child5').getId()).to.be.equal('id_child5');
  });
});

describe('append', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child');
  const oNodeChild2 = new Node('id_child2');
  const oNodeChild3 = new Node('id_child3');

  it('should be possible to append a node', () => {
    // appendChild
    oNodeParent.appendChild(oNodeChild);
    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[{"attrs":{},"child":[],"id":"id_child"}],"id":"id_parent"}');

    // append
    oNodeChild.append(oNodeChild2);
    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[{"attrs":{},"child":[{"attrs":{},"child":[],"id":"id_child2"}],"id":"id_child"}],"id":"id_parent"}');

    oNodeChild2.append(oNodeChild3);
    expect(oNodeParent.getElementById('id_child3')).to.not.be.an('undefined');

    expect(oNodeParent.getElementById('id_child2')).to.not.be.an('undefined');
    expect(oNodeParent.getElementById('id_child2').getId()).to.be.equal('id_child2');

    oNodeChild2.append({ id: 'id_child4' });
    expect(oNodeChild2.getElementById('id_child4').getId()).to.be.equal('id_child4');

    oNodeChild2.getElementById('id_child4').append({ id: 'id_child5' });
    expect(oNodeChild2.getElementById('id_child5').getId()).to.be.equal('id_child5');

    oNodeChild2.append({
      id: 'id_child6',
      child: [{ id: 'id_child7', child: [{ id: 'id_child8' }] }],
    });
    expect(oNodeChild2.getElementById('id_child8').getId()).to.be.equal('id_child8');
    expect(oNodeParent.getElementById('id_child8').parentNode().getId()).to.be.equal('id_child7');
    expect(oNodeParent.getElementById('id_child7').parentNode().getId()).to.be.equal('id_child6');
  });
});

describe('prepend', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child');
  const oNodeChild2 = new Node('id_child2');
  const oNodeChild3 = new Node('id_child3');
  oNodeParent.appendChild(oNodeChild);

  it('should be possible to prepend a node', () => {
    // prependChild
    oNodeParent.prependChild(oNodeChild2);
    const oExpectedJson = {
      id: 'id_parent',
      attrs: {},
      child: [
        { id: 'id_child2', attrs: {}, child: [] },
        { id: 'id_child', attrs: {}, child: [] },
      ],
    };
    expect(oNodeParent.toString()).to.be.equal(stringifiedWithSortedKeys(oExpectedJson));

    // prepend
    oNodeParent.prepend(oNodeChild3);
    const oExpectedJson2 = {
      id: 'id_parent',
      attrs: {},
      child: [
        { id: 'id_child3', attrs: {}, child: [] },
        { id: 'id_child2', attrs: {}, child: [] },
        { id: 'id_child', attrs: {}, child: [] },
      ],
    };
    expect(oNodeParent.toString()).to.be.equal(stringifiedWithSortedKeys(oExpectedJson2));

    expect(oNodeParent.getElementById('id_child2')).to.not.be.an('undefined');
    expect(oNodeParent.getElementById('id_child2').getId()).to.be.equal('id_child2');
  });
});

describe('remove', () => {
  it('should be possible to remove a child node', () => {
    // setup
    const oNodeParent = new Node('id_parent');
    const oNodeChild = new Node('id_child');
    const oNodeChild2 = new Node('id_child2');
    oNodeParent.appendChild(oNodeChild);
    oNodeChild.append(oNodeChild2);

    // removeChild
    oNodeParent.removeChild(oNodeChild);
    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[],"id":"id_parent"}');
    expect(oNodeChild.toString()).to.be.equal('{"attrs":{},"child":[{"attrs":{},"child":[],"id":"id_child2"}],"id":"id_child"}');
    expect(oNodeParent.getElementById(oNodeChild.getId())).to.be.an('undefined');

    // remove
    oNodeChild.remove(oNodeChild2);
    expect(oNodeChild.toString()).to.be.equal('{"attrs":{},"child":[],"id":"id_child"}');
    expect(oNodeChild.getElementById(oNodeChild2.getId())).to.be.an('undefined');
  });

  it('should be possible to remove a node as a child', () => {
    // setup
    const oNodeParent = new Node('id_parent');
    const oNodeChild = new Node('id_child');

    // setup, add a child
    oNodeParent.append(oNodeChild);

    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[{"attrs":{},"child":[],"id":"id_child"}],"id":"id_parent"}');
    // remove using the child
    oNodeChild.removeFromParent(oNodeParent);
    expect(oNodeParent.toString()).to.be.equal('{"attrs":{},"child":[],"id":"id_parent"}');
    expect(oNodeParent.getElementById(oNodeChild.getId())).to.be.an('undefined');
  });
});

describe('getElementById', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child');
  const oNodeChild2 = new Node('id_child2');
  const oNodeChild3 = new Node('id_child3');
  oNodeParent.append(oNodeChild);
  oNodeChild.append(oNodeChild2);
  oNodeChild.append(oNodeChild3);

  it('should be possible to get a node using id', () => {
    expect(oNodeParent.getElementById('id_parent').toString()).to.be.equal(oNodeParent.toString());
    expect(oNodeParent.getElementById('id_child').toString()).to.be.equal(oNodeChild.toString());
    expect(oNodeParent.getElementById('id_child2').toString()).to.be.equal(oNodeChild2.toString());

    expect(oNodeParent.getElementById('id_parent').toString()).to.be.equal(oNodeParent.toString());
    expect(oNodeChild.getElementById('id_child').toString()).to.be.equal(oNodeChild.toString());
    expect(oNodeChild2.getElementById('id_child2').toString()).to.be.equal(oNodeChild2.toString());
  });

  it('should not be possible to get a node using id who is not a child', () => {
    expect(oNodeChild2.getElementById('id_child')).to.be.an('undefined');
    expect(oNodeChild2.getElementById('id_child3')).to.be.an('undefined');
  });
});

describe('getElementsByAttributes', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child', { attribute1: 'value', attribute2: 'otherValue' });
  const oNodeChild2 = new Node('id_child2');
  const oNodeChild3 = new Node('id_child3', { attribute1: 'value', attribute2: 'otherValue2' });
  oNodeParent.append(oNodeChild);
  oNodeChild.append(oNodeChild2);
  oNodeChild2.append(oNodeChild3);

  it('should be possible to get nodes by attributes', () => {
    const aNodes = oNodeParent.getElementsByAttributes({ attribute1: 'value' });
    expect(aNodes).to.deep.equal([oNodeChild, oNodeChild3]);

    const aNodes2 = oNodeParent.getElementsByAttributes({ attribute2: 'otherValue2' });
    expect(aNodes2).to.deep.equal([oNodeChild3]);
  });
});

describe('getParentNodeByAttributes', () => {
  // setup
  const oNodeParent = new Node('id_parent');
  const oNodeChild = new Node('id_child', { attribute1: 'value', attribute2: 'otherValue' });
  const oNodeChild2 = new Node('id_child2', { attribute2: 'otherValue2' });
  const oNodeChild3 = new Node('id_child3', { attribute3: 'value', attribute2: 'otherValue3' });
  oNodeParent.append(oNodeChild);
  oNodeChild.append(oNodeChild2);
  oNodeChild2.append(oNodeChild3);

  it('should be possible to get parent node by attributes', () => {
    expect(oNodeChild3.getParentNodeByAttributes({ attribute2: 'otherValue' }))
      .to.be.equal(oNodeChild);
  });
});

describe('attribute', () => {
  // setup
  const oNode = new Node('id_parent', { attribute1: 'value_1' });

  it('should be possible to set the value of an attribute', () => {
    oNode.setAttribute('attribute2', 'value_2');
    expect(oNode.toString()).to.be.equal('{"attrs":{"attribute1":"value_1","attribute2":"value_2"},"child":[],"id":"id_parent"}');
    oNode.setAttribute('attribute1', 'new_value_1');
    expect(oNode.toString()).to.be.equal('{"attrs":{"attribute1":"new_value_1","attribute2":"value_2"},"child":[],"id":"id_parent"}');
  });
  it('should be possible to retrieve the value of an attribute', () => {
    const sValueAttribute = oNode.getAttribute('attribute2');
    expect(sValueAttribute).to.be.equal('value_2');
  });
});

describe('getChildren', () => {
  // setup
  const oJson = {
    id: 'id_parent',
    attrs: {},
    child: [
      { id: 'id_child', attrs: {}, child: [] },
      {
        id: 'id_child3',
        attrs: {},
        child: [
          {
            id: 'id_child4',
            attrs: {},
            child: [
              { id: 'id_child6', attrs: {}, child: [] },
            ],
          },
          { id: 'id_child5', attrs: {}, child: [] },
        ],
      },
      { id: 'id_child2', attrs: {}, child: [] },
    ],
  };

  const oNode = Nodetree.loadFromJson(oJson);

  it('should be possible to get all children of a node', () => {
    const aExpectedIds = ['id_child', 'id_child3', 'id_child2'];
    expect(oNode.getChildren().map(oItem => oItem.getId())).to.deep.equal(aExpectedIds);
  });

  it('should be possible to get all children of a node as a flat array', () => {
    const aExpectedIds = ['id_child', 'id_child3', 'id_child4', 'id_child6', 'id_child5', 'id_child2'];
    expect(oNode.getChildren(true).map(oItem => oItem.getId())).to.deep.equal(aExpectedIds);
  });
});

describe('indexes', () => {
  // setup
  const oJson = {
    id: 'id_parent',
    attrs: {},
    child: [
      { id: 'id_child', attrs: {}, child: [] },
      {
        id: 'id_child3',
        attrs: {},
        child: [
          {
            id: 'id_child4',
            attrs: {},
            child: [
              { id: 'id_child6', attrs: {}, child: [] },
            ],
          },
          { id: 'id_child5', attrs: {}, child: [] },
        ],
      },
      { id: 'id_child2', attrs: {}, child: [] },
    ],
  };

  it('should keep indexes updated', () => {
    const oNode = Nodetree.loadFromJson(oJson);

    expect(oNode.oRoot).to.be.equal(oNode);
    expect(Object.keys(oNode.oRoot.oIndexes).length).to.be.equal(oNode.getChildren(true).length + 1);

    let sAllIds = oNode.getElementsByAttributes({}).map(oItem => oItem.getId()).sort().join();
    expect(typeof oNode.oIndexes).to.be.equal('object');
    expect(Object.keys(oNode.oIndexes).sort().join())
      .to.be.equal(sAllIds);

    const oNodeChild3 = oNode.getElementById('id_child3');
    oNodeChild3.removeFromParent();

    sAllIds = oNode.getElementsByAttributes({}).map(oItem => oItem.getId()).sort().join();
    expect(typeof oNode.oIndexes).to.be.equal('object');
    expect(Object.keys(oNode.oIndexes).sort().join())
      .to.be.equal(sAllIds);

    sAllIds = oNodeChild3.getElementsByAttributes({}).map(oItem => oItem.getId()).sort().join();
    expect(typeof oNodeChild3.oIndexes).to.be.equal('object');
    expect(Object.keys(oNodeChild3.oIndexes).sort().join())
      .to.be.equal(sAllIds);
  });

  it('should be able to reindex the tree', () => {
    const oNode = Nodetree.loadFromJson(oJson);

    oNode.reindexTree();

    let sIds = ['id_parent', 'id_child', 'id_child2', 'id_child3', 'id_child4', 'id_child5', 'id_child6'].sort().join();
    expect(typeof oNode.oRoot.oIndexes).to.be.equal('object');
    expect(oNode.oRoot.oIndexes).to.not.be.equal(null);
    expect(Object.keys(oNode.oRoot.oIndexes).sort().join()).to.be.equal(sIds);

    oNode.getElementById('id_child4').removeFromParent();
    oNode.reindexTree();

    sIds = ['id_parent', 'id_child', 'id_child2', 'id_child3', 'id_child5'].sort().join();
    expect(Object.keys(oNode.oRoot.oIndexes).sort().join()).to.be.equal(sIds);
  });
});

const trimTree = (oNode, iModulo = 4) => {
  let iCount = 0;
  const aStack = [oNode];
  const aRemoved = [];

  while (aStack.length !== 0) {
    const oCurrent = aStack.pop();

    if (iCount > 0 && iCount % iModulo === 0) {
      oCurrent.removeFromParent();
      aRemoved.push(oCurrent);
    } else {
      for (let i = 0; i < oCurrent.getChildren().length; i++) {
        aStack.push(oCurrent.getChildren()[i]);
      }
    }

    iCount++;
  }
  return aRemoved;
};

describe('benchmark', () => {
  const iBench = 50000;
  const iChildPerNode = 5;

  const oMemoryUsage = process.memoryUsage();

  const iStartSetup = Date.now();

  const oFirstNode = Nodetree.createNode('id_parent');
  let oLastNode = oFirstNode;

  let iCount = 0;
  const aStack = [oFirstNode];
  const oSuperArray = [oFirstNode];

  while (iCount < iBench) {
    const oCurrent = aStack.shift();

    for (let i = 0; i < iChildPerNode; i++) {
      const oNewNode = Nodetree.createNode();
      oCurrent.append(oNewNode);
      aStack.push(oNewNode);
      ++iCount;

      oLastNode = oNewNode;
    }
    oSuperArray.push(oLastNode);
  }

  console.log(iCount);

  oLastNode.setAttribute('name', 'toto');
  const oNewMemoryUsage = process.memoryUsage();

  const transformToMb = iSize => (Math.round((iSize / 1024 / 1024) * 100) / 100);

  console.log(
    'rss:', transformToMb(oNewMemoryUsage.rss - oMemoryUsage.rss), 'MB',
    'heap total:', transformToMb(oNewMemoryUsage.heapTotal - oMemoryUsage.heapTotal), 'MB',
    'heap used:', transformToMb(oNewMemoryUsage.heapUsed - oMemoryUsage.heapUsed), 'MB',
    'external:', transformToMb(oNewMemoryUsage.external - oMemoryUsage.external), 'MB',
  );

  console.log('setup:', Date.now() - iStartSetup, 'ms');

  it('should support a heavy tree for searching', (done) => {
    const iStart = Date.now();

    console.log(oFirstNode.getElementsByAttributes({ name: 'toto' }).length);

    let iTmp = Date.now();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < oSuperArray.length; j++) {
        expect(oFirstNode.getElementById(oSuperArray[j].getId())).to.be.equal(oSuperArray[j]);
      }

      console.log('search', i + 1, ':', Date.now() - iTmp, 'ms');

      iTmp = Date.now();
    }

    console.log('all search:', Date.now() - iStart, 'ms');

    done();
  }).timeout(100000);

  it('should support re-indexing a heavy tree', (done) => {
    expect(oFirstNode.oRoot.getId()).to.be.equal('id_parent');
    expect(Object.keys(oFirstNode.oRoot.oIndexes).length).to.be.equal(iCount + 1);

    const aRemoved = trimTree(oFirstNode, 15);

    expect(oFirstNode.oRoot.getId()).to.be.equal('id_parent');
    expect(oFirstNode.oRoot).to.be.equal(oFirstNode);
    expect(oFirstNode.oParentNode).to.be.an('undefined');
    expect(Object.keys(oFirstNode.oRoot.oIndexes).length).to.be.equal(oFirstNode.getChildren(true).length + 1);

    let iRemovedCount = aRemoved.length;
    for (let iIndex = 0; iIndex < aRemoved.length; iIndex++) {
      const oItem = aRemoved[iIndex];
      const aItemChildren = oItem.getChildren(true);
      const iCountChild = aItemChildren.length;
      iRemovedCount += iCountChild;

      expect(oFirstNode.getElementById(oItem.getId())).to.be.an('undefined');
      expect(oItem.oRoot).to.be.equal(oItem);
      expect(oItem.oParentNode).to.be.an('undefined');
      expect(Object.keys(oItem.oRoot.oIndexes).length).to.be.equal(iCountChild + 1);
      if (iCountChild !== 0) {
        expect(oItem.getElementById(aItemChildren[iCountChild - 1].getId())).to.not.be.an('undefined');
      }

      // for (let iIndexChild = 0; iIndexChild < iCountChild; iIndexChild++) {
      //   const oItemChild = aItemChildren[iIndexChild];
      //   expect(oItemChild.oRoot).to.be.equal(oItem);
      //   expect(oItemChild.oParentNode).to.not.be.an('undefined');
      //   expect(Object.keys(oItemChild.oRoot.oIndexes).length).to.be.equal(iCountChild + 1);
      //   expect(oItem.getElementById(oItemChild.getId())).to.not.be.an('undefined');
      // }

      // if (iCountChild !== 0) {
      //   const oNewNode = new Node('last_node');
      //   aItemChildren[iCountChild - 1].append(oNewNode);
      //   expect(oItem.getElementById('last_node')).to.be.equal(oNewNode);
      // }
    }

    expect(Object.keys(oFirstNode.oRoot.oIndexes).length).to.be.equal(iCount + 1 - iRemovedCount);

    for (let iIndex = 0; iIndex < aRemoved.length; iIndex++) {
      const oItem = aRemoved[iIndex];
      oFirstNode.append(oItem);

      const aItemChildren = oItem.getChildren(true);
      for (let iIndexChild = 0; iIndexChild < aItemChildren.length; iIndexChild++) {
        const oItemChild = aItemChildren[iIndexChild];
        expect(oItemChild).to.not.be.an('undefined');
        expect(oItemChild.oParentNode).to.not.be.an('undefined');
        expect(oItemChild.oRoot).to.not.be.an('undefined');

        expect(oItemChild.oRoot === oFirstNode).to.be.equal(true);
      //   expect(oFirstNode.getElementById(oItemChild)).to.be.equal(oItemChild);
      }
    }

    done();
  }).timeout(100000);
});

// const doTheBench = (sName, fBench, iLoop) => {
// 	const iStart = Date.now();
// 	for (let i = 0; i < iLoop; i++) {
// 		fBench();
// 	}
// 	const iTotal = Date.now() - iStart;
// 	const iAverage = iTotal / iLoop;
// 	console.log(`${sName}, loop: ${iLoop}: time elapsed: ${iTotal}ms, average ${iAverage.toFixed(2)} ms`);
// 	return iAverage;
// };
//
// describe('benchmark', () => {
// 	const oDemoStructure = require('./test-structure.json');
// 	const iLoop = 100;
//
// 	/*
// 	Building Tree: classic version, time elapsed: 4ms
// 	toJson, loop: 100: time elapsed: 370ms, average 3.70 ms
// 	toString(code: JSON.stringify(toJson)), loop: 100: time elapsed: 769ms, average 7.69 ms
// 	legacyHashcode, loop: 100: time elapsed: 1674ms, average 16.74 ms
// 	hashcode, loop: 100: time elapsed: 1150ms, average 11.50 ms
// 	Without the toString, Fastest: 3.81ms, Slowest: 9.05ms
// 	Diff hashcode: 5.24ms, 57.9% faster
// 	hash 10889908 legacy hash -1899445872
// 	    ✓ should bench classic version (3996ms)
// 	*/
// 	it('should bench classic version', function () {
// 		this.timeout(30000);
//
// 		const iStartBuild = Date.now();
// 		const oNode = Nodetree.loadFromJson(oDemoStructure, false);
// 		console.log(`Building Tree: classic version, time elapsed: ${Date.now() - iStartBuild}ms`);
//
// 		doTheBench('toJson', () => oNode.toJson(), iLoop);
// 		const iToString = doTheBench('toString(code: JSON.stringify(toJson))', () => oNode.toString(), iLoop);
//
// 		const aBenchResult = [
// 			doTheBench('legacyHashcode', () => oNode.legacyHashcode(), iLoop),
// 			doTheBench('hashcode', () => oNode.hashcode(), iLoop)
// 		]
// 		.map(iResult => iResult - iToString)
// 		.sort();
//
// 		console.log(`Without the toString, Fastest: ${aBenchResult[0].toFixed(2)}ms, Slowest: ${aBenchResult[aBenchResult.length - 1].toFixed(2)}ms`);
// 		console.log(`Diff hashcode: ${(aBenchResult[aBenchResult.length - 1] - aBenchResult[0]).toFixed(2)}ms, ${
// 			100 - (100 * (aBenchResult[0] / aBenchResult[aBenchResult.length - 1])).toFixed(2)
// 		}% faster`);
// 		console.log('hash', oNode.hashcode(), 'legacy hash', oNode.legacyHashcode());
// 	});
//
// 	/*
// 	Building Tree: cached version, time elapsed: 15ms
// 	toJson, loop: 100: time elapsed: 0ms, average 0.00 ms
// 	toString(code: JSON.stringify(toJson)), loop: 100: time elapsed: 432ms, average 4.32 ms
// 	legacyHashcode, loop: 100: time elapsed: 1283ms, average 12.83 ms
// 	hashcode, loop: 100: time elapsed: 825ms, average 8.25 ms
// 	Hashcode without the toString, Fastest: 3.93ms, Slowest: 8.51ms
// 	Diff hashcode: 4.58ms, 53.82% faster
// 	hash 10889908 legacy hash -1899445872
// 	    ✓ should bench cached version (2576ms)
// 	*/
// 	it('should bench cached version', function () {
// 		this.timeout(30000);
//
// 		const iStartBuild = Date.now();
// 		const oNode = Nodetree.loadFromJson(oDemoStructure);
// 		console.log(`Building Tree: cached version, time elapsed: ${Date.now() - iStartBuild}ms`);
//
// 		doTheBench('toJson', () => oNode.toJson(), iLoop);
// 		const iToString = doTheBench('toString(code: JSON.stringify(toJson))', () => oNode.toString(), iLoop);
//
// 		const aBenchResult = [
// 			doTheBench('legacyHashcode', () => oNode.legacyHashcode(), iLoop),
// 			doTheBench('hashcode', () => oNode.hashcode(), iLoop)
// 		]
// 		.map(iResult => iResult - iToString)
// 		.sort();
//
// 		console.log(`Hashcode without the toString, Fastest: ${aBenchResult[0].toFixed(2)}ms, Slowest: ${aBenchResult[aBenchResult.length - 1].toFixed(2)}ms`);
// 		console.log(`Diff hashcode: ${(aBenchResult[aBenchResult.length - 1] - aBenchResult[0]).toFixed(2)}ms, ${
// 			100 - (100 * (aBenchResult[0] / aBenchResult[aBenchResult.length - 1])).toFixed(2)
// 		}% faster`);
// 		console.log('hash', oNode.hashcode(), 'legacy hash', oNode.legacyHashcode());
// 	});
//
// 	/*
// 	Building Tree: cached version, time elapsed: 7ms
// 	getElementById, loop: 100: time elapsed: 4ms, average 0.04 ms
// 	getElementById, loop: 100: time elapsed: 5ms, average 0.05 ms
// 	getElementById, loop: 100: time elapsed: 5ms, average 0.05 ms
// 	getElementById, loop: 100: time elapsed: 1ms, average 0.01 ms
// 	*/
// });
