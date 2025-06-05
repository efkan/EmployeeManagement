import { expect } from '@open-wc/testing';

describe('Simple Test', () => {
  it('should pass a basic test', () => {
    expect(true).to.be.true;
  });

  it('should verify arithmetic', () => {
    expect(2 + 2).to.equal(4);
  });
});
