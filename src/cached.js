/**
 * @class  Node
 * @param   {string}sId
 * @param   {object}oAttributes
 * @param   {array} aChildNodes
 */
export default class CachedNode {
	constructor(sId, oAttributes = {}) {
		this._oCachedJson = {
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
	setAttribute(sAttributeName, oValue) {
		this._oCachedJson.attrs[sAttributeName] = oValue;
	}

	insertAtPosition(oNode, iPosition) {
		this._oCachedJson.child.splice(iPosition, 0, oNode.toJson());
	}

	removeChild(iPosition) {
		if (typeof this._oCachedJson !== 'object' || this._oCachedJson === null) {
			return;
		}
		if (Array.isArray(this._oCachedJson.child)) {
			this._oCachedJson.child.splice(iPosition, 1);
		}
	}

	/**
	 * Return the node and childs as a JSON (serialized)
	 *
	 * @method  toJson
	 * @param   {boolean}   bImmediateScope - (facultatif, false by default) restrain the json to the node only (not all its children)
	 * @return  {object}
	 */
	toJson(bImmediateScope) {
		if (bImmediateScope) {
			return Object.assign({}, this._oCachedJson, {child: []});
		}

		return Object.assign({}, this._oCachedJson);
	}

	superDestroy() {
		this._oCachedJson = undefined;
	}
}
