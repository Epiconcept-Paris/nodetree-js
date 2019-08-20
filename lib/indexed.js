'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getRootNode = function getRootNode(oNode) {
  if (oNode === undefined) {
    return undefined;
  }

  // get root
  var oRoot = oNode;
  if (_typeof(oNode.oRoot) === 'object' && oNode.oRoot !== null) {
    return oNode.oRoot;
  }

  var oNextParent = oNode.parentNode();
  while (oNextParent !== undefined) {
    oRoot = oNextParent;
    // next
    oNextParent = oNextParent.parentNode();
  }

  return oRoot;
};

var IndexedNode = function (_Node) {
  _inherits(IndexedNode, _Node);

  function IndexedNode() {
    var sId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.uniqId)();
    var oAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var aChildNodes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, IndexedNode);

    var _this = _possibleConstructorReturn(this, (IndexedNode.__proto__ || Object.getPrototypeOf(IndexedNode)).call(this, sId, oAttributes, aChildNodes));

    _this.oRoot = _this;
    return _this;
  }

  _createClass(IndexedNode, [{
    key: 'parentNode',
    value: function parentNode(oPropParent) {
      var oParentNode = _get(IndexedNode.prototype.__proto__ || Object.getPrototypeOf(IndexedNode.prototype), 'parentNode', this).call(this, oPropParent);
      if ((typeof oPropParent === 'undefined' ? 'undefined' : _typeof(oPropParent)) === 'object' && oPropParent !== null) {
        this.oRoot = getRootNode(oParentNode);
        if (typeof this.oRoot.mergeIndex === 'function') {
          this.oRoot.mergeIndex(this.oIndexes);
          this.oRoot.oIndexes[this.sId] = this;

          this.oIndexes = undefined;
        }
      }

      return oParentNode;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(oNode) {
      if (_get(IndexedNode.prototype.__proto__ || Object.getPrototypeOf(IndexedNode.prototype), 'removeChild', this).call(this, oNode)) {
        if (_typeof(oNode.oRoot) === 'object' && oNode.oRoot !== null && _typeof(oNode.oRoot.oIndexes) === 'object' && oNode.oRoot.oIndexes !== null) {
          oNode.oRoot.oIndexes[oNode.getId()] = undefined;
        }
        oNode.oRoot = undefined;
        oNode.oIndexes = undefined;

        return true;
      }
      return false;
    }
  }, {
    key: 'getElementById',
    value: function getElementById(sId) {
      if (this.getId() === sId) {
        return this;
      }

      if (_typeof(this.oRoot) !== 'object' || this.oRoot === null || _typeof(this.oRoot.oIndexes) !== 'object' || this.oRoot.oIndexes === null) {
        return undefined;
      }

      var oItem = this.oRoot.oIndexes[sId];
      if (oItem === undefined) {
        return undefined;
      }

      var oNextParent = oItem.oParentNode;
      while (oNextParent !== undefined) {
        // check attributes
        if (oNextParent === this) {
          return oItem;
        }

        // next
        oNextParent = oNextParent.oParentNode;
      }

      return undefined;
    }
  }, {
    key: 'mergeIndex',
    value: function mergeIndex(oNewIndexes) {
      if (_typeof(this.oIndexes) !== 'object' || this.oIndexes === null) {
        this.oIndexes = {};
      }

      if ((typeof oNewIndexes === 'undefined' ? 'undefined' : _typeof(oNewIndexes)) !== 'object' || oNewIndexes === null) {
        return;
      }

      var aIds = Object.keys(oNewIndexes);
      for (var iIndex = 0; iIndex < aIds.length; iIndex++) {
        var sId = aIds[iIndex];
        this.oIndexes[sId] = oNewIndexes[sId];
      }
    }
  }]);

  return IndexedNode;
}(_node2.default);

exports.default = IndexedNode;