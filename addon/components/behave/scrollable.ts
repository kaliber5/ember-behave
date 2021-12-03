import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isNumber, isUndefined } from '@sniptt/guards';

export type EbScrollableDirection = 'horizontal' | 'vertical';

export interface EBScrollableArgs {
  isEnabled?: boolean | unknown;
  direction?: EbScrollableDirection | unknown; // default 'vertical'
  tolerance?: number | unknown; // default 10
}

export default class EBScrollableComponent extends Component<EBScrollableArgs> {
  @tracked isAtStart = true;
  @tracked isAtEnd = false;

  _element?: HTMLElement;

  get isEnabled(): boolean {
    // Treat null as falsy, undefined as truthy
    return this.args.isEnabled === undefined ? true : !!this.args.isEnabled;
  }

  get direction(): EbScrollableDirection {
    assert(
      '@direction must be `"horizontal"`, `"vertical"` or `undefined',
      isUndefined(this.args.direction) ||
        this.args.direction === 'horizontal' ||
        this.args.direction === 'vertical'
    );

    return this.args.direction ?? 'vertical';
  }

  get tolerance(): number {
    assert(
      '@tolerance must be a positive number of `undefined`',
      isUndefined(this.args.tolerance) ||
        (isNumber(this.args.tolerance) && this.args.tolerance >= 0)
    );

    return this.args.tolerance ?? 10;
  }

  @action
  trackScroll(): void {
    if (!this.isEnabled || !this._element) return;

    const scrollSize =
      this.direction === 'vertical' ? this._element.scrollHeight : this._element.scrollWidth;

    const scrollStart =
      this.direction === 'vertical' ? this._element.scrollTop : this._element.scrollLeft;

    const clientSize =
      this.direction === 'vertical' ? this._element.clientHeight : this._element.clientWidth;

    this.isAtStart = scrollStart <= this.tolerance;
    this.isAtEnd = scrollStart >= scrollSize - clientSize - this.tolerance;
  }

  @action
  trackSize(entry: ResizeObserverEntry): void {
    if (!this.isEnabled) return;

    assert('Expected entry.target to be an HTMLElement', entry.target instanceof HTMLElement);

    this._element = entry.target;

    this.trackScroll();
  }
}
