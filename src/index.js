import Node from './node';

export default {

	/**
	 * Return a new Node object
	 *
	 * @method  createNode
	 * @param   {string}   sId
	 * @param   {object}   oAttributes
	 * @param   {array}   aChildNodes
	 * @return  {Node}
	 */
	createNode(sId, oAttributes, aChildNodes) {
		return new Node(sId, oAttributes, aChildNodes);
	},

	/**
	 * Return the Node object described by the string (and it's childs)
	 *
	 * @method  loadFromString
	 * @param   {string}	   sJson
	 * @return  {Node}
	 */
	loadFromString(sJson, bCachedVersion) {
		const oJson = JSON.parse(sJson);
		return this.loadFromJson(oJson, bCachedVersion);
	},

	/**
	 * Return the Node object described by the json (and it's childs)
	 *
	 * @method  loadFromJson
	 * @param   {object}	 oJson
	 * @return  {Node}
	 */
	loadFromJson(oJson) {
		const oNode = new Node(oJson.id, oJson.attrs);

		if (Array.isArray(oJson.child)) {
			oJson.child.forEach(oChild => {
				oNode.append(this.loadFromJson(oChild));
			});
		}

		return oNode;
	},

	clone(oNode) {
		const oNewNode = new Node();
		if (oNode === undefined) {
			return oNewNode;
		}
		const oAttributes = oNode.getAttributes();
		Object.keys(oAttributes).forEach(sAttributeName => {
			oNewNode.setAttribute(sAttributeName, oAttributes[sAttributeName]);
		});

		oNode.getChildren()
		.forEach(oChild => {
			oNewNode.append(
				this.clone(oChild)
			);
		});
		return oNewNode;
	}

};
