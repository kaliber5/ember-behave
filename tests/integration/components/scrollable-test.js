import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { settled } from '@ember/test-helpers';

module('Integration | Component | scrollable', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields all blocks', async function (assert) {
    await render(hbs`
      <Behave::Scrollable>
        <:default>
          <div class="MyScrollable-Content"></div>
        </:default>

        <:start>
          <div class="MyScrollable-Start"></div>
        </:start>

        <:end>
          <div class="MyScrollable-End"></div>
        </:end>
      </Behave::Scrollable>
    `);

    assert
      .dom(
        this.element.querySelector(
          '.Behave-Scrollable .Behave-Scrollable-Content .MyScrollable-Content'
        )
      )
      .exists();

    assert
      .dom(
        this.element.querySelector(
          '.Behave-Scrollable .Behave-Scrollable-Start .MyScrollable-Start'
        )
      )
      .exists();

    assert
      .dom(
        this.element.querySelector('.Behave-Scrollable .Behave-Scrollable-End .MyScrollable-End')
      )
      .exists();
  });

  module('vertical', function () {
    test('it applies classes, default settings', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="height: 500px; width: 100px; background: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).hasClass('-enabled');
      assert.dom(scrollable).hasClass('-vertical');
      assert.dom(scrollable).doesNotHaveClass('-horizontal');
      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).hasClass('-start');
    });

    test('it does not apply enabled class when disabled', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @isEnabled={{false}}
          class="MyScrollable"
        >
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).doesNotHaveClass('-enabled');
    });

    test('it applies both start and end classes when scrollable height is taller than content', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 200px;"
        >
          <p>1</p>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).hasClass('-start');
      assert.dom(scrollable).hasClass('-end');
    });

    test('it removes the start class when scrolling to the middle', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="height: 500px; width: 100px; background: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 50);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it removes the start class when scrolling slightly beyond default tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="height: 500px; width: 100px; background: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 11);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it removes the start class when scrolling beyond custom tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @tolerance={{100}}
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="height: 500px; width: 100px; background: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 101);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it applies the end class when scrolling to the end', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="height: 500px; width: 100px; background: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 5000);
      await settled();

      assert.dom(scrollable).hasClass('-enabled');
      assert.dom(scrollable).hasClass('-vertical');
      assert.dom(scrollable).hasClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });
  });

  module('horizontal', function () {
    test('it applies classes, default settings', async function (assert) {
      await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          @direction="horizontal"
          style="width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).hasClass('-enabled');
      assert.dom(scrollable).doesNotHaveClass('-vertical');
      assert.dom(scrollable).hasClass('-horizontal');
      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).hasClass('-start');
    });

    test('it does not apply enabled class when disabled', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @isEnabled={{false}}
          @direction="horizontal"
          class="MyScrollable"
        >
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).doesNotHaveClass('-enabled');
    });

    test('it applies both start and end classes when scrollable height is taller than content', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 200px;"
        >
          <p>1</p>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).hasClass('-start');
      assert.dom(scrollable).hasClass('-end');
    });

    test('it removes the start class when scrolling to the middle', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(50, 0);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it removes the start class when scrolling to the middle with custom tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          @tolerance={{70}}
          class="MyScrollable"
          style="height: 100px; width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(100, 0);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it does not removes the start class when scrolling within default tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(5, 0);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).hasClass('-start');
    });

    test('it does not removes the start class when scrolling within custom tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          @tolerance={{100}}
          class="MyScrollable"
          style="height: 100px; width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(50, 0);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).hasClass('-start');
    });

    test('it applies the end class when scrolling to the end', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(5000, 0);
      await settled();

      assert.dom(scrollable).hasClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it applies the end class when scrolling to the end with custom tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          @tolerance={{70}}
          class="MyScrollable"
          style="height: 100px; width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(350, 0);
      await settled();

      assert.dom(scrollable).hasClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it does not apply the end class when scrolling to the end outside default tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 100px; width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(350, 0);
      await settled();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it applies the end class when scrolling to the end within default tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          @direction="horizontal"
          class="MyScrollable"
          style="height: 100px; width: 100px;"
        >
          <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(395, 0);
      await settled();

      assert.dom(scrollable).hasClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });
  });
});
