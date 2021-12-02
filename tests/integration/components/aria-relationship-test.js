import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | aria-relationship', function (hooks) {
  setupRenderingTest(hooks);

  test('it applies ARIA attribute to target', async function (assert) {
    this.set('show', true);

    await render(hbs`
      <Behave::AriaRelationship as |target reference|>
        <div>
          <label data-test-target {{target}}>Label</label>
          {{#if this.show}}
            <input type="text" data-test-reference {{reference "for"}}/>
          {{/if}}
        </div>
      </Behave::AriaRelationship>
    `);

    const id = this.element.querySelector('[data-test-reference]').id;
    assert.ok(id, 'element has been assigned an ID');
    assert
      .dom('[data-test-target]')
      .hasAttribute('for', id, 'Target has been assigned attribute with same ID');

    this.set('show', false);
    await settled();

    assert.dom('[data-test-target]').doesNotHaveAttribute('for', 'Attribute gets cleaned up');
  });

  test('works with multiple references', async function (assert) {
    this.set('show', true);

    await render(hbs`
      <Behave::AriaRelationship as |target reference|>
        <div>
          <div data-test-target {{target}}>Label</div>
          {{#if this.show}}
            <div data-test-label {{reference "aria-labelledby"}}/>
            <div data-test-description {{reference "aria-describedby"}}/>
          {{/if}}
        </div>
      </Behave::AriaRelationship>
    `);

    const labelId = this.element.querySelector('[data-test-label]').id;
    const descriptionId = this.element.querySelector('[data-test-description]').id;
    assert.ok(labelId, 'element has been assigned an ID');
    assert.ok(descriptionId, 'element has been assigned an ID');
    assert
      .dom('[data-test-target]')
      .hasAttribute('aria-labelledby', labelId, 'Target has been assigned attribute with same ID');
    assert
      .dom('[data-test-target]')
      .hasAttribute(
        'aria-describedby',
        descriptionId,
        'Target has been assigned attribute with same ID'
      );

    this.set('show', false);
    await settled();

    assert
      .dom('[data-test-target]')
      .doesNotHaveAttribute('aria-labelledby', 'Attribute gets cleaned up');
    assert
      .dom('[data-test-target]')
      .doesNotHaveAttribute('aria-describedby', 'Attribute gets cleaned up');
  });

  test('it works also in reverse order', async function (assert) {
    this.set('show', true);

    await render(hbs`
      <Behave::AriaRelationship as |target reference|>
        <div>
          {{#if this.show}}
            <input type="text" data-test-reference {{reference "for"}}/>
          {{/if}}
          <label data-test-target {{target}}>Label</label>
        </div>
      </Behave::AriaRelationship>
    `);

    const id = this.element.querySelector('[data-test-reference]').id;
    assert.ok(id, 'element has been assigned an ID');
    assert
      .dom('[data-test-target]')
      .hasAttribute('for', id, 'Target has been assigned attribute with same ID');

    this.set('show', false);
    await settled();

    assert.dom('[data-test-target]').doesNotHaveAttribute('for', 'Attribute gets cleaned up');
  });
  test('adding target later works', async function (assert) {
    this.set('show', false);

    await render(hbs`
      <Behave::AriaRelationship as |target reference|>
        <div>
          <input type="text" data-test-reference {{reference "for"}}/>
          {{#if this.show}}
            <label data-test-target {{target}}>Label</label>
          {{/if}}
        </div>
      </Behave::AriaRelationship>
    `);

    this.set('show', true);
    await settled();

    const id = this.element.querySelector('[data-test-reference]').id;
    assert.ok(id, 'element has been assigned an ID');
    assert
      .dom('[data-test-target]')
      .hasAttribute('for', id, 'Target has been assigned attribute with same ID');

    this.set('show', false);
    await settled();
  });
});
