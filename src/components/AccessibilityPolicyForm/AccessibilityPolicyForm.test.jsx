import React from 'react';
import Enzyme from 'enzyme';
import { AccessibilityPolicyForm } from './index';
import { accessibilityActions } from '../../data/constants/actionTypes';

const mount = Enzyme.mount;

const defaultProps = {
  accessibilityStatus: {},
  accessibilityEmail: 'accessibilityTest@test.com',
  clearAccessibilityStatus: () => {},
  submitAccessibilityForm: () => {},
};

const formInputs = {
  email: 'test@test.com',
  fullName: 'test name',
  message: 'feedback message',
};

const validationMessages = {
  email: 'Enter a valid email address.',
  fullName: 'Enter a name.',
  message: 'Enter a message.',
};

const clearStatus = (wrapper) => {
  wrapper.setProps({ accessibilityStatus: {} });
};

const getMockForZendeskSuccess = (wrapper) => {
  wrapper.setProps({
    accessibilityStatus: {
      type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
    },
  });
};

const getMockForZendeskRateLimit = (wrapper) => {
  wrapper.setProps({
    accessibilityStatus: {
      type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
    },
  });
};

let wrapper;

describe('<AccessibilityPolicyForm />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );
    });

    it('correct number of form fields', () => {
      const formSection = wrapper.find('section');
      expect(formSection.find('input')).toHaveLength(2);
      expect(formSection.find('textarea')).toHaveLength(1);
      expect(formSection.find('button')).toHaveLength(1);
    });

    it('hides StatusAlert on initial load', () => {
      const statusAlert = wrapper.find('StatusAlert');
      expect(statusAlert.find('div').first().prop('hidden')).toEqual(true);
    });

    it('adds validation checking on each input field', () => {
      const emailInput = wrapper.find('input#email');
      emailInput.simulate('blur');

      const emailError = wrapper.find('div#error-email');
      expect(emailError.exists()).toEqual(true);
      expect(emailError.text()).toEqual(validationMessages.email);

      const fullNameInput = wrapper.find('input#fullName');
      fullNameInput.simulate('blur');

      const fullNameError = wrapper.find('div#error-fullName');
      expect(fullNameError.exists()).toEqual(true);
      expect(fullNameError.text()).toEqual(validationMessages.fullName);

      const messageInput = wrapper.find('textarea#message');
      messageInput.simulate('blur');

      const messageError = wrapper.find('div#error-message');
      expect(messageError.exists()).toEqual(true);
      expect(messageError.text()).toEqual(validationMessages.message);
    });

    it('shows validation errors when trying to submit with empty fields', () => {
      const formSection = wrapper.find('section');
      const submitButton = formSection.find('button');
      submitButton.simulate('click');

      const statusAlert = wrapper.find('StatusAlert');
      expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);
      expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}${validationMessages.fullName}${validationMessages.message}`);
    });

    it('shows correct success message', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskSuccess(wrapper),
      });
      wrapper.setState({
        submitterEmail: 'email@email.com',
        submitterFullName: 'test name',
        submitterMessage: 'feedback message',
      });

      const formSection = wrapper.find('section');
      const submitButton = formSection.find('button');
      submitButton.simulate('click');

      const statusAlert = wrapper.find('StatusAlert');
      const statusAlertType = statusAlert.prop('alertType');
      expect(statusAlertType).toEqual('success');
      expect(statusAlert.find('div').first().hasClass('alert-success')).toEqual(true);
      expect(statusAlert.text()).toContain('Thank you for contacting edX!Thank you for your feedback regarding the accessibility of Studio. We typically respond within one business day (Monday to Friday, 13:00 to 21:00 UTC).');
    });

    it('shows correct rate limiting message', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskRateLimit(wrapper),
      });
      wrapper.setState({
        submitterEmail: formInputs.email,
        submitterFullName: formInputs.fullName,
        submitterMessage: formInputs.message,
      });

      const formSection = wrapper.find('section');
      const submitButton = formSection.find('button');
      submitButton.simulate('click');

      const statusAlert = wrapper.find('StatusAlert');
      const statusAlertType = statusAlert.prop('alertType');
      expect(statusAlertType).toEqual('danger');
      expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
      expect(statusAlert.text()).toContain(`We are currently experiencing high volume. Try again later today or send an email message to ${wrapper.props().accessibilityEmail}`);
    });

    it('clears inputs on valid submit', () => {
      const formSection = wrapper.find('section');
      const emailInput = wrapper.find('input#email');
      const fullNameInput = wrapper.find('input#fullName');
      const messageInput = wrapper.find('textarea#message');

      wrapper.setState({
        submitterEmail: formInputs.email,
        submitterFullName: formInputs.fullName,
        submitterMessage: formInputs.message,
      });

      const submitButton = formSection.find('button');
      submitButton.simulate('click');

      expect(emailInput.instance().value).toEqual('');
      expect(fullNameInput.instance().value).toEqual('');
      expect(messageInput.instance().value).toEqual('');
    });

    it('clears accessibilityStatus as expected', () => {
      wrapper.setProps({
        accessibilityStatus: {
          type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
        },
        clearAccessibilityStatus: () => clearStatus(wrapper),
      });

      const formSection = wrapper.find('section');
      const submitButton = formSection.find('button');
      submitButton.simulate('click');
      expect(wrapper.props().accessibilityStatus).toEqual({});
    });
  });
});
