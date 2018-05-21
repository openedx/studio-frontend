// The extension of test files are `.test.jsx` so that Jest knows where to find the tests in our
// repo.  This file contains all of the unit tests for our HelloWorld component.
import React from 'react';
import { Button, Modal } from '@edx/paragon';
import { mount } from 'enzyme';

import HelloWorld from './index';
import messages from './displayMessages';
// This is a wrapper around Enzyme's mount() that makes it work with our internationalized
// components
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

// This utility can mock `document.querySelector` during tests. We need this because Enzyme does
// not operate on a real DOM so it does not support the function, which is used in the Paragon
// Modal.
import mockQuerySelector from '../../utils/mockQuerySelector';

let wrapper;

// The first describe block wraps up all the tests in this file with the title "<HelloWorld />"
describe('<HelloWorld />', () => {
  // This describe block wraps tests that just deal with the basic rendering of our component
  describe('renders', () => {
    // The beforeEach() function is called before every it() function in this describe() block
    beforeEach(() => {
      mockQuerySelector.init();
      // Here we "mount" our component in Enzyme which simulates a render
      wrapper = mountWithIntl(<HelloWorld />);
    });

    afterEach(() => {
      // Reset `document.querySelector` back to normal.
      mockQuerySelector.reset();
    });

    // This is our first actual test function. Test if the display message is inside the rendered
    // output.
    it('displays hello world text', () => {
      expect(wrapper.text()).toEqual(messages.helloWorld.defaultMessage);
    });

    it('clicking button opens modal', () => {
      const button = wrapper.find(Button).find('#open-modal-btn').at(0);
      button.simulate('click');

      const modal = wrapper.find(Modal);
      expect(modal.prop('open')).toEqual(true);
      expect(wrapper.state('modalOpen')).toEqual(true);
    });

    it('clicking modal close button closes the modal', () => {
      wrapper.setState({ modalOpen: true });
      let modal = wrapper.find(Modal);
      const xButton = wrapper.find(Button).at(0);
      xButton.simulate('click');

      modal = wrapper.find(Modal);
      expect(modal.prop('open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
  });
});
