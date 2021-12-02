import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { EQInfo } from 'ember-element-query';
import { isNumber, isUndefined } from '@sniptt/guards';

export type EbScrollableDirection = 'horizontal' | 'vertical';

export interface EBScrollableArgs {
  isEnabled?: boolean | unknown;
  direction?: EbScrollableDirection | unknown; // default 'vertical'
  tolerance?: number | unknown; // default 10
}

export default class EBScrollableComponent extends Component<EBScrollableArgs> {
  @tracked height?: number;
  @tracked isScrollable = false;
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
    console.log('TrackScroll 1');
    if (!this.isEnabled || !this._element) return;
    console.log('TrackScroll 2');

    const scrollSize =
      this.direction === 'vertical' ? this._element.scrollHeight : this._element.scrollWidth;

    const scrollStart =
      this.direction === 'vertical' ? this._element.scrollTop : this._element.scrollLeft;

    const clientSize =
      this.direction === 'vertical' ? this._element.clientHeight : this._element.clientWidth;

    this.isScrollable = scrollSize > clientSize;
    this.isAtStart = scrollStart <= this.tolerance;
    this.isAtEnd = scrollStart >= scrollSize - clientSize - this.tolerance;

    console.log({
      scrollSize,
      scrollStart,
      clientSize,
      atEnd: scrollSize - clientSize - this.tolerance,
      tolerance: this.tolerance,
    });
  }

  @action
  trackSize(eqInfo: EQInfo): void {
    if (!this.isEnabled) return;

    this.height = eqInfo.height;
    this._element = eqInfo.element;
    this.trackScroll();
  }
}
