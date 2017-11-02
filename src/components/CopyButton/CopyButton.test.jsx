import React from 'react';
import { mount } from 'enzyme';
import CopyButton from './index';

const defaultProps = {
  label: 'I am a copy button!',
  onCopyLabel: 'Copied!',
  textToCopy: 'This is my copy text!',
};

describe('<CopyButton />', () => {
  let wrapper;
  let button;

  beforeEach(() => {
    jest.mock('copy-to-clipboard');

    wrapper = mount(
      <CopyButton
        {...defaultProps}
      />,
    );

    button = wrapper.find('button');
  });
  describe('renders', () => {
    it('label with correct text', () => {
      expect(button.matchesElement(<button>{defaultProps.label}</button>))
        .toEqual(true);
    });
    it('label with correct default onCopy text on click', () => {
      expect(button).toHaveLength(1);
      button.at(0).simulate('click');

      expect(button.matchesElement(<button>{defaultProps.onCopyLabel}</button>))
        .toEqual(true);
    });
    it('label with correct text onBlur', () => {
      button.at(0).simulate('click');
      button.at(0).simulate('blur');

      expect(button.matchesElement(<button>{defaultProps.label}</button>))
        .toEqual(true);
    });
  });
  describe('state', () => {
    it('has correct initial state', () => {
      expect(wrapper.state('wasClicked')).toEqual(false);
    });
    it('state changes on click', () => {
      button.at(0).simulate('click');
      expect(wrapper.state('wasClicked')).toEqual(true);
    });
    it('state changes onBlur', () => {
      button.at(0).simulate('click');
      button.at(0).simulate('blur');

      expect(wrapper.state('wasClicked')).toEqual(false);
    });
  });
});
