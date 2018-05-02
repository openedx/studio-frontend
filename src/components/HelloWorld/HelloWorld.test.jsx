// The extension of test files are `.test.jsx` so that Jest knows where to find the tests in our
// repo.  This file contains all of the unit tests for our HelloWorld component.
import React from 'react';
import { mount } from 'enzyme';

import HelloWorld from './index';

let wrapper;

// The first describe block wraps up all the tests in this file with the title "<HelloWorld />"
describe('<HelloWorld />', () => {
  // This describe block wraps tests that just deal with the basic rendering of our component
  describe('renders', () => {
    // The beforeEach() function is called before every it() function in this describe() block
    beforeEach(() => {
      // Here we "mount" our component in Enzyme which simulates a render
      wrapper = mount(<HelloWorld />);
    });
    // This is our first actual test function. Test if the display message is inside the rendered
    // output.
    it('displays hello world text', () => {
      expect(wrapper.text()).toEqual('Hello, world!');
    });
  });
});
