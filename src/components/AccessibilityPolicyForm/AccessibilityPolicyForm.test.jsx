import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { StatusAlert } from '@edx/paragon';

import WrappedAccessibilityPolicyForm, { AccessibilityPolicyForm } from './index';
import { accessibilityActions } from '../../data/constants/actionTypes';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const mockStore = configureStore();

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

const dangerIconDescription = 'Error';

const clearStatus = (wrapper) => {
  wrapper.setProps({ accessibilityStatus: {} });
};

const getMockForZendeskSuccess = (wrapper) => {
  wrapper.setProps({
    accessibilityStatus: {
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
    },
  });
};

const getMockForZendeskRateLimit = (wrapper) => {
  wrapper.setProps({
    accessibilityStatus: {
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
    },
  });
};

let wrapper;
let store;

describe('<AccessibilityPolicyForm />', () => {
  describe('maps', () => {
    let formComponent;
    beforeEach(() => {
      store = mockStore({
        accessibility: {
          status: {},
        },
      });
      store.dispatch = jest.fn();
      wrapper = mountWithIntl(
        <Provider store={store}>
          <WrappedAccessibilityPolicyForm
            accessibilityEmail="accessibilityTest@test.com"
          />
        </Provider>,
      );

      formComponent = wrapper.find('AccessibilityPolicyForm');
    });

    it('state to props correctly', () => {
      expect(formComponent.props()).toEqual(expect.objectContaining({
        accessibilityStatus: {},
        accessibilityEmail: 'accessibilityTest@test.com',
        clearAccessibilityStatus: expect.any(Function),
        submitAccessibilityForm: expect.any(Function),
      }));
    });

    it('dispatch to clearAccessibilityStatus correctly', () => {
      const clearAccessibilityStatusAction = {
        type: 'CLEAR_ACCESSIBILITY_STATUS',
      };

      formComponent.props().clearAccessibilityStatus();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(clearAccessibilityStatusAction);
    });

    it('dispatch to submitAccessibilityForm correctly', () => {
      formComponent.props().submitAccessibilityForm(formInputs.email,
        formInputs.fullName, formInputs.message);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      // TODO: determine best way to validate async functions here
    });
  });

  describe('renders', () => {
    let formSection;
    let statusAlert;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );
      formSection = wrapper.find('section');
      statusAlert = wrapper.find(StatusAlert);
    });

    it('correct number of form fields', () => {
      expect(formSection.find('input')).toHaveLength(2);
      expect(formSection.find('textarea')).toHaveLength(1);
      expect(formSection.find('button')).toHaveLength(1);
    });

    it('hides StatusAlert on initial load', () => {
      expect(wrapper.state('isStatusAlertOpen')).toEqual(false);
      expect(statusAlert.find('div').first().prop('hidden')).toEqual(true);
    });
  });

  describe('statusAlert', () => {
    let formSection;
    let submitButton;
    let statusAlert;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );
      formSection = wrapper.find('section');
      submitButton = formSection.find('button');
      statusAlert = wrapper.find(StatusAlert);
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
      submitButton.simulate('click');
      statusAlert = wrapper.find(StatusAlert);
      const statusAlertType = statusAlert.prop('alertType');
      expect(wrapper.state('isStatusAlertOpen')).toEqual(true);
      expect(statusAlertType).toEqual('success');
      expect(statusAlert.find('div').first().hasClass('alert-success')).toEqual(true);
      expect(statusAlert.find('div').first().text()).toContain('×Thank you for contacting edX!Thank you for your feedback regarding the accessibility of Studio. We typically respond within one business day (Monday to Friday, 1:00 PM UTC to 9:00 PM UTC).');
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
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      const statusAlertType = statusAlert.prop('alertType');
      expect(wrapper.state('isStatusAlertOpen')).toEqual(true);
      expect(statusAlertType).toEqual('danger');
      expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
      expect(statusAlert.text()).toContain(`We are currently experiencing high volume. Try again later today or send an email message to ${wrapper.props().accessibilityEmail}.`);
    });
  });

  describe('input validation', () => {
    let formSection;
    let emailInput;
    let fullNameInput;
    let messageInput;
    let submitButton;
    let statusAlert;
    let testValue;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );

      formSection = wrapper.find('section');
      emailInput = wrapper.find('input#email');
      fullNameInput = wrapper.find('input#fullName');
      messageInput = wrapper.find('textarea#message');
      submitButton = formSection.find('button');
      statusAlert = wrapper.find(StatusAlert);
      testValue = 'testValue';
    });

    it('updates state when email changes', () => {
      emailInput.simulate('change', { target: { value: testValue } });
      expect(wrapper.state('submitterEmail')).toEqual(testValue);

      fullNameInput.simulate('change', { target: { value: testValue } });
      expect(wrapper.state('submitterFullName')).toEqual(testValue);

      messageInput.simulate('change', { target: { value: testValue } });
      expect(wrapper.state('submitterMessage')).toEqual(testValue);
    });

    it('adds validation checking on each input field', () => {
      emailInput.simulate('blur');
      const emailError = wrapper.find('div#error-email');
      expect(emailError.exists()).toEqual(true);
      expect(emailError.text()).toEqual(dangerIconDescription + validationMessages.email);

      fullNameInput.simulate('blur');
      const fullNameError = wrapper.find('div#error-fullName');
      expect(fullNameError.exists()).toEqual(true);
      expect(fullNameError.text()).toEqual(dangerIconDescription + validationMessages.fullName);

      messageInput.simulate('blur');
      const messageError = wrapper.find('div#error-message');
      expect(messageError.exists()).toEqual(true);
      expect(messageError.text()).toEqual(dangerIconDescription + validationMessages.message);
    });

    it('shows validation errors when trying to submit with all empty fields', () => {
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(wrapper.state('isStatusAlertOpen')).toEqual(true);
      expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);
      expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}${validationMessages.fullName}${validationMessages.message}`);
    });

    it('shows validation errors when only email is empty', () => {
      fullNameInput.simulate('change', { target: { value: testValue } });
      messageInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}`);
    });

    it('shows validation errors when only email is invalid but not empty', () => {
      emailInput.simulate('change', { target: { value: testValue } });
      fullNameInput.simulate('change', { target: { value: testValue } });
      messageInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}`);
    });

    it('shows validation errors when only fullName is empty', () => {
      emailInput.simulate('change', { target: { value: `${testValue}@test.com` } });
      messageInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.fullName}`);
    });

    it('shows validation errors when only message is empty', () => {
      emailInput.simulate('change', { target: { value: `${testValue}@test.com` } });
      fullNameInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.message}`);
    });

    it('shows validation errors for invalid fullName and message', () => {
      emailInput.simulate('change', { target: { value: `${testValue}@test.com` } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.fullName}${validationMessages.message}`);
    });

    it('shows validation errors for invalid email and message', () => {
      fullNameInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}${validationMessages.message}`);
    });

    it('shows validation errors for invalid email and fullName', () => {
      messageInput.simulate('change', { target: { value: testValue } });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      expect(statusAlert.text()).toContain(`Make sure to fill in all fields.${validationMessages.email}${validationMessages.fullName}`);
    });
  });

  describe('form clearing', () => {
    let formSection;
    let emailInput;
    let fullNameInput;
    let messageInput;
    let submitButton;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );
      formSection = wrapper.find('section');
      emailInput = wrapper.find('input#email');
      fullNameInput = wrapper.find('input#fullName');
      messageInput = wrapper.find('textarea#message');
      submitButton = formSection.find('button');
    });
    it('clears inputs on successful submit', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskSuccess(wrapper),
      });
      wrapper.setState({
        submitterEmail: formInputs.email,
        submitterFullName: formInputs.fullName,
        submitterMessage: formInputs.message,
      });
      submitButton.simulate('click');

      expect(emailInput.instance().value).toEqual('');
      expect(fullNameInput.instance().value).toEqual('');
      expect(messageInput.instance().value).toEqual('');
    });

    it('does not clear inputs on failed submit', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskRateLimit(wrapper),
      });
      wrapper.setState({
        submitterEmail: formInputs.email,
        submitterFullName: formInputs.fullName,
        submitterMessage: formInputs.message,
      });
      submitButton.simulate('click');

      expect(emailInput.instance().value).toEqual(formInputs.email);
      expect(fullNameInput.instance().value).toEqual(formInputs.fullName);
      expect(messageInput.instance().value).toEqual(formInputs.message);
    });

    it('clears accessibilityStatus as expected', () => {
      wrapper.setProps({
        accessibilityStatus: {
          type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
        },
        clearAccessibilityStatus: () => clearStatus(wrapper),
      });
      submitButton.simulate('click');
      expect(wrapper.props().accessibilityStatus).toEqual({});
    });
  });

  describe('focuses', () => {
    let formSection;
    let emailInput;
    let submitButton;
    let statusAlert;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AccessibilityPolicyForm
          {...defaultProps}
        />,
      );

      formSection = wrapper.find('section');
      submitButton = formSection.find('button');
      statusAlert = wrapper.find(StatusAlert);
      emailInput = wrapper.find('input#email');
    });

    it('focuses correctly on StatusAlert open', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskRateLimit(wrapper),
      });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      const statusAlertDismissButton = statusAlert.find('button');
      expect(wrapper.state('isStatusAlertOpen')).toEqual(true);
      expect(statusAlertDismissButton.html()).toEqual(document.activeElement.outerHTML);
    });

    it('focuses correctly on StatusAlert close', () => {
      wrapper.setProps({
        clearAccessibilityStatus: () => clearStatus(wrapper),
        submitAccessibilityForm: () => getMockForZendeskRateLimit(wrapper),
      });
      submitButton.simulate('click');

      statusAlert = wrapper.find(StatusAlert);
      const statusAlertDismissButton = statusAlert.find('button');
      statusAlertDismissButton.simulate('click');
      expect(wrapper.state('isStatusAlertOpen')).toEqual(false);
      emailInput = wrapper.find('input#email');
      expect(emailInput.html()).toEqual(document.activeElement.outerHTML);
    });
  });
});
