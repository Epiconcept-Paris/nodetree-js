(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Nodetree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Node=require("./node");module.exports={createNode:function(o,r,e){return new Node(o,r,e)},loadFromString:function(o){var r=JSON.parse(o);return this.loadFromJson(r)},loadFromJson:function(o){for(var r=new Node(o.id,o.attrs),e=0;e<o.child.length;e++)r.append(this.loadFromJson(o.child[e]));return r}};
},{"./node":2}],2:[function(require,module,exports){
var Utils=require("./utils"),Node=function(t,e,o){if(this.sId=void 0!=t?t:Utils.uniqId(),this.oAttributes=void 0!=e?e:{},this.aChildNodes=[],this.oParentNode=void 0,void 0!=o&&Array.isArray(o))for(var i=0;i<o.length;i++)this.append(o[i])};Node.prototype.parentNode=function(t){return void 0!=t&&(this.oParentNode=t),this.oParentNode},Node.prototype.append=Node.prototype.appendChild=function(t){return this.insertAtPosition(t,this.aChildNodes.length)},Node.prototype.remove=Node.prototype.removeChild=function(t){var e=this.aChildNodes.indexOf(t);return e>-1?(this.aChildNodes.splice(e,1),!0):!1},Node.prototype.removeFromParent=function(){return void 0!=this.parentNode()?this.parentNode().removeChild(this):!1},Node.prototype.prepend=Node.prototype.prependChild=function(t){return this.insertAtPosition(t,0)},Node.prototype.insertAtPosition=function(t,e){return t instanceof Node==0?(Utils.error_log(new Error("Can't append this object. Wrong type, we are supposed to only have Node.")),!1):((void 0==e||0>e||e>this.aChildNodes.length)&&(e=this.aChildNodes.length),this.aChildNodes.splice(e,0,t),t.parentNode(this),!0)},Node.prototype.getElementById=function(t){if(this.sId==t)return this;for(var e=0;e<this.aChildNodes.length;e++){var o=this.aChildNodes[e],i=o.getElementById(t);if(void 0!=i)return i}return void 0},Node.prototype.insertBefore=function(t,e){return this.insertAtPosition(t,this.aChildNodes.indexOf(e))},Node.prototype.insertAfter=function(t,e){return this.insertAtPosition(t,this.aChildNodes.indexOf(e)+1)},Node.prototype.setAttribute=function(t,e){return this.oAttributes[t]=e,!0},Node.prototype.getAttribute=function(t){return this.oAttributes[t]},Node.prototype.getChildren=function(){return this.aChildNodes},Node.prototype.serialize=Node.prototype.toJson=function(){for(var t={id:this.sId,attrs:this.oAttributes,child:[]},e=0;e<this.aChildNodes.length;e++){var o=this.aChildNodes[e];t.child.push(o.toJson())}return t},Node.prototype.toString=function(){return JSON.stringify(this.toJson())},Node.prototype.hashcode=function(){var t=this.toString(),e=0,o=t.length;if(0==o)return e;for(var i=0;o>i;i++){var r=t.charCodeAt(i);e=(e<<5)-e+r,e&=e}return e},module.exports=Node;


},{"./utils":3}],3:[function(require,module,exports){
module.exports={error_log:function(o){o&&(console.log("\n===================="),console.log("Error Message: "+o.message),console.log("Stacktrace:"),console.log(o.stack),console.log("===================="))},uniqId:function(){for(var o=["a","z","e","r","t","y","u","i","o","p","q","s","d","f","g","h","j","k","l","m","w","x","c","v","b","n"],e="",n=0;10>n;n++)e+=o[Math.floor(Math.random()*o.length)];return e+Date.now()}};


},{}]},{},[1])(1)
});