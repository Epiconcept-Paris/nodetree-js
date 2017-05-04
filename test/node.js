import {describe, it} from 'mocha';
import {expect} from 'chai';

import Nodetree from '../lib';
import Node from '../lib/node';

const expectToNotBeUndefined = oItem => {
	return expect(oItem).to.not.be.an('undefined');
};

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
		const oAttributes = {name: 'value'};
		const oNode = new Node(sId, oAttributes);
		expectToNotBeUndefined(oNode);
		expect(oNode.sId).to.be.equal(sId);
		expect(JSON.stringify(oNode.oAttributes)).to.be.equal(JSON.stringify(oAttributes));
	});
});

describe('serialize', () => {
	// setup
	const oNodeParent = new Node('id_parent');

	it('should be possible to serialize the node as a string', () => {
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[]}');
	});
	it('should be possible to serialize the node as a json', () => {
		const oJson = oNodeParent.toJson();
		const oJsonSerialize = oNodeParent.serialize();

		// should be the same json
		expect(JSON.stringify(oJson)).to.be.equal(JSON.stringify(oJsonSerialize));

		// should be this one
		const oExpectedJson = {id: 'id_parent', attrs: {}, child: []};
		expect(JSON.stringify(oJson)).to.be.equal(JSON.stringify(oExpectedJson));
		expect(JSON.stringify(oJsonSerialize)).to.be.equal(JSON.stringify(oExpectedJson));
	});
	it('should be possible to generate a hashcode from the node', () => {
		expect(oNodeParent.hashcode()).to.be.equal(1357554261);
		expect(oNodeParent.legacyHashcode()).to.be.equal(-1918605369);
	});
});

describe('insert', () => {
	// setup
	const oNodeParent = new Node('id_parent');
	const oNodeChild = new Node('id_child');
	const oNodeChild2 = new Node('id_child2');
	const oNodeChild3 = new Node('id_child3');

	it('should be possible to insert a node at a position', () => {
		oNodeParent.insertAtPosition(oNodeChild);
		oNodeParent.insertAtPosition(oNodeChild2);
		oNodeParent.insertAtPosition(oNodeChild3, 1);

		const oExpectedJson = {
			id: 'id_parent',
			attrs: {},
			child: [
				{id: 'id_child', attrs: {}, child: []},
				{id: 'id_child3', attrs: {}, child: []},
				{id: 'id_child2', attrs: {}, child: []}
			]
		};

		expect(oNodeParent.toString()).to.be.equal(JSON.stringify(oExpectedJson));
	});

	it('should be possible to insert a node before another one', () => {
		oNodeParent.insertBefore(new Node('id_child4'), oNodeChild3);

		const oExpectedJson = {
			id: 'id_parent',
			attrs: {},
			child: [
				{id: 'id_child', attrs: {}, child: []},
				{id: 'id_child4', attrs: {}, child: []},
				{id: 'id_child3', attrs: {}, child: []},
				{id: 'id_child2', attrs: {}, child: []}
			]
		};

		expect(oNodeParent.toString()).to.be.equal(JSON.stringify(oExpectedJson));
	});

	it('should be possible to insert a node after another one', () => {
		oNodeParent.insertAfter(new Node('id_child5'), oNodeChild3);

		const oExpectedJson = {
			id: 'id_parent',
			attrs: {},
			child: [
				{id: 'id_child', attrs: {}, child: []},
				{id: 'id_child4', attrs: {}, child: []},
				{id: 'id_child3', attrs: {}, child: []},
				{id: 'id_child5', attrs: {}, child: []},
				{id: 'id_child2', attrs: {}, child: []}
			]
		};

		expect(oNodeParent.toString()).to.be.equal(JSON.stringify(oExpectedJson));
	});
});

describe('append', () => {
	// setup
	const oNodeParent = new Node('id_parent');
	const oNodeChild = new Node('id_child');
	const oNodeChild2 = new Node('id_child2');

	it('should be possible to append a node', () => {
		// appendChild
		oNodeParent.appendChild(oNodeChild);
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}');

		// append
		oNodeChild.append(oNodeChild2);
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}]}');
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
				{id: 'id_child2', attrs: {}, child: []},
				{id: 'id_child', attrs: {}, child: []}
			]
		};
		expect(oNodeParent.toString()).to.be.equal(JSON.stringify(oExpectedJson));

		// prepend
		oNodeParent.prepend(oNodeChild3);
		const oExpectedJson2 = {
			id: 'id_parent',
			attrs: {},
			child: [
				{id: 'id_child3', attrs: {}, child: []},
				{id: 'id_child2', attrs: {}, child: []},
				{id: 'id_child', attrs: {}, child: []}
			]
		};
		expect(oNodeParent.toString()).to.be.equal(JSON.stringify(oExpectedJson2));
	});
});

describe('remove', () => {
	// setup
	const oNodeParent = new Node('id_parent');
	const oNodeChild = new Node('id_child');
	const oNodeChild2 = new Node('id_child2');
	oNodeParent.appendChild(oNodeChild);
	oNodeChild.append(oNodeChild2);

	it('should be possible to remove a child node', () => {
		// removeChild
		oNodeParent.removeChild(oNodeChild);
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[]}');
		expect(oNodeChild.toString()).to.be.equal('{"id":"id_child","attrs":{},"child":[{"id":"id_child2","attrs":{},"child":[]}]}');

		// remove
		oNodeChild.remove(oNodeChild2);
		expect(oNodeChild.toString()).to.be.equal('{"id":"id_child","attrs":{},"child":[]}');
	});
	it('should be possible to remove a node as a child', () => {
		// setup, add a child
		oNodeParent.append(oNodeChild);
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[{"id":"id_child","attrs":{},"child":[]}]}');
		// remove using the child
		oNodeChild.removeFromParent(oNodeParent);
		expect(oNodeParent.toString()).to.be.equal('{"id":"id_parent","attrs":{},"child":[]}');
	});
});

describe('getElementById', () => {
	// setup
	const oNodeParent = new Node('id_parent');
	const oNodeChild = new Node('id_child');
	const oNodeChild2 = new Node('id_child2');
	oNodeParent.append(oNodeChild);
	oNodeChild.append(oNodeChild2);

	it('should be possible to get a node using id', () => {
		const oExpectedNodeParent = oNodeParent.getElementById('id_parent');
		const oExpectedNodeChild = oNodeParent.getElementById('id_child');
		const oExpectedNodeChild2 = oNodeParent.getElementById('id_child2');

		expect(oExpectedNodeParent.toString()).to.be.equal(oNodeParent.toString());
		expect(oExpectedNodeChild.toString()).to.be.equal(oNodeChild.toString());
		expect(oExpectedNodeChild2.toString()).to.be.equal(oNodeChild2.toString());
	});
});

describe('getElementsByAttributes', () => {
	// setup
	const oNodeParent = new Node('id_parent');
	const oNodeChild = new Node('id_child', {attribute1: 'value', attribute2: 'otherValue'});
	const oNodeChild2 = new Node('id_child2');
	const oNodeChild3 = new Node('id_child3', {attribute1: 'value', attribute2: 'otherValue2'});
	oNodeParent.append(oNodeChild);
	oNodeChild.append(oNodeChild2);
	oNodeChild2.append(oNodeChild3);

	it('should be possible to get nodes by attributes', () => {
		const aNodes = oNodeParent.getElementsByAttributes({attribute1: 'value'});
		expect(aNodes).to.deep.equal([oNodeChild, oNodeChild3]);

		const aNodes2 = oNodeParent.getElementsByAttributes({attribute2: 'otherValue2'});
		expect(aNodes2).to.deep.equal([oNodeChild3]);
	});
});

describe('attribute', () => {
	// setup
	const oNode = new Node('id_parent', {attribute1: 'value_1'});

	it('should be possible to set the value of an attribute', () => {
		oNode.setAttribute('attribute2', 'value_2');
		expect(oNode.toString()).to.be.equal('{"id":"id_parent","attrs":{"attribute1":"value_1","attribute2":"value_2"},"child":[]}');
		oNode.setAttribute('attribute1', 'new_value_1');
		expect(oNode.toString()).to.be.equal('{"id":"id_parent","attrs":{"attribute1":"new_value_1","attribute2":"value_2"},"child":[]}');
	});
	it('should be possible to retrieve the value of an attribute', () => {
		const sValueAttribute = oNode.getAttribute('attribute2');
		expect(sValueAttribute).to.be.equal('value_2');
	});
});

describe('benchmark', () => {
	const iBench = 1000000;

	it(`should support a heavy tree for searching`, done => {
		const oFirstNode = Nodetree.createNode();
		let oPreviousNode = oFirstNode;

		for (let i = 0; i < iBench; i++) {
			const oNewNode = Nodetree.createNode();
			oPreviousNode.append(oNewNode);
			oPreviousNode = oNewNode;
		}

		oPreviousNode.setAttribute('name', 'toto');

		console.log(oFirstNode.getElementsByAttributes({name: 'toto'}).length);

		done();
	});
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
