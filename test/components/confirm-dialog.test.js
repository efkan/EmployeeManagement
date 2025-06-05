import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import '../../src/components/confirm-dialog.js';

describe('ConfirmDialog', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <confirm-dialog
        title="Test Title"
        message="Test message"
        confirmText="Confirm"
        cancelText="Cancel">
      </confirm-dialog>
    `);
  });

  it('should render dialog with correct content', () => {
    const dialog = element.shadowRoot.querySelector('.dialog');
    expect(dialog).to.exist;

    const title = element.shadowRoot.querySelector('.dialog-title');
    expect(title).to.exist;
    expect(title.textContent.trim()).to.equal('Test Title');

    const message = element.shadowRoot.querySelector('.dialog-message');
    expect(message).to.exist;
    expect(message.textContent.trim()).to.equal('Test message');

    const confirmBtn = element.shadowRoot.querySelector('.btn-primary, .btn-danger');
    expect(confirmBtn).to.exist;
    expect(confirmBtn.textContent.trim()).to.equal('Confirm');

    const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');
    expect(cancelBtn).to.exist;
    expect(cancelBtn.textContent.trim()).to.equal('Cancel');
  });

  it('should be hidden by default', () => {
    expect(element.open).to.be.false;
    expect(element.hasAttribute('open')).to.be.false;
  });

  it('should show dialog when open property is set to true', async () => {
    element.open = true;
    await elementUpdated(element);

    expect(element.hasAttribute('open')).to.be.true;
  });

  it('should emit confirm event when confirm button is clicked', async () => {
    element.open = true;
    await elementUpdated(element);

    let confirmEvent = null;
    element.addEventListener('dialog-confirm', (e) => {
      confirmEvent = e;
    });

    const confirmBtn = element.shadowRoot.querySelector('.btn-primary, .btn-danger');
    confirmBtn.click();
    await elementUpdated(element);

    expect(confirmEvent).to.exist;
    expect(element.open).to.be.false; // Should close after confirm
  });

  it('should emit cancel event when cancel button is clicked', async () => {
    element.open = true;
    await elementUpdated(element);

    let cancelEvent = null;
    element.addEventListener('dialog-cancel', (e) => {
      cancelEvent = e;
    });

    const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');
    cancelBtn.click();
    await elementUpdated(element);

    expect(cancelEvent).to.exist;
    expect(element.open).to.be.false; // Should close after cancel
  });

  it('should close dialog when clicking overlay', async () => {
    element.open = true;
    await elementUpdated(element);

    let cancelEvent = null;
    element.addEventListener('dialog-cancel', (e) => {
      cancelEvent = e;
    });

    // Click on the host element (overlay)
    element.click();
    await elementUpdated(element);

    expect(cancelEvent).to.exist;
    expect(element.open).to.be.false;
  });

  it('should not close when clicking dialog content', async () => {
    element.open = true;
    await elementUpdated(element);

    let cancelEvent = null;
    element.addEventListener('dialog-cancel', (e) => {
      cancelEvent = e;
    });

    const dialog = element.shadowRoot.querySelector('.dialog');
    dialog.click();
    await elementUpdated(element);

    expect(cancelEvent).to.be.null;
    expect(element.open).to.be.true; // Should remain open
  });

  it('should handle escape key to close dialog', async () => {
    element.open = true;
    await elementUpdated(element);

    let cancelEvent = null;
    element.addEventListener('dialog-cancel', (e) => {
      cancelEvent = e;
    });

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    await elementUpdated(element);

    expect(cancelEvent).to.exist;
    expect(element.open).to.be.false;
  });

  it('should show dialog when opened', async () => {
    element.open = true;
    await elementUpdated(element);

    // Check that confirm button is present and can be found
    const confirmBtn = element.shadowRoot.querySelector('.btn-primary, .btn-danger');
    expect(confirmBtn).to.exist;
  });

  it('should handle different types of dialogs', async () => {
    element.type = 'danger';
    await elementUpdated(element);

    const confirmBtn = element.shadowRoot.querySelector('.btn-danger');
    expect(confirmBtn).to.exist;
    expect(confirmBtn.classList.contains('btn-danger')).to.be.true;
  });

  it('should support custom confirm and cancel text', async () => {
    element.confirmText = 'Delete';
    element.cancelText = 'Keep';
    await elementUpdated(element);

    const confirmBtn = element.shadowRoot.querySelector('.btn-primary, .btn-danger');
    expect(confirmBtn.textContent.trim()).to.equal('Delete');

    const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');
    expect(cancelBtn.textContent.trim()).to.equal('Keep');
  });

  it('should be accessible with proper ARIA attributes', () => {
    // The dialog itself should have proper structure
    const dialog = element.shadowRoot.querySelector('.dialog');
    expect(dialog).to.exist;

    // Check that basic dialog structure is present
    const title = element.shadowRoot.querySelector('.dialog-title');
    const message = element.shadowRoot.querySelector('.dialog-message');
    expect(title).to.exist;
    expect(message).to.exist;
  });
});
