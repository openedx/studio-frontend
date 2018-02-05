import { defineMessages } from 'react-intl';

const messages = defineMessages({
  accessibilityPolicyFormEmailLabel: {
    id: 'accessibilityPolicyFormEmailLabel',
    defaultMessage: 'Email Address',
    description: 'Label for the email form field',
  },
  accessibilityPolicyFormError: {
    id: 'accessibilityPolicyFormError',
    defaultMessage: 'Error',
    description: 'Error message for screen-reader text',
  },
  accessibilityPolicyFormErrorHighVolume: {
    id: 'accessibilityPolicyFormErrorHighVolume',
    defaultMessage: 'We are currently experiencing high volume. Try again later today or send an email message to {emailLink}.',
    description: 'Error message when site is experiencing high volume that will include an email link',
  },
  accessibilityPolicyFormErrorMissingFields: {
    id: 'accessibilityPolicyFormErrorMissingFields',
    defaultMessage: 'Make sure to fill in all fields.',
    description: 'Error message to instruct user to fill in all fields',
  },
  accessibilityPolicyFormFieldsRequired: {
    id: 'accessibilityPolicyFormFieldsRequired',
    defaultMessage: 'All fields are required.',
    description: 'Instructions at the top of the form telling the user to fill in all fields',
  },
  accessibilityPolicyFormHeader: {
    id: 'accessibilityPolicyFormHeader',
    defaultMessage: 'Studio Accessibility Feedback',
    description: 'The heading for the form',
  },
  accessibilityPolicyFormMessageLabel: {
    id: 'accessibilityPolicyFormMessageLabel',
    defaultMessage: 'Message',
    description: 'Label for the message form field',
  },
  accessibilityPolicyFormNameLabel: {
    id: 'accessibilityPolicyFormNameLabel',
    defaultMessage: 'Name',
    description: 'Label for the name form field',
  },
  accessibilityPolicyFormSubmitAria: {
    id: 'accessibilityPolicyFormSubmitAria',
    defaultMessage: 'Submit Accessibility Feedback Form',
    description: 'Detailed aria-label for the submit button',
  },
  accessibilityPolicyFormSubmitLabel: {
    id: 'accessibilityPolicyFormSubmitLabel',
    defaultMessage: 'Submit',
    description: 'General label for the submit button',
  },
  accessibilityPolicyFormSubmittingFeedbackLabel: {
    id: 'accessibilityPolicyFormSubmittingFeedbackLabel',
    defaultMessage: 'Submitting feedback',
    description: 'Loading message while form feedback is being submitted',
  },
  accessibilityPolicyFormSuccess: {
    id: 'accessibilityPolicyFormSuccess',
    defaultMessage: 'Thank you for contacting edX!',
    description: 'Simple thank you message when form submission is successful',
  },
  accessibilityPolicyFormSuccessDetails: {
    id: 'accessibilityPolicyFormSuccessDetails',
    defaultMessage: 'Thank you for your feedback regarding the accessibility of Studio. We typically respond within one business day ({day_start} to {day_end}, {time_start} to {time_end}).',
    description: 'Detailed thank you message when form submission is successful',
  },
  accessibilityPolicyFormValidEmail: {
    id: 'accessibilityPolicyFormValidEmail',
    defaultMessage: 'Enter a valid email address.',
    description: 'Error message for when an invalid email is entered into the form',
  },
  accessibilityPolicyFormValidMessage: {
    id: 'accessibilityPolicyFormValidMessage',
    defaultMessage: 'Enter a message.',
    description: 'Error message an invalid message is entered into the form',
  },
  accessibilityPolicyFormValidName: {
    id: 'accessibilityPolicyFormValidName',
    defaultMessage: 'Enter a name.',
    description: 'Error message an invalid name is entered into the form',
  },
});

export default messages;
