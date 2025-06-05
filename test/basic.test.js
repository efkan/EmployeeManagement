import { expect } from '@open-wc/testing';

describe('Basic Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).to.equal(2);
  });

  it('should work with strings', () => {
    expect('hello').to.equal('hello');
  });
});
