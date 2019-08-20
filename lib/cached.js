'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class  Node
 * @param   {string}sId
 * @param   {object}oAttributes
 * @param   {array} aChildNodes
 */
var CachedNode = function () {
  function CachedNode(sId) {
    var oAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CachedNode);

    this.oCachedJson = {
      id: sId,
      attrs: Object.assign({}, oAttributes),
      child: []
    };
  }

  /**
   * @method  setAttribute
   * @param   {string} sAttributeName
   * @param   {object} oValue
   * @return  {boolean}
   */


  _createClass(CachedNode, [{
    key: 'setAttribute',
    value: function setAttribute(sAttributeName, oValue) {
      this.oCachedJson.attrs[sAttributeName] = oValue;
    }
  }, {
    key: 'insertAtPosition',
    value: function insertAtPosition(oNode, iPosition) {
      this.oCachedJson.child.splice(iPosition, 0, oNode.toJson());
    }
  }, {
    key: 'removeChild',
    value: function removeChild(iPosition) {
      if (_typeof(this.oCachedJson) !== 'object' || this.oCachedJson === null) {
        return;
      }
      if (Array.isArray(this.oCachedJson.child)) {
        this.oCachedJson.child.splice(iPosition, 1);
      }
    }

    /**
     * Return the node and childs as a JSON (serialized)
     *
     * @method  toJson
     * @param   {boolean} bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
     * @return  {object}
     */

  }, {
    key: 'toJson',
    value: function toJson(bImmediateScope) {
      if (bImmediateScope) {
        return Object.assign({}, this.oCachedJson, { child: [] });
      }

      return Object.assign({}, this.oCachedJson);
    }
  }, {
    key: 'superDestroy',
    value: function superDestroy() {
      this.oCachedJson = undefined;
    }
  }]);

  return CachedNode;
}();

exports.default = CachedNode;