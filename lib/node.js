'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class  Node
 * @param   {string}sId
 * @param   {object}oAttributes
 * @param   {array} aChildNodes
 */
var Node = function () {
	function Node() {
		var sId = arguments.length <= 0 || arguments[0] === undefined ? (0, _utils.uniqId)() : arguments[0];

		var _this = this;

		var oAttributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var aChildNodes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

		_classCallCheck(this, Node);

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
			aChildNodes.forEach(function (oChild) {
				return _this.append(oChild);
			});
		}
	}

	/**
  * Return the identifier of the Node
  *
  * @method  getId
  * @return  {string}
  */


	_createClass(Node, [{
		key: 'getId',
		value: function getId() {
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

	}, {
		key: 'parentNode',
		value: function parentNode(oParentNode) {
			if (oParentNode !== undefined) {
				// assign new parent node
				this.oParentNode = oParentNode;
			}
			return this.oParentNode;
		}

		/**
   * @method  append  - see appendChild
   */

	}, {
		key: 'append',
		value: function append() {
			return this.appendChild.apply(this, arguments);
		}

		/**
   * Add a node as a child of this node
   *
   * @method  appendChild
   * @param   {Node}oNode
   * @return  {boolean}
   */

	}, {
		key: 'appendChild',
		value: function appendChild(oNode) {
			return this.insertAtPosition(oNode, this.aChildNodes.length);
		}

		/**
   * @method  remove  - see removeChild
   */

	}, {
		key: 'remove',
		value: function remove() {
			return this.removeChild.apply(this, arguments);
		}

		/**
   * Remove a Node child from this Node
   *
   * @method  removeChild
   * @param   {Node}  oNode
   * @return  {boolean}
   */

	}, {
		key: 'removeChild',
		value: function removeChild(oNode) {
			var iPosition = this.aChildNodes.indexOf(oNode);
			if (iPosition > -1) {
				oNode.oParentNode = undefined;
				this.aChildNodes.splice(iPosition, 1);
				return true;
			}
			return false;
		}

		/**
   * Remove the Node from its Node parent
   *
   * @method  removeFromParent
   * @param   {Node}  oNode
   * @return  {boolean}
   */

	}, {
		key: 'removeFromParent',
		value: function removeFromParent() {
			if (this.parentNode() !== undefined) {
				return this.parentNode().removeChild(this);
			}
			return false;
		}

		/**
   * @method  prepend - see prependChild
   */

	}, {
		key: 'prepend',
		value: function prepend() {
			return this.prependChild.apply(this, arguments);
		}

		/**
  * Insert a node as the first child of this node
  *
  * @method   prependChild
  * @param{Node}oNode
  * @return  {boolean}
  */

	}, {
		key: 'prependChild',
		value: function prependChild(oNode) {
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

	}, {
		key: 'insertAtPosition',
		value: function insertAtPosition(oNode, iPosition) {
			if (oNode instanceof Node === false) {
				if ((typeof oNode === 'undefined' ? 'undefined' : _typeof(oNode)) === 'object') {
					var oJson = oNode;
					oNode = new Node(oJson.id, oJson.attrs);
					if (Array.isArray(oJson.child)) {
						oJson.child.forEach(function (oChild) {
							oNode.append(oChild);
						});
					}
				} else {
					(0, _utils.error_log)(new Error('Can\'t append this object. Wrong type, we are supposed to only have Node.'));
					return false;
				}
			}

			if (iPosition === undefined || iPosition < 0 || iPosition > this.aChildNodes.length) {
				iPosition = this.aChildNodes.length;
			}

			this.aChildNodes.splice(iPosition, 0, oNode);
			// assign the parent node
			oNode.parentNode(this);

			return true;
		}

		/**
   * Return the node with this id inside the scope of this node (him and child, no parents)
   *
   * @method  getElementById
   * @param   {string}   sId
   * @return  {Node}
   */

	}, {
		key: 'getElementById',
		value: function getElementById(sId) {
			if (this.sId === sId) {
				return this;
			}

			for (var i = 0; i < this.aChildNodes.length; i++) {
				var oChildNode = this.aChildNodes[i];
				var oSearchedNode = oChildNode.getElementById(sId);
				if (oSearchedNode !== undefined) {
					return oSearchedNode;
				}
			}

			// there is no element with this id (at least when searching from this node)
			return undefined;
		}

		/**
   * Search and return childrens who match the attributes given
   *
   * @method  getElementsByAttributes
   * @param   {object}oAttributes - { myAttribute: 'theValueWanted', mySecondAttribute: 'anotherOne' }
   * @return  {array}
   */

	}, {
		key: 'getElementsByAttributes',
		value: function getElementsByAttributes(oAttributes) {
			var _this2 = this;

			var aOutput = [];

			// check attributes for this node
			var bMatch = undefined === Object.keys(oAttributes).find(function (sAttributeName) {
				return _this2.getAttribute(sAttributeName) !== oAttributes[sAttributeName];
			});

			if (bMatch === true) {
				aOutput.push(this);
			}

			this.aChildNodes.filter(function (oChild) {
				return oChild !== undefined;
			}).map(function (oChild) {
				return oChild.getElementsByAttributes(oAttributes);
			}).forEach(function (aChilds) {
				return aOutput.push.apply(aOutput, _toConsumableArray(aChilds));
			});

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

	}, {
		key: 'insertBefore',
		value: function insertBefore(oNewNode, oReferenceNode) {
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

	}, {
		key: 'insertAfter',
		value: function insertAfter(oNewNode, oReferenceNode) {
			return this.insertAtPosition(oNewNode, this.getChildren().indexOf(oReferenceNode) + 1);
		}

		/**
   * @method  setAttribute
   * @param   {string} sAttributeName
   * @param   {object} oValue
   * @return  {boolean}
   */

	}, {
		key: 'setAttribute',
		value: function setAttribute(sAttributeName, oValue) {
			this.oAttributes[sAttributeName] = oValue;
			return true;
		}

		/**
   * @method  getAttribute
   * @param   {string} sAttributeName
   * @return  {object}
   */

	}, {
		key: 'getAttribute',
		value: function getAttribute(sAttributeName) {
			return this.getAttributes()[sAttributeName];
		}

		/**
   * @method  getAttributes
   * @return  {object}
   */

	}, {
		key: 'getAttributes',
		value: function getAttributes() {
			return this.oAttributes || {};
		}

		/**
   * Return children of this node
   *
   * @method  getChildren
   * @return  {array} - array of Node
   */

	}, {
		key: 'getChildren',
		value: function getChildren() {
			return this.aChildNodes || [];
		}

		/**
   * @method  serialize   - see toJson
   */

	}, {
		key: 'serialize',
		value: function serialize() {
			return this.toJson.apply(this, arguments);
		}

		/**
   * Return the node and childs as a JSON (serialized)
   *
   * @method  toJson
   * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
   * @return  {object}
   */

	}, {
		key: 'toJson',
		value: function toJson(bImmediateScope) {
			return {
				id: this.sId,
				attrs: Object.assign({}, this.oAttributes),
				child: this.getChildren().map(function (oChildNode) {
					return bImmediateScope === true ? oChildNode.getId() : oChildNode.toJson(bImmediateScope);
				})
			};
		}

		/**
   * Return the node and childs as a String (serialized)
   *
   * @method  toString
   * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
   * @return  {string}
   */

	}, {
		key: 'toString',
		value: function toString(bImmediateScope) {
			return JSON.stringify(this.toJson(bImmediateScope));
		}

		/**
   * Return a hashcode of the node and childs
   *
   * @method  hashcode
   * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the hashcode to the node only (not all its children)
   * @return  {Number}
   */

	}, {
		key: 'hashcode',
		value: function hashcode(bImmediateScope) {
			var sNodeString = this.toString(bImmediateScope);
			var iHash = 0;
			var iStringLength = sNodeString.length;

			if (iStringLength === 0) {
				return iHash;
			}

			for (var i = 0; i < iStringLength; i++) {
				var sCharacter = sNodeString.charCodeAt(i);
				iHash = (iHash << 5) - iHash + sCharacter;
				// Convert to 32bit integer
				iHash &= iHash;
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

	}, {
		key: 'getParentNodeByAttributes',
		value: function getParentNodeByAttributes(oAttributes) {
			var oParentNode = this.parentNode();
			if (oParentNode === undefined) {
				return undefined;
			}

			// check attributes
			for (var sAttributeName in oAttributes) {
				if (oAttributes.hasOwnProperty(sAttributeName)) {
					if (oParentNode.getAttribute(sAttributeName) !== oAttributes[sAttributeName]) {
						return oParentNode.getParentNodeByAttributes(oAttributes);
					}
				}
			}

			// attributes matches
			return oParentNode;
		}

		/**
   * Search and return the first parent node with the right id
   *
   * @method  getParentNodeById
   * @param   {string}sNodeId
   * @return  {Node}
   */

	}, {
		key: 'getParentNodeById',
		value: function getParentNodeById(sNodeId) {
			var oParentNode = this.parentNode();
			if (oParentNode === undefined) {
				return undefined;
			}

			if (oParentNode.getId() !== sNodeId) {
				return oParentNode.getParentNodeById(sNodeId);
			}

			// attributes matches
			return oParentNode;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			if (this._deleted === true) {
				return;
			}
			this._deleted = true;
			this.removeFromParent();

			delete this.sId;
			for (var variable in this.oAttributes) {
				if (this.oAttributes.hasOwnProperty(variable)) {
					delete this.oAttributes[variable];
				}
			}
			delete this.oAttributes;
			this.aChildNodes.forEach(function (oChildNode) {
				return oChildNode.destroy();
			});
			delete this.aChildNodes;
		}
	}]);

	return Node;
}();

exports.default = Node;