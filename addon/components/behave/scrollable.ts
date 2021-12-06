import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type EbScrollableDirection = 'horizontal' | 'vertical';

export interface EBScrollableArgs {
  isEnabled?: boolean | null | unknown;
  direction?: EbScrollableDirection | null | unknown; // default 'vertical'
  tolerance?: number | null | unknown; // default 10
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
      this.args.direction === undefined ||
        this.args.direction === null ||
        this.args.direction === 'horizontal' ||
        this.args.direction === 'vertical'
    );

    return this.args.direction ?? 'vertical';
  }

  get tolerance(): number {
    assert(
      '@tolerance must be a positive number of `undefined`',
      this.args.tolerance === undefined ||
        this.args.tolerance === null ||
        (typeof this.args.tolerance === 'number' && this.args.tolerance >= 0)
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
