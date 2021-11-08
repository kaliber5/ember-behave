import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';

export default class AriaRelationshipComponent extends Component {
  private targetElement?: Element;
  private referenceQueue = new Map<Element, string>();

  target = modifier((element) => {
    this.targetElement = element;
    this.processQueue();

    return (): void => {
      this.targetElement = undefined;
    };
  });

  reference = modifier((element, [attribute]: [string | unknown]) => {
    assert(
      'Expecting the name of the attribute as the first parameter to {{reference}}',
      typeof attribute === 'string'
    );

    this.addAttribute(element, attribute);

    return (): void => {
      this.removeAttribute(element, attribute);
    };
  });

  private addAttribute(referenceElement: Element, attribute: string): void {
    let id = referenceElement.getAttribute('id');
    if (!id) {
      id = guidFor(referenceElement);
      referenceElement.setAttribute('id', id);
    }

    if (this.targetElement) {
      this.addReference(referenceElement, attribute);
    } else {
      this.referenceQueue.set(referenceElement, attribute);
    }
  }

  private removeAttribute(_referenceElement: Element, attribute: string): void {
    if (this.targetElement) {
      this.targetElement.removeAttribute(attribute);
    }
  }

  private addReference(referenceElement: Element, attribute: string): void {
    assert('targetElement must exist', this.targetElement);
    const id = referenceElement.getAttribute('id');
    assert('referenceElement must have an ID', id);

    this.targetElement.setAttribute(attribute, id);
  }

  private processQueue(): void {
    this.referenceQueue.forEach((attribute, element) => {
      this.addReference(element, attribute);
    });
    this.referenceQueue.clear();
  }
}
