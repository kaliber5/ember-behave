import Component from '@glimmer/component';
import { getDestinationElement } from 'ember-behave/utils/dom';

interface ModalComponentArgs {
  onClose?: () => void;
  tagName?: string;
}

export default class ModalComponent extends Component<ModalComponentArgs> {
  destinationElement = getDestinationElement(this);
}
