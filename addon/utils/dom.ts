/*
 * Implement some helpers methods for interacting with the DOM,
 * be it Fastboot's SimpleDOM or the browser's version.
 *
 * Credit to https://github.com/yapplabs/ember-wormhole, from where this has been shamelessly stolen.
 */

import { getOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { getOwnConfig } from '@embroider/macros';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import requirejs from 'require';
import { assert } from '@ember/debug';
import { EmbroiderOwnConfig } from 'ember-behave/types';

declare global {
  const FastBoot: unknown;
}

function childNodesOfElement(element: HTMLElement): HTMLElement[] {
  const children: HTMLElement[] = [];
  let child = element.firstChild;
  while (child) {
    children.push(child as HTMLElement);
    child = child.nextSibling;
  }
  return children;
}

export function findElementById(
  doc: typeof document,
  id: string
): HTMLElement | null {
  if (doc.getElementById) {
    return doc.getElementById(id);
  }

  let nodes = childNodesOfElement(doc as unknown as HTMLElement);
  let node;

  while (nodes.length) {
    node = nodes.shift()!;

    if (node.getAttribute('id') === id) {
      return node;
    }
    nodes = childNodesOfElement(node).concat(nodes);
  }

  return null;
}

// Private Ember API usage. Get the dom implementation used by the current
// renderer, be it native browser DOM or Fastboot SimpleDOM
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getDOM(context: any): typeof document {
  let { renderer } = context;
  if (!renderer?._dom) {
    // pre glimmer2
    const container = getOwner ? getOwner(context) : context.container;
    const documentService = container.lookup('service:-document');

    if (documentService) {
      return documentService;
    }

    renderer = container.lookup('renderer:-dom');
  }

  if (renderer._dom && renderer._dom.document) {
    return renderer._dom.document;
  } else {
    throw new Error('Could not get DOM');
  }
}

export function getDestinationElement(context: unknown): HTMLElement | null {
  const dom = getDOM(context);
  const id = getOwnConfig<EmbroiderOwnConfig>().portalTargetId;
  let destinationElement = id
    ? findElementById(dom, id) || findElemementByIdInShadowDom(context, id)
    : null;

  if (DEBUG && !destinationElement) {
    const config = getOwner(context).resolveRegistration('config:environment');
    if (config.environment === 'test' && typeof FastBoot === 'undefined') {
      if (requirejs.has('@ember/test-helpers/dom/get-root-element')) {
        try {
          destinationElement = requirejs(
            '@ember/test-helpers/dom/get-root-element'
          ).default();
        } catch (ex) {
          // no op
        }
      }
      if (!destinationElement) {
        destinationElement = document.querySelector('#ember-testing');
      }
    }
  }

  if (!destinationElement) {
    destinationElement = document.body;
  }

  assert(
    `No portal target element found for component ${context}.`,
    destinationElement
  );

  return destinationElement;
}

export function findElemementByIdInShadowDom(
  context: unknown,
  id: string
): HTMLElement | null {
  const owner = getOwner(context);
  return (
    owner.rootElement.querySelector &&
    owner.rootElement.querySelector(`[id="${id}"]`)
  );
}
