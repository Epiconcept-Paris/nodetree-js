const aAlphabet = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'w', 'x', 'c', 'v', 'b', 'n'];

/**
 * Print error log in console.log with stacktrace
 *
 * @method	errorLog
 * @param	{Error}		error
 */
export const error_log = (oError) => {
  if (oError) {
    console.log('\n====================');
    console.log(`Error Message: ${oError.message}`);
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
export const uniqId = () => {
  let sRandomText = '';
  for (let i = 0; i < 10; i++) {
    sRandomText += aAlphabet[Math.floor(Math.random() * aAlphabet.length)];
  }

  return sRandomText + Date.now();
};

export default {
  error_log,
  uniqId,
};
