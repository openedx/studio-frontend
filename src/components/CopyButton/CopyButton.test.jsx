import { Button } from '@edx/paragon';
import Enzyme from 'enzyme';
import React from 'react';
import CopyButton from './index';

const { shallow } = Enzyme;

const defaultProps = {
  label: 'I am a copy button!',
  onCopyLabel: 'Copied!',
  textToCopy: 'This is my copy text!',
};

const getButton = wrapper => wrapper.find(Button);

describe('<CopyButton />', () => {
  let wrapper;
  let button;

  beforeEach(() => {
    jest.mock('copy-to-clipboard');

    wrapper = shallow(
      <CopyButton
        {...defaultProps}
      />,
    );

    wrapper.instance().buttonRef = {
      focus: jest.fn(),
    };

    button = getButton(wrapper);
  });
  describe('renders', () => {
    it('label with correct text', () => {
      expect(button.prop('label')).toEqual(defaultProps.label);
    });

    it('label with correct default onCopy text on click', () => {
      expect(button).toHaveLength(1);
      button.simulate('click');

      wrapper.update();
      button = getButton(wrapper);

      expect(button.prop('label')).toEqual(defaultProps.onCopyLabel);
    });
    it('label with correct text onBlur', () => {
      button.simulate('click');
      button.simulate('blur');

      wrapper.update();
      button = getButton(wrapper);

      expect(button.prop('label')).toEqual(defaultProps.label);
    });
  });

  describe('state', () => {
    it('has correct initial state', () => {
      expect(wrapper.state('wasClicked')).toEqual(false);
    });

    it('state changes on click', () => {
      button.simulate('click');

      expect(wrapper.state('wasClicked')).toEqual(true);
    });

    it('state changes onBlur', () => {
      button.simulate('click');
      button.simulate('blur');

      expect(wrapper.state('wasClicked')).toEqual(false);
    });
  });
});
