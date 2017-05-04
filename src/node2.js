import {uniqId, error_log as errorLog} from './utils';

import CachedNode from './cached';

/**
 * @class  Node
 * @param   {string}sId
 * @param   {object}oAttributes
 * @param   {array} aChildNodes
 */
export default class Node extends CachedNode {
	constructor(sId = uniqId(), oAttributes = {}, aChildNodes = []) {
		super(sId, oAttributes, aChildNodes);

		/**
		 * @member  {string}sId - The id of the node
		 */
		this.sId = sId;

		/**
		 * @member  {object}oAttributes - Attributes of the node (useful to store informations like the name of the node or anything else not related to the tree structure)
		 */
		this.oAttributes = oAttributes;

		/**
		 * @member  {array} aChildNodes - List of all children of this node
		 */
		this.aChildNodes = [];

		/**
		 * @member  {Node}  oParentNode - Parent of this node
		 */
		this.oParentNode = undefined;

		if (Array.isArray(aChildNodes)) {
			aChildNodes.forEach(oChild => this.append(oChild));
		}
	}

	/**
	 * Return the identifier of the Node
	 *
	 * @method  getId
	 * @return  {string}
	 */
	getId() {
		return this.sId;
	}

	/**
	 * Assign a new parent node if given
	 * Return the parent node
	 *
	 * @method  parentNode
	 * @param   {Node}   oParentNode- (optional)
	 * @return  {Node}
	 */
	parentNode(oParentNode) {
		if (oParentNode !== undefined) {
			// assign new parent node
			this.oParentNode = oParentNode;
		}
		return this.oParentNode;
	}

	/**
	 * @method  append  - see appendChild
	 */
	append(...aArgs) {
		return this.appendChild(...aArgs);
	}

	/**
	 * Add a node as a child of this node
	 *
	 * @method  appendChild
	 * @param   {Node}oNode
	 * @return  {boolean}
	 */
	appendChild(oNode) {
		return this.insertAtPosition(oNode, this.aChildNodes.length);
	}

	/**
	 * @method  remove  - see removeChild
	 */
	remove(...aArgs) {
		return this.removeChild(...aArgs);
	}

	/**
	 * Remove a Node child from this Node
	 *
	 * @method  removeChild
	 * @param   {Node}  oNode
	 * @return  {boolean}
	 */
	removeChild(oNode) {
		const iPosition = this.aChildNodes.indexOf(oNode);
		if (iPosition === -1) {
			return false;
		}
		oNode.oParentNode = undefined;
		this.aChildNodes.splice(iPosition, 1);
		super.removeChild(iPosition);

		return true;
	}

	/**
	 * Remove the Node from its Node parent
	 *
	 * @method  removeFromParent
	 * @param   {Node}  oNode
	 * @return  {boolean}
	 */
	removeFromParent() {
		if (this.parentNode() !== undefined) {
			return this.parentNode().removeChild(this);
		}
		return false;
	}

	/**
	 * @method  prepend - see prependChild
	 */
	prepend(...aArgs) {
		return this.prependChild(...aArgs);
	}

	/**
	* Insert a node as the first child of this node
	*
	* @method   prependChild
	* @param{Node}oNode
	* @return  {boolean}
	*/
	prependChild(oNode) {
		return this.insertAtPosition(oNode, 0);
	}

	/**
	 * Insert a node at a position in this node
	 * If no position is given, push to the end of the list
	 *
	 * @method  insertAtPosition
	 * @param   {Node}  oNode
	 * @param   {integer}   iPosition   - (optional)
	 * @return  {boolean}
	 */
	insertAtPosition(oNode, iPosition) {
		if ((oNode instanceof Node) === false) {
			if (typeof oNode === 'object') {
				const oJson = oNode;
				oNode = new Node(oJson.id, oJson.attrs);
				if (Array.isArray(oJson.child)) {
					oJson.child.forEach(oChild => {
						oNode.append(oChild);
					});
				}
			} else {
				errorLog(new Error('Can\'t append this object. Wrong type, we are supposed to only have Node.'));
				return false;
			}
		}

		if (iPosition === undefined || iPosition < 0 || iPosition > this.aChildNodes.length) {
			iPosition = this.aChildNodes.length;
		}

		this.aChildNodes.splice(iPosition, 0, oNode);
		// assign the parent node
		oNode.parentNode(this);

		super.insertAtPosition(oNode, iPosition);

		return true;
	}

	/**
	 * Return the node with this id inside the scope of this node (him and child, no parents)
	 *
	 * @method  getElementById
	 * @param   {string}   sId
	 * @return  {Node}
	 */
	getElementById(sId) {
		let oFound;
		const aVisitStack = [this];
		while (aVisitStack.length !== 0 && oFound === undefined) {
			const oCurrent = aVisitStack[0];
			if (oCurrent.getId() === sId) {
				oFound = this;
			}

			aVisitStack.shift();
			const aChilds = oCurrent.getChildren();
			for (let i = 0; i < aChilds.length; i++) {
				aVisitStack.push(aChilds[i]);
			}
		}

		return oFound;
	}

	/**
	 * Search and return childrens who match the attributes given
	 *
	 * @method  getElementsByAttributes
	 * @param   {object}oAttributes - { myAttribute: 'theValueWanted', mySecondAttribute: 'anotherOne' }
	 * @return  {array}
	 */
	getElementsByAttributes(oAttributes) {
		const aOutput = [];
		const aVisitStack = [this];
		while (aVisitStack.length !== 0) {
			const oCurrent = aVisitStack[0];

			// check attributes for this node
			const bMatch = undefined === Object.keys(oAttributes)
			.find(sAttributeName => oCurrent.getAttribute(sAttributeName) !== oAttributes[sAttributeName]);
			if (bMatch === true) {
				aOutput.push(oCurrent);
			}

			aVisitStack.shift();
			const aChilds = oCurrent.getChildren();
			for (let i = 0; i < aChilds.length; i++) {
				aVisitStack.push(aChilds[i]);
			}
		}

		return aOutput;
	}

	/**
	 * Insert a node just before the ref node among childs of this node
	 *
	 * @method  insertBefore
	 * @param   {Node} oNewNode
	 * @param   {Node} oReferenceNode
	 * @return  {boolean}
	 */
	insertBefore(oNewNode, oReferenceNode) {
		return this.insertAtPosition(oNewNode, this.getChildren().indexOf(oReferenceNode));
	}

	/**
	 * Insert a node just after the ref node among childs of this node
	 *
	 * @method  insertAfter
	 * @param   {Node} oNewNode
	 * @param   {Node} oReferenceNode
	 * @return  {boolean}
	 */
	insertAfter(oNewNode, oReferenceNode) {
		return this.insertAtPosition(oNewNode, this.getChildren().indexOf(oReferenceNode) + 1);
	}

	/**
	 * @method  setAttribute
	 * @param   {string} sAttributeName
	 * @param   {object} oValue
	 * @return  {boolean}
	 */
	setAttribute(sAttributeName, oValue) {
		super.setAttribute(sAttributeName, oValue);

		this.oAttributes[sAttributeName] = oValue;
		return true;
	}

	/**
	 * @method  getAttribute
	 * @param   {string} sAttributeName
	 * @return  {object}
	 */
	getAttribute(sAttributeName) {
		return this.getAttributes()[sAttributeName];
	}

	/**
	 * @method  getAttributes
	 * @return  {object}
	 */
	getAttributes() {
		return this.oAttributes || {};
	}

	/**
	 * Return children of this node
	 *
	 * @method  getChildren
	 * @return  {array} - array of Node
	 */
	getChildren() {
		return this.aChildNodes || [];
	}

	/**
	 * @method  serialize   - see toJson
	 */
	serialize(...aArgs) {
		return this.toJson(...aArgs);
	}

	/**
	 * Return the node and childs as a JSON (serialized)
	 *
	 * @method  toJson
	 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
	 * @return  {object}
	 */
	toJson(bImmediateScope) {
		return super.toJson(bImmediateScope);
	}

	/**
	 * Return the node and childs as a String (serialized)
	 *
	 * @method  toString
	 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
	 * @return  {string}
	 */
	toString(bImmediateScope) {
		return JSON.stringify(this.toJson(bImmediateScope));
	}

	/**
	 * Return a hashcode of the node and childs
	 * legacy version, should not be used
	 *
	 * @method  legacyHashcode
	 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the hashcode to the node only (not all its children)
	 * @return  {Number}
	 */
	legacyHashcode(bImmediateScope) {
		const sNodeString = this.toString(bImmediateScope);
		let iHash = 0;
		const iStringLength = sNodeString.length;

		if (iStringLength === 0) {
			return iHash;
		}

		for (let i = 0; i < iStringLength; i++) {
			const sCharacter = sNodeString.charCodeAt(i);
			iHash = ((iHash << 5) - iHash) + sCharacter;
			// Convert to 32bit integer
			iHash &= iHash;
		}

		return iHash;
	}

	/**
	 * Return a hashcode of the node and childs
	 *
	 * @method  hashcode
	 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the hashcode to the node only (not all its children)
	 * @return  {Number}
	 */
	hashcode(bImmediateScope) {
		const sNodeString = this.toString(bImmediateScope);

		let iHash = 0;
		for (let i = sNodeString.length; i-- > 0;) {
			iHash = ((iHash << 5) + iHash) ^ sNodeString.charCodeAt(i); /* hash * 33 ^ c */
		}
		return iHash;
	}

	/**
	 * Search and return the first parent node who match the attributes given
	 *
	 * @method  getParentNodeByAttributes
	 * @param   {object}oAttributes - { myAttribute: 'theValueWanted', mySecondAttribute: 'anotherOne' }
	 * @return  {Node}
	 */
	getParentNodeByAttributes(oAttributes = {}) {
		const aAttributesNames = Object.keys(oAttributes);
		let oNextParent = this.parentNode();
		while (oNextParent !== undefined) {
			// check attributes
			let bValidCurrent = true;
			for (let i = 0; i < aAttributesNames.length; i++) {
				const sAttributeName = aAttributesNames[i];
				if (oNextParent.getAttribute(sAttributeName) !== oAttributes[sAttributeName]) {
					bValidCurrent = false;
				}
			}

			if (bValidCurrent === true) {
				return oNextParent;
			}

			// next
			oNextParent = oNextParent.parentNode();
		}

		return undefined;
	}

	/**
	 * Search and return the first parent node with the right id
	 *
	 * @method  getParentNodeById
	 * @param   {string}sNodeId
	 * @return  {Node}
	 */
	getParentNodeById(sNodeId) {
		let oNextParent = this.parentNode();
		while (oNextParent !== undefined) {
			if (oNextParent.getId() === sNodeId) {
				return oNextParent;
			}

			// next
			oNextParent = oNextParent.parentNode();
		}

		return undefined;
	}

	destroy() {
		if (this._deleted === true) {
			return;
		}

		super.destroy();

		this._deleted = true;
		this.removeFromParent();

		delete this.sId;
		const aAttributesNames = Object.keys(this.oAttributes);
		for (let i = 0; i < aAttributesNames.length; i++) {
			const sAttributeName = aAttributesNames[i];
			delete this.oAttributes[sAttributeName];
		}
		delete this.oAttributes;
		this.aChildNodes.forEach(oChildNode => oChildNode.destroy());
		delete this.aChildNodes;
	}
}
