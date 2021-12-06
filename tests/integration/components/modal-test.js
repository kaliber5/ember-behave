import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, focus, render, settled, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | modal', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.set('onClose', sinon.spy());
  });

  module('Dialog', function () {
    test('it renders block content', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      assert
        .dom('[data-test-dialog] button')
        .hasText('Hello world!', 'Modal body has correct content.');
    });

    test('it has a11y attributes', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      assert
        .dom('[data-test-dialog]')
        .hasAttribute('role', 'dialog')
        .hasAttribute('aria-modal', 'true');
    });

    test('it is initially focused', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      // eslint-disable-next-line ember/no-settled-after-test-helper
      await settled();

      assert.dom('[data-test-dialog]').isFocused();
    });

    test('focus is reset to previously focused element', async function (assert) {
      this.set('open', false);

      await render(hbs`
        <button type="button" data-test-button>Open</button>
        {{#if this.open}}
          <Behave::Modal @onClose={{this.onClose}} as |modal|>
            <modal.Dialog data-test-dialog>
              <button type="button">Hello world!</button>
            </modal.Dialog>
          </Behave::Modal>
        {{/if}}
      `);

      await focus('[data-test-button]');

      this.set('open', true);
      await settled();

      assert.dom('[data-test-dialog]').isFocused();

      this.set('open', false);
      await settled();

      assert.dom('[data-test-button]').isFocused();
    });

    test('Pressing escape key will will call onClose action', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      await triggerKeyEvent('[data-test-dialog]', 'keydown', 27);

      assert.ok(this.onClose.calledOnce);
    });

    test('it yields modifier for aria-labelledby', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog as |dialog|>
            <h2 data-test-title {{dialog.title}}>Title</h2>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      const id = this.element.querySelector('[data-test-title]').id;
      assert.ok(id, 'Title element has ID');
      assert.dom('[data-test-dialog]').hasAttribute('aria-labelledby', id);
    });

    test('it yields modifier for aria-describedby', async function (assert) {
      await render(hbs`
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog as |dialog|>
            <p data-test-description {{dialog.description}}>bla bla</p>
            <button type="button">Hello world!</button>
          </modal.Dialog>
        </Behave::Modal>
      `);

      const id = this.element.querySelector('[data-test-description]').id;
      assert.ok(id, 'Description element has ID');
      assert.dom('[data-test-dialog]').hasAttribute('aria-describedby', id);
    });

    skip('it traps focus', function () {
      // @todo
    });
  });

  module('Overlay', function () {
    test('clicking on on overlay calls onClose action', async function (assert) {
      await render(hbs`
      <Behave::Modal @onClose={{this.onClose}} as |modal|>
        <modal.Dialog data-test-dialog>
          <button type="button" {{on "click" modal.close}}>Hello world!</button>
        </modal.Dialog>
        <modal.Overlay data-test-overlay/>
      </Behave::Modal>
    `);

      await click('[data-test-overlay]');
      assert.ok(this.onClose.calledOnce);
    });
  });

  test('it yields a close action', async function (assert) {
    await render(hbs`
      <Behave::Modal @onClose={{this.onClose}} as |modal|>
        <modal.Dialog data-test-dialog>
          <button type="button" {{on "click" modal.close}}>Hello world!</button>
        </modal.Dialog>
      </Behave::Modal>
    `);

    await click('button');
    assert.ok(this.onClose.calledOnce);
  });

  test('Renders w/ in-element', async function (assert) {
    await render(hbs`
      <Behave::Modal @onClose={{this.onClose}} as |modal|>
        <modal.Dialog data-test-dialog>
          <button type="button">Hello world!</button>
        </modal.Dialog>
      </Behave::Modal>
    `);

    assert.dom('[data-test-dialog]').exists({ count: 1 }, 'Modal exists.');
    assert.dom('#wrapper [data-test-dialog]').doesNotExist();
  });

  test('it locks body scrolling while visible', async function (assert) {
    this.set('show', false);
    await render(hbs`
      {{#if this.show}}
        <Behave::Modal @onClose={{this.onClose}} as |modal|>
          <modal.Dialog data-test-dialog>
            <button type="button" {{on "click" modal.close}}>Hello world!</button>
          </modal.Dialog>
          <modal.Overlay data-test-overlay/>
        </Behave::Modal>
      {{/if}}
      <div style="height: 2000px"></div>
    `);

    assert.dom('body', document).doesNotHaveStyle({
      overflow: 'hidden',
    });

    this.set('show', true);
    await settled();

    assert.dom('body', document).hasStyle({
      overflow: 'hidden',
    });

    this.set('show', false);
    await settled();

    assert.dom('body', document).doesNotHaveStyle({
      overflow: 'hidden',
    });
  });
});
