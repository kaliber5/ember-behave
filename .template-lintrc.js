'use strict';

module.exports = {
  extends: 'recommended',
  ignore: [
    // this cannot (yet) be parsed due to https://github.com/ember-template-lint/ember-template-lint/issues/1963
    // @todo remove this when the issue has been resolved!
    'addon/components/behave/scrollable/content',
  ],
};
