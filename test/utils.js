import { describe, it } from 'mocha';
import { expect } from 'chai';

import Utils from '../src/utils';

describe('uniqId', () => {
  it('should be possible to create an unique identifier', () => {
    const iMaxTests = 1000;
    // faster than using an array with indexOf
    const randomIds = {};

    for (let i = 0; i < iMaxTests; i++) {
      const uniqId = Utils.uniqId();
      expect(typeof uniqId).to.be.an('string');
      // there isn't the same id before
      expect(randomIds[uniqId]).to.be.an('undefined');
      randomIds[uniqId] = 1;
    }
  });
});
