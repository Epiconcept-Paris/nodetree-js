'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var aAlphabet = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'w', 'x', 'c', 'v', 'b', 'n'];

/**
 * Print error log in console.log with stacktrace
 *
 * @method	errorLog
 * @param	{Error}		error
 */
var error_log = exports.error_log = function error_log(oError) {
	if (oError) {
		console.log('\n====================');
		console.log('Error Message: ' + oError.message);
		console.log('Stacktrace:');
		console.log(oError.stack);
		console.log('====================');
	}
};

/**
 * Return an unique identifier
 *
 * @method  uniqId
 * @return  {string}
 */
var uniqId = exports.uniqId = function uniqId() {
	var sRandomText = '';
	for (var i = 0; i < 10; i++) {
		sRandomText += aAlphabet[Math.floor(Math.random() * aAlphabet.length)];
	}

	return sRandomText + Date.now();
};

exports.default = {
	error_log: error_log,
	uniqId: uniqId
};