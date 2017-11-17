import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CopyButton from './index';

Enzyme.configure({ adapter: new Adapter() });

const { mount } = Enzyme;

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
      button = wrapper.find('button');

      expect(button.matchesElement(<button>{defaultProps.onCopyLabel}</button>))
        .toEqual(true);
    });
    it('label with correct text onBlur', () => {
      button.at(0).simulate('click');
      button = wrapper.find('button');
      button.at(0).simulate('blur');
      button = wrapper.find('button');

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
      button = wrapper.find('button');

      expect(wrapper.state('wasClicked')).toEqual(true);
    });
    it('state changes onBlur', () => {
      button.at(0).simulate('click');
      button = wrapper.find('button');
      button.at(0).simulate('blur');
      button = wrapper.find('button');

      expect(wrapper.state('wasClicked')).toEqual(false);
    });
  });
});
