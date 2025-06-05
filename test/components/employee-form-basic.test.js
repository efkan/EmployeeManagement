import { html, fixture, expect } from '@open-wc/testing';

describe('EmployeeForm Basic', () => {
  it('should be able to import the component', async () => {
    // Try to dynamically import the component
    await import('../../src/components/employee-form.js');

    // Verify the custom element is defined
    expect(customElements.get('employee-form')).to.exist;
  });

  it('should render the element', async () => {
    // Import the component
    await import('../../src/components/employee-form.js');

    // Create the element
    const element = await fixture(html`<employee-form></employee-form>`);

    // Basic checks
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('employee-form');
  });
});
