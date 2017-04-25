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
		this._oCachedJson.child.splice(iPosition, 1);
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
			return Object.assign(
				{},
				this._oCachedJson,
				{
					child: this.getChildren().map(oChildNode => oChildNode.getId())
				}
			);
		}

		return Object.assign({}, this._oCachedJson);
	}

	destroy() {
		this._oCachedJson = undefined;
	}
}
