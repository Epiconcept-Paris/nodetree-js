'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

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

		var oNode = new _node2.default(oJson.id, oJson.attrs);

		if (Array.isArray(oJson.child)) {
			oJson.child.forEach(function (oChild) {
				oNode.append(_this.loadFromJson(oChild));
			});
		}

		return oNode;
	},
	clone: function clone(oNode) {
		if (oNode === undefined) {
			return new _node2.default();
		}

		return this.loadFromString(oNode.toString());
	}
};