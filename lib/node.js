'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _utils = require('./utils');

var _cached = require('./cached');

var _cached2 = _interopRequireDefault(_cached);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class  Node
 * @param   {string}sId
 * @param   {object}oAttributes
 * @param   {array} aChildNodes
 */
var Node = function (_CachedNode) {
	_inherits(Node, _CachedNode);

	function Node() {
		var sId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.uniqId)();
		var oAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var aChildNodes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

		_classCallCheck(this, Node);

		/**
   * @member  {string}sId - The id of the node
   */
		var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, sId, oAttributes, aChildNodes));

		_this.sId = sId;

		/**
   * @member  {object}oAttributes - Attributes of the node (useful to store informations like the name of the node or anything else not related to the tree structure)
   */
		_this.oAttributes = oAttributes;

		/**
   * @member  {array} aChildNodes - List of all children of this node
   */
		_this.aChildNodes = [];

		/**
   * @member  {Node}  oParentNode - Parent of this node
   */
		_this.oParentNode = undefined;

		if (Array.isArray(aChildNodes)) {
			aChildNodes.forEach(function (oChild) {
				return _this.append(oChild);
			});
		}
		return _this;
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
			if (iPosition === -1) {
				return false;
			}
			oNode.oParentNode = undefined;
			this.aChildNodes.splice(iPosition, 1);
			_get(Node.prototype.__proto__ || Object.getPrototypeOf(Node.prototype), 'removeChild', this).call(this, iPosition);

			return true;
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
			if (this.oParentNode !== undefined) {
				return this.oParentNode.removeChild(this);
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

			_get(Node.prototype.__proto__ || Object.getPrototypeOf(Node.prototype), 'insertAtPosition', this).call(this, oNode, iPosition);

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
			var aVisitStack = [this];
			while (aVisitStack.length !== 0) {
				var oCurrent = aVisitStack.unshift();
				if (oCurrent.getId() === sId) {
					return oCurrent;
				}

				var aChilds = oCurrent.getChildren();
				for (var i = 0; i < aChilds.length; i++) {
					aVisitStack.push(aChilds[i]);
				}
			}

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
			var aAttributesNames = Object.keys(oAttributes);
			var aOutput = [];
			var aVisitStack = [this];
			while (aVisitStack.length !== 0) {
				var oCurrent = aVisitStack.unshift();

				// check attributes for this node
				var bValidCurrent = true;
				for (var i = 0; i < aAttributesNames.length; i++) {
					var sAttributeName = aAttributesNames[i];
					if (oCurrent.getAttribute(sAttributeName) !== oAttributes[sAttributeName]) {
						bValidCurrent = false;
					}
				}

				if (bValidCurrent === true) {
					aOutput.push(oCurrent);
				}

				var aChilds = oCurrent.getChildren().reverse();
				for (var _i = 0; _i < aChilds.length; _i++) {
					aVisitStack.shift(aChilds[_i]);
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
			_get(Node.prototype.__proto__ || Object.getPrototypeOf(Node.prototype), 'setAttribute', this).call(this, sAttributeName, oValue);

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
			return _get(Node.prototype.__proto__ || Object.getPrototypeOf(Node.prototype), 'toJson', this).call(this, bImmediateScope);
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
   * legacy version, should not be used
   *
   * @method  legacyHashcode
   * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the hashcode to the node only (not all its children)
   * @return  {Number}
   */

	}, {
		key: 'legacyHashcode',
		value: function legacyHashcode(bImmediateScope) {
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
			for (var i = sNodeString.length; i-- > 0;) {
				iHash = (iHash << 5) + iHash ^ sNodeString.charCodeAt(i); /* hash * 33 ^ c */
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
		value: function getParentNodeByAttributes() {
			var oAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var aAttributesNames = Object.keys(oAttributes);
			var oNextParent = this.parentNode();
			while (oNextParent !== undefined) {
				// check attributes
				var bValidCurrent = true;
				for (var i = 0; i < aAttributesNames.length; i++) {
					var sAttributeName = aAttributesNames[i];
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

	}, {
		key: 'getParentNodeById',
		value: function getParentNodeById(sNodeId) {
			var oNextParent = this.parentNode();
			while (oNextParent !== undefined) {
				if (oNextParent.getId() === sNodeId) {
					return oNextParent;
				}

				// next
				oNextParent = oNextParent.parentNode();
			}

			return undefined;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var aVisitStack = [this];
			while (aVisitStack.length !== 0) {
				var oCurrent = aVisitStack.unshift();

				var aChilds = oCurrent.getChildren();
				for (var i = 0; i < aChilds.length; i++) {
					aVisitStack.push(aChilds[i]);
				}

				if (this._deleted !== true) {
					oCurrent._deleted = true;
					oCurrent.removeFromParent();

					oCurrent.oAttributes = undefined;
					oCurrent.aChildNodes = undefined;
					oCurrent.oParentNode = undefined;

					// delete oCurrent.sId;
					// const aAttributesNames = Object.keys(oCurrent.oAttributes);
					// for (let i = 0; i < aAttributesNames.length; i++) {
					// 	const sAttributeName = aAttributesNames[i];
					// 	delete oCurrent.oAttributes[sAttributeName];
					// }
					// delete oCurrent.oAttributes;
					// delete oCurrent.aChildNodes;

					oCurrent.superDestroy();
				}
			}
		}
	}]);

	return Node;
}(_cached2.default);

exports.default = Node;