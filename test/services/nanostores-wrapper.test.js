import { expect } from '@open-wc/testing';
import { nanostoresWrapper } from '../../src/services/nanostores-wrapper.js';

describe('NanostoresWrapper', () => {
  it('should be defined', () => {
    expect(nanostoresWrapper).to.exist;
  });

  it('should export atom function', () => {
    expect(nanostoresWrapper.atom).to.be.a('function');
  });

  it('should export map function if available', () => {
    if (nanostoresWrapper.map) {
      expect(nanostoresWrapper.map).to.be.a('function');
    }
  });

  it('should create atom store', () => {
    const testAtom = nanostoresWrapper.atom('initial');
    expect(testAtom).to.exist;
    expect(testAtom.get()).to.equal('initial');
  });

  it('should allow atom store updates', () => {
    const testAtom = nanostoresWrapper.atom('initial');
    testAtom.set('updated');
    expect(testAtom.get()).to.equal('updated');
  });

  it('should allow atom store subscriptions', () => {
    const testAtom = nanostoresWrapper.atom('initial');
    let callbackValue = null;

    const unsubscribe = testAtom.subscribe((value) => {
      callbackValue = value;
    });

    testAtom.set('subscribed');
    expect(callbackValue).to.equal('subscribed');

    unsubscribe();
  });
});
