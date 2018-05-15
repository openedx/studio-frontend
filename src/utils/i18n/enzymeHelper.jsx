/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 *
 * copied from https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl#enzyme
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages: {} }, {});
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node, { context, ...otherOptions } = {}) {
  return shallow(
    nodeWithIntlProp(node),
    {
      ...otherOptions,
      context: Object.assign({}, context, { intl }),
    },
  );
}

export function mountWithIntl(node, { context, childContextTypes, ...otherOptions } = {}) {
  return mount(
    nodeWithIntlProp(node),
    {
      ...otherOptions,
      context: Object.assign({}, context, { intl }),
      childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes),
    },
  );
}
