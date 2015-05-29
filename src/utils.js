
module.exports = {

    /**
     * Print error log in console.log with stacktrace
     *
     * @method	errorLog
     * @param	{Error}		error
     */
    error_log: function ( error )
    {
    	if ( error ) {
            console.log( '\n====================' )
    		console.log( 'Error Message: ' + error.message )
    		console.log( 'Stacktrace:' )
    		console.log( error.stack )
            console.log( '====================' )
    	}
    },

    /**
     * Return an unique identifier
     *
     * @method  uniqId
     * @return  {string}
     */
    uniqId: function()
    {
        var aAlphabet = ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "w", "x", "c", "v", "b", "n" ]
        var sRandomText = ''
        for (var i = 0; i < 10; i++) {
            sRandomText += aAlphabet[ Math.floor( Math.random() * aAlphabet.length ) ]
        }

        return sRandomText + Date.now()
    }

}
