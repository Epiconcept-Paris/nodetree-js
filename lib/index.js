'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _node3 = require('./node2');

var _node4 = _interopRequireDefault(_node3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

	/**
  * Return a new Node object
  *
  * @method  createNode
  * @param   {string}   sId
  * @param   {object}   oAttributes
  * @param   {array}   aChildNodes
  * @return  {Node}
  */
	createNode: function createNode(sId, oAttributes, aChildNodes) {
		var bCachedVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		if (bCachedVersion) {
			return new _node4.default(sId, oAttributes, aChildNodes);
		}
		return new _node2.default(sId, oAttributes, aChildNodes);
	},


	/**
  * Return the Node object described by the string (and it's childs)
  *
  * @method  loadFromString
  * @param   {string}	   sJson
  * @return  {Node}
  */
	loadFromString: function loadFromString(sJson, bCachedVersion) {
		var oJson = JSON.parse(sJson);
		return this.loadFromJson(oJson, bCachedVersion);
	},


	/**
  * Return the Node object described by the json (and it's childs)
  *
  * @method  loadFromJson
  * @param   {object}	 oJson
  * @return  {Node}
  */
	loadFromJson: function loadFromJson(oJson) {
		var _this = this;

		var bCachedVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var oNode = bCachedVersion ? new _node4.default(oJson.id, oJson.attrs) : new _node2.default(oJson.id, oJson.attrs);

		if (Array.isArray(oJson.child)) {
			oJson.child.forEach(function (oChild) {
				oNode.append(_this.loadFromJson(oChild, bCachedVersion));
			});
		}

		return oNode;
	},
	clone: function clone(oNode) {
		var _this2 = this;

		var bCachedVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var oNewNode = bCachedVersion ? new _node4.default() : new _node2.default();
		if (oNode === undefined) {
			return oNewNode;
		}
		var oAttributes = oNode.getAttributes();
		Object.keys(oAttributes).forEach(function (sAttributeName) {
			oNewNode.setAttribute(sAttributeName, oAttributes[sAttributeName]);
		});

		oNode.getChildren().forEach(function (oChild) {
			oNewNode.append(_this2.clone(oChild, bCachedVersion));
		});
		return oNewNode;
	}
};