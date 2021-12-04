import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { settled } from '@ember/test-helpers';

async function pause(durationMs = 100) {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
  return settled();
}

module('Integration | Component | scrollable', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields all blocks', async function (assert) {
    await render(hbs`
      <Behave::Scrollable as |scrollable|>
        <scrollable.content>
          <div class="MyScrollable-Content"></div>
        </scrollable.content>

        <div class="MyScrollable-Start"></div>

        <div class="MyScrollable-End"></div>
      </Behave::Scrollable>
    `);
    await pause();

    assert
      .dom(
        this.element.querySelector(
          '.Behave-Scrollable > .Behave-Scrollable-Content > .MyScrollable-Content'
        )
      )
      .exists();

    assert.dom(this.element.querySelector('.Behave-Scrollable > .MyScrollable-Start')).exists();

    assert.dom(this.element.querySelector('.Behave-Scrollable > .MyScrollable-End')).exists();
  });

  module('vertical', function () {
    test('it applies classes, default settings', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
          as |scrollable|
        >
          <scrollable.content>
            <div style="height: 500px; width: 100px; background: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);
      await pause();

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
      await pause();

      const scrollable = this.element.querySelector('.MyScrollable');

      assert.dom(scrollable).doesNotHaveClass('-enabled');
    });

    test('it applies both start and end classes when scrollable height is taller than content', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 200px;"
          as |scrollable|
        >
          <scrollable.content>
            <p>1</p>
          </scrollable.content>
        </Behave::Scrollable>
      `);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="height: 500px; width: 100px; background: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);
      await pause();

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 50);
      await pause();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it removes the start class when scrolling slightly beyond default tolerance', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
          as |scrollable|
        >
          <scrollable.content>
            <div style="height: 500px; width: 100px; background: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 11);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="height: 500px; width: 100px; background: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 101);
      await pause();

      assert.dom(scrollable).doesNotHaveClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });

    test('it applies the end class when scrolling to the end', async function (assert) {
      await render(hbs`
        {{!-- template-lint-disable no-inline-styles --}}
        <Behave::Scrollable
          class="MyScrollable"
          style="height: 100px;"
          as |scrollable|
        >
          <scrollable.content>
            <div style="height: 500px; width: 100px; background: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(0, 5000);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
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
          as |scrollable|
        >
          <scrollable.content>
            <p>1</p>
          </scrollable.content>
        </Behave::Scrollable>
      `);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(50, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(100, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(5, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(50, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(5000, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(350, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(350, 0);
      await pause();

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
          as |scrollable|
        >
          <scrollable.content>
            <div style="width: 500px; height: 50px; background-color: deeppink;"></div>
          </scrollable.content>
        </Behave::Scrollable>
      `);

      const scrollable = this.element.querySelector('.MyScrollable');
      const scrollableContent = this.element.querySelector('.Behave-Scrollable-Content');

      scrollableContent.scrollTo(395, 0);
      await pause();

      assert.dom(scrollable).hasClass('-end');
      assert.dom(scrollable).doesNotHaveClass('-start');
    });
  });
});
