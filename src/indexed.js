import { uniqId } from './utils';

import Node from './node';

export default class IndexedNode extends Node {
  constructor(sId = uniqId(), oAttributes = {}, aChildNodes = []) {
    super(sId, oAttributes, aChildNodes);

    this.oRoot = this;
  }

  getRootNode() {
    if (typeof this.oRoot === 'object' && this.oRoot !== null && this.oRoot.oParentNode === undefined) {
      return this.oRoot;
    }

    // get root
    let oRoot = this;
    let oParent = this.oParentNode;
    while (oParent !== undefined) {
      if (typeof oParent.oRoot === 'object' && oParent.oRoot !== null && oParent.oRoot.oParentNode === undefined) {
        oRoot = oParent.oRoot;
        break;
      }

      // next
      oParent = oParent.oParentNode;
    }

    if (typeof oRoot === 'object' && oRoot !== null) {
      this.oRoot = oRoot;

      this.oRoot.mergeIndex(this.oIndexes);
      this.oRoot.oIndexes[this.sId] = this;

      if (this.oRoot !== this) {
        this.oIndexes = undefined;
      }
    }

    return oRoot;
  }

  reindexTree() {
    // Caution, heavy process
    const oIndexes = {
      [this.oRoot.sId]: this.oRoot,
    };

    const aChilds = this.oRoot.getChildren(true);
    for (let iIndex = 0; iIndex < aChilds.length; iIndex++) {
      const oItem = aChilds[iIndex];
      oItem.oRoot = this.oRoot;
      oItem.oIndexes = undefined;

      oIndexes[oItem.sId] = oItem;
    }

    this.oRoot.oIndexes = oIndexes;
  }

  compileRootNode() {
    this.getRootNode();
  }

  parentNode(oPropParent) {
    const oParentNode = super.parentNode(oPropParent);
    if (typeof oPropParent === 'object' && oPropParent !== null) {
      this.compileRootNode();

      // fix child indexes
      const aChilds = this.getChildren(true);
      for (let iIndexChild = 0; iIndexChild < aChilds.length; iIndexChild++) {
        const oChild = aChilds[iIndexChild];
        oChild.oRoot = this.oRoot;
        oChild.oIndexes = undefined;
        this.oRoot.oIndexes[oChild.sId] = oChild;
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
      oNode.oRoot = undefined;
      oNode.oIndexes = undefined;
      oNode.compileRootNode();

      for (let iIndexChild = 0; iIndexChild < aChilds.length; iIndexChild++) {
        const oChild = aChilds[iIndexChild];

        oChild.oRoot = undefined;
        oChild.oIndexes = undefined;
        oChild.compileRootNode();
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
      typeof this.oRoot !== 'object' || this.oRoot === null
    ) {
      // fix if needed
      this.compileRootNode();
    }

    if (typeof this.oRoot.oIndexes !== 'object' || this.oRoot.oIndexes === null) {
      // reindex the tree
      this.reindexTree();
    }

    const oItem = this.oRoot.oIndexes[sId];
    if (typeof oItem !== 'object' || oItem === null) {
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
    this.oRoot = this;
    if (typeof this.oIndexes !== 'object' || this.oIndexes === null) {
      this.oIndexes = {};
      this.oIndexes[this.sId] = this;
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
        for (let iIndex = 0; iIndex < aChilds.length; iIndex++) {
          aVisitStack.push(aChilds[iIndex]);
        }
      }

      return aOutput;
    }

    return super.getChildren();
  }
}
