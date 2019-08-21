import Node from './indexed';

export default {

  /**
   * Return a new Node object
   *
   * @method  createNode
   * @param   {string}  sId
   * @param   {object}  oAttributes
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
   * @param   {string}  sJson
   * @return  {Node}
   */
  loadFromString(sJson) {
    const oJson = JSON.parse(sJson);
    return this.loadFromJson(oJson);
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
      for (let iIndex = 0; iIndex < oJson.child.length; iIndex++) {
        const oChild = oJson.child[iIndex];
        oNode.append(this.loadFromJson(oChild));
      }
    }

    return oNode;
  },

  clone(oNode) {
    if (oNode === undefined) {
      return new Node();
    }

    return this.loadFromString(oNode.toString());
  },

};
