import { uniqId } from './utils';

import Node from './node';

const getRootNode = (oNode) => {
  if (oNode === undefined) {
    return undefined;
  }

  // get root
  let oRoot = oNode;
  if (typeof oNode.oRoot === 'object' && oNode.oRoot !== null) {
    return oNode.oRoot;
  }

  let oNextParent = oNode.parentNode();
  while (oNextParent !== undefined) {
    oRoot = oNextParent;
    // next
    oNextParent = oNextParent.parentNode();
  }

  return oRoot;
};

export default class IndexedNode extends Node {
  constructor(sId = uniqId(), oAttributes = {}, aChildNodes = []) {
    super(sId, oAttributes, aChildNodes);

    this.oRoot = this;
  }

  parentNode(oPropParent) {
    const oParentNode = super.parentNode(oPropParent);
    if (typeof oPropParent === 'object' && oPropParent !== null) {
      this.oRoot = getRootNode(oParentNode);
      if (typeof this.oRoot.mergeIndex === 'function') {
        this.oRoot.mergeIndex(this.oIndexes);
        this.oRoot.oIndexes[this.sId] = this;

        this.oIndexes = undefined;
      }
    }

    return oParentNode;
  }

  removeChild(oNode) {
    if (super.removeChild(oNode)) {
      const aChilds = oNode.getChildren(true);
      if (
        typeof oNode.oRoot === 'object' && oNode.oRoot !== null &&
        typeof oNode.oRoot.oIndexes === 'object' && oNode.oRoot.oIndexes !== null
      ) {
        const oRootIndexes = oNode.oRoot.oIndexes;
        oRootIndexes[oNode.getId()] = undefined;
        delete oRootIndexes[oNode.getId()];

        for (let iIndexChild = 0; iIndexChild < aChilds.length; iIndexChild++) {
          const oChild = aChilds[iIndexChild];
          oRootIndexes[oChild.getId()] = undefined;
          delete oRootIndexes[oChild.getId()];
        }
      }

      // oNode become the new root of the detached nodes
      oNode.oRoot = oNode;
      oNode.oIndexes = {
        [oNode.getId()]: oNode,
      };
      for (let iIndexChild = 0; iIndexChild < aChilds.length; iIndexChild++) {
        const oChild = aChilds[iIndexChild];
        oNode.oIndexes[oChild.getId()] = oChild;
      }

      return true;
    }
    return false;
  }

  getElementById(sId) {
    if (this.getId() === sId) {
      return this;
    }

    if (
      typeof this.oRoot !== 'object' || this.oRoot === null ||
      typeof this.oRoot.oIndexes !== 'object' || this.oRoot.oIndexes === null
    ) {
      return undefined;
    }

    const oItem = this.oRoot.oIndexes[sId];
    if (oItem === undefined) {
      return undefined;
    }

    let oNextParent = oItem.oParentNode;
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

  mergeIndex(oNewIndexes) {
    if (typeof this.oIndexes !== 'object' || this.oIndexes === null) {
      this.oIndexes = {
        [this.sId]: this,
      };
    }

    if (typeof oNewIndexes !== 'object' || oNewIndexes === null) {
      return;
    }

    const aIds = Object.keys(oNewIndexes);
    for (let iIndex = 0; iIndex < aIds.length; iIndex++) {
      const sId = aIds[iIndex];
      this.oIndexes[sId] = oNewIndexes[sId];
    }
  }

  getChildren(bFlatList = false) {
    if (bFlatList) {
      const aOutput = [];
      const aVisitStack = super.getChildren().slice();
      while (aVisitStack.length !== 0) {
        const oCurrent = aVisitStack.pop();

        aOutput.push(oCurrent);

        // for... is faster than
        // aVisitStack.push(...oCurrent.getChildren());
        const aChilds = oCurrent.getChildren();
        for (let i = aChilds.length - 1; i > -1; i--) {
          aVisitStack.push(aChilds[i]);
        }
      }

      return aOutput;
    }

    return super.getChildren();
  }
}
